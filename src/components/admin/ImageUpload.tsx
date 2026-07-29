"use client";

import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

import { deleteAsset, finalizeAsset, uploadAsset } from "@/actions/assets";
import { cn } from "@/lib/utils";
import type { AssetImage } from "@/types/admin";

interface ImageUploadProps {
  value: AssetImage[];
  onChange: (images: AssetImage[]) => void;
  /** Maximum number of images. 1 = single-image mode. */
  max?: number;
  /** Maximum file size in MB. Default 10. */
  maxSizeMb?: number;
  /** Helper line under the dropzone. */
  hint?: string;
  /** Notifies the parent while an upload is in flight so it can lock its form. */
  onUploadingChange?: (uploading: boolean) => void;
}

/** An asset that finished uploading to storage but is still being processed by
 * Hygraph; finalizeAsset(id) is polled until it publishes. */
interface PendingUpload {
  id: string;
  name: string;
}

const FINALIZE_INTERVAL_MS = 3000;
const FINALIZE_MAX_TRIES = 40; // ~2 min ceiling before giving up client-side

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function ImageUpload({
  value,
  onChange,
  max = 8,
  maxSizeMb = 10,
  hint = `PNG, JPG, WEBP hingga ${maxSizeMb}MB`,
  onUploadingChange,
}: ImageUploadProps): React.JSX.Element {
  const [uploading, setUploading] = React.useState(false);
  const [pending, setPending] = React.useState<PendingUpload[]>([]);
  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Latest committed value — lets concurrent finalize polls append safely
  // without reading a stale `value` closure.
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const mounted = React.useRef(true);
  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const total = value.length + pending.length;
  const full = total >= max;

  // Lock the parent form while anything is in flight — an upload, an asset still
  // being finalized, or a delete — so a product can't be saved mid-operation or
  // while referencing a not-yet-published image. This effect is the single
  // source of truth for the lock signal.
  const busy = uploading || pending.length > 0 || deletingIds.size > 0;
  React.useEffect(() => {
    onUploadingChange?.(busy);
  }, [busy, onUploadingChange]);

  function commitImages(images: AssetImage[]): void {
    if (images.length === 0) return;
    const next = [...valueRef.current, ...images];
    valueRef.current = next;
    onChange(next);
  }

  /** Poll finalizeAsset(id) until Hygraph finishes processing and publishes. */
  async function pollFinalize(id: string): Promise<void> {
    for (let i = 0; i < FINALIZE_MAX_TRIES; i += 1) {
      await sleep(FINALIZE_INTERVAL_MS);
      if (!mounted.current) return;
      let res: Awaited<ReturnType<typeof finalizeAsset>>;
      try {
        res = await finalizeAsset(id);
      } catch {
        continue; // transient — keep polling
      }
      if (!mounted.current) return;
      if (res.success && res.data && !res.data.pending) {
        commitImages([{ id: res.data.id, url: res.data.url }]);
        setPending((p) => p.filter((x) => x.id !== id));
        toast.success("Gambar terunggah");
        return;
      }
      if (!res.success) {
        setPending((p) => p.filter((x) => x.id !== id));
        toast.error(res.message);
        return;
      }
      // still pending → keep polling
    }
    setPending((p) => p.filter((x) => x.id !== id));
    toast.error("Gambar terlalu lama diproses. Coba unggah ulang.");
  }

  async function handleFiles(files: FileList | null): Promise<void> {
    if (!files || files.length === 0) return;
    const remaining = max - total;
    if (remaining <= 0) {
      toast.error(`Maksimal ${max} gambar`);
      return;
    }
    const selected = Array.from(files).slice(0, remaining);
    const maxBytes = maxSizeMb * 1024 * 1024;
    setUploading(true);
    const uploaded: AssetImage[] = [];
    const started: PendingUpload[] = [];
    try {
      for (const file of selected) {
        if (file.size > maxBytes) {
          toast.error(`"${file.name}" melebihi ${maxSizeMb}MB`);
          continue;
        }
        const fd = new FormData();
        fd.append("file", file);
        fd.append("maxBytes", String(maxBytes));
        const res = await uploadAsset(fd);
        if (res.success && res.data) {
          if (res.data.pending) {
            started.push({ id: res.data.id, name: file.name });
          } else {
            uploaded.push({ id: res.data.id, url: res.data.url });
          }
        } else {
          toast.error(res.message);
        }
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
    if (uploaded.length > 0) {
      commitImages(uploaded);
      toast.success(`${uploaded.length} gambar terunggah`);
    }
    if (started.length > 0) {
      setPending((p) => [...p, ...started]);
      toast.info(`${started.length} gambar sedang diproses…`);
      for (const s of started) void pollFinalize(s.id);
    }
  }

  async function removeImage(id: string): Promise<void> {
    // Purge the asset from Hygraph so removed uploads don't linger. Adding the
    // id to deletingIds flips `busy`, which locks the parent form via the effect.
    setDeletingIds((s) => new Set(s).add(id));
    const res = await deleteAsset(id);
    setDeletingIds((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
    if (res.success) {
      const next = valueRef.current.filter((v) => v.id !== id);
      valueRef.current = next;
      onChange(next);
      toast.success("Gambar dihapus");
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div>
      {!full && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full cursor-pointer rounded-card border-2 border-dashed border-gray-200 bg-[#FAFBFC] px-6 py-8 text-center transition-colors hover:border-brand hover:bg-brand-subtle-2 disabled:cursor-wait"
        >
          <div className="mx-auto mb-3 flex h-13 w-13 items-center justify-center rounded-card border border-admin-border bg-white text-brand">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <UploadCloud className="h-6 w-6" />
            )}
          </div>
          <div className="text-[14.5px] font-semibold text-ink">
            {uploading ? "Mengunggah…" : "Pilih gambar untuk diunggah"}
          </div>
          <div className="mt-1 text-[13px] text-gray-400">{hint}</div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={max > 1}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {total > 0 && (
        <div className="mt-3.5 grid grid-cols-4 gap-2.5">
          {value.map((img, i) => {
            const isDeleting = deletingIds.has(img.id);
            return (
              <div
                key={img.id}
                className="group relative aspect-square overflow-hidden rounded-btn border border-admin-border bg-gray-50"
              >
                <Image
                  src={img.url}
                  alt={`Gambar ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                {i === 0 && max > 1 && (
                  <span className="absolute top-1.5 left-1.5 rounded-pill bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                    Utama
                  </span>
                )}
                <button
                  type="button"
                  aria-label="Hapus gambar"
                  onClick={() => removeImage(img.id)}
                  disabled={isDeleting}
                  className={cn(
                    "absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white transition-opacity",
                    isDeleting ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  )}
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </button>
                {isDeleting && (
                  <div className="absolute inset-0 bg-white/60" />
                )}
              </div>
            );
          })}

          {pending.map((p) => (
            <div
              key={p.id}
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-btn border border-dashed border-admin-border bg-gray-50"
              title={`${p.name} sedang diproses`}
            >
              <div className="flex flex-col items-center gap-1.5 text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-[10px] font-semibold">Memproses…</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
