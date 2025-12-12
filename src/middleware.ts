import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { AccessRole } from "@/lib/auth/accessRole";

const ACCESS_RULES: Record<string, AccessRole[]> = {
  "/dashboard": [AccessRole.Admin, AccessRole.User],
  "/admin": [AccessRole.Admin],
};

function matchProtected(pathname: string) {
  return Object.keys(ACCESS_RULES).find(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const matched = matchProtected(pathname);

  if (!matched) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || !token.role) {
    const login = new URL("/", req.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  const allowed = ACCESS_RULES[matched];
  if (!allowed.includes(token.role as AccessRole)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
