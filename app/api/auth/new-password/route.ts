import { db } from "@/lib/db";

import { NextResponse } from "next/server";

import { getVerificationTokenByToken } from "@/lib/verification";
import { NewPasswordSchema } from "@/schemas/auth.schema";
import { getUserByEmail } from "@/lib/user";
import bcrypt from "bcryptjs";
import { getForgotPasswordByToken } from "@/lib/forgot-password";

const ROUTE_NAME = "Update Password User";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Successfully updated password!";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, ...toValidate } = body;

    const validated = NewPasswordSchema.safeParse(toValidate);

    if (!validated.success || !token) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const existingToken = await getForgotPasswordByToken(token);
    if (!existingToken) {
      return new NextResponse(ROUTE_NAME + ": Token does not exist", {
        status: 400,
      });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return new NextResponse(ROUTE_NAME + ": Token has expired", {
        status: 400,
      });
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return new NextResponse(ROUTE_NAME + ": No user found!", {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(validated.data.password, 10);

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
      },
    });

    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return new NextResponse(SUCCESS_MESSAGE, { status: ROUTE_STATUS });
  } catch (error) {
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
