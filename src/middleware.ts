import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_ROUTE = ["/"];

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("token");
  const currentPath = new URL(request.url).pathname;

  const response = NextResponse.next();

  if (tokenCookie) {
    try {
      const parsedCookie = JSON.parse(tokenCookie.value);
      const isExpired = new Date(parsedCookie.expiresAt) < new Date();

      if (isExpired && request.cookies.has("token")) {
        response.cookies.delete("token");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      return response;
    } catch (error) {
      console.error("Error parsing token cookie:", error);
      response.cookies.delete("token");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (!tokenCookie && AUTH_ROUTE.includes(currentPath)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};