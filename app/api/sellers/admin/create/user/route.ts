import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateUserSchema } from "@/schemas/auth.schema";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/user";

const ROUTE_NAME = "Create User";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Successfully Created User!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== UserRole.ADMIN) {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const validatedFields = CreateUserSchema.safeParse(body);

    if (!validatedFields.success) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const { email, password, name, role } = validatedFields.data;

    const existing = await getUserByEmail(email);

    if (existing) {
      return new NextResponse(ROUTE_NAME + ": Email already exists!", {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isOnboarded: false,
      },
    });

    return new NextResponse(SUCCESS_MESSAGE, { status: ROUTE_STATUS });
  } catch (error: any) {
    console.error("Error: " + ROUTE_NAME, error);

    const isDebug = process.env.NEXT_PUBLIC_DEBUG !== "production";
    const errorResponse = {
      message: "Internal Error: " + ROUTE_NAME,
      ...(isDebug && {
        stack: error instanceof Error ? error.stack : "Unknown stack trace",
      }),
    };
    return new NextResponse(JSON.stringify(errorResponse), { status: 500 });
  }
}
