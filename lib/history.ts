"use server";

import { db } from "@/lib/db";

export const createHistory = async (
  user_email: string,
  management_email: string,
  date: Date
) => {
  try {
    const user = await db.user.findUnique({
      where: { email: user_email, role: "USER" },
      include: { userProfile: true },
    });

    const management = await db.user.findUnique({
      where: { email: management_email, role: "MANAGEMENT" },
      include: { managementProfile: true },
    });

    if (!user || !management) return { error: "User or Management not found!" };

    const newData = await db.history.create({
      data: {
        user: { connect: { id: user.userProfile?.id } },
        management: { connect: { id: management.managementProfile?.id } },
        date,
      },
    });

    return { data: newData };
    
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    db.$disconnect();
  }
};
