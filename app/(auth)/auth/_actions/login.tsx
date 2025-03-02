"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { LoginSchema } from "@/schemas/auth.schema";
import { getUserByEmail } from "@/lib/user";
import { generateVerificationToken } from "@/lib/tokens";

const failedAttempts = new Map<
    string,
    { attempts: number; lastAttempt: number }
>();
const delayMapping: { [key: number]: number } = {
    5: 30 * 1000, // 30 seconds
    6: 60 * 1000, // 1 minute
    7: 2 * 60 * 1000, // 2 minutes
    8: 5 * 60 * 1000, // 5 minutes
    9: 10 * 60 * 1000, // 10 minutes
    10: 15 * 60 * 1000, // 15 minutes
    11: 30 * 60 * 1000, // 30 minutes
    12: 60 * 60 * 1000, // 1 hour
    13: 2 * 60 * 60 * 1000, // 2 hours
    14: 3 * 60 * 60 * 1000, // 3 hours
    15: 6 * 60 * 60 * 1000, // 6 hours
    16: 12 * 60 * 60 * 1000, // 12 hours
};

function getDelayForAttempt(attempts: number): number {
    if (attempts >= 17) {
        return (attempts - 15) * 12 * 60 * 60 * 1000; // starting from 17, add 12 hours
    }
    return delayMapping[attempts] || 0;
}


export const handleLoginAccount = async (values: z.infer<typeof LoginSchema>): Promise<{ error: string; } | { success: string; } | { error_verify: string; token: string; }> => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    try {
        const { email, password } = validatedFields.data;

        console.log(email)

        const userAttempts = failedAttempts.get(email) || {
            attempts: 0,
            lastAttempt: 0,
        };

        console.log(userAttempts)

        if (userAttempts.attempts >= 5) {
            const delay = getDelayForAttempt(userAttempts.attempts);
            const timeSinceLastAttempt = Date.now() - userAttempts.lastAttempt;


            if (timeSinceLastAttempt < delay) {
                console.log("Attempting");
                return {
                    error: `Please wait ${Math.ceil(
                        (delay - timeSinceLastAttempt) / 1000
                    )} seconds before trying again.`
                }
            }
        }

        console.log(email)

        const existingUser = await getUserByEmail(email);
        if (!existingUser || !existingUser.password) return handleFailedLogin({ email });

        if (!existingUser.emailVerified) {
            const verificationToken = await generateVerificationToken(
                existingUser.email
            );

            return { error_verify: "Please verify your account!", token: verificationToken.token }
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordValid) return handleFailedLogin({ email });
        failedAttempts.delete(email);

        return { success: "Welcome!" };

        // if (!existingUser || !existingUser.email || !existingUser.password) {
        //     return { error: "Invalid Credentials!" };
        // }

        // if (!existingUser.emailVerified) {
        //     const verificationToken = await generateVerificationToken(
        //         existingUser.email
        //     );


        //     return {
        //         error_verify: "Please verify your account! A Confirmation email has been sent!",
        //         token: verificationToken.token,
        //     };
        // } else {
        //     const userAttempts = failedAttempts.get(email) || {
        //         attempts: 0,
        //         lastAttempt: 0,
        //     };

        //     if (userAttempts.attempts >= 5) {
        //         console.log("Failed! " + userAttempts.attempts);
        //         const delay = getDelayForAttempt(userAttempts.attempts);
        //         const timeSinceLastAttempt = Date.now() - userAttempts.lastAttempt;

        //         if (timeSinceLastAttempt < delay) {
        //             return {
        //                 error: `Too many failed attempts! Please try again in ${Math.ceil(
        //                     (delay - timeSinceLastAttempt) / 1000
        //                 )} seconds.`,
        //             };
        //         }
        //     }

        //     const isMatching = await bcrypt.compare(password, existingUser.password);
        //     if (!isMatching) return handleFailedLogin(email);
        //     failedAttempts.delete(email);

        //     return { success: "Welcome!" };
        // }

    } catch (error) {
        console.log(error)
        return { error: "An error occured!" };
    }

};


interface IProps {
    email: string;
    message?: string
}
function handleFailedLogin({ email, message = "Invalid Credentials" }: IProps) {
    try {
        const userAttempts = failedAttempts.get(email) || {
            attempts: 0,
            lastAttempt: 0,
        };
        userAttempts.attempts += 1;
        userAttempts.lastAttempt = Date.now();
        failedAttempts.set(email, userAttempts);
        console.log(userAttempts);

        setTimeout(() => {
            try {
                const currentAttempts = failedAttempts.get(email);
                if (
                    currentAttempts &&
                    currentAttempts.lastAttempt === userAttempts.lastAttempt
                ) {
                    failedAttempts.delete(email);
                }
            } catch (timeoutError) {
                console.log(timeoutError)
            }
        }, 60 * 60 * 1000); // 1 hour


        return { error: message }
    } catch (handleError: any) {
        const isDebug = process.env.NODE_ENV !== "production";
        const errorResponse = {
            message: "Internal Error",
            ...(isDebug && {
                stack:
                    handleError instanceof Error
                        ? handleError.stack
                        : "Unknown stack trace",
            }),
        };
        console.log(errorResponse);
        return { error: `[ERROR] handleFailedLogin: ${handleError.message}` };
    }
}