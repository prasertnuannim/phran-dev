import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { normalizeAccessRole, resolveRoleRedirectPath, AccessRole } from "@/lib/auth/accessRole";
import { ACCESS_RULES, matchProtectedPath } from "./server/services/auth/accessControl";

const COOKIE_CANDIDATES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
];

async function readToken(req: NextRequest, secret: string) {
  let token = await getToken({ req, secret });
  if (token) return token;

  for (const cookieName of COOKIE_CANDIDATES) {
    token = await getToken({
      req,
      secret,
      cookieName,
      secureCookie: cookieName.startsWith("__Secure-"),
    });
    if (token) return token;
  }
  return null;
}

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

    // ✅ ปล่อย API, next assets, favicon ผ่าน
  if (
    pathname.startsWith("/api/sensors") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

   if (pathname.startsWith("/api/sensors/")) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("Missing NEXTAUTH_SECRET");

  const matched = matchProtectedPath(pathname);

  const token = await readToken(req, secret);
  const role = normalizeAccessRole(token?.role) ?? AccessRole.Guest;

  if (!matched) {
    if (pathname === "/" && role !== AccessRole.Guest) {
      const redirectPath = resolveRoleRedirectPath(role);
      if (redirectPath && redirectPath !== "/") {
        return NextResponse.redirect(new URL(redirectPath, nextUrl.origin));
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("next", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  const allowed = ACCESS_RULES[matched];
  if (!allowed.includes(role)) {
    const fallback = resolveRoleRedirectPath(role);
    return NextResponse.redirect(new URL(fallback ?? "/", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
