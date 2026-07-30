"use client";

import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  EyeOff,
  PackageSearch,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import {
  createProduct,
  deleteProduct,
  quickUpdateProduct,
} from "@/actions/products";
import { Modal } from "@/components/admin/Modal";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Drawer } from "@/components/ui/Drawer";
import { CategoryIcon } from "@/components/ui/Icon";
import { formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminProduct, ProductStatus } from "@/types/admin";
import type { Category } from "@/types/category";

const PAGE_SIZE = 8;
const SELECT_CLS =
  "h-[42px] rounded-btn border border-admin-border bg-white px-3 text-sm font-semibold text-gray-700 cursor-pointer outline-none focus:border-brand";
const TH =
  "px-3 py-3 text-left text-[12px] font-bold tracking-[0.04em] text-gray-400 uppercase";

type SortKey = "recent" | "views" | "price-desc" | "price-asc";

export function ProductsTable({
  initialProducts,
  categories,
}: {
  initialProducts: AdminProduct[];
  categories: Category[];
}): React.JSX.Element {
  const [items, setItems] = React.useState<AdminProduct[]>(initialProducts);
  const categoryMap = React.useMemo(
    () => Object.fromEntries(categories.map((c) => [c.slug, c])),
    [categories],
  );
  const [search, setSearch] = React.useState("");
  const [catFilter, setCatFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | ProductStatus>(
    "all",
  );
  const [sort, setSort] = React.useState<SortKey>("recent");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [loading, setLoading] = React.useState(true);
  const [deleteSku, setDeleteSku] = React.useState<string | null>(null);
  const [editSku, setEditSku] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 400);
    return () => window.clearTimeout(t);
  }, []);

  const filtered = React.useMemo(() => {
    const list = items.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!(
          p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        ))
          return false;
      }
      if (catFilter !== "all" && p.categorySlug !== catFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    });
    if (sort === "views") return [...list].sort((a, b) => b.views - a.views);
    if (sort === "price-desc")
      return [...list].sort((a, b) => b.price - a.price);
    if (sort === "price-asc")
      return [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [items, search, catFilter, statusFilter, sort]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE,
  );
  const rangeStart = total === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(current * PAGE_SIZE, total);

  const selectionCount = Object.values(selected).filter(Boolean).length;
  const allChecked =
    pageItems.length > 0 && pageItems.every((p) => selected[p.sku]);

  function resetPage<T>(setter: (v: T) => void): (v: T) => void {
    return (v) => {
      setter(v);
      setPage(1);
    };
  }

  function toggle(sku: string): void {
    setSelected((s) => ({ ...s, [sku]: !s[sku] }));
  }
  function toggleAll(): void {
    setSelected((s) => {
      const next = { ...s };
      pageItems.forEach((p) => {
        if (allChecked) delete next[p.sku];
        else next[p.sku] = true;
      });
      return next;
    });
  }

  async function duplicate(p: AdminProduct): Promise<void> {
    const copy: AdminProduct = {
      ...p,
      sku: `${p.sku}-C${Date.now().toString().slice(-4)}`,
      name: `${p.name} (Copy)`,
      status: "draft",
      views: 0,
      waClicks: 0,
    };
    setBusy(true);
    const res = await createProduct({
      name: copy.name,
      slug: `${copy.sku.toLowerCase()}`,
      sku: copy.sku,
      categorySlug: copy.categorySlug,
      shortDescription: copy.short,
      price: copy.price,
      stock: copy.stock,
      status: "draft",
    });
    setBusy(false);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    setItems((list) => {
      const idx = list.findIndex((x) => x.sku === p.sku);
      const next = [...list];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    toast.success(`${p.name} diduplikat`);
  }

  async function confirmDelete(): Promise<void> {
    if (!deleteSku) return;
    const target = deleteSku;
    setDeleting(true);
    const res = await deleteProduct(target);
    setDeleting(false);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    setItems((list) => list.filter((p) => p.sku !== target));
    setSelected((s) => {
      const next = { ...s };
      delete next[target];
      return next;
    });
    toast.success(res.message);
    setDeleteSku(null);
  }

  async function bulkDelete(): Promise<void> {
    const skus = items.filter((p) => selected[p.sku]).map((p) => p.sku);
    setBusy(true);
    const results = await Promise.all(skus.map((sku) => deleteProduct(sku)));
    setBusy(false);
    const deleted = skus.filter((_, i) => results[i].success);
    if (deleted.length > 0) {
      setItems((list) => list.filter((p) => !deleted.includes(p.sku)));
      setSelected({});
      toast.success(`${deleted.length} produk dihapus`);
    }
    const failed = results.find((r) => !r.success);
    if (failed) toast.error(failed.message);
  }

  async function bulkStatus(status: ProductStatus): Promise<void> {
    const targets = items.filter((p) => selected[p.sku]);
    setBusy(true);
    const results = await Promise.all(
      targets.map((p) =>
        quickUpdateProduct(p.sku, {
          name: p.name,
          price: p.price,
          stock: p.stock,
          categorySlug: p.categorySlug,
          status,
        }),
      ),
    );
    setBusy(false);
    const okSkus = targets
      .filter((_, i) => results[i].success)
      .map((p) => p.sku);
    if (okSkus.length > 0) {
      setItems((list) =>
        list.map((p) => (okSkus.includes(p.sku) ? { ...p, status } : p)),
      );
      setSelected({});
      toast.success(
        status === "published"
          ? "Produk dipublikasikan"
          : "Produk disembunyikan",
      );
    }
    const failed = results.find((r) => !r.success);
    if (failed) toast.error(failed.message);
  }

  async function saveEdit(
    patch: Pick<
      AdminProduct,
      "sku" | "name" | "price" | "stock" | "categorySlug" | "status"
    >,
  ): Promise<boolean> {
    const res = await quickUpdateProduct(patch.sku, {
      name: patch.name,
      price: patch.price,
      stock: patch.stock,
      categorySlug: patch.categorySlug,
      status: patch.status,
    });
    if (!res.success) {
      toast.error(res.message);
      return false;
    }
    setItems((list) =>
      list.map((p) => (p.sku === patch.sku ? { ...p, ...patch } : p)),
    );
    toast.success(res.message);
    setEditSku(null);
    return true;
  }

  const deleteTarget = items.find((p) => p.sku === deleteSku) ?? null;
  const editTarget = items.find((p) => p.sku === editSku) ?? null;

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Produk
          </h1>
          <p className="mt-0.5 text-[14.5px] text-gray-500">
            {items.length} produk dalam katalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center gap-2 rounded-btn bg-brand px-[18px] text-[14.5px] font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          <Plus className="h-[18px] w-[18px]" />
          Tambah Produk
        </Link>
      </div>

      <div className="overflow-hidden rounded-card border border-admin-border bg-white">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-[18px] py-4">
          <div className="flex h-[42px] min-w-[200px] flex-1 items-center gap-2.5 rounded-btn border border-admin-border bg-admin-bg px-3.5 focus-within:border-brand focus-within:bg-white">
            <Search className="h-[17px] w-[17px] text-gray-400" />
            <input
              value={search}
              onChange={(e) => resetPage(setSearch)(e.target.value)}
              placeholder="Cari produk atau SKU…"
              className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => resetPage(setCatFilter)(e.target.value)}
            className={SELECT_CLS}
            aria-label="Filter kategori"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) =>
              resetPage(setStatusFilter)(
                e.target.value as "all" | ProductStatus,
              )
            }
            className={SELECT_CLS}
            aria-label="Filter status"
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className={SELECT_CLS}
            aria-label="Urutkan"
          >
            <option value="recent">Terbaru</option>
            <option value="views">Views Terbanyak</option>
            <option value="price-desc">Harga Tertinggi</option>
            <option value="price-asc">Harga Terendah</option>
          </select>
        </div>

        {/* Bulk bar */}
        {selectionCount > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-[#F8D2D7] bg-brand-subtle-2 px-[18px] py-3">
            <span className="text-[13.5px] font-bold text-brand-dark">
              {selectionCount} dipilih
            </span>
            <div className="ml-auto flex flex-wrap gap-2">
              <BulkBtn
                icon={CheckCircle2}
                label="Publish"
                tone="success"
                disabled={busy}
                onClick={() => bulkStatus("published")}
              />
              <BulkBtn
                icon={EyeOff}
                label="Unpublish"
                disabled={busy}
                onClick={() => bulkStatus("draft")}
              />
              <BulkBtn
                icon={Download}
                label="Export"
                onClick={() => toast.success("Export dimulai")}
              />
              <BulkBtn
                icon={Trash2}
                label="Hapus"
                danger
                disabled={busy}
                onClick={bulkDelete}
              />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rmx-scrollbar overflow-x-auto">
          <table className="w-full min-w-[940px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-[#FAFBFC]">
                <th className="w-11 px-[18px] py-3 text-left">
                  <Checkbox checked={allChecked} onClick={toggleAll} />
                </th>
                <th className={TH}>Produk</th>
                <th className={TH}>Kategori</th>
                <th className={cn(TH, "text-right")}>Harga</th>
                <th className={cn(TH, "text-right")}>Stok</th>
                <th className={cn(TH, "text-right")}>Views</th>
                <th className={cn(TH, "text-right")}>Klik WA</th>
                <th className={TH}>Status</th>
                <th className={cn(TH, "text-right")}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                : pageItems.length > 0
                  ? pageItems.map((p) => {
                      const cat = categoryMap[p.categorySlug];
                      const checked = !!selected[p.sku];
                      return (
                        <tr
                          key={p.sku}
                          className="border-b border-gray-50 transition-colors hover:bg-[#FAFBFC]"
                        >
                          <td className="px-[18px] py-3.5">
                            <Checkbox
                              checked={checked}
                              onClick={() => toggle(p.sku)}
                            />
                          </td>
                          <td className="px-3 py-3.5">
                            <Link
                              href={`/admin/products/${p.sku}`}
                              className="flex items-center gap-3"
                            >
                              <span className="relative flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-btn bg-gradient-to-br from-[#f1f2f4] to-[#e6e7ea] text-gray-400">
                                {p.imageUrl ? (
                                  <Image
                                    src={p.imageUrl}
                                    alt={p.name}
                                    fill
                                    sizes="200px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <CategoryIcon
                                    name={cat?.icon ?? "package"}
                                    className="h-5 w-5"
                                  />
                                )}
                              </span>
                              <span>
                                <span className="block text-sm font-semibold text-ink">
                                  {p.name}
                                </span>
                                <span className="block font-mono text-xs text-gray-400">
                                  {p.sku}
                                </span>
                              </span>
                            </Link>
                          </td>
                          <td className="px-3 py-3.5 text-[13.5px] text-gray-600">
                            {cat?.name}
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono text-[13.5px] font-bold text-ink">
                            {formatPrice(p.price)}
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono text-[13.5px]">
                            <span
                              className={cn(
                                p.stock === null
                                  ? "text-gray-400"
                                  : p.stock === 0
                                    ? "text-danger"
                                    : p.stock <= 20
                                      ? "text-warning"
                                      : "text-gray-600",
                              )}
                            >
                              {p.stock === null ? "—" : p.stock}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono text-[13.5px] text-gray-600">
                            {formatNumber(p.views)}
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono text-[13.5px] text-gray-600">
                            {p.waClicks}
                          </td>
                          <td className="px-3 py-3.5">
                            <StatusBadge status={p.status} />
                          </td>
                          <td className="px-3 py-3.5">
                            <div className="flex justify-end gap-1">
                              <IconAction
                                icon={Pencil}
                                title="Quick edit"
                                onClick={() => setEditSku(p.sku)}
                              />
                              <IconAction
                                icon={Copy}
                                title="Duplikat"
                                onClick={() => duplicate(p)}
                              />
                              <IconAction
                                icon={Trash2}
                                title="Hapus"
                                danger
                                onClick={() => setDeleteSku(p.sku)}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!loading && total === 0 && (
          <div className="px-5 py-[70px] text-center">
            <div className="mx-auto mb-4 flex h-[70px] w-[70px] items-center justify-center rounded-card bg-gray-50 text-gray-300">
              <PackageSearch className="h-8 w-8" />
            </div>
            <div className="mb-1 text-[17px] font-bold text-ink">
              Tidak ada produk
            </div>
            <div className="mb-[18px] text-sm text-gray-400">
              Coba ubah pencarian atau filter.
            </div>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCatFilter("all");
                setStatusFilter("all");
                setPage(1);
              }}
              className="h-[42px] rounded-btn border border-admin-border bg-white px-[18px] text-sm font-semibold hover:bg-gray-50"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-[18px] py-3.5">
            <span className="text-[13px] text-gray-400">
              Menampilkan {rangeStart}–{rangeEnd} dari {total}
            </span>
            <div className="flex gap-1.5">
              <PageBtn
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
                aria="Sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </PageBtn>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={n === current ? "page" : undefined}
                  className={cn(
                    "h-[38px] min-w-[38px] rounded-btn border px-2 font-mono text-sm font-bold",
                    n === current
                      ? "border-brand bg-brand text-white"
                      : "border-admin-border bg-white text-ink hover:bg-gray-50",
                  )}
                >
                  {n}
                </button>
              ))}
              <PageBtn
                disabled={current === pageCount}
                onClick={() => setPage(current + 1)}
                aria="Berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </PageBtn>
            </div>
          </div>
        )}
      </div>

      {/* Delete modal */}
      <Modal
        open={!!deleteSku}
        onClose={() => setDeleteSku(null)}
        ariaLabel="Hapus produk"
      >
        <div className="mb-[18px] flex h-14 w-14 items-center justify-center rounded-card bg-brand-subtle text-danger">
          <TriangleAlert className="h-7 w-7" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-ink">Hapus Produk?</h3>
        <p className="mb-6 text-[14.5px] leading-relaxed text-gray-500">
          Anda akan menghapus{" "}
          <strong className="text-ink">{deleteTarget?.name}</strong>. Tindakan
          ini tidak dapat dibatalkan dan data terkait akan hilang permanen.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDeleteSku(null)}
            className="h-12 flex-1 rounded-btn border border-admin-border bg-white text-[14.5px] font-semibold hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={deleting}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-btn bg-danger text-[14.5px] font-bold text-white hover:brightness-95 disabled:opacity-60"
          >
            <Trash2 className="h-[17px] w-[17px]" />
            {deleting ? "Menghapus…" : "Hapus"}
          </button>
        </div>
      </Modal>

      {/* Quick-edit drawer */}
      <Drawer
        open={!!editTarget}
        onClose={() => setEditSku(null)}
        widthClassName="w-[min(92vw,420px)]"
        ariaLabel="Quick edit produk"
      >
        {editTarget && (
          <QuickEditForm
            key={editTarget.sku}
            product={editTarget}
            categories={categories}
            onClose={() => setEditSku(null)}
            onSave={saveEdit}
          />
        )}
      </Drawer>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Checkbox({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label="Pilih"
      onClick={onClick}
      className={cn(
        "flex h-[19px] w-[19px] items-center justify-center rounded-md border-[1.5px]",
        checked ? "border-brand bg-brand" : "border-gray-300 bg-white",
      )}
    >
      {checked && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
    </button>
  );
}

function IconAction({
  icon: Icon,
  title,
  onClick,
  danger,
}: {
  icon: typeof Pencil;
  title: string;
  onClick: () => void;
  danger?: boolean;
}): React.JSX.Element {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cn(
        "flex h-[34px] w-[34px] items-center justify-center rounded-btn border border-admin-border bg-white text-gray-500 transition-colors",
        danger
          ? "hover:border-[#F8D2D7] hover:bg-brand-subtle hover:text-danger"
          : "hover:bg-gray-50 hover:text-brand",
      )}
    >
      <Icon className="h-[15px] w-[15px]" />
    </button>
  );
}

function BulkBtn({
  icon: Icon,
  label,
  onClick,
  tone,
  danger,
  disabled,
}: {
  icon: typeof Pencil;
  label: string;
  onClick: () => void;
  tone?: "success";
  danger?: boolean;
  disabled?: boolean;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-[34px] items-center gap-1.5 rounded-btn border bg-white px-3 text-[13px] font-semibold disabled:opacity-50",
        danger
          ? "border-[#F8D2D7] text-danger"
          : "border-admin-border text-gray-700 hover:bg-gray-50",
      )}
    >
      <Icon
        className={cn(
          "h-[15px] w-[15px]",
          tone === "success" && "text-success",
          danger && "text-danger",
        )}
      />
      {label}
    </button>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  aria,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  aria: string;
}): React.JSX.Element {
  return (
    <button
      type="button"
      aria-label={aria}
      onClick={onClick}
      disabled={disabled}
      className="flex h-[38px] w-[38px] items-center justify-center rounded-btn border border-admin-border bg-white text-ink hover:bg-gray-50 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function SkeletonRow(): React.JSX.Element {
  return (
    <tr className="border-b border-gray-50">
      <td className="px-[18px] py-4">
        <div className="h-[19px] w-[19px] rounded-md bg-gray-100" />
      </td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="shimmer h-11 w-11 rounded-btn" />
          <div className="h-3.5 w-40 rounded-md bg-gray-100" />
        </div>
      </td>
      <td className="px-3 py-4" colSpan={7}>
        <div className="h-3.5 w-4/5 rounded-md bg-gray-100" />
      </td>
    </tr>
  );
}

function QuickEditForm({
  product,
  categories,
  onClose,
  onSave,
}: {
  product: AdminProduct;
  categories: Category[];
  onClose: () => void;
  onSave: (
    patch: Pick<
      AdminProduct,
      "sku" | "name" | "price" | "stock" | "categorySlug" | "status"
    >,
  ) => Promise<boolean>;
}): React.JSX.Element {
  const [name, setName] = React.useState(product.name);
  const [price, setPrice] = React.useState(String(product.price));
  const [stock, setStock] = React.useState(
    product.stock === null ? "" : String(product.stock),
  );
  const [categorySlug, setCategorySlug] = React.useState(product.categorySlug);
  const [status, setStatus] = React.useState<ProductStatus>(product.status);
  const [pending, setPending] = React.useState(false);

  const field =
    "h-[46px] rounded-btn border border-admin-border bg-admin-bg px-3.5 text-[14.5px] outline-none focus:border-brand focus:bg-white";

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 px-[22px] py-5">
        <div>
          <div className="text-[12px] font-semibold tracking-[0.05em] text-gray-400 uppercase">
            Quick Edit
          </div>
          <div className="text-[17px] font-semibold text-ink">
            {product.name}
          </div>
        </div>
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
          className="flex h-[38px] w-[38px] items-center justify-center rounded-btn border border-admin-border bg-white"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="rmx-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto p-[22px]">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-gray-600">
            Nama Produk
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
          />
        </label>
        <div className="grid grid-cols-2 gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-gray-600">
              Harga Mulai
            </span>
            <div className="flex h-[46px] items-center gap-1.5 rounded-btn border border-admin-border bg-admin-bg px-3.5 focus-within:border-brand focus-within:bg-white">
              <span className="font-mono text-gray-400">Rp</span>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                className="w-full border-none bg-transparent font-mono text-[14.5px] outline-none"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-gray-600">
              Stok
            </span>
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="Kosong = pre-order"
              className={`${field} font-mono`}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-gray-600">
            Kategori
          </span>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className={`${field} cursor-pointer`}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-gray-600">
            Status
          </span>
          <div className="flex gap-2.5">
            {(["published", "draft"] as ProductStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "h-11 flex-1 rounded-btn border-[1.5px] text-sm font-bold capitalize",
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

      <div className="flex gap-3 border-t border-gray-200 px-[22px] py-4">
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
            setPending(true);
            const ok = await onSave({
              sku: product.sku,
              name,
              price: parseInt(price, 10) || product.price,
              stock: stock === "" ? null : parseInt(stock, 10) || 0,
              categorySlug,
              status,
            });
            if (!ok) setPending(false);
          }}
          className="h-12 flex-1 rounded-btn bg-brand text-[14.5px] font-bold text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </>
  );
}
