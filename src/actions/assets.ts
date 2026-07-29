"use server";

import { gql, type GraphQLClient } from "graphql-request";

import { hygraphWrite } from "@/lib/hygraph/client";
import { hygraphErrorMessage } from "@/lib/hygraph/errors";
import type { ActionResult } from "@/types/action";

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
// Hygraph processes uploads asynchronously and the time swings wildly (usually
// ~1–2s, but it randomly stalls past 30s regardless of file size). So we only
// wait a short, timeout-safe bound in the upload request itself; if it's still
// processing we hand back a `pending` asset and let the client poll
// finalizeAsset(id) until Hygraph is done. This keeps the request well under
// serverless function limits and never loses a slow upload.
const UPLOAD_WAIT_POLLS = 8;
const UPLOAD_POLL_INTERVAL_MS = 1000; // ~8s in-request bound

const CREATE_ASSET = gql`
  mutation CreateAsset($fileName: String!) {
    createAsset(data: { fileName: $fileName }) {
      id
      upload {
        requestPostData {
          url
          date
          key
          signature
          algorithm
          policy
          credential
          securityToken
        }
      }
    }
  }
`;

const ASSET_STATUS = gql`
  query AssetStatus($id: ID!) {
    asset(where: { id: $id }, stage: DRAFT) {
      mimeType
      upload {
        status
      }
    }
  }
`;

const PUBLISH_ASSET = gql`
  mutation PublishAsset($id: ID!) {
    publishAsset(where: { id: $id }, to: PUBLISHED) {
      id
      url
    }
  }
`;

const DELETE_ASSET = gql`
  mutation DeleteAsset($id: ID!) {
    deleteAsset(where: { id: $id }) {
      id
    }
  }
`;

interface RequestPostData {
  url: string;
  date: string;
  key: string;
  signature: string;
  algorithm: string;
  policy: string;
  credential: string;
  securityToken: string | null;
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Result of an upload. `pending: true` → still processing; the client must
 * poll finalizeAsset(id) until it comes back `pending: false` with a URL. */
export interface UploadedAsset {
  id: string;
  url: string;
  pending: boolean;
}

type AssetState = "ready" | "processing" | "error";

/** One status check for an in-flight asset upload. */
async function readAssetState(
  client: GraphQLClient,
  id: string,
): Promise<AssetState> {
  const { asset } = await client.request<{
    asset: { mimeType: string | null; upload: { status: string } | null } | null;
  }>(ASSET_STATUS, { id });
  if (!asset) return "processing";
  if (asset.upload?.status === "ASSET_ERROR_UPLOAD") return "error";
  if (
    asset.mimeType ||
    asset.upload?.status === "ASSET_UPLOAD_COMPLETE" ||
    !asset.upload
  ) {
    return "ready";
  }
  return "processing";
}

async function publishAsset(
  client: GraphQLClient,
  id: string,
): Promise<{ id: string; url: string }> {
  const { publishAsset: published } = await client.request<{
    publishAsset: { id: string; url: string };
  }>(PUBLISH_ASSET, { id });
  return published;
}

const PROCESSING_ERROR_MESSAGE =
  "Gambar gagal diproses. Coba unggah ulang atau perkecil ukuran file.";

/**
 * Upload an image to Hygraph's asset system (createAsset → presigned S3 POST →
 * wait briefly for processing → publish). If processing outlasts the short
 * in-request wait, returns the asset as `pending` for the client to finalize.
 */
export async function uploadAsset(
  formData: FormData,
): Promise<ActionResult<UploadedAsset>> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, data: null, message: "Tidak ada file gambar" };
  }
  const maxRaw = formData.get("maxBytes");
  const maxBytes =
    typeof maxRaw === "string" && Number(maxRaw) > 0
      ? Number(maxRaw)
      : DEFAULT_MAX_BYTES;
  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024));
    return {
      success: false,
      data: null,
      message: `Ukuran gambar maksimal ${mb} MB`,
    };
  }
  if (!file.type.startsWith("image/")) {
    return { success: false, data: null, message: "File harus berupa gambar" };
  }

  try {
    const client = hygraphWrite();
    const { createAsset } = await client.request<{
      createAsset: { id: string; upload: { requestPostData: RequestPostData } };
    }>(CREATE_ASSET, { fileName: file.name });

    const id = createAsset.id;
    const d = createAsset.upload.requestPostData;

    // Upload the binary to the presigned S3 endpoint (file field must be last).
    const s3Form = new FormData();
    s3Form.append("X-Amz-Date", d.date);
    s3Form.append("key", d.key);
    s3Form.append("X-Amz-Signature", d.signature);
    s3Form.append("X-Amz-Algorithm", d.algorithm);
    s3Form.append("policy", d.policy);
    s3Form.append("X-Amz-Credential", d.credential);
    if (d.securityToken) s3Form.append("X-Amz-Security-Token", d.securityToken);
    const buffer = Buffer.from(await file.arrayBuffer());
    s3Form.append(
      "file",
      new Blob([buffer], { type: file.type }),
      file.name,
    );

    const s3Res = await fetch(d.url, { method: "POST", body: s3Form });
    if (!s3Res.ok) {
      return {
        success: false,
        data: null,
        message: `Upload ke storage gagal (${s3Res.status})`,
      };
    }

    // Wait a short, timeout-safe bound for processing. Tolerate transient
    // status-query errors (keep waiting instead of aborting on one hiccup).
    for (let i = 0; i < UPLOAD_WAIT_POLLS; i += 1) {
      await sleep(UPLOAD_POLL_INTERVAL_MS);
      let state: AssetState;
      try {
        state = await readAssetState(client, id);
      } catch (pollError) {
        console.warn("uploadAsset status poll failed, retrying:", pollError);
        continue;
      }
      if (state === "error") {
        return { success: false, data: null, message: PROCESSING_ERROR_MESSAGE };
      }
      if (state === "ready") {
        const published = await publishAsset(client, id);
        return {
          success: true,
          data: { id: published.id, url: published.url, pending: false },
          message: "Gambar terunggah",
        };
      }
    }

    // Still processing after the bound — hand back a pending asset. The client
    // polls finalizeAsset(id) until Hygraph finishes, so a slow/stalled job
    // never fails the upload or holds the request open past its time limit.
    return {
      success: true,
      data: { id, url: "", pending: true },
      message: "Gambar sedang diproses",
    };
  } catch (error) {
    console.error("uploadAsset failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal mengunggah gambar"),
    };
  }
}

/**
 * Publish a still-processing upload once Hygraph has finished. The client polls
 * this (after uploadAsset returned a `pending` asset) every few seconds until it
 * resolves — so a slow or stalled Hygraph processing job never blocks the upload
 * request itself or trips a serverless timeout.
 */
export async function finalizeAsset(
  id: string,
): Promise<ActionResult<UploadedAsset>> {
  if (!id) {
    return { success: false, data: null, message: "ID gambar tidak valid" };
  }
  try {
    const client = hygraphWrite();
    const state = await readAssetState(client, id);
    if (state === "error") {
      return { success: false, data: null, message: PROCESSING_ERROR_MESSAGE };
    }
    if (state === "processing") {
      return {
        success: true,
        data: { id, url: "", pending: true },
        message: "Gambar sedang diproses",
      };
    }
    const published = await publishAsset(client, id);
    return {
      success: true,
      data: { id: published.id, url: published.url, pending: false },
      message: "Gambar terunggah",
    };
  } catch (error) {
    console.error("finalizeAsset failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal memproses gambar"),
    };
  }
}

/**
 * Permanently delete a Hygraph asset by id. Called when an admin removes an
 * uploaded image from a product/banner so orphaned assets don't linger in
 * Hygraph. Deleting an optional relation's asset simply drops the reference.
 */
export async function deleteAsset(id: string): Promise<ActionResult> {
  if (!id) {
    return { success: false, data: null, message: "ID gambar tidak valid" };
  }
  try {
    await hygraphWrite().request(DELETE_ASSET, { id });
    return { success: true, data: null, message: "Gambar dihapus" };
  } catch (error) {
    console.error("deleteAsset failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal menghapus gambar"),
    };
  }
}
