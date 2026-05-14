// [admin-middleware] 2026-05-13 — Route protection for /admin/* paths
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware — Fast-fail gate for admin routes.
 *
 * Checks for the presence of an accessToken cookie.
 * If missing, redirects to /admin/login immediately.
 *
 * NOTE: We cannot validate the JWT here (no secret available in Edge Runtime).
 * The real auth validation happens in the AdminAuthGuard component via GET /auth/me.
 * This middleware simply prevents unauthenticated users from even loading the admin JS bundle.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (excluding /admin/login itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const accessToken = request.cookies.get("accessToken")

    if (!accessToken?.value) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
