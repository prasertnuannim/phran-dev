import NextAuth, { DefaultSession, type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db/auth/client";
import type { JWT } from "next-auth/jwt";
import {
  authUserService,
  authorizeWithCredentialsService,
} from "@/server/services/auth/authUserService";
import { resolveSessionMaxAgeSeconds } from "@/server/services/auth/sessionService";
import { normalizeAccessRole } from "@/lib/auth/accessRole";

/* ===== Types ===== */
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
    picture?: string | null;
    email?: string | null;
  }
}

/* ===== Providers ===== */
const providers: NextAuthConfig["providers"] = [
  GitHub,
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    authorize: authorizeWithCredentialsService,
  }),
];

/* ===== Callbacks ===== */
const callbacks: NextAuthConfig["callbacks"] = {
  async signIn({ user, account }) {
    if (!user.email || !account?.provider) return false;
    if (account.provider === "credentials") return true;

    await authUserService.findOrCreate(
      { id: user.id, email: user.email, name: user.name, image: user.image },
      account,
    );
    return true;
  },

  async jwt({ token, user, account }) {
    if (user) token.email = user.email ?? token.email;

    if (account?.provider && ["github", "google"].includes(account.provider)) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user?.email ?? "" },
        include: { role: true },
      });
      if (dbUser) {
        token.id = dbUser.id;
        token.role = normalizeAccessRole(
          dbUser.role?.name ?? dbUser.roleId ?? null
        );
        token.picture = dbUser.image ?? token.picture ?? null;
      }
    }

    if (account?.provider === "credentials" && user) {
      token.id = user.id;
      token.role = normalizeAccessRole(user.role ?? null);
      token.picture = user.image ?? null;
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.image =
        (token.picture as string) ?? session.user.image;
    }
    return session;
  },
};

/* ===== Auth Options ===== */
const authOptions: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: resolveSessionMaxAgeSeconds(process.env.SESSION_MAX_AGE),
  },
  providers,
  callbacks,
  pages: {
    signIn: "/", // หรือ /login
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
