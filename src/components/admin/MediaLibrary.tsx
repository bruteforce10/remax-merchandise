"use client";

import {
  FileText,
  Folder,
  Image as ImageIcon,
  Search,
  Shapes,
  Trash2,
  UploadCloud,
  Video,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import type { MediaItem, MediaType } from "@/types/admin";

const TYPE_STYLE: Record<MediaType, { cls: string; icon: LucideIcon }> = {
  image: { cls: "bg-gradient-to-br from-[#f1f2f4] to-[#e6e7ea] text-gray-400", icon: ImageIcon },
  pdf: { cls: "bg-brand-subtle text-brand", icon: FileText },
  icon: { cls: "bg-info-subtle text-info", icon: Shapes },
  video: { cls: "bg-[#F2EAFB] text-[#8B3FD9]", icon: Video },
};

const FOLDERS: { key: "all" | MediaType; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "Semua File", icon: Folder },
  { key: "image", label: "Gambar", icon: ImageIcon },
  { key: "pdf", label: "PDF", icon: FileText },
  { key: "icon", label: "Ikon", icon: Shapes },
  { key: "video", label: "Video", icon: Video },
];

export function MediaLibrary({
  initial,
}: {
  initial: MediaItem[];
}): React.JSX.Element {
  const [items, setItems] = React.useState<MediaItem[]>(initial);
  const [folder, setFolder] = React.useState<"all" | MediaType>("all");
  const [search, setSearch] = React.useState("");

  const q = search.trim().toLowerCase();
  const filtered = items.filter(
    (m) =>
      (folder === "all" || m.type === folder) &&
      (!q || m.name.toLowerCase().includes(q)),
  );

  function count(key: "all" | MediaType): number {
    return key === "all" ? items.length : items.filter((m) => m.type === key).length;
  }

  async function copyUrl(name: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(`https://cdn.remax.co.id/media/${name}`);
      toast.success("URL disalin ke clipboard");
    } catch {
      toast.error("Gagal menyalin URL");
    }
  }

  function remove(id: string): void {
    setItems((list) => list.filter((m) => m.id !== id));
    toast.success("File dihapus");
  }

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Media Library</h1>
          <p className="mt-0.5 text-[14.5px] text-gray-500">
            Kelola gambar, PDF, ikon, dan video
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast.success("Upload akan aktif dengan Supabase Storage")}
          className="inline-flex h-11 items-center gap-2 rounded-btn bg-brand px-[18px] text-[14.5px] font-semibold text-white hover:bg-brand-hover"
        >
          <UploadCloud className="h-[18px] w-[18px]" />
          Upload File
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-admin-border bg-white p-3">
            <div className="px-2.5 py-1.5 text-[12px] font-bold tracking-[0.04em] text-gray-400 uppercase">
              Folder
            </div>
            {FOLDERS.map((f) => {
              const active = folder === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFolder(f.key)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-[10px] p-2.5 text-sm font-semibold",
                    active ? "bg-brand-subtle text-brand" : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <f.icon className="h-[17px] w-[17px]" />
                  <span className="flex-1 text-left">{f.label}</span>
                  <span className="text-xs text-gray-300">{count(f.key)}</span>
                </button>
              );
            })}
          </div>
          <div className="rounded-card border border-admin-border bg-white p-[18px]">
            <div className="mb-3 text-[13px] font-bold text-ink">Penyimpanan</div>
            <div className="mb-2.5 h-2 overflow-hidden rounded-pill bg-gray-100">
              <div className="h-full w-[62%] rounded-pill bg-gradient-to-r from-brand to-[#FF4D5E]" />
            </div>
            <div className="text-[12.5px] text-gray-500">6,2 GB dari 10 GB terpakai</div>
          </div>
        </div>

        {/* Main */}
        <div>
          <div className="mb-4 flex h-[42px] items-center gap-2.5 rounded-[11px] border border-admin-border bg-white px-3.5 focus-within:border-brand">
            <Search className="h-[17px] w-[17px] text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari media…"
              className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="mb-[18px] cursor-pointer rounded-[14px] border-2 border-dashed border-gray-200 bg-white px-5 py-5.5 text-center hover:border-brand hover:bg-brand-subtle-2">
            <span className="inline-flex items-center gap-2.5 text-sm font-semibold text-gray-500">
              <UploadCloud className="h-5 w-5 text-brand" />
              Seret &amp; letakkan file untuk mengunggah
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((m) => {
                const style = TYPE_STYLE[m.type];
                return (
                  <div
                    key={m.id}
                    className="group overflow-hidden rounded-[14px] border border-admin-border bg-white transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => copyUrl(m.name)}
                      className={cn(
                        "relative flex aspect-square w-full items-center justify-center",
                        style.cls,
                      )}
                      title="Klik untuk salin URL"
                    >
                      <style.icon className="h-[30px] w-[30px]" />
                      <span className="absolute top-2 right-2 rounded-md bg-gray-900/60 px-1.5 py-0.5 text-[9.5px] font-bold text-white uppercase">
                        {m.type}
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label="Hapus file"
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(m.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            remove(m.id);
                          }
                        }}
                        className="absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </span>
                    </button>
                    <div className="p-2.5">
                      <div className="truncate text-[12.5px] font-semibold text-ink">{m.name}</div>
                      <div className="mt-0.5 text-[11px] text-gray-400">{m.size}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-card border border-dashed border-admin-border px-5 py-16 text-center text-sm text-gray-400">
              Tidak ada file pada folder ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
