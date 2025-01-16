"use server";

import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({ where: { email } });
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    db.$disconnect();
  }
};

export const getUserById = async (id: string) => {
  try {
    return await db.user.findUnique({ where: { id } });
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    db.$disconnect();
  }
};

export const getManagementUserById = async (id: string) => {
  try {
    return await db.user.findUnique({
      where: { id },
      select: { id: true, name: true, managementProfile: true },
    });
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    db.$disconnect();
  }
};
