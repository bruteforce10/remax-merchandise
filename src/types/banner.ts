/** Homepage banner/slide model (maps to Hygraph `Banner`). */
export interface Banner {
  id: string;
  /** Image alt text (for SEO/accessibility). */
  alt: string;
  /** Destination when the banner is clicked. */
  link: string;
  /** Hygraph asset URL, or null when no image is attached yet. */
  imageUrl: string | null;
  /** CSS gradient fallback used when no image is attached. */
  gradient: string;
  order: number;
}
