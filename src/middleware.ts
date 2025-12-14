// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";
// import {
//   normalizeAccessRole,
//   resolveRoleRedirectPath,
// } from "@/lib/auth/accessRole";
// import {
//   ACCESS_RULES,
//   matchProtectedPath,
// } from "@/server/services/auth/accessControl";

// export async function middleware(req: NextRequest) {
//   const { nextUrl } = req;
//   const pathname = nextUrl.pathname;
//   const matched = matchProtectedPath(pathname);

//   const secret = process.env.NEXTAUTH_SECRET;
//   if (!secret) {
//     console.log("NEXTAUTH_SECRET Fail")
//     throw new Error("Missing NEXTAUTH_SECRET");
//   }

//   const token = await getToken({ req, secret });
//   const role = normalizeAccessRole(token?.role);
//   const session = token
//     ? {
//         email: token.email,
//         name: token.name,
//         role: token.role,
//         exp: token.exp,
//       }
//     : null;
//   console.log("[middleware] session:", session);
//   console.log("[middleware] token:", token);

//   if (!matched) {
//     if (pathname === "/" && role) {
//       const redirectPath = resolveRoleRedirectPath(role);
//       if (redirectPath && redirectPath !== "/") {
//         return NextResponse.redirect(
//           new URL(redirectPath, req.nextUrl.origin),
//         );
//       }
//     }
//     return NextResponse.next();
//   }

//   if (!token) {
//     const loginUrl = new URL("/", req.url);
//     loginUrl.searchParams.set("next", pathname + nextUrl.search);
//     return NextResponse.redirect(loginUrl);
//   }

//   const allowed = ACCESS_RULES[matched];
//   if (!role || !allowed.includes(role)) {
//     const fallback = resolveRoleRedirectPath(role);
//     return NextResponse.redirect(
//       new URL(fallback ?? "/", req.nextUrl.origin),
//     );
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

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
  // 1) ลองแบบ default ก่อน
  let token = await getToken({ req, secret });
  if (token) return token;

  // 2) ลองแบบระบุชื่อ cookie (กัน prod/https)
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

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("Missing NEXTAUTH_SECRET");

  const matched = matchProtectedPath(pathname);

  const token = await readToken(req, secret);
  const role = normalizeAccessRole(token?.role) ?? AccessRole.Guest;

  // PUBLIC
  if (!matched) {
    if (pathname === "/" && role !== AccessRole.Guest) {
      const redirectPath = resolveRoleRedirectPath(role);
      if (redirectPath && redirectPath !== "/") {
        return NextResponse.redirect(new URL(redirectPath, nextUrl.origin));
      }
    }
    return NextResponse.next();
  }

  // PROTECTED ต้อง login
  if (!token) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("next", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // RBAC
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
