"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas/auth.schema";
import { getUserByEmail } from "@/lib/user";
import { generateVerificationToken } from "@/lib/tokens";

export const handleRegisterAccount = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    try {
        const { email, password, fullName, role } = validatedFields.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return { error: "Email already in use!" };
        }

        await db.user.create({
            data: {
                name: fullName,
                email,
                password: hashedPassword,
                role,
                isOnboarded: false,
            },
        });

        const verificationToken = await generateVerificationToken(email);

        return { success: "Confirmation sent! Please verify your account first before you login! Thank you!", token: verificationToken.token };
    } catch (error) {
        console.log(error)
        return { error: "An error occured!" };
    }

};