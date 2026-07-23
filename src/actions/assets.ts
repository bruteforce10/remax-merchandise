"use server";

import { gql } from "graphql-request";

import { hygraphWrite } from "@/lib/hygraph/client";
import { hygraphErrorMessage } from "@/lib/hygraph/errors";
import type { ActionResult } from "@/types/action";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

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

/**
 * Upload an image to Hygraph's asset system (createAsset → presigned S3 POST →
 * poll until processed → publish) and return the published asset id + URL.
 */
export async function uploadAsset(
  formData: FormData,
): Promise<ActionResult<{ id: string; url: string }>> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, data: null, message: "Tidak ada file gambar" };
  }
  if (file.size > MAX_BYTES) {
    return { success: false, data: null, message: "Ukuran gambar maksimal 10 MB" };
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

    // Hygraph processes the upload asynchronously — poll until complete.
    let ready = false;
    for (let i = 0; i < 20; i += 1) {
      await sleep(700);
      const { asset } = await client.request<{
        asset: { mimeType: string | null; upload: { status: string } | null } | null;
      }>(ASSET_STATUS, { id });
      if (asset && (asset.mimeType || !asset.upload)) {
        ready = true;
        break;
      }
    }
    if (!ready) {
      return {
        success: false,
        data: null,
        message: "Gambar sedang diproses, coba lagi sebentar",
      };
    }

    const { publishAsset } = await client.request<{
      publishAsset: { id: string; url: string };
    }>(PUBLISH_ASSET, { id });

    return {
      success: true,
      data: { id: publishAsset.id, url: publishAsset.url },
      message: "Gambar terunggah",
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
