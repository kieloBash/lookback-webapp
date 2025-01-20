"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./user";

export const createAdminAccount = async ({ email = "admin@gmail.com" }: { email?: string }) => {
    try {
        const hashedPassword = await bcrypt.hash("User1234!", 10);

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return { error: "Email already in use!" };
        }

        const newData = await db.user.create({
            data: {
                name: "ADMIN",
                email,
                password: hashedPassword,
                role: "ADMIN",
                isOnboarded: true,
                emailVerified: new Date(),
            },
        });

        return {
            success: "Success",
            data: newData,
        }

    } catch (error) {
        console.log(error);
        return null;
    } finally {
        db.$disconnect();
    }
};
