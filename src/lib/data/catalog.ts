import { slugify } from "@/lib/format";
import type { Banner } from "@/types/banner";
import type { Category } from "@/types/category";
import type { Product, ProductBadge } from "@/types/product";

/**
 * Static catalog seed (Phase 1). Ported from the approved prototype.
 * In Phase 2 this is replaced by Hygraph content via `services/content`.
 * This module is pure data + config and is safe to import on the client.
 */

// ── Colors ──────────────────────────────────────────────────────────────────
export const COLOR_HEX: Record<string, string> = {
  Merah: "#E11D2E",
  Navy: "#000E35",
  Putih: "#FFFFFF",
  Hitam: "#232323",
  Abu: "#9AA0AD",
  Silver: "#C3C7D1",
};

export const COLOR_PALETTE: string[] = [
  "Merah",
  "Navy",
  "Hitam",
  "Putih",
  "Abu",
  "Silver",
];

// ── Badges ───────────────────────────────────────────────────────────────────
export const BADGE_LABELS: Record<ProductBadge, string> = {
  new: "BARU",
  popular: "POPULER",
  featured: "UNGGULAN",
};

export const BADGE_RANK: Record<ProductBadge, number> = {
  featured: 3,
  popular: 2,
  new: 1,
};

// ── Categories ───────────────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  {
    slug: "polo",
    name: "Polo Shirt",
    icon: "shirt",
    material: "Cotton Pique / Lacoste 220gsm",
    productionTime: "7–10 hari kerja",
    branding: "Bordir / Sablon / DTF",
    colors: ["Merah", "Navy", "Putih", "Hitam", "Abu"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Polo shirt katun premium yang nyaman dan berkelas untuk seragam agen dan tim korporat. Jahitan rapi, warna tahan lama, cocok untuk penggunaan harian maupun event.",
  },
  {
    slug: "tshirt",
    name: "T-Shirt",
    icon: "shirt",
    material: "Cotton Combed 30s",
    productionTime: "5–7 hari kerja",
    branding: "Sablon Plastisol / DTF",
    colors: ["Merah", "Putih", "Hitam", "Navy", "Abu"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Kaos katun combed lembut dan adem, pilihan ekonomis untuk event, gathering, dan kampanye promosi dengan sablon berkualitas.",
  },
  {
    slug: "jacket",
    name: "Jaket",
    icon: "shirt",
    material: "Fleece / Taslan Waterproof",
    productionTime: "10–14 hari kerja",
    branding: "Bordir / Patch",
    colors: ["Navy", "Hitam", "Merah", "Abu"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Jaket korporat tahan lama dengan bahan pilihan, memberikan tampilan profesional untuk tim lapangan maupun hadiah eksklusif.",
  },
  {
    slug: "hoodie",
    name: "Hoodie",
    icon: "shirt",
    material: "Fleece Cotton 300gsm",
    productionTime: "10–14 hari kerja",
    branding: "Bordir / Sablon",
    colors: ["Hitam", "Navy", "Abu", "Merah"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Hoodie fleece tebal dan hangat, favorit untuk merchandise komunitas, event, dan seragam kasual yang tetap terlihat premium.",
  },
  {
    slug: "umbrella",
    name: "Payung",
    icon: "umbrella",
    material: "Kain Poly 190T + Rangka Fiber",
    productionTime: "7–10 hari kerja",
    branding: "Sablon Logo",
    colors: ["Merah", "Navy", "Hitam", "Putih"],
    sizes: [],
    description:
      "Payung custom kokoh anti angin dengan cetak logo penuh warna. Corporate gift yang fungsional dan selalu terlihat.",
  },
  {
    slug: "mug",
    name: "Mug",
    icon: "coffee",
    material: "Keramik Grade A 325ml",
    productionTime: "3–5 hari kerja",
    branding: "Sablon / Coating Full",
    colors: ["Putih", "Hitam", "Merah"],
    sizes: [],
    description:
      "Mug keramik berkualitas dengan cetak logo tajam. Souvenir klasik untuk kantor, seminar, dan hampers korporat.",
  },
  {
    slug: "tumbler",
    name: "Tumbler",
    icon: "cup-soda",
    material: "Stainless Steel Vacuum 500ml",
    productionTime: "5–7 hari kerja",
    branding: "Laser Engrave / UV Print",
    colors: ["Silver", "Hitam", "Putih", "Merah"],
    sizes: [],
    description:
      "Tumbler stainless vacuum menjaga suhu minuman lebih lama. Premium gift yang tahan lama dengan gravir logo elegan.",
  },
  {
    slug: "pen",
    name: "Pulpen",
    icon: "pen-line",
    material: "Plastik / Metal",
    productionTime: "3–5 hari kerja",
    branding: "Pad Print / Laser",
    colors: ["Merah", "Hitam", "Navy", "Silver"],
    sizes: [],
    description:
      "Pulpen custom dengan cetak atau gravir logo. Merchandise promosi hemat biaya dengan jangkauan luas.",
  },
  {
    slug: "notebook",
    name: "Notebook",
    icon: "notebook-pen",
    material: "Hard Cover + Kertas 80gsm",
    productionTime: "5–7 hari kerja",
    branding: "Emboss / Hotprint",
    colors: ["Hitam", "Navy", "Merah"],
    sizes: [],
    description:
      "Notebook hard cover eksklusif untuk agenda, meeting kit, dan corporate gift yang berkesan profesional.",
  },
  {
    slug: "lanyard",
    name: "Lanyard",
    icon: "tag",
    material: "Polyester 2cm Full Print",
    productionTime: "3–5 hari kerja",
    branding: "Sublimasi Full Color",
    colors: ["Merah", "Navy", "Hitam"],
    sizes: [],
    description:
      "Lanyard sublimasi warna penuh tajam untuk event, ID card, dan seminar. Kuat dan nyaman digunakan.",
  },
  {
    slug: "cap",
    name: "Topi",
    icon: "shirt",
    material: "Rafel / Twill 5 Panel",
    productionTime: "7–10 hari kerja",
    branding: "Bordir",
    colors: ["Merah", "Navy", "Hitam", "Putih"],
    sizes: [],
    description:
      "Topi baseball bordir rapi untuk seragam lapangan dan merchandise event outdoor.",
  },
  {
    slug: "tote",
    name: "Tote Bag",
    icon: "shopping-bag",
    material: "Kanvas Blacu 12oz",
    productionTime: "5–7 hari kerja",
    branding: "Sablon / DTF",
    colors: ["Putih", "Hitam", "Navy"],
    sizes: [],
    description:
      "Tote bag kanvas kuat dan ramah lingkungan. Goodie bag serbaguna untuk seminar dan kampanye brand.",
  },
  {
    slug: "backpack",
    name: "Backpack",
    icon: "backpack",
    material: "Polyester 600D",
    productionTime: "10–14 hari kerja",
    branding: "Bordir / Rubber Patch",
    colors: ["Hitam", "Navy", "Abu"],
    sizes: [],
    description:
      "Backpack korporat dengan kompartemen laptop. Premium gift fungsional untuk tim dan mitra.",
  },
  {
    slug: "idcard",
    name: "ID Card",
    icon: "id-card",
    material: "PVC + Yoyo Retractable",
    productionTime: "3–5 hari kerja",
    branding: "Digital Print",
    colors: ["Merah", "Navy", "Putih"],
    sizes: [],
    description:
      "Set ID card PVC dengan tali retractable. Identitas resmi yang rapi untuk staf dan event.",
  },
  {
    slug: "keychain",
    name: "Gantungan Kunci",
    icon: "key-round",
    material: "Akrilik / Metal",
    productionTime: "3–5 hari kerja",
    branding: "Print / Emboss",
    colors: ["Merah", "Silver", "Hitam"],
    sizes: [],
    description:
      "Gantungan kunci custom akrilik atau metal. Souvenir kecil berkesan untuk berbagai acara.",
  },
];

// ── Products ─────────────────────────────────────────────────────────────────
interface RawProduct {
  sku: string;
  name: string;
  short: string;
  categorySlug: string;
  price: number;
  moq: number;
  badge: ProductBadge | null;
}

const RAW_PRODUCTS: RawProduct[] = [
  { sku: "PL001", name: "Polo Shirt Lacoste Premium", short: "Polo Lacoste", categorySlug: "polo", price: 95000, moq: 24, badge: "popular" },
  { sku: "PL002", name: "Polo Shirt Katun Pique", short: "Polo Pique", categorySlug: "polo", price: 78000, moq: 24, badge: null },
  { sku: "PL003", name: "Polo Shirt Kombinasi Warna", short: "Polo Kombinasi", categorySlug: "polo", price: 88000, moq: 24, badge: "new" },
  { sku: "TS001", name: "Kaos Cotton Combed 30s", short: "Kaos Combed", categorySlug: "tshirt", price: 55000, moq: 24, badge: "popular" },
  { sku: "TS002", name: "Kaos Polos Premium", short: "Kaos Polos", categorySlug: "tshirt", price: 48000, moq: 24, badge: null },
  { sku: "TS003", name: "Kaos Raglan Event", short: "Kaos Raglan", categorySlug: "tshirt", price: 62000, moq: 24, badge: null },
  { sku: "JK001", name: "Jaket Bomber Corporate", short: "Jaket Bomber", categorySlug: "jacket", price: 215000, moq: 12, badge: "featured" },
  { sku: "JK002", name: "Jaket Fleece Zipper", short: "Jaket Fleece", categorySlug: "jacket", price: 185000, moq: 12, badge: null },
  { sku: "JK003", name: "Jaket Waterproof Taslan", short: "Jaket Taslan", categorySlug: "jacket", price: 235000, moq: 12, badge: "new" },
  { sku: "HD001", name: "Hoodie Fleece Premium", short: "Hoodie Fleece", categorySlug: "hoodie", price: 165000, moq: 12, badge: "popular" },
  { sku: "HD002", name: "Hoodie Zipper Corporate", short: "Hoodie Zipper", categorySlug: "hoodie", price: 185000, moq: 12, badge: null },
  { sku: "UM001", name: "Payung Lipat 3 Otomatis", short: "Payung Lipat", categorySlug: "umbrella", price: 75000, moq: 50, badge: "popular" },
  { sku: "UM002", name: "Payung Golf Jumbo", short: "Payung Golf", categorySlug: "umbrella", price: 110000, moq: 50, badge: null },
  { sku: "UM003", name: "Payung Terbalik Premium", short: "Payung Terbalik", categorySlug: "umbrella", price: 95000, moq: 50, badge: "new" },
  { sku: "MG001", name: "Mug Keramik Custom", short: "Mug Keramik", categorySlug: "mug", price: 35000, moq: 50, badge: "popular" },
  { sku: "MG002", name: "Mug Magic Color Change", short: "Mug Magic", categorySlug: "mug", price: 48000, moq: 50, badge: "new" },
  { sku: "TB001", name: "Tumbler Stainless Vacuum", short: "Tumbler Steel", categorySlug: "tumbler", price: 85000, moq: 50, badge: "featured" },
  { sku: "TB002", name: "Tumbler Infuse Water", short: "Tumbler Infuse", categorySlug: "tumbler", price: 72000, moq: 50, badge: null },
  { sku: "PN001", name: "Pulpen Metal Gravir", short: "Pulpen Metal", categorySlug: "pen", price: 12000, moq: 100, badge: "popular" },
  { sku: "PN002", name: "Pulpen Plastik Custom", short: "Pulpen Plastik", categorySlug: "pen", price: 6000, moq: 100, badge: null },
  { sku: "NB001", name: "Notebook Hard Cover A5", short: "Notebook A5", categorySlug: "notebook", price: 45000, moq: 50, badge: null },
  { sku: "NB002", name: "Agenda Corporate + Pen", short: "Agenda Set", categorySlug: "notebook", price: 68000, moq: 50, badge: "new" },
  { sku: "LY001", name: "Lanyard Sublim Full Print", short: "Lanyard Print", categorySlug: "lanyard", price: 15000, moq: 100, badge: "popular" },
  { sku: "CP001", name: "Topi Baseball Bordir", short: "Topi Baseball", categorySlug: "cap", price: 55000, moq: 24, badge: null },
  { sku: "CP002", name: "Topi Trucker Foam", short: "Topi Trucker", categorySlug: "cap", price: 52000, moq: 24, badge: "new" },
  { sku: "TT001", name: "Tote Bag Kanvas Blacu", short: "Tote Kanvas", categorySlug: "tote", price: 40000, moq: 50, badge: "popular" },
  { sku: "TT002", name: "Tote Bag Kanvas Premium", short: "Tote Premium", categorySlug: "tote", price: 52000, moq: 50, badge: null },
  { sku: "BP001", name: "Backpack Laptop Corporate", short: "Backpack Laptop", categorySlug: "backpack", price: 275000, moq: 12, badge: "featured" },
  { sku: "ID001", name: "ID Card + Lanyard Set", short: "ID Card Set", categorySlug: "idcard", price: 18000, moq: 100, badge: null },
  { sku: "KC001", name: "Gantungan Kunci Akrilik", short: "GK Akrilik", categorySlug: "keychain", price: 12000, moq: 100, badge: "new" },
  { sku: "KC002", name: "Gantungan Kunci Metal", short: "GK Metal", categorySlug: "keychain", price: 20000, moq: 100, badge: null },
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  slug: slugify(p.name),
}));

// ── Lookup maps ──────────────────────────────────────────────────────────────
export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);

export const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.sku, p]),
);

export const PRODUCT_SLUG_MAP: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p]),
);

// ── Banners (homepage hero slides) ───────────────────────────────────────────
export const BANNERS: Banner[] = [
  {
    id: "b1",
    kicker: "Corporate Merchandise",
    title: "Premium Merchandise untuk RE/MAX Indonesia",
    subtitle:
      "Corporate merchandise, event kit, office supplies, dan promotional gifts dalam satu katalog.",
    gradient: "linear-gradient(120deg,#26282e 0%,#3c3f47 55%,#5a5e69 100%)",
    order: 1,
    status: "published",
  },
  {
    id: "b2",
    kicker: "Events & Seragam",
    title: "Seragam & Event Kit Siap Custom",
    subtitle:
      "Dari polo & jaket hingga tumbler, payung, dan goodie bag — lengkap dengan brand Anda.",
    gradient: "linear-gradient(120deg,#1c1d21 0%,#33353c 60%,#4c4f57 100%)",
    order: 2,
    status: "published",
  },
  {
    id: "b3",
    kicker: "Promotional Gifts",
    title: "Corporate Gift yang Berkesan",
    subtitle:
      "Produksi cepat, kualitas premium, pengiriman ke seluruh Indonesia.",
    gradient: "linear-gradient(120deg,#2a2528 0%,#454045 55%,#63606a 100%)",
    order: 3,
    status: "published",
  },
];

// ── UI config ────────────────────────────────────────────────────────────────
export const POPULAR_CATEGORY_SLUGS: string[] = [
  "polo",
  "jacket",
  "hoodie",
  "umbrella",
  "mug",
  "tumbler",
  "tote",
  "cap",
];

export const FOOTER_CATEGORY_SLUGS: string[] = [
  "polo",
  "tshirt",
  "jacket",
  "umbrella",
  "tumbler",
  "tote",
];

export interface HomeTab {
  key: string;
  label: string;
}

export const HOME_TABS: HomeTab[] = [
  { key: "all", label: "Semua" },
  { key: "polo", label: "Polo" },
  { key: "jacket", label: "Jaket" },
  { key: "hoodie", label: "Hoodie" },
  { key: "umbrella", label: "Payung" },
  { key: "mug", label: "Mug" },
  { key: "bag", label: "Tas" },
  { key: "pen", label: "Pulpen" },
];

export const POPULAR_SEARCHES: string[] = [
  "Polo Shirt",
  "Jaket",
  "Payung",
  "Tumbler",
  "Tote Bag",
  "Lanyard",
];

export const PRICE_MIN = 10000;
export const PRICE_MAX = 300000;
export const PAGE_SIZE = 8;
