"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "../../lib/user";

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
                role: "HEAD_ADMIN",
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

export const createUserAccount = async ({ email, name }: { email: string; name: string; }) => {
    try {
        const hashedPassword = await bcrypt.hash("User1234!", 10);

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return { error: "Email already in use!" };
        }

        const newData = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                emailVerified: new Date(),
                role: "USER",
                isOnboarded: true,

                //custom
                userProfile: {
                    create: {
                        fname: "User",
                        lname: "Test",
                        gender: "Male",
                        birthDate: new Date(),
                        regCode: "13",
                        provCode: "1376",
                        citymunCode: "137604",
                        brgyCode: "137604012",
                        status: "NEGATIVE"
                    }
                }
            }
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

export const createManagementAccount = async ({ email, name }: { email: string; name: string; }) => {
    try {
        const hashedPassword = await bcrypt.hash("User1234!", 10);

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return { error: "Email already in use!" };
        }

        const newData = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                emailVerified: new Date(),
                role: "MANAGEMENT",
                isOnboarded: true,

                //custom
                managementProfile: {
                    create: {
                        regCode: "13",
                        provCode: "1376",
                        citymunCode: "137604",
                        brgyCode: "137604012",
                    }
                }
            }
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

export const createHistory = async ({
    user,
    management,
    date,
}: {
    user: string;
    management: string;
    date: Date;
}) => {
    try {
        const [existingUser, existingManagement] = await Promise.all([
            db.user.findFirst({ include: { userProfile: true }, where: { email: user, role: "USER" } }),
            db.user.findFirst({ include: { managementProfile: true }, where: { email: management, role: "MANAGEMENT" } }),
        ])

        if (!existingUser || !existingManagement) {
            return { error: "No use with that email" };
        }

        const newData = await db.history.create({
            data: {
                userId: existingUser.userProfile?.id ?? "",
                managementId: existingManagement.managementProfile?.id ?? "",
                date: new Date(date),
            }
        })

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

