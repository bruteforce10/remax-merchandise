/** Turn a Hygraph/graphql-request error into a user-facing message. */
export function hygraphErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as { response?: { errors?: { message?: string }[] } }
    ).response;
    const message = response?.errors?.[0]?.message;
    if (message) {
      if (/permission/i.test(message)) {
        return "Token Hygraph tidak punya izin untuk aksi ini (mis. Delete). Aktifkan permission-nya pada token.";
      }
      return message;
    }
  }
  return fallback;
}
