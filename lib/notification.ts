"use server";

import { db } from "@/lib/db";
import { NotificationType } from "@prisma/client";

export const createNotification = async (data: {
  userId: string;
  date: Date;
  title: string;
  message: string;
  type: NotificationType;
}) => {
  try {
    return await db.notification.create({
      data,
    });
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    db.$disconnect();
  }
};
