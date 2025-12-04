import NextAuth from "next-auth";
import LineProvider from "next-auth/providers/line";
import { AuthService } from "@/server/services/auth.service";

const handler = NextAuth({
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // ส่ง user profile ไป domain layer ของ Sert
      await AuthService.handleOAuthLogin({
        provider: "LINE",
        providerId: account!.providerAccountId,
        name: user.name ?? "",
        email: user.email ?? null,
        avatar: user.image ?? null,
      });

      return true;
    },

    async session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
