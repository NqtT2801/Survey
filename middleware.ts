import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminCookieValue, ADMIN_COOKIE } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const cookie = req.cookies.get(ADMIN_COOKIE.name)?.value;
  if (await verifyAdminCookieValue(cookie)) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
