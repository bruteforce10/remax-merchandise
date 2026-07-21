/** Homepage banner/slide model (maps to Hygraph `Banner` in Phase 2). */
export interface Banner {
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  /** CSS gradient used for the placeholder background (image URL later). */
  gradient: string;
  order: number;
  status: "published" | "draft";
}
