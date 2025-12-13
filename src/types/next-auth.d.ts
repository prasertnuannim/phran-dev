import { DefaultSession } from "next-auth";
import type { AccessRole } from "@/lib/auth/accessRole";

// 🔹 ขยาย Session / User
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: AccessRole | null;
    } & DefaultSession["user"];
    role?: AccessRole | null;
  }

  interface User {
    id?: string;
    role?: AccessRole | null;
    image?: string | null;
  }
}

// 🔹 ขยาย JWT
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AccessRole | null;
    picture?: string | null;
    email?: string | null;
  }
}
