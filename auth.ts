import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, UserRole } from "@prisma/client";
import authConfig from "@/auth.config";
import { db } from "./lib/db";
import { getUserById } from "./lib/user";
import { getAccountByUserId } from "./lib/account";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isOAuth: boolean;
  isOnboarded: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/",
    // error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // //Allow OAth w/o email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user?.id || "");

      //Prevent sign in w/o email verification
      if (!existingUser?.emailVerified) return false;

      //TODO: Add 2FA check
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.isOnboarded = token.isOnboarded as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;

      token.role = existingUser.role;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.picture = existingUser.image;
      token.isOnboarded = existingUser.isOnboarded;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // doesn't work on the edge/middleware
  ...authConfig,
});
