import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/db";
import authConfig from "@/lib/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      return true; //// "Always allow sign-in"
    },

    async jwt({ token, user }) {
      if (user) {// Only on first sign-in
        token.role = user.role; // "Remember their role in the token"
        token.id = user.id; // "Remember their ID in the token"
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET!,
  ...authConfig,
});






// 1. User clicks "Sign in with Google"
// 2. Google redirects back with user info
// 3. signIn() → returns true (allow)
// 4. PrismaAdapter creates/finds user in database
// 5. jwt() → gets called with user object, saves role/id to token
// 6. session() → adds role/id to session object
// 7. User is now signed in
