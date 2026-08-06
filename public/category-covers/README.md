# Category cover images

Cover/background image for the **category detail hero** (`/categories/[slug]`).

## Fully dynamic — just drop the file

Name the file after the category **slug**, e.g. `clothing.webp`. That's it — no
map or code change needed. `<CategoryCover>` resolves the path by convention
(`/category-covers/<slug>.webp`); if the file is missing it falls back to the
default dark gradient (client `onError`).

The category **icon/product image** works the same way from
`public/category-products/<slug>.webp` via `<CategoryVisual>`.

## Guidance

- Format: `.webp` preferred. Landscape, wide (hero is full-width).
- Suggested size: ~1600×600px. A dark scrim is layered on top for text
  legibility, so mid/low-key images with headroom work best.
