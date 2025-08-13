import NextAuth from "next-auth";
import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "database" },
  ...authConfig,
});
