/** Consistent return shape for Server Actions and API routes. */
export interface ActionResult<T = null> {
  success: boolean;
  data: T | null;
  message: string;
}
