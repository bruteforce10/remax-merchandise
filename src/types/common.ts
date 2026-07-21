/** Consistent API/service response envelope (CLAUDE.md §10). */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}
