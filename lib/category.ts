"use server";

import { db } from "@/lib/db";

export const getCategoryById = async (id: string) => {
  try {
    return await db.category.findUnique({
      where: { id },
      select: { id: true, name: true, description: true },
    });
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    db.$disconnect();
  }
};
