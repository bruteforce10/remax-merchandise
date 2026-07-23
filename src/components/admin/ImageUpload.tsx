"use client";

import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

import { uploadAsset } from "@/actions/assets";
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

export function ImageUpload({
  value,
  onChange,
  max = 8,
  maxSizeMb = 10,
  hint = `PNG, JPG, WEBP hingga ${maxSizeMb}MB`,
  onUploadingChange,
}: ImageUploadProps): React.JSX.Element {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const full = value.length >= max;

  function setUploadingState(next: boolean): void {
    setUploading(next);
    onUploadingChange?.(next);
  }

  async function handleFiles(files: FileList | null): Promise<void> {
    if (!files || files.length === 0) return;
    const remaining = max - value.length;
    if (remaining <= 0) {
      toast.error(`Maksimal ${max} gambar`);
      return;
    }
    const selected = Array.from(files).slice(0, remaining);
    const maxBytes = maxSizeMb * 1024 * 1024;
    setUploadingState(true);
    const uploaded: AssetImage[] = [];
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
          uploaded.push(res.data);
        } else {
          toast.error(res.message);
        }
      }
    } finally {
      setUploadingState(false);
      if (inputRef.current) inputRef.current.value = "";
    }
    if (uploaded.length > 0) {
      onChange([...value, ...uploaded]);
      toast.success(`${uploaded.length} gambar terunggah`);
    }
  }

  function removeImage(id: string): void {
    onChange(value.filter((v) => v.id !== id));
  }

  return (
    <div>
      {!full && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full cursor-pointer rounded-[14px] border-2 border-dashed border-gray-200 bg-[#FAFBFC] px-6 py-8 text-center transition-colors hover:border-brand hover:bg-brand-subtle-2 disabled:cursor-wait"
        >
          <div className="mx-auto mb-3 flex h-13 w-13 items-center justify-center rounded-[14px] border border-admin-border bg-white text-brand">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <UploadCloud className="h-6 w-6" />
            )}
          </div>
          <div className="text-[14.5px] font-bold text-ink">
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

      {value.length > 0 && (
        <div className="mt-3.5 grid grid-cols-4 gap-2.5">
          {value.map((img, i) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-[11px] border border-admin-border bg-gray-50"
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
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
