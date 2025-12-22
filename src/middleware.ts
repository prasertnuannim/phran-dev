// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";
// import { normalizeAccessRole, resolveRoleRedirectPath, AccessRole } from "@/lib/auth/accessRole";
// import { ACCESS_RULES, matchProtectedPath } from "./server/services/auth/accessControl";

// const COOKIE_CANDIDATES = [
//   "__Secure-authjs.session-token",
//   "authjs.session-token",
// ];

// async function readToken(req: NextRequest, secret: string) {
//   let token = await getToken({ req, secret });
//   if (token) return token;

//   for (const cookieName of COOKIE_CANDIDATES) {
//     token = await getToken({
//       req,
//       secret,
//       cookieName,
//       secureCookie: cookieName.startsWith("__Secure-"),
//     });
//     if (token) return token;
//   }
//   return null;
// }

// export async function middleware(req: NextRequest) {
//   const { nextUrl } = req;
//   const pathname = nextUrl.pathname;

//    if (pathname.startsWith("/api/")) {
//     return NextResponse.next();
//   }

//   const secret = process.env.NEXTAUTH_SECRET;
//   if (!secret) throw new Error("Missing NEXTAUTH_SECRET");

//   const matched = matchProtectedPath(pathname);

//   const token = await readToken(req, secret);
//   const role = normalizeAccessRole(token?.role) ?? AccessRole.Guest;

//   if (!matched) {
//     if (pathname === "/" && role !== AccessRole.Guest) {
//       const redirectPath = resolveRoleRedirectPath(role);
//       if (redirectPath && redirectPath !== "/") {
//         return NextResponse.redirect(new URL(redirectPath, nextUrl.origin));
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
//   if (!allowed.includes(role)) {
//     const fallback = resolveRoleRedirectPath(role);
//     return NextResponse.redirect(new URL(fallback ?? "/", nextUrl.origin));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";
import {
  normalizeAccessRole,
  resolveRoleRedirectPath,
  AccessRole,
} from "@/lib/auth/accessRole";
import { ACCESS_RULES, matchProtectedPath } from "./server/services/auth/accessControl";

type TokenWithRole = JWT & { role?: AccessRole | string };

const COOKIE_CANDIDATES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
];

async function readToken(
  req: NextRequest,
  secret: string,
): Promise<TokenWithRole | null> {
  let token = (await getToken({ req, secret })) as TokenWithRole | null;
  if (token) return token;

  for (const cookieName of COOKIE_CANDIDATES) {
    token = (await getToken({
      req,
      secret,
      cookieName,
      secureCookie: cookieName.startsWith("__Secure-"),
    })) as TokenWithRole | null;
    if (token) return token;
  }
  return null;
}

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // ✅ 1) สำคัญสุด: API ต้องไม่โดน redirect จาก middleware
  // ไม่งั้นจะเกิด 307 loop / หรือถูกพาไปหน้าอื่น
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("Missing NEXTAUTH_SECRET");

  // เช็คว่า path นี้เป็น path ที่ต้องป้องกันไหม
  const matchedPath = matchProtectedPath(pathname);
  if (!matchedPath) return NextResponse.next();

  // อ่าน token
  const token = await readToken(req, secret);

  // ถ้าไม่มี token → redirect ไปหน้า login (หรือของคุณ)
  if (!token) {
    const url = nextUrl.clone();
    url.pathname = "/"; // ปรับเป็นเส้นทาง login ของคุณ
    // ✅ กัน loop (ถ้าเผลอให้ /auth/signin อยู่ใน protected)
    if (url.pathname === pathname) return NextResponse.next();
    return NextResponse.redirect(url);
  }

  // ตรวจ role
  const role = normalizeAccessRole(token.role) ?? AccessRole.Guest;
  const allowedRoles = ACCESS_RULES[matchedPath] ?? [];

  if (!allowedRoles.includes(role)) {
    const redirectPath = resolveRoleRedirectPath(role);
    // ✅ 2) กัน redirect-loop: ห้าม redirect ไป path เดิม
    if (redirectPath === pathname) return NextResponse.next();

    const url = nextUrl.clone();
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// ✅ 3) แนะนำ: exclude /api จาก matcher ด้วย (กันเหนียว)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
