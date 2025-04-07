import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/orders", "/profile", "/order"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;
  const isNotAuth = !token && PROTECTED_PATHS.includes(pathname);
  if (isNotAuth) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("isNotLogin", "true");
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
