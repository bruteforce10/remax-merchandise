export const CATEGORY_IMAGE_PATHS: Record<string, string> = {
  backpack: "/category-products/backpack.webp",
  cap: "/category-products/cap.webp",
  hoodie: "/category-products/hoodie.webp",
  idcard: "/category-products/idcard.webp",
  jacket: "/category-products/jacket.webp",
  keychain: "/category-products/keychain.webp",
  mug: "/category-products/mug.webp",
  polo: "/category-products/polo.webp",
  tote: "/category-products/tote.webp",
  tshirt: "/category-products/tshirt.webp",
  tumbler: "/category-products/tumbler.webp",
  umbrella: "/category-products/umbrella.webp",
};

export function hasCategoryImage(slug: string): boolean {
  return slug in CATEGORY_IMAGE_PATHS;
}
