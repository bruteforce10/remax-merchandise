"use client";

import { Pencil, Plus, Search, Star, Trash2, TriangleAlert, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/actions/categories";
import { CategoryVisual } from "@/components/category/CategoryVisual";
import { Modal } from "@/components/admin/Modal";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CategoryIcon } from "@/components/ui/Icon";
import { slugify } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { ProductStatus } from "@/types/admin";

export interface AdminCategory extends Category {
  count: number;
  order: number;
  featured: boolean;
  status: ProductStatus;
}

const ICON_OPTIONS = [
  "shirt",
  "umbrella",
  "coffee",
  "cup-soda",
  "pen-line",
  "notebook-pen",
  "tag",
  "shopping-bag",
  "backpack",
  "id-card",
  "key-round",
  "package",
];

const FIELD =
  "h-[46px] rounded-btn border border-admin-border bg-admin-bg px-3.5 text-[14.5px] outline-none focus:border-brand focus:bg-white";

export function CategoriesGrid({
  initial,
}: {
  initial: AdminCategory[];
}): React.JSX.Element {
  const [items, setItems] = React.useState<AdminCategory[]>(initial);
  const [search, setSearch] = React.useState("");
  const [deleteSlug, setDeleteSlug] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [editing, setEditing] = React.useState<AdminCategory | "new" | null>(null);

  const q = search.trim().toLowerCase();
  const filtered = q
    ? items.filter((c) => c.name.toLowerCase().includes(q) || c.slug.includes(q))
    : items;

  const deleteTarget = items.find((c) => c.slug === deleteSlug) ?? null;

  async function remove(): Promise<void> {
    if (!deleteSlug) return;
    setDeleting(true);
    const res = await deleteCategory(deleteSlug);
    setDeleting(false);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    setItems((list) => list.filter((c) => c.slug !== deleteSlug));
    toast.success(res.message);
    setDeleteSlug(null);
  }

  async function saveCategory(data: AdminCategory): Promise<boolean> {
    const input = {
      name: data.name,
      slug: data.slug,
      icon: data.icon,
      description: data.description,
      material: data.material,
      branding: data.branding,
      colors: data.colors,
      sizes: data.sizes,
    };
    const isNew = editing === "new";
    const res = isNew
      ? await createCategory(input)
      : await updateCategory(data.slug, input);
    if (!res.success) {
      toast.error(res.message);
      return false;
    }
    setItems((list) => {
      const idx = list.findIndex((c) => c.slug === data.slug);
      if (idx >= 0) {
        const next = [...list];
        next[idx] = data;
        return next;
      }
      return [...list, data];
    });
    toast.success(res.message);
    setEditing(null);
    return true;
  }

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Kategori</h1>
          <p className="mt-0.5 text-[14.5px] text-gray-500">{items.length} kategori aktif</p>
        </div>
        <div className="flex gap-2.5">
          <div className="flex h-11 w-[220px] items-center gap-2.5 rounded-btn border border-admin-border bg-white px-3.5 focus-within:border-brand">
            <Search className="h-[17px] w-[17px] text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kategori…"
              className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="inline-flex h-11 items-center gap-2 rounded-btn bg-brand px-[18px] text-[14.5px] font-semibold text-white hover:bg-brand-hover"
          >
            <Plus className="h-[18px] w-[18px]" />
            Tambah Kategori
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((c) => (
          <div
            key={c.slug}
            className="overflow-hidden rounded-card border border-admin-border bg-white transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-hover"
          >
            <div className="relative flex h-[88px] items-center justify-center bg-gradient-to-br from-[#f1f2f4] to-[#e6e7ea]">
              <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-card bg-white text-brand shadow-sm">
                <CategoryVisual
                  slug={c.slug}
                  name={c.name}
                  icon={c.icon}
                  imageClassName="p-1"
                  iconClassName="h-6 w-6"
                  sizes="48px"
                />
              </span>
              {c.featured && (
                <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-pill bg-gray-900 px-2.5 py-1 text-[10.5px] font-bold text-white">
                  <Star className="h-[11px] w-[11px] fill-white" />
                  Unggulan
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[15.5px] font-semibold text-ink">{c.name}</div>
                <StatusBadge status={c.status} dot={false} />
              </div>
              <div className="mt-0.5 mb-2 font-mono text-[12.5px] text-gray-400">/{c.slug}</div>
              <p className="line-clamp-2 h-[38px] text-[13px] leading-relaxed text-gray-500">
                {c.description}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-[12.5px] text-gray-400">
                  <strong className="text-ink">{c.count}</strong> produk · urutan {c.order}
                </span>
                <div className="flex gap-1">
                  <IconBtn icon={Pencil} label="Edit" onClick={() => setEditing(c)} />
                  <IconBtn icon={Trash2} label="Hapus" danger onClick={() => setDeleteSlug(c.slug)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete modal */}
      <Modal open={!!deleteSlug} onClose={() => setDeleteSlug(null)} ariaLabel="Hapus kategori">
        <div className="mb-[18px] flex h-14 w-14 items-center justify-center rounded-card bg-brand-subtle text-danger">
          <TriangleAlert className="h-7 w-7" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-ink">Hapus Kategori?</h3>
        <p className="mb-6 text-[14.5px] leading-relaxed text-gray-500">
          Anda akan menghapus <strong className="text-ink">{deleteTarget?.name}</strong>.
          Produk pada kategori ini tidak ikut terhapus.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDeleteSlug(null)}
            className="h-12 flex-1 rounded-btn border border-admin-border bg-white text-[14.5px] font-semibold hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className="h-12 flex-1 rounded-btn bg-danger text-[14.5px] font-medium text-white hover:brightness-95 disabled:opacity-60"
          >
            {deleting ? "Menghapus…" : "Hapus"}
          </button>
        </div>
      </Modal>

      {/* Form modal */}
      <Modal open={editing !== null} onClose={() => setEditing(null)} ariaLabel="Form kategori">
        {editing !== null && (
          <CategoryForm
            initial={editing === "new" ? null : editing}
            nextOrder={items.length + 1}
            onClose={() => setEditing(null)}
            onSave={saveCategory}
          />
        )}
      </Modal>
    </div>
  );
}

function IconBtn({
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
        "flex h-8 w-8 items-center justify-center rounded-lg border border-admin-border bg-white text-gray-500",
        danger ? "hover:bg-brand-subtle hover:text-danger" : "hover:bg-gray-50 hover:text-brand",
      )}
    >
      <Icon className="h-[14px] w-[14px]" />
    </button>
  );
}

function CategoryForm({
  initial,
  nextOrder,
  onClose,
  onSave,
}: {
  initial: AdminCategory | null;
  nextOrder: number;
  onClose: () => void;
  onSave: (c: AdminCategory) => Promise<boolean>;
}): React.JSX.Element {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [icon, setIcon] = React.useState(initial?.icon ?? "shirt");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [featured, setFeatured] = React.useState(initial?.featured ?? false);
  const [status, setStatus] = React.useState<ProductStatus>(initial?.status ?? "published");
  const [pending, setPending] = React.useState(false);

  const slug = initial?.slug ?? (name ? slugify(name) : "");

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">
          {initial ? "Edit Kategori" : "Kategori Baru"}
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
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-gray-600">Nama</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={FIELD} />
        </label>
        <div className="grid grid-cols-2 gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-gray-600">Ikon</span>
            <select value={icon} onChange={(e) => setIcon(e.target.value)} className={`${FIELD} cursor-pointer`}>
              {ICON_OPTIONS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-gray-600">Slug</span>
            <input value={slug} readOnly className={`${FIELD} font-mono text-gray-500`} />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-gray-600">Deskripsi</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="resize-y rounded-btn border border-admin-border bg-admin-bg px-3.5 py-3 text-[14px] outline-none focus:border-brand focus:bg-white"
          />
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setFeatured((f) => !f)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-md border-[1.5px]",
                featured ? "border-brand bg-brand" : "border-gray-300 bg-white",
              )}
            >
              {featured && <Star className="h-3 w-3 fill-white text-white" />}
            </span>
            Unggulan
          </button>
          <div className="ml-auto flex gap-2">
            {(["published", "draft"] as ProductStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "h-9 rounded-btn border-[1.5px] px-3.5 text-[13px] font-bold",
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
            if (!name.trim()) {
              toast.error("Nama kategori wajib diisi");
              return;
            }
            setPending(true);
            const ok = await onSave({
              slug: slug || slugify(name),
              name: name.trim(),
              icon,
              description,
              featured,
              status,
              material: initial?.material ?? "",
              branding: initial?.branding ?? "",
              colors: initial?.colors ?? [],
              sizes: initial?.sizes ?? [],
              count: initial?.count ?? 0,
              order: initial?.order ?? nextOrder,
            });
            if (!ok) setPending(false);
          }}
          className="h-12 flex-1 rounded-btn bg-brand text-[14.5px] font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </div>
  );
}
