import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { matchProtectedPath } from "./server/services/auth/accessControl";

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

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const publicMatch = pathname.match(/^\/(th|en|zh)(\/about|\/architecture)?\/?$/);
  if (publicMatch) {
    const url = req.nextUrl.clone();
    url.pathname = publicMatch[2] || "/";
    return NextResponse.redirect(url, 308);
  }

  // Coarse authentication only. Server layouts/actions check fresh database roles.
  const matched = matchProtectedPath(pathname);
  if (!matched) return NextResponse.next();

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("Missing NEXTAUTH_SECRET");
  const token = await readToken(req, secret);

  if (!token) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("next", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
