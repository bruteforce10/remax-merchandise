# RE/MAX Merchandise Catalog

Katalog merchandise resmi RE/MAX Indonesia — modern, cepat, dan SEO-friendly.
Fokus MVP: **product discovery + inquiry (lead) via WhatsApp** (bukan e-commerce/checkout).

> Status: **Front-end publik selesai dengan data statis.** Dashboard admin dan
> integrasi backend (Hygraph / Supabase / Prisma) menyusul di fase berikutnya.

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme` design tokens) + **shadcn/ui** conventions
- **lucide-react** (ikon), **framer-motion**, **sonner** (toast), **zod** (validasi)
- Konten & data operasional saat ini **statis** (`src/lib/data`, `src/services`)

## Prasyarat

- Node.js ≥ 18 (dites di v22)
- **pnpm** (proyek wajib pnpm — bukan npm/yarn)

```bash
# aktifkan pnpm (salah satu):
corepack enable pnpm
# atau
npm install -g pnpm
```

## Menjalankan

```bash
pnpm install      # install dependencies
pnpm dev          # dev server  → http://localhost:3000
pnpm build        # production build
pnpm start        # jalankan hasil build
pnpm lint         # linting
```

Salin `.env.example` → `.env.local` untuk konfigurasi lokal
(`NEXT_PUBLIC_WA_NUMBER`, dll). Jangan commit `.env*`.

## Struktur

```
src/
  app/(public)/     Home, Search, Categories, Category detail,
                    Product detail, Cart, Contact  (+ not-found, sitemap, robots)
  components/       ui/ · layout/ · home/ · product/ · category/ · search/ · cart/ · contact/
  services/content/ Fetcher konten (statis → Hygraph di Phase 2)
  lib/              data (seed), catalog helpers, format, whatsapp, constants
  providers/        CartProvider (context + localStorage, sessionId)
  types/            Model TypeScript
```

## Rute Publik

`/` · `/search` · `/categories` · `/categories/[slug]` · `/products/[slug]` ·
`/cart` · `/contact`

## Catatan Arsitektur

Konten (produk/kategori/banner) dipisah dari data operasional sejak awal agar
Phase 2 (Hygraph CMS + Supabase/Prisma) bisa ditambahkan tanpa migrasi
arsitektur. Semua fetcher sudah `async` dan tinggal diisi query GraphQL.
Halaman admin (`/admin/*`) direncanakan menyusul.
