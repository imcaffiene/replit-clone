// 1. IMPORTS - Getting the tools you need
import { PrismaAdapter } from "@auth/prisma-adapter"; // Database connection
import NextAuth from "next-auth"; // Auth library
import authConfig from "./auth.config"; // Your providers (Google, GitHub, etc.)
import { prisma } from "@/lib/db"; // Your database client

// 2. SETUP NextAuth with configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Tell NextAuth to use your database
  adapter: PrismaAdapter(prisma),

  // 3. CUSTOM LOGIC - What happens when someone tries to sign in
  callbacks: {
    async signIn({ user, account, profile }) {
      // user = { email: "john@gmail.com", name: "John", image: "..." }
      // account = { provider: "google", providerAccountId: "123456", access_token: "...", etc. }

      // Step 1: Basic validation
      if (!user || !account) return false; // Block sign-in if data is missing

      // Step 2: Check if user already exists in YOUR database
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! }, // Find by email
      });

      if (!existingUser) {
        // SCENARIO A: Brand new user (first time signing in)
        console.log("Creating new user...");

        const newUser = await prisma.user.create({
          data: {
            // Save user info
            email: user.email!,
            name: user.name,
            image: user.image,

            // ALSO create the account connection in the same operation
            accounts: {
              create: {
                // Save provider info (Google, GitHub, etc.)
                type: account.type, // "oauth"
                provider: account.provider, // "google"
                providerAccountId: account.providerAccountId, // "123456"

                // Save tokens (for calling Google APIs later if needed)
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            },
          },
        });

        if (!newUser) return false; // If creation failed, block sign-in
      } else {
        // SCENARIO B: User exists, but maybe signing in with a NEW provider
        console.log("User exists, checking if this provider is linked...");

        const existingAccount = await prisma.account.findUnique({
          where: {
            // Check if THIS specific provider account is already linked
            provider_providerAccountId: {
              provider: account.provider, // "google"
              providerAccountId: account.providerAccountId, // "123456"
            },
          },
        });

        if (!existingAccount) {
          // Link this new provider to the existing user
          console.log("Linking new provider to existing user...");

          await prisma.account.create({
            data: {
              userId: existingUser.id, // Connect to existing user
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
        }
        // If account already exists, do nothing (user is just signing in again)
      }

      // Step 3: Allow the sign-in to proceed
      return true;
    },
  },

  // 4. OTHER CONFIG
  secret: process.env.AUTH_SECRET, // Required for security
  session: { strategy: "jwt" }, // Use JWTs instead of database sessions
  ...authConfig, // Your providers, pages, etc.
});
