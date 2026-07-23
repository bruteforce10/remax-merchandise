import { slugify } from "@/lib/format";
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
  stock: number | null;
  badge: ProductBadge | null;
}

const RAW_PRODUCTS: RawProduct[] = [
  { sku: "PL001", name: "Polo Shirt Lacoste Premium", short: "Polo Lacoste", categorySlug: "polo", price: 95000, stock: 45, badge: "popular" },
  { sku: "PL002", name: "Polo Shirt Katun Pique", short: "Polo Pique", categorySlug: "polo", price: 78000, stock: 72, badge: null },
  { sku: "PL003", name: "Polo Shirt Kombinasi Warna", short: "Polo Kombinasi", categorySlug: "polo", price: 88000, stock: 28, badge: "new" },
  { sku: "TS001", name: "Kaos Cotton Combed 30s", short: "Kaos Combed", categorySlug: "tshirt", price: 55000, stock: 156, badge: "popular" },
  { sku: "TS002", name: "Kaos Polos Premium", short: "Kaos Polos", categorySlug: "tshirt", price: 48000, stock: 220, badge: null },
  { sku: "TS003", name: "Kaos Raglan Event", short: "Kaos Raglan", categorySlug: "tshirt", price: 62000, stock: 88, badge: null },
  { sku: "JK001", name: "Jaket Bomber Corporate", short: "Jaket Bomber", categorySlug: "jacket", price: 215000, stock: 18, badge: "featured" },
  { sku: "JK002", name: "Jaket Fleece Zipper", short: "Jaket Fleece", categorySlug: "jacket", price: 185000, stock: 24, badge: null },
  { sku: "JK003", name: "Jaket Waterproof Taslan", short: "Jaket Taslan", categorySlug: "jacket", price: 235000, stock: 12, badge: "new" },
  { sku: "HD001", name: "Hoodie Fleece Premium", short: "Hoodie Fleece", categorySlug: "hoodie", price: 165000, stock: 35, badge: "popular" },
  { sku: "HD002", name: "Hoodie Zipper Corporate", short: "Hoodie Zipper", categorySlug: "hoodie", price: 185000, stock: 20, badge: null },
  { sku: "UM001", name: "Payung Lipat 3 Otomatis", short: "Payung Lipat", categorySlug: "umbrella", price: 75000, stock: 85, badge: "popular" },
  { sku: "UM002", name: "Payung Golf Jumbo", short: "Payung Golf", categorySlug: "umbrella", price: 110000, stock: 40, badge: null },
  { sku: "UM003", name: "Payung Terbalik Premium", short: "Payung Terbalik", categorySlug: "umbrella", price: 95000, stock: 55, badge: "new" },
  { sku: "MG001", name: "Mug Keramik Custom", short: "Mug Keramik", categorySlug: "mug", price: 35000, stock: 320, badge: "popular" },
  { sku: "MG002", name: "Mug Magic Color Change", short: "Mug Magic", categorySlug: "mug", price: 48000, stock: 180, badge: "new" },
  { sku: "TB001", name: "Tumbler Stainless Vacuum", short: "Tumbler Steel", categorySlug: "tumbler", price: 85000, stock: 65, badge: "featured" },
  { sku: "TB002", name: "Tumbler Infuse Water", short: "Tumbler Infuse", categorySlug: "tumbler", price: 72000, stock: 48, badge: null },
  { sku: "PN001", name: "Pulpen Metal Gravir", short: "Pulpen Metal", categorySlug: "pen", price: 12000, stock: 650, badge: "popular" },
  { sku: "PN002", name: "Pulpen Plastik Custom", short: "Pulpen Plastik", categorySlug: "pen", price: 6000, stock: 1200, badge: null },
  { sku: "NB001", name: "Notebook Hard Cover A5", short: "Notebook A5", categorySlug: "notebook", price: 45000, stock: 95, badge: null },
  { sku: "NB002", name: "Agenda Corporate + Pen", short: "Agenda Set", categorySlug: "notebook", price: 68000, stock: 60, badge: "new" },
  { sku: "LY001", name: "Lanyard Sublim Full Print", short: "Lanyard Print", categorySlug: "lanyard", price: 15000, stock: 500, badge: "popular" },
  { sku: "CP001", name: "Topi Baseball Bordir", short: "Topi Baseball", categorySlug: "cap", price: 55000, stock: 75, badge: null },
  { sku: "CP002", name: "Topi Trucker Foam", short: "Topi Trucker", categorySlug: "cap", price: 52000, stock: 55, badge: "new" },
  { sku: "TT001", name: "Tote Bag Kanvas Blacu", short: "Tote Kanvas", categorySlug: "tote", price: 40000, stock: 140, badge: "popular" },
  { sku: "TT002", name: "Tote Bag Kanvas Premium", short: "Tote Premium", categorySlug: "tote", price: 52000, stock: 80, badge: null },
  { sku: "BP001", name: "Backpack Laptop Corporate", short: "Backpack Laptop", categorySlug: "backpack", price: 275000, stock: 22, badge: "featured" },
  { sku: "ID001", name: "ID Card + Lanyard Set", short: "ID Card Set", categorySlug: "idcard", price: 18000, stock: 800, badge: null },
  { sku: "KC001", name: "Gantungan Kunci Akrilik", short: "GK Akrilik", categorySlug: "keychain", price: 12000, stock: 350, badge: "new" },
  { sku: "KC002", name: "Gantungan Kunci Metal", short: "GK Metal", categorySlug: "keychain", price: 20000, stock: 280, badge: null },
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
