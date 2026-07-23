"use client";

import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Image as ImageIcon,
  Info,
  Link as LinkIcon,
  Pencil,
  Plus,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

import { createBanner, deleteBanner, updateBanner } from "@/actions/banners";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Modal } from "@/components/admin/Modal";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import type { AdminBanner, AssetImage, ProductStatus } from "@/types/admin";

const FIELD =
  "h-[46px] rounded-btn border border-admin-border bg-admin-bg px-3.5 text-[14.5px] outline-none focus:border-brand focus:bg-white";
const GRADIENTS = [
  "linear-gradient(120deg,#26282e,#5a5e69)",
  "linear-gradient(120deg,#1c1d21,#4c4f57)",
  "linear-gradient(120deg,#2a2528,#63606a)",
];

export function BannersList({
  initial,
}: {
  initial: AdminBanner[];
}): React.JSX.Element {
  const [items, setItems] = React.useState<AdminBanner[]>(initial);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [editing, setEditing] = React.useState<AdminBanner | "new" | null>(null);

  function move(index: number, dir: -1 | 1): void {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    setItems((list) => {
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((b, i) => ({ ...b, order: i + 1 }));
    });
  }

  async function remove(): Promise<void> {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deleteBanner(deleteId);
    setDeleting(false);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    setItems((list) =>
      list
        .filter((b) => b.id !== deleteId)
        .map((b, i) => ({ ...b, order: i + 1 })),
    );
    toast.success(res.message);
    setDeleteId(null);
  }

  async function save(data: AdminBanner): Promise<boolean> {
    const input = {
      alt: data.alt,
      link: data.link,
      order: data.order,
      status: data.status,
      imageId: data.imageId,
    };
    if (editing === "new") {
      const res = await createBanner(input);
      if (!res.success || !res.data) {
        toast.error(res.message);
        return false;
      }
      const created: AdminBanner = { ...data, id: res.data.id, date: res.data.date };
      setItems((list) => [...list, created]);
      toast.success(res.message);
      setEditing(null);
      return true;
    }
    const res = await updateBanner(data.id, input);
    if (!res.success) {
      toast.error(res.message);
      return false;
    }
    setItems((list) => list.map((b) => (b.id === data.id ? data : b)));
    toast.success(res.message);
    setEditing(null);
    return true;
  }

  const deleteTarget = items.find((b) => b.id === deleteId) ?? null;

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Banner Homepage</h1>
          <p className="mt-0.5 text-[14.5px] text-gray-500">
            Kelola slider promosi di halaman utama
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex h-11 items-center gap-2 rounded-btn bg-brand px-[18px] text-[14.5px] font-semibold text-white hover:bg-brand-hover"
        >
          <Plus className="h-[18px] w-[18px]" />
          Tambah Banner
        </button>
      </div>

      <div className="mb-5 flex items-start gap-3 rounded-card border border-info/25 bg-info-subtle px-4 py-3.5">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-white text-info">
          <Info className="h-[18px] w-[18px]" />
        </span>
        <p className="text-[13.5px] leading-relaxed text-gray-600">
          <strong className="font-bold text-ink">Ukuran gambar wajib 1440 × 480 px.</strong>{" "}
          Gunakan resolusi dan rasio ini agar banner tampil tajam serta tidak terpotong di
          slider halaman utama. Format JPG, PNG, atau WebP — maksimal 2 MB.
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {items.map((b, i) => (
          <div
            key={b.id}
            className="flex flex-wrap items-center gap-4 rounded-card border border-admin-border bg-white p-4"
          >
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                aria-label="Naik"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-gray-300 hover:text-brand disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <span className="font-mono text-[15px] font-bold text-gray-400">{b.order}</span>
              <button
                type="button"
                aria-label="Turun"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="text-gray-300 hover:text-brand disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
            <div
              className="relative flex h-24 w-[200px] flex-none items-center justify-center overflow-hidden rounded-[12px] text-white/50"
              style={{ background: b.gradient }}
            >
              {b.imageUrl ? (
                <Image
                  src={b.imageUrl}
                  alt={b.alt}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              ) : (
                <ImageIcon className="h-[26px] w-[26px]" />
              )}
              <span className="absolute right-2 bottom-1.5 rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] text-white">
                1440×480
              </span>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="text-base font-bold text-ink">{b.alt}</div>
              <div className="mt-1 flex flex-wrap gap-3.5 text-[12.5px] text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <LinkIcon className="h-[13px] w-[13px]" />
                  {b.link}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-[13px] w-[13px]" />
                  {b.date}
                </span>
              </div>
            </div>
            <StatusBadge status={b.status} />
            <div className="flex gap-1.5">
              <ActionBtn icon={Pencil} label="Edit" onClick={() => setEditing(b)} />
              <ActionBtn icon={Trash2} label="Hapus" danger onClick={() => setDeleteId(b.id)} />
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} ariaLabel="Hapus banner">
        <div className="mb-[18px] flex h-14 w-14 items-center justify-center rounded-[16px] bg-brand-subtle text-danger">
          <TriangleAlert className="h-7 w-7" />
        </div>
        <h3 className="mb-2 text-xl font-extrabold text-ink">Hapus Banner?</h3>
        <p className="mb-6 text-[14.5px] leading-relaxed text-gray-500">
          Anda akan menghapus banner <strong className="text-ink">{deleteTarget?.alt}</strong>.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDeleteId(null)}
            className="h-12 flex-1 rounded-btn border border-admin-border bg-white text-[14.5px] font-semibold hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className="h-12 flex-1 rounded-btn bg-danger text-[14.5px] font-bold text-white hover:brightness-95 disabled:opacity-60"
          >
            {deleting ? "Menghapus…" : "Hapus"}
          </button>
        </div>
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)} ariaLabel="Form banner">
        {editing !== null && (
          <BannerForm
            initial={editing === "new" ? null : editing}
            index={items.length}
            onClose={() => setEditing(null)}
            onSave={save}
          />
        )}
      </Modal>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Pencil;
  label: string;
  onClick: () => void;
  danger?: boolean;
}): React.JSX.Element {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-admin-border bg-white text-gray-500",
        danger ? "hover:bg-brand-subtle hover:text-danger" : "hover:bg-gray-50 hover:text-brand",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function BannerForm({
  initial,
  index,
  onClose,
  onSave,
}: {
  initial: AdminBanner | null;
  index: number;
  onClose: () => void;
  onSave: (b: AdminBanner) => Promise<boolean>;
}): React.JSX.Element {
  const [alt, setAlt] = React.useState(initial?.alt ?? "");
  const [link, setLink] = React.useState(initial?.link ?? "/search");
  const [status, setStatus] = React.useState<ProductStatus>(initial?.status ?? "draft");
  const [image, setImage] = React.useState<AssetImage[]>(
    initial?.imageId && initial?.imageUrl
      ? [{ id: initial.imageId, url: initial.imageUrl }]
      : [],
  );
  const [pending, setPending] = React.useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-ink">
          {initial ? "Edit Banner" : "Banner Baru"}
        </h3>
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-admin-border bg-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col gap-3.5">
        <div className="flex items-start gap-2.5 rounded-btn bg-info-subtle px-3 py-2.5 text-[12.5px] leading-relaxed text-gray-600">
          <Info className="mt-px h-[15px] w-[15px] flex-none text-info" />
          <span>
            Unggah gambar berukuran <strong className="font-bold text-ink">1440 × 480 px</strong> agar sesuai
            dengan slider halaman utama.
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-gray-600">Gambar Banner</span>
          <ImageUpload
            value={image}
            onChange={setImage}
            max={1}
            hint="1440 × 480 px · PNG, JPG, atau WEBP hingga 10MB"
          />
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-gray-600">Alt Gambar</span>
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Deskripsi gambar untuk SEO & aksesibilitas"
            className={FIELD}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-gray-600">Link</span>
          <input value={link} onChange={(e) => setLink(e.target.value)} className={`${FIELD} font-mono`} />
        </label>
        <div className="flex gap-2">
          {(["published", "draft"] as ProductStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "h-10 flex-1 rounded-btn border-[1.5px] text-[13px] font-bold",
                status === s
                  ? "border-brand bg-brand-subtle text-brand"
                  : "border-admin-border bg-white text-gray-600",
              )}
            >
              {s === "published" ? "Published" : "Draft"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="h-12 flex-1 rounded-btn border border-admin-border bg-white text-[14.5px] font-semibold hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={async () => {
            if (!alt.trim()) {
              toast.error("Alt gambar wajib diisi");
              return;
            }
            setPending(true);
            const ok = await onSave({
              id: initial?.id ?? `ab${Date.now()}`,
              order: initial?.order ?? index + 1,
              alt: alt.trim(),
              link,
              status,
              date: initial?.date ?? new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
              gradient: initial?.gradient ?? GRADIENTS[index % GRADIENTS.length],
              imageId: image[0]?.id ?? null,
              imageUrl: image[0]?.url ?? null,
            });
            if (!ok) setPending(false);
          }}
          className="h-12 flex-1 rounded-btn bg-brand text-[14.5px] font-bold text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </div>
  );
}
