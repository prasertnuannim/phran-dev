import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  normalizeAccessRole,
  resolveRoleRedirectPath,
} from "@/lib/auth/accessRole";
import {
  ACCESS_RULES,
  matchProtectedPath,
} from "@/server/services/auth/accessControl";

/**
 * =========================
 * LOGGER (EDGE SAFE)
 * =========================
 */
const DEBUG = process.env.MIDDLEWARE_DEBUG === "true";

const log = {
  info: (...args: unknown[]) =>
    console.info("[EDGE][middleware]", ...args),
  warn: (...args: unknown[]) =>
    console.warn("[EDGE][middleware]", ...args),
  error: (...args: unknown[]) =>
    console.error("[EDGE][middleware]", ...args),
};

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const search = nextUrl.search;

  const matched = matchProtectedPath(pathname);

  // =========================
  // BASIC REQUEST LOG
  // =========================
  if (DEBUG) {
    log.info("request", {
      path: pathname,
      matched: matched ?? "public",
    });
  }

  // =========================
  // ENV CHECK (ห้าม throw)
  // =========================
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    log.error("Missing NEXTAUTH_SECRET");
    return NextResponse.next();
  }

  // =========================
  // TOKEN / ROLE
  // =========================
  const token = await getToken({ req, secret });
  const role = normalizeAccessRole(token?.role);
console.log("token>> ", token)
  if (DEBUG) {
    log.info("auth", {
      hasToken: Boolean(token),
      role: role ?? "guest",
      exp: token?.exp,
    });
  }

  // =========================
  // 1️⃣ PUBLIC ROUTES
  // =========================
  if (!matched) {
    // login แล้วเข้าหน้า "/" → redirect ตาม role
    if (pathname === "/" && role) {
      const redirectPath = resolveRoleRedirectPath(role);
      if (redirectPath && redirectPath !== "/") {
        if (DEBUG) {
          log.info("redirect home → role", {
            role,
            to: redirectPath,
          });
        }
        return NextResponse.redirect(
          new URL(redirectPath, req.nextUrl.origin),
        );
      }
    }
    return NextResponse.next();
  }

  // =========================
  // 2️⃣ PROTECTED ROUTES (ต้อง login)
  // =========================
  if (!token) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("next", pathname + search);

    log.warn("unauthorized → redirect to login", {
      path: pathname,
    });

    return NextResponse.redirect(loginUrl);
  }

  // =========================
  // 3️⃣ ROLE-BASED ACCESS
  // =========================
  const allowedRoles = ACCESS_RULES[matched];

  if (!role || !allowedRoles.includes(role)) {
    const fallback = role
      ? resolveRoleRedirectPath(role)
      : "/";

    log.warn("forbidden → redirect", {
      path: pathname,
      role: role ?? "guest",
      allowedRoles,
      fallback,
    });

    return NextResponse.redirect(
      new URL(fallback ?? "/", req.nextUrl.origin),
    );
  }

  // =========================
  // 4️⃣ PASS
  // =========================
  if (DEBUG) {
    log.info("allow", {
      path: pathname,
      role,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
