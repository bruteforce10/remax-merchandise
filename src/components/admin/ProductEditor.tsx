"use client";

import {
  ArrowLeft,
  Check,
  Info,
  Package,
  SearchCheck,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { createProduct, updateProduct } from "@/actions/products";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { CategoryIcon } from "@/components/ui/Icon";
import { COLOR_PALETTE } from "@/lib/data/catalog";
import { formatNumber, slugify } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  buildMatrix,
  makeVariantSku,
  optionsKey,
  productOptions,
  variantTitle,
} from "@/lib/variants";
import type {
  AdminProductDetail,
  AssetImage,
  ProductStatus,
} from "@/types/admin";
import type { Category } from "@/types/category";

const FIELD =
  "h-[46px] rounded-btn border border-admin-border bg-admin-bg px-3.5 text-[14.5px] outline-none focus:border-brand focus:bg-white";
const LABEL = "text-[13px] font-semibold text-gray-600";
const CARD = "rounded-card border border-admin-border bg-white p-5.5";

interface ProductEditorProps {
  mode: "create" | "edit";
  product?: AdminProductDetail;
  categories: Category[];
}

interface CustomVariant {
  id: string;
  name: string;
  values: string[];
}

interface VariantRow {
  sku: string;
  title: string;
  options: Record<string, string>;
  /** Kept as input strings; "" price = inherit base, "" stock = not tracked. */
  price: string;
  stock: string;
}

export function ProductEditor({
  mode,
  product,
  categories,
}: ProductEditorProps): React.JSX.Element {
  const router = useRouter();

  const [name, setName] = React.useState(product?.name ?? "");
  const [sku, setSku] = React.useState(product?.sku ?? "");
  const [categorySlug, setCategorySlug] = React.useState(
    product?.categorySlug ?? categories[0]?.slug ?? "",
  );
  const [shortDesc, setShortDesc] = React.useState(product?.short ?? "");
  const [fullDesc, setFullDesc] = React.useState(product?.description ?? "");
  const [price, setPrice] = React.useState(product ? String(product.price) : "");
  const [stock, setStock] = React.useState(
    product && product.stock !== null ? String(product.stock) : "",
  );
  const [sizes, setSizes] = React.useState<string[]>(product?.sizes ?? []);
  const [colors, setColors] = React.useState<string[]>(
    product?.colors ?? ["Merah", "Navy"],
  );
  const [material, setMaterial] = React.useState(product?.material ?? "");
  const [branding, setBranding] = React.useState(product?.branding ?? "");
  const [status, setStatus] = React.useState<ProductStatus>(product?.status ?? "draft");
  const [newSize, setNewSize] = React.useState("");
  const [newColor, setNewColor] = React.useState("");
  const [customVariants, setCustomVariants] = React.useState<CustomVariant[]>(
    product?.customVariants ?? [],
  );
  const [keywords, setKeywords] = React.useState(product?.keywords ?? "");
  const [images, setImages] = React.useState<AssetImage[]>(
    product?.images ?? [],
  );
  const [variants, setVariants] = React.useState<VariantRow[]>(
    product?.variants.map((v) => ({
      sku: v.sku,
      title: v.title,
      options: v.options,
      price: v.price !== null ? String(v.price) : "",
      stock: v.stock !== null ? String(v.stock) : "",
    })) ?? [],
  );
  const [pending, setPending] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const slug = product?.slug ?? (name ? slugify(name) : "");
  const previewCategory = categories.find((c) => c.slug === categorySlug);
  const variantDimNames = variants[0] ? Object.keys(variants[0].options) : [];

  function addSize(): void {
    const v = newSize.trim().toUpperCase();
    if (v && !sizes.includes(v)) setSizes((s) => [...s, v]);
    setNewSize("");
  }

  function toggleColor(nameC: string): void {
    setColors((c) =>
      c.includes(nameC) ? c.filter((x) => x !== nameC) : [...c, nameC],
    );
  }

  function addColor(): void {
    const v = newColor.trim();
    if (!v) return;
    if (!colors.includes(v)) setColors((c) => [...c, v]);
    setNewColor("");
  }

  function addVariantGroup(): void {
    setCustomVariants((list) => [
      ...list,
      { id: `v${Date.now()}`, name: "", values: [] },
    ]);
  }
  function updateGroup(updated: CustomVariant): void {
    setCustomVariants((list) =>
      list.map((g) => (g.id === updated.id ? updated : g)),
    );
  }
  function removeGroup(id: string): void {
    setCustomVariants((list) => list.filter((g) => g.id !== id));
  }

  /** Rebuild the variant matrix from the current options, keeping any price/
   * stock already entered for combinations that still exist. */
  function generateVariants(): void {
    const combos = buildMatrix(productOptions(colors, sizes, customVariants));
    setVariants((prev) => {
      const byKey = new Map(prev.map((r) => [optionsKey(r.options), r]));
      return combos.map((options) => {
        const existing = byKey.get(optionsKey(options));
        return {
          sku: existing?.sku ?? makeVariantSku(sku.trim() || "SKU", options),
          title: variantTitle(options),
          options,
          price: existing?.price ?? "",
          stock: existing?.stock ?? "",
        };
      });
    });
  }

  function updateVariant(index: number, patch: Partial<VariantRow>): void {
    setVariants((rows) =>
      rows.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  }

  function removeVariant(index: number): void {
    setVariants((rows) => rows.filter((_, i) => i !== index));
  }

  async function save(): Promise<void> {
    if (uploading) {
      toast.error("Tunggu gambar selesai diunggah");
      return;
    }
    if (!name.trim()) {
      toast.error("Nama produk wajib diisi");
      return;
    }
    if (!sku.trim()) {
      toast.error("SKU wajib diisi");
      return;
    }
    setPending(true);
    const input = {
      name: name.trim(),
      slug,
      sku: sku.trim(),
      categorySlug,
      shortDescription: shortDesc,
      description: fullDesc,
      price: parseInt(price, 10) || 0,
      stock: stock === "" ? null : parseInt(stock, 10) || 0,
      sizes,
      colors,
      material,
      branding,
      customVariants: customVariants.map((v) => ({
        name: v.name,
        values: v.values,
      })),
      variants: variants.map((r) => ({
        sku: r.sku,
        title: r.title,
        price: r.price === "" ? null : parseInt(r.price, 10) || 0,
        stock: r.stock === "" ? null : parseInt(r.stock, 10) || 0,
        options: r.options,
      })),
      imageIds: images.map((im) => im.id),
      // Meta title/description mirror the product name & full description.
      seoTitle: name.trim(),
      seoDescription: fullDesc,
      keywords,
      status,
    };
    const res =
      mode === "edit" && product
        ? await updateProduct(product.sku, input)
        : await createProduct(input);
    if (!res.success) {
      toast.error(res.message);
      setPending(false);
      return;
    }
    toast.success(res.message);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      <div className="mb-5 flex items-center gap-3.5">
        <Link
          href="/admin/products"
          aria-label="Kembali"
          className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-btn border border-admin-border bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-[19px] w-[19px]" />
        </Link>
        <div className="flex-1">
          <h1 className="text-[23px] font-semibold tracking-tight text-ink">
            {mode === "edit" ? "Edit Produk" : "Produk Baru"}
          </h1>
          <p className="mt-0.5 text-[13.5px] text-gray-400">
            {mode === "edit" ? `SKU ${product?.sku}` : "Lengkapi detail produk baru"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_340px]">
        {/* Left */}
        <div className="flex min-w-0 flex-col gap-[18px]">
          {/* Basic info */}
          <section className={CARD}>
            <h3 className="mb-[18px] text-base font-semibold text-ink">Informasi Dasar</h3>
            <div className="flex flex-col gap-3.5">
              <Field label="Nama Produk">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="mis. Polo Shirt Lacoste Premium"
                  className={FIELD}
                />
              </Field>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <Field label="Slug">
                  <input
                    value={slug}
                    readOnly
                    placeholder="otomatis-dari-nama"
                    className={`${FIELD} font-mono text-gray-500`}
                  />
                </Field>
                <Field label="SKU">
                  <input
                    value={sku}
                    // SKU becomes a URL segment (/admin/products/[sku]); spaces
                    // break that, so collapse whitespace to a hyphen on input.
                    onChange={(e) =>
                      setSku(e.target.value.toUpperCase().replace(/\s+/g, "-"))
                    }
                    placeholder="PL001"
                    className={`${FIELD} font-mono`}
                  />
                </Field>
              </div>
              <Field label="Kategori">
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className={`${FIELD} cursor-pointer`}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Deskripsi Singkat">
                <input
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Ringkasan satu kalimat"
                  className={FIELD}
                />
              </Field>
              <Field label="Deskripsi Lengkap">
                <textarea
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  rows={4}
                  placeholder="Tulis deskripsi produk…"
                  className="resize-y rounded-btn border border-admin-border bg-admin-bg px-3.5 py-3 text-[14.5px] outline-none focus:border-brand focus:bg-white"
                />
              </Field>
            </div>
          </section>

          {/* Price & stock */}
          <section className={CARD}>
            <h3 className="mb-[18px] text-base font-semibold text-ink">Harga &amp; Stok</h3>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="Harga Mulai">
                <div className="flex h-[46px] items-center gap-1.5 rounded-btn border border-admin-border bg-admin-bg px-3.5 focus-within:border-brand focus-within:bg-white">
                  <span className="font-mono text-gray-400">Rp</span>
                  <input
                    value={price ? formatNumber(parseInt(price, 10) || 0) : ""}
                    onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                    inputMode="numeric"
                    placeholder="95.000"
                    className="w-full border-none bg-transparent font-mono text-[14.5px] outline-none"
                  />
                </div>
              </Field>
              <Field label="Stok (pcs) — kosong = pre-order">
                <input
                  value={stock}
                  onChange={(e) => setStock(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  placeholder="240"
                  className={`${FIELD} font-mono`}
                />
              </Field>
            </div>
          </section>

          {/* Variants */}
          <section className={CARD}>
            <h3 className="mb-[18px] text-base font-semibold text-ink">Varian</h3>
            <div className="flex flex-col gap-4">
              <div>
                <span className={`${LABEL} mb-2 block`}>Ukuran</span>
                <div className="flex flex-wrap items-center gap-2">
                  {sizes.map((s) => (
                    <span
                      key={s}
                      className="inline-flex h-9 items-center gap-1.5 rounded-pill border border-admin-border bg-admin-bg px-3.5 text-[13px] font-semibold"
                    >
                      {s}
                      <button
                        type="button"
                        aria-label={`Hapus ${s}`}
                        onClick={() => setSizes((list) => list.filter((x) => x !== s))}
                      >
                        <X className="h-[13px] w-[13px] text-gray-400 hover:text-danger" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSize();
                      }
                    }}
                    placeholder="+ Tambah"
                    className="h-9 w-[100px] rounded-pill border border-dashed border-gray-300 bg-white px-3.5 text-[13px] outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div>
                <span className={`${LABEL} mb-2 block`}>Warna</span>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTE.map((c) => {
                    const active = colors.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleColor(c)}
                        aria-pressed={active}
                        className={cn(
                          "inline-flex h-9 items-center rounded-pill border px-3.5 text-[13px] font-semibold",
                          active
                            ? "border-brand bg-brand-subtle text-brand-dark"
                            : "border-admin-border bg-admin-bg text-gray-600",
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                  {colors
                    .filter((c) => !COLOR_PALETTE.includes(c))
                    .map((c) => (
                      <span
                        key={c}
                        className="inline-flex h-9 items-center gap-1.5 rounded-pill border border-brand bg-brand-subtle px-3.5 text-[13px] font-semibold text-brand-dark"
                      >
                        {c}
                        <button
                          type="button"
                          aria-label={`Hapus ${c}`}
                          onClick={() =>
                            setColors((list) => list.filter((x) => x !== c))
                          }
                        >
                          <X className="h-[13px] w-[13px] text-brand/60 hover:text-danger" />
                        </button>
                      </span>
                    ))}
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addColor();
                      }
                    }}
                    placeholder="Nama warna kustom (mis. Maroon)"
                    className="h-9 flex-1 rounded-pill border border-dashed border-gray-300 bg-white px-3.5 text-[13px] outline-none focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="h-9 flex-none rounded-pill bg-brand px-3.5 text-[13px] font-semibold text-white hover:bg-brand-hover"
                  >
                    Tambah
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <Field label="Material">
                  <input
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Cotton Pique 220gsm"
                    className={FIELD}
                  />
                </Field>
                <Field label="Metode Branding">
                  <input
                    value={branding}
                    onChange={(e) => setBranding(e.target.value)}
                    placeholder="Bordir / Sablon / DTF"
                    className={FIELD}
                  />
                </Field>
              </div>

              {/* Custom variants */}
              <div className="border-t border-gray-200 pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className={LABEL}>Varian Kustom</span>
                  <button
                    type="button"
                    onClick={addVariantGroup}
                    className="text-[13px] font-semibold text-brand"
                  >
                    + Tambah Varian
                  </button>
                </div>
                {customVariants.length === 0 ? (
                  <p className="text-[13px] text-gray-400">
                    Belum ada. Tambahkan tipe varian sendiri — mis. Bahan, Model,
                    atau Metode Cetak.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {customVariants.map((v) => (
                      <CustomVariantGroup
                        key={v.id}
                        group={v}
                        onChange={updateGroup}
                        onRemove={removeGroup}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Stock per variant */}
          <section className={CARD}>
            <div className="mb-[18px] flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  Stok per Varian
                </h3>
                <p className="mt-0.5 max-w-[420px] text-[13px] text-gray-400">
                  Kombinasi dari Warna, Ukuran &amp; Varian Kustom. Isi harga
                  &amp; stok tiap kombinasi. Produk tanpa varian memakai harga
                  &amp; stok tunggal di atas.
                </p>
              </div>
              <button
                type="button"
                onClick={generateVariants}
                className="h-9 flex-none rounded-pill bg-brand px-4 text-[13px] font-semibold text-white hover:bg-brand-hover"
              >
                Generate Varian
              </button>
            </div>
            {variants.length === 0 ? (
              <p className="rounded-btn bg-admin-bg px-3.5 py-3 text-[13px] text-gray-500">
                Belum ada varian. Tambahkan opsi di atas lalu klik{" "}
                <b className="font-semibold text-gray-600">Generate Varian</b>.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-admin-border text-left text-gray-500">
                      <th className="py-2 pr-3 font-semibold">SKU</th>
                      {variantDimNames.map((n) => (
                        <th key={n} className="py-2 pr-3 font-semibold">
                          {n}
                        </th>
                      ))}
                      <th className="py-2 pr-3 font-semibold">Harga</th>
                      <th className="py-2 pr-3 font-semibold">Stok</th>
                      <th className="py-2 font-semibold" aria-label="Aksi" />
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((row, i) => (
                      <tr
                        key={row.sku}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="py-2 pr-3 font-mono text-[12px] text-gray-500">
                          {row.sku}
                        </td>
                        {variantDimNames.map((n) => (
                          <td
                            key={n}
                            className="py-2 pr-3 font-semibold text-ink"
                          >
                            {row.options[n] ?? "—"}
                          </td>
                        ))}
                        <td className="py-2 pr-3">
                          <input
                            value={row.price}
                            onChange={(e) =>
                              updateVariant(i, {
                                price: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            inputMode="numeric"
                            placeholder="Base"
                            className="h-9 w-[96px] rounded-lg border border-admin-border bg-admin-bg px-2.5 font-mono text-[13px] outline-none focus:border-brand focus:bg-white"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            value={row.stock}
                            onChange={(e) =>
                              updateVariant(i, {
                                stock: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            inputMode="numeric"
                            placeholder="0"
                            className="h-9 w-[76px] rounded-lg border border-admin-border bg-admin-bg px-2.5 font-mono text-[13px] outline-none focus:border-brand focus:bg-white"
                          />
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            aria-label={`Hapus ${row.sku}`}
                            onClick={() => removeVariant(i)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-admin-border bg-white text-gray-500 hover:bg-brand-subtle hover:text-danger"
                          >
                            <X className="h-[14px] w-[14px]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Images */}
          <section className={CARD}>
            <h3 className="mb-[18px] text-base font-semibold text-ink">Gambar Produk</h3>
            <ImageUpload
              value={images}
              onChange={setImages}
              onUploadingChange={setUploading}
              max={8}
              hint="PNG, JPG, WEBP hingga 10MB · gambar pertama jadi Utama"
            />
          </section>

          {/* SEO */}
          <section className={CARD}>
            <div className="mb-[18px] flex items-center gap-2">
              <SearchCheck className="h-[19px] w-[19px] text-brand" />
              <h3 className="text-base font-semibold text-ink">SEO</h3>
            </div>
            <div className="flex flex-col gap-3.5">
              <p className="rounded-btn bg-admin-bg px-3.5 py-2.5 text-[12.5px] leading-relaxed text-gray-500">
                Meta title &amp; description otomatis mengikuti{" "}
                <b className="font-semibold text-gray-600">Nama Produk</b> dan{" "}
                <b className="font-semibold text-gray-600">Deskripsi Lengkap</b>.
              </p>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <Field label="Keywords">
                  <input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="polo, seragam, corporate"
                    className={FIELD}
                  />
                </Field>
                <Field label="Canonical URL">
                  <input
                    value={slug ? `/products/${slug}` : ""}
                    readOnly
                    className={`${FIELD} font-mono text-gray-500`}
                  />
                </Field>
              </div>
            </div>
          </section>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-[18px] lg:sticky lg:top-[78px]">
          <section className="rounded-card border border-admin-border bg-white p-5">
            <h3 className="mb-3.5 text-[15px] font-semibold text-ink">Status</h3>
            <div className="flex flex-col gap-2">
              {(
                [
                  ["draft", "Draft", "Simpan tanpa dipublikasikan"],
                  ["published", "Published", "Tampil di katalog publik"],
                ] as [ProductStatus, string, string][]
              ).map(([value, label, desc]) => {
                const active = status === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatus(value)}
                    className={cn(
                      "flex items-center gap-3 rounded-btn border-[1.5px] px-3.5 py-3 text-left",
                      active ? "border-brand bg-brand-subtle-2" : "border-admin-border bg-white",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border-[1.5px]",
                        active ? "border-brand" : "border-gray-300",
                      )}
                    >
                      {active && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">{label}</span>
                      <span className="block text-xs text-gray-400">{desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-card border border-admin-border bg-white p-5">
            <h3 className="mb-3 text-[15px] font-semibold text-ink">Pratinjau</h3>
            <div className="overflow-hidden rounded-card border border-admin-border">
              <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-[#f1f2f4] to-[#e6e7ea] text-gray-300">
                {images[0] ? (
                  <Image
                    src={images[0].url}
                    alt={name || "Pratinjau produk"}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                ) : previewCategory ? (
                  <CategoryIcon name={previewCategory.icon} className="h-9 w-9" />
                ) : (
                  <Package className="h-9 w-9" />
                )}
              </div>
              <div className="p-3">
                <div className="text-[11px] font-semibold tracking-[0.05em] text-gray-400 uppercase">
                  {previewCategory?.name ?? ""}
                </div>
                <div className="my-0.5 text-sm font-semibold text-ink">
                  {name || "Nama Produk"}
                </div>
                <div className="font-mono text-[15px] font-semibold text-brand">
                  Rp {price ? formatNumber(parseInt(price, 10) || 0) : "0"}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-admin-border bg-white/90 py-3.5 lg:sticky lg:bottom-0 lg:z-20 lg:-mx-6 lg:px-6 lg:backdrop-blur-[10px]">
        <span className="mr-auto inline-flex items-center gap-1.5 text-[13px] text-gray-400">
          <Info className="h-[15px] w-[15px]" />
          Perubahan belum disimpan
        </span>
        <Link
          href="/admin/products"
          className="flex h-[46px] items-center rounded-btn border border-admin-border bg-white px-5 text-[14.5px] font-semibold hover:bg-gray-50"
        >
          Batal
        </Link>
        <button
          type="button"
          onClick={save}
          disabled={pending || uploading}
          className="inline-flex h-[46px] items-center gap-2 rounded-btn bg-brand px-[22px] text-[14.5px] font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          <Check className="h-[18px] w-[18px]" />
          {uploading ? "Mengunggah gambar…" : pending ? "Menyimpan…" : "Simpan Produk"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}

function CustomVariantGroup({
  group,
  onChange,
  onRemove,
}: {
  group: CustomVariant;
  onChange: (g: CustomVariant) => void;
  onRemove: (id: string) => void;
}): React.JSX.Element {
  const [draft, setDraft] = React.useState("");

  function addValue(): void {
    const v = draft.trim();
    if (v && !group.values.includes(v)) {
      onChange({ ...group, values: [...group.values, v] });
    }
    setDraft("");
  }

  return (
    <div className="rounded-btn border border-admin-border bg-admin-bg p-3">
      <div className="mb-2 flex items-center gap-2">
        <input
          value={group.name}
          onChange={(e) => onChange({ ...group, name: e.target.value })}
          placeholder="Nama varian (mis. Bahan)"
          className="h-9 flex-1 rounded-lg border border-admin-border bg-white px-3 text-[13.5px] font-semibold outline-none focus:border-brand"
        />
        <button
          type="button"
          aria-label="Hapus varian"
          onClick={() => onRemove(group.id)}
          className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-admin-border bg-white text-gray-500 hover:bg-brand-subtle hover:text-danger"
        >
          <Trash2 className="h-[15px] w-[15px]" />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {group.values.map((val) => (
          <span
            key={val}
            className="inline-flex h-8 items-center gap-1.5 rounded-pill border border-admin-border bg-white px-3 text-[12.5px] font-semibold"
          >
            {val}
            <button
              type="button"
              aria-label={`Hapus ${val}`}
              onClick={() =>
                onChange({
                  ...group,
                  values: group.values.filter((x) => x !== val),
                })
              }
            >
              <X className="h-3 w-3 text-gray-400 hover:text-danger" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue();
            }
          }}
          placeholder="+ Nilai"
          className="h-8 w-[90px] rounded-pill border border-dashed border-gray-300 bg-white px-3 text-[12.5px] outline-none focus:border-brand"
        />
      </div>
    </div>
  );
}
