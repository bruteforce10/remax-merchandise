/**
 * Category content model (maps to Hygraph `Category` in Phase 2).
 * `icon` stores a Lucide icon name resolved at render time via <CategoryIcon>.
 */
export interface Category {
  slug: string;
  name: string;
  icon: string;
  material: string;
  productionTime: string;
  branding: string;
  colors: string[];
  sizes: string[];
  description: string;
}
