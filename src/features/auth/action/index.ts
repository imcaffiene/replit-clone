"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        accounts: true,
      },
    });

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAccountByUserId = async (userId: string) => {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId,
      },
    });

    return accounts;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const currentUser = async () => {
  const user = await auth();

  return user?.user;
};
