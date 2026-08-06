import type { Category } from "@/types/category";
import type { ProductBadge } from "@/types/product";

/**
 * Static catalog seed (Phase 1). Ported from the approved prototype.
 * In Phase 2 this is replaced by Hygraph content via `services/content`.
 * This module is pure data + config and is safe to import on the client.
 */

// ── Colors ──────────────────────────────────────────────────────────────────
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
// Fallback/seed category data. `featured` is added below (Hygraph is the live
// source of truth for the flag once seeded).
const FEATURED_SLUGS = new Set(["polo", "jacket", "tumbler", "umbrella"]);

const RAW_CATEGORIES: Omit<Category, "featured">[] = [
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
      "Payung kokoh anti angin dengan cetak logo REMAX penuh warna. Corporate gift yang fungsional dan selalu terlihat.",
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
      "Pulpen dengan cetak atau gravir logo REMAX. Merchandise promosi hemat biaya dengan jangkauan luas.",
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
      "Gantungan kunci akrilik atau metal berlogo REMAX. Souvenir kecil berkesan untuk berbagai acara.",
  },
];

export const CATEGORIES: Category[] = RAW_CATEGORIES.map((c) => ({
  ...c,
  featured: FEATURED_SLUGS.has(c.slug),
}));

// ── Lookup maps ──────────────────────────────────────────────────────────────
export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);

// ── UI config ────────────────────────────────────────────────────────────────
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
