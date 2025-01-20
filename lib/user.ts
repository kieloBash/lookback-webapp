"use server";

import { db } from "@/lib/db";
import { currentUser } from "./auth";
import { UserRole } from "@prisma/client";

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

export const getUser = async (id: string) => {
  try {
    return await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,

        userProfile: true,
        managementProfile: true,
        requests: {
          select: { id: true },
          where: {
            status: "PENDING",
          },
        },
      },
    });
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
