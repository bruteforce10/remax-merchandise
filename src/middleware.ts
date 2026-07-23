import { type NextRequest, NextResponse } from "next/server";

import { isAdminEmail } from "@/lib/auth";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Keeps the Supabase session fresh on every request and guards the admin panel.
 * The panel (`/admin/*`, except the `/admin` login page) is restricted to
 * allowlisted admin emails; authenticated admins are bounced off the login page.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { user, response } = await updateSession(request);
  const { pathname } = request.nextUrl;
  const isAdmin = isAdminEmail(user?.email);

  if (pathname.startsWith("/admin/") && !isAdmin) {
    return redirectTo(request, "/admin", response);
  }
  if (pathname === "/admin" && isAdmin) {
    return redirectTo(request, "/admin/dashboard", response);
  }

  return response;
}

/** Redirect while preserving the refreshed auth cookies from `base`. */
function redirectTo(
  request: NextRequest,
  path: string,
  base: NextResponse,
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  base.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
