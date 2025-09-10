"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export const getUserById = async (id: string, includeAccounts = false) => {
  if (!id) return null; // "If no ID given, return nothing"

  try {
    const user = await prisma.user.findUnique({
      where: { id }, // "Find user with this ID"
      include: includeAccounts ? { accounts: true } : undefined, // "Maybe include their login accounts too"
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // "If something goes wrong, return nothing"
  }
};

export const getAccountByUserId = async (userId: string) => {
  if (!userId) return []; // "If no user ID, return empty list"

  try {
    const accounts = await prisma.account.findMany({
      where: { userId }, // "Find all accounts for this user"
    });
    return accounts;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return []; // "If error, return empty list"
  }
};

export const currentUser = async () => {
  try {
    const session = await auth(); // "Check who's logged in"
    return session?.user || null; // "Return their info, or nothing if not logged in"
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
