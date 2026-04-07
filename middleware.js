import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (pathname.startsWith("/admin/orders") && !hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin/login") && hasSession) {
    const ordersUrl = new URL("/admin/orders", request.url);
    return NextResponse.redirect(ordersUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/orders/:path*", "/admin/login"],
};
