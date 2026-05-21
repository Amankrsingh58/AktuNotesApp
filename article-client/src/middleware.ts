import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("userToken")?.value;
  const { pathname } = request.nextUrl;

  // Protect the write route
  if (pathname.startsWith("/write")) {
    if (!token) {
      // Redirect to login page
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent logged-in users from hitting login/signup pages
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/write/:path*", "/write", "/login", "/signup"],
};
