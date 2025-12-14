import { AccessRole } from "@/lib/auth/accessRole";

export const ACCESS_RULES: Record<string, AccessRole[]> = {
  "/admin": [AccessRole.Admin],
  "/dashboard": [AccessRole.Admin, AccessRole.User],
  "/doctor": [AccessRole.Doctor],
  "/nurse": [AccessRole.Nurse],
};

export function matchProtectedPath(pathname: string): string | undefined {
  return Object.keys(ACCESS_RULES)
    .sort((a, b) => b.length - a.length) // กัน route ซ้อน
    .find(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );
}
