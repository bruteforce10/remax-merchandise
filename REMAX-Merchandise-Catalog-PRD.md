# Product Requirements Document (PRD)
## REMAX Gifts Catalog

| | |
|---|---|
| **Version** | MVP v1.0 |
| **Product Type** | Headless Commerce Product Catalog |
| **Status** | Draft â€” untuk direview stakeholder |
| **Document Owner** | *(isi nama PM)* |
| **Last Updated** | 21 Juli 2026 |

---

## 1. Executive Summary

REMAX Gifts Catalog adalah website katalog official gifts REMAX Indonesia yang modern, cepat, SEO-friendly, dan scalable. Website ini menjadi pusat referensi produk gifts bagi agen REMAX, kantor franchise, corporate client, dan event organizer, sekaligus mempermudah proses inquiry melalui WhatsApp.

Pada tahap MVP, produk ini secara sengaja **bukan marketplace dan bukan e-commerce penuh** â€” tidak ada login pelanggan, checkout, maupun payment gateway. Fokus MVP adalah *discovery* produk yang cepat dan menyenangkan, serta konversi minat menjadi inquiry (lead) via WhatsApp.

Yang membedakan proyek ini adalah pendekatan arsitekturnya: konten (produk, kategori, banner) dipisahkan dari data operasional (analytics, leads, cart) sejak awal, menggunakan Hygraph sebagai headless CMS dan Supabase sebagai database operasional. Pemisahan ini dirancang agar sistem dapat berkembang menjadi e-commerce penuh (Phase 2 & 3 â€” login, checkout, payment, CRM, AI) tanpa migrasi arsitektur.

---

## 2. Problem Statement

> Catatan: brief awal belum menyertakan pain point pengguna secara eksplisit. Bagian ini disusun berdasarkan tujuan bisnis yang diberikan â€” mohon divalidasi dengan riset/data internal jika tersedia.

Saat ini REMAX Indonesia diasumsikan belum memiliki katalog digital terpusat yang profesional untuk merchandise-nya. Agen, kantor franchise, dan corporate client kemungkinan mengandalkan katalog manual (PDF, chat, atau komunikasi langsung) untuk melihat produk dan meminta penawaran, yang membuat proses discovery produk lambat, tidak konsisten, dan sulit di-scale seiring bertambahnya jumlah agen dan variasi produk.

Tanpa katalog digital yang terstruktur:
- Calon pemesan kesulitan membandingkan produk, warna, ukuran, dan MOQ secara mandiri.
- Tim internal tidak punya cara mudah melacak produk mana yang paling diminati.
- Tidak ada jejak digital (SEO) yang membantu REMAX ditemukan calon corporate client baru.

---

## 3. Goals & Objectives

### Business Goals
- Menampilkan seluruh merchandise REMAX secara profesional dalam satu tempat.
- Mempermudah pelanggan menemukan produk yang sesuai kebutuhan.
- Meningkatkan jumlah inquiry yang masuk melalui WhatsApp.
- Menjadi pusat katalog merchandise resmi REMAX.
- Memungkinkan admin mengelola konten tanpa perlu membuka CMS secara langsung.
- Membangun fondasi yang siap berkembang menjadi e-commerce penuh.

### Product Goals
- Waktu muat halaman < 2 detik.
- SEO-friendly di seluruh halaman publik.
- Mobile-first & fully responsive.
- Dashboard admin yang mudah digunakan tanpa training ekstensif.
- Arsitektur headless yang scalable.

---

## 4. User Personas

### Primary
| Persona | Kebutuhan Utama |
|---|---|
| **Agen REMAX** | Referensi cepat produk & harga untuk ditawarkan ke klien sendiri |
| **Marketing REMAX** | Materi promosi merchandise yang konsisten dan mudah dibagikan |
| **Kantor Franchise** | Katalog terpusat untuk kebutuhan cabang tanpa harus tanya kantor pusat |
| **Corporate Client** | Merchandise custom branding untuk kebutuhan event/kantor dalam volume besar |
| **Event Organizer** | Produk merchandise cepat untuk kebutuhan acara dengan MOQ jelas |

### Secondary
| Persona | Kebutuhan Utama |
|---|---|
| **Vendor** | Referensi spesifikasi produk yang diproduksi |
| **Purchasing Staff** | Perbandingan produk & harga sebelum pengajuan pembelian |
| **Business Owner** | Gambaran cepat opsi merchandise untuk branding perusahaan |

---

## 5. User Stories & Requirements

### 5.1 Public Website

**Home**
> As a calon pemesan, I want melihat highlight produk dan kategori populer di halaman utama, so that saya bisa cepat menemukan merchandise yang relevan tanpa harus mencari manual.
- Acceptance Criteria:
  - Hero banner (slider) dengan CTA "Browse Products" dan "Contact".
  - Section kategori populer (Polo, Jacket, Hoodie, Payung, Mug, Pulpen, Tas) tampil sebagai kartu horizontal.
  - Section Featured Products dengan tab filter (All, Polo, Jacket, Bag, Umbrella, Pen), grid 4 kolom (desktop), 3 kolom (tablet), 2 kolom (mobile).
  - Section "Why Choose REMAX" (Premium Quality, Corporate Branding, Fast Production, Custom Logo, MOQ Flexible).
  - CTA akhir mengarah ke chat WhatsApp.

**Search**
> As a pengguna, I want mencari produk berdasarkan nama atau kategori dengan autocomplete, so that saya tidak perlu scroll manual di seluruh katalog.
- Acceptance Criteria:
  - Input pencarian dengan autocomplete & popular search suggestions.
  - Riwayat pencarian tersimpan per sesi pengguna.
  - Filter berdasarkan kategori, harga, dan MOQ.
  - Sort berdasarkan terbaru, terpopuler, dan harga.
  - Setiap pencarian tercatat ke `SearchLog` untuk kebutuhan analytics.

**Category & Category Detail**
> As a pengguna, I want menjelajah produk per kategori dengan banner dan navigasi yang jelas, so that saya bisa fokus ke jenis produk yang saya butuhkan.
- Acceptance Criteria:
  - Banner kategori + breadcrumb navigasi.
  - Grid produk dengan pagination.
  - Filter & sort tersedia di dalam kategori.

**Product Detail**
> As a calon pemesan, I want melihat detail lengkap produk (spesifikasi, warna, ukuran, MOQ) sebelum bertanya, so that saya punya cukup informasi untuk memutuskan tanpa perlu banyak tanya jawab manual.
- Acceptance Criteria:
  - Gallery dengan thumbnail, harga, dan MOQ ditampilkan jelas.
  - Deskripsi, spesifikasi, material, dan metode branding tercantum.
  - Pilihan warna dan ukuran yang tersedia.
  - Related products ditampilkan di bagian bawah.
  - Tombol "Add to Cart" (quotation) dan "Chat WhatsApp" tersedia.
  - Setiap kunjungan produk tercatat ke `ProductStats.views`.

**Cart (Quotation Cart)**
> As a calon pemesan, I want mengumpulkan beberapa produk yang saya minati ke dalam satu daftar, so that saya bisa mengirim satu permintaan penawaran sekaligus lewat WhatsApp, bukan chat satu-satu per produk.
- Acceptance Criteria:
  - Menampilkan daftar produk beserta quantity yang bisa diubah.
  - Ringkasan (summary) jumlah item sebelum dikirim.
  - Tombol "Send to WhatsApp" men-generate pesan WhatsApp dengan format otomatis (nama produk, quantity, per produk).
  - Data cart tersimpan berbasis `sessionId` (tanpa perlu login).

**Contact**
> As a pengguna, I want menemukan informasi kontak dan lokasi REMAX dengan mudah, so that saya bisa menghubungi lewat kanal yang paling nyaman buat saya.
- Acceptance Criteria:
  - Informasi perusahaan, alamat, WhatsApp, email, dan Google Maps.
  - Jam operasional dan FAQ ditampilkan.

### 5.2 Admin Dashboard

**Dashboard Overview**
> As an admin, I want melihat ringkasan performa katalog dalam satu layar, so that saya bisa cepat memahami produk mana yang perlu perhatian tanpa membuka banyak halaman.
- Acceptance Criteria:
  - Overview cards: Total Products, Total Categories, Total Views Today, WA Click Today, Total Leads, Most Viewed Product.
  - Recent activity feed dan quick actions.

**Product Management**
> As an admin, I want membuat, mengubah, menduplikasi, dan menghapus produk dengan mudah, so that saya bisa menjaga katalog tetap update tanpa perlu bantuan developer atau membuka Hygraph langsung.
- Acceptance Criteria:
  - CRUD penuh dengan search, filter status, dan pagination.
  - Bulk action: duplicate, delete, publish.
  - Editor produk mencakup informasi dasar (nama, slug, SKU, kategori, harga, MOQ, deskripsi), gallery, varian, dan SEO (title/description).

**Category, Banner, & Media Management**
> As an admin, I want mengelola kategori, banner homepage, dan file media dari satu tempat, so that saya bisa memperbarui tampilan katalog tanpa menyentuh kode.
- Acceptance Criteria:
  - Category CRUD dengan icon, banner, display order, dan SEO.
  - Banner CRUD (desktop & mobile image, title, subtitle, CTA, order, status publish).
  - Media Library: upload, folder, search, copy URL, rename, delete.

**Leads Management**
> As an admin, I want melihat seluruh inquiry yang masuk beserta produk dan quantity yang diminta, so that saya bisa menindaklanjuti calon pemesan dengan cepat dan terorganisir.
- Acceptance Criteria:
  - Tabel leads: tanggal inquiry, produk, quantity, status.
  - Export data leads ke CSV.

**Analytics**
> As an admin/marketing, I want melihat data product views, klik WhatsApp, dan pencarian terpopuler, so that saya bisa mengambil keputusan produk & konten berbasis data.
- Acceptance Criteria:
  - Metrik: Product Views, WA Click, Popular Product, Popular Category, Popular Search, Daily Traffic.

**Settings & Profile**
> As an admin, I want mengatur informasi perusahaan dan akun saya sendiri, so that data kontak yang tampil di publik selalu akurat.
- Acceptance Criteria:
  - Settings: nama perusahaan, logo, telepon, WhatsApp, Google Maps, SEO default, social media.
  - Profile: nama, email, password, role, avatar.

---

## 6. Success Metrics

Karena target angka spesifik belum ditentukan di brief awal, berikut kerangka metrik yang disusun berdasarkan data yang sudah dirancang untuk ditangkap sistem (`ProductStats`, `Lead`, `SearchLog`, `Event`). **Target/threshold di kolom kanan perlu diisi bersama stakeholder bisnis.**

| Kategori | Metrik | Sumber Data | Target |
|---|---|---|---|
| North Star (kandidat) | Total WhatsApp inquiry per bulan dari katalog | `Lead`, `Event` (type=wa_click) | *TBD* |
| Adoption | Total product views per minggu | `ProductStats.views` | *TBD* |
| Engagement | Rasio Cart â†’ Send to WhatsApp | `Cart` vs `Lead` | *TBD* |
| Engagement | Search-to-result click-through rate | `SearchLog`, `Event` | *TBD* |
| Business Impact | Jumlah leads terkonversi jadi transaksi offline | Data internal sales (di luar sistem) | *TBD* |
| Performance | Lighthouse Performance/SEO/Accessibility/Best Practices | Alat audit (Lighthouse) | 95+ / 100 / 95+ / 100 |
| Operational | Admin dapat publish produk tanpa bantuan developer | Observasi/UAT admin | 100% task berhasil |

---

## 7. Scope

### 7.1 In Scope (MVP)
Product Catalog Â· Product Search Â· Category Â· Product Detail Â· Cart (Quotation) Â· WhatsApp Inquiry Â· Admin Dashboard Â· Analytics dasar Â· SEO

### 7.2 Out of Scope (MVP)
Login Customer Â· Register Â· Checkout Â· Payment Gateway Â· Shipping Â· Order Management Â· Wishlist Â· Review Â· Blog

### 7.3 Definition of Done (MVP Acceptance Criteria)

**Public Website**
- Home, Search, Category, Product Detail, Cart, dan Contact berfungsi penuh.
- Pengguna dapat mencari produk berdasarkan nama dan kategori.
- Pengguna dapat menambahkan produk ke keranjang.
- Keranjang dapat dikirim sebagai pesan WhatsApp dengan format otomatis.
- Seluruh halaman memiliki metadata SEO yang benar (meta title/description, OG, Twitter Card, canonical, JSON-LD, breadcrumb).
- Website responsif di desktop, tablet, dan mobile.

**Admin Dashboard**
- Admin dapat membuat, mengubah, menghapus, dan mempublikasikan produk.
- Admin dapat mengelola kategori, banner, media, dan halaman statis.
- Dashboard menampilkan statistik dasar (views, klik WhatsApp, pencarian).
- Admin tidak perlu membuka Hygraph secara langsung.

### 7.4 Future Phases (di luar MVP)

**Phase 2:** Customer Login, Wishlist, Order, Checkout, Payment Gateway, Shipping, Inventory, Email Notification, Review, Voucher, Invoice.

**Phase 3:** Multi Warehouse, POS, CRM, Loyalty, ERP Integration, Recommendation AI, AI Product Description, AI SEO Generator, Sales Dashboard, Role Permission.

---

## 8. Technical Considerations

### 8.1 Architecture

Arsitektur memisahkan **Public Website**, **Admin Dashboard**, dan **Operational Database** menjadi tiga alur berbeda yang saling terhubung ke Next.js:

```
Public Website (Next.js) â†’ GraphQL API â†’ Hygraph CMS
Admin Dashboard (Next.js) â†’ Hygraph Management API â†’ Hygraph CMS
Operational Data: Next.js API â†’ Prisma â†’ Supabase PostgreSQL
```

Prinsip utamanya: **konten** (produk, kategori, banner, halaman statis) dikelola di Hygraph, sedangkan **data operasional** (analytics, leads, search log, event, cart, settings) dikelola di Supabase melalui Prisma.

### 8.2 Technology Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion |
| CMS (content) | Hygraph â€” Product, Category, Banner, Static Page |
| Database (operational) | Supabase PostgreSQL â€” Analytics, Leads, Search, Cart, Settings |
| ORM | Prisma |
| Storage | Supabase Storage (semua gambar; Hygraph hanya menyimpan URL) |
| Deployment | Vercel |

### 8.3 Content Model (Hygraph)
- **Product:** id, name, slug, category, description, price, MOQ, images, variants, seoTitle, seoDescription, status.
- **Category:** id, name, slug, icon, banner, seoTitle, seoDescription.
- **Banner:** id, title, subtitle, imageDesktop, imageMobile, button, order, status.
- **Page:** About, Contact, FAQ.

### 8.4 Operational Data Model (Supabase)
- **ProductStats:** id, productId, views, waClick, cartCount, createdAt, updatedAt.
- **Lead:** id, products, qty, createdAt.
- **SearchLog:** id, keyword, createdAt.
- **Event:** id, type, productId, sessionId, createdAt.
- **Cart:** id, sessionId, productId, qty.
- **Setting:** companyName, whatsapp, email, maps, socialMedia.

### 8.5 Security
- Seluruh operasi tulis (write) dilakukan melalui server (Server Actions / Route Handlers) â€” tidak langsung dari client ke Hygraph.
- Management API token Hygraph tidak boleh terekspos ke browser.
- Environment variables dikelola melalui Vercel.

### 8.6 Scalability & Maintainability
- Pemisahan Content (Hygraph) vs Operational Data (Supabase) memudahkan penambahan autentikasi, payment gateway, dan order management tanpa mengubah struktur konten di masa depan.
- Komponen UI reusable dengan shadcn/ui.
- TypeScript strict mode.
- Validasi input menggunakan Zod.
- Struktur folder berdasarkan feature/module.

### 8.7 Performance Targets (Lighthouse)
| Metrik | Target |
|---|---|
| Performance | 95+ |
| Accessibility | 95+ |
| SEO | 100 |
| Best Practices | 100 |
| Page load | < 2 detik |

### 8.8 SEO Requirements
Setiap halaman harus menyertakan: meta title, meta description, Open Graph, Twitter Card, canonical URL, JSON-LD (Product schema), breadcrumb, robots.txt, sitemap.xml, dan friendly URL.

---

## 9. Design & UX Requirements

### 9.1 Sitemap
```
/                       Home
/search                 Search
/categories             Category listing
/categories/[slug]      Category detail
/products/[slug]        Product detail
/cart                   Quotation cart
/contact                Contact

/admin                  Admin login/entry
/dashboard              Dashboard overview
/products               Product management
/categories              Category management
/banners                Banner management
/media                  Media library
/leads                  Leads management
/analytics               Analytics
/settings                Company settings
/profile                 Admin profile
```

### 9.2 Visual Style
Minimal, premium, corporate â€” terinspirasi Apple & Shopify. White space luas, gambar besar, sudut membulat 16px, soft shadow. Pendekatan desktop-first namun tetap fully responsive.

### 9.3 Responsive Grid (Featured Products)
Desktop: 4 kolom Â· Tablet: 3 kolom Â· Mobile: 2 kolom.

### 9.4 Admin Dashboard UX
Fokus pada kemudahan penggunaan tanpa training â€” form editor produk yang jelas per section (basic info, gallery, variants, SEO), bulk actions untuk efisiensi (duplicate, delete, publish), dan overview cards yang scannable dalam hitungan detik.

---

## 10. Timeline & Milestones

> Brief awal belum mencantumkan timeline atau tenggat waktu. Berikut struktur fase yang disarankan sebagai starting point â€” **tanggal dan durasi aktual perlu dikonfirmasi bersama tim engineering dan stakeholder bisnis.**

1. **Discovery & Design** â€” finalisasi wireframe, design system, dan content model Hygraph.
2. **Setup Infrastruktur** â€” Hygraph, Supabase, Prisma schema, Vercel project.
3. **Pengembangan Public Website** â€” Home, Search, Category, Product Detail, Cart, Contact.
4. **Pengembangan Admin Dashboard** â€” Product/Category/Banner/Media/Leads/Analytics/Settings/Profile.
5. **SEO & Performance Hardening** â€” audit Lighthouse, structured data, sitemap.
6. **QA & UAT** â€” termasuk uji coba alur admin tanpa training.
7. **Launch**.

---

## 11. Risks & Mitigation

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Ketergantungan pada uptime Hygraph & Supabase | Katalog/dashboard tidak bisa diakses jika salah satu vendor down | Arsitektur sudah terpisah per concern; tambahkan monitoring & fallback caching di Next.js |
| Format pesan WhatsApp (klik-untuk-chat vs WhatsApp Business API) belum ditentukan | Pesan quotation dari Cart bisa gagal terformat rapi di semua device | Tentukan pendekatan (wa.me link vs Business API) di awal development dan uji lintas platform |
| Cart berbasis session tanpa login | Data cart hilang jika cache browser dibersihkan sebelum leads terkirim | Beri indikasi jelas ke user, pertimbangkan expiry & auto-save yang wajar |
| SEO pada arsitektur headless/SSR | Rendering yang salah konfigurasi bisa merugikan SEO meski target skor tinggi | Gunakan SSR/SSG Next.js App Router secara konsisten, audit berkala |
| Scope creep dari roadmap Phase 2/3 yang ambisius | MVP molor karena tergoda menambah fitur | Tegakkan "Out of Scope" secara ketat, fitur baru masuk PRD terpisah |
| Adopsi admin terhadap dashboard baru | Admin kembali minta bantuan developer jika UI tidak intuitif | UAT bersama admin sebelum launch, iterasi berdasarkan feedback |
| Data leads (kontak/nomor WA) tersimpan di Supabase | Perlu kejelasan penanganan data pribadi | Definisikan kebijakan retensi & akses data leads |

---

## 12. Dependencies & Assumptions

### Dependencies
- Akun & project Hygraph aktif (plan yang sesuai kebutuhan produk & traffic).
- Project Supabase (PostgreSQL + Storage) aktif.
- Akun Vercel untuk deployment.
- Nomor/akun WhatsApp resmi REMAX untuk inquiry.
- Konten awal (foto produk, deskripsi, spesifikasi) disiapkan oleh tim marketing/REMAX.
- Domain & DNS untuk website.

### Assumptions
- MVP tidak memerlukan pembayaran online maupun proses order â€” hanya sampai tahap quotation/inquiry.
- Mata uang tunggal (IDR) dan bahasa utama Bahasa Indonesia.
- Satu jenis akses admin sudah cukup untuk MVP (field "Role" di Profile ada, namun sistem Role Permission granular baru masuk Phase 3 â€” perlu klarifikasi, lihat Open Questions).
- Cart tanpa login (berbasis `sessionId`) dapat diterima secara bisnis untuk use case B2B/quotation ini.

---

## 13. Open Questions

1. Berapa target/threshold untuk setiap metrik di Section 6 (mis. target jumlah inquiry per bulan)?
2. Kapan target tanggal launch, dan apakah ada milestone internal yang mengikat?
3. Pendekatan integrasi WhatsApp: link `wa.me` sederhana atau WhatsApp Business (Cloud) API untuk pesan terstruktur?
4. Apakah harga produk ditampilkan publik, atau sebagian kategori/harga bersifat "request quote only" mengingat basis pelanggan B2B/corporate?
5. Apakah MOQ bersifat enforced (tidak bisa input quantity di bawah MOQ) atau hanya informasi?
6. Field "Role" ada di Profile â€” apakah MVP butuh minimal 2 level akses (mis. Admin vs Super Admin), mengingat Role Permission granular baru direncanakan di Phase 3?
7. Apakah website perlu mendukung Bahasa Inggris untuk corporate client, atau Bahasa Indonesia saja?
8. Kebijakan retensi/privasi untuk data leads (nomor WA, nama) yang tersimpan di Supabase?
9. Apakah dibutuhkan integrasi analytics eksternal (Google Analytics/GTM) di luar dashboard analytics internal?
10. Bagaimana strategi penyimpanan/CDN untuk galeri gambar produk dalam jumlah besar di Media Library?

---

*Dokumen ini disusun ulang dari brief awal ke dalam format PRD standar (Executive Summary â†’ Problem Statement â†’ Goals â†’ Personas â†’ User Stories â†’ Success Metrics â†’ Scope â†’ Technical â†’ Design â†’ Timeline â†’ Risks â†’ Dependencies â†’ Open Questions). Bagian yang ditandai TBD/perlu klarifikasi sebaiknya diisi bersama stakeholder sebelum dokumen ini difinalkan untuk sign-off.*


