import NextAuth, { DefaultSession, type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db/auth/client";
import type { JWT } from "next-auth/jwt";
import type {
  AuthCallbacks,
  AuthJwtCallbackParams,
  AuthSessionCallbackParams,
} from "@/types/auth.type";
import {
  authUserService,
  authorizeWithCredentialsService,
} from "@/server/services/auth/authUserService";
import { resolveSessionMaxAgeSeconds } from "@/server/services/auth/sessionService";
import { AccessRole, normalizeAccessRole } from "@/lib/auth/accessRole";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: AccessRole | null;
    } & DefaultSession["user"];
    role?: AccessRole | null;
  }

  interface User {
    role?: AccessRole | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AccessRole | null;
    picture?: string | null;
    email?: string | null;
  }
}

export {
  AccessRole,
  ROLE_REDIRECT_MAP,
  resolveRoleRedirectPath,
  normalizeAccessRole,
} from "@/lib/auth/accessRole";

const adapter = PrismaAdapter(prisma);
const enableWebAuthn = ["1", "true", "yes"].includes(
  String(process.env.NEXT_PUBLIC_ENABLE_PASSKEY ?? "").toLowerCase(),
);

const providers = (): NextAuthConfig["providers"] => {
  const providerList: NextAuthConfig["providers"] = [
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

  return providerList;
};

const handleSignIn: AuthCallbacks["signIn"] = async ({ user, account }) => {
  if (!user.email || !account?.provider) return false;

  if (account.provider !== "credentials") {
    await authUserService.findOrCreate(
      { id: user.id, email: user.email, name: user.name, image: user.image },
      account,
    );
  }

  return true;
};


const handleJWT: AuthCallbacks["jwt"] = async ({
  token,
  user,
}: AuthJwtCallbackParams): Promise<JWT> => {

  let resolvedRole = normalizeAccessRole(token.role);

  if (user?.email) {
    token.email = user.email;
  }

  // 🔥 ดึงจาก DB ทุก provider (นิ่งที่สุด)
  if (user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { role: true },
    });

    if (dbUser) {
      token.id = dbUser.id;
      resolvedRole =
        normalizeAccessRole(dbUser.role?.name ?? dbUser.roleId ?? null) ??
        resolvedRole;
      token.picture = dbUser.image ?? null;
    }
  }

  token.role = resolvedRole ?? AccessRole.Guest;
  return token;
};

const handleSession: AuthCallbacks["session"] = async ({
  session,
  token,
}: AuthSessionCallbackParams) => {
  const resolvedRole = normalizeAccessRole(token.role) ?? AccessRole.Guest;
  const resolvedSession: typeof session = {
    ...session,
    user: session.user
      ? {
          ...session.user,
          id: token.id as string,
          role: resolvedRole,
          image: (token.picture as string) ?? session.user.image,
        }
      : session.user,
    role: resolvedRole,
  };
  //console.log("[SESSION]", { session: resolvedSession, token });
  return resolvedSession;
};

const callbacks: AuthCallbacks = {
  signIn: handleSignIn,
  jwt: handleJWT,
  session: handleSession,
};

const getAuthOptions = (): NextAuthConfig => ({
  secret: process.env.NEXTAUTH_SECRET,
  adapter,
  session: {
    strategy: "jwt",
    maxAge: resolveSessionMaxAgeSeconds(process.env.SESSION_MAX_AGE),
  },
  experimental: enableWebAuthn ? { enableWebAuthn: true } : undefined,
  providers: providers(),
  callbacks,
  pages: {
    signIn: "/",
  },
});

export const { handlers, auth, signIn, signOut } = NextAuth(getAuthOptions);
