"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { LoginSchema } from "@/schemas/auth.schema";
import { getUserByEmail } from "@/lib/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const handleLoginAccount = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    try {
        const { email, password } = validatedFields.data;

        const existingUser = await getUserByEmail(email);
        if (!existingUser || !existingUser.email || !existingUser.password) {
            return { error: "Email does not exist!" };
        }

        if (!existingUser.emailVerified) {
            const verificationToken = await generateVerificationToken(
                existingUser.email
            );
            await sendVerificationEmail(
                verificationToken.email,
                verificationToken.token
            );

            return {
                error: "Please verify your account! A Confirmation email has been sent!",
            };
        } else {
            const isMatching = await bcrypt.compare(password, existingUser.password);

            if (isMatching) return { success: "Welcome!" };
            else return { error: "Invalid Credentials" };
        }

    } catch (error) {
        console.log(error)
        return { error: "An error occured!" };
    }

};