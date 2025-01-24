import { db } from "@/lib/db";

import { NextResponse } from "next/server";

import { ForgotPasswordSchema } from "@/schemas/auth.schema";
import { generatePasswordResetToken } from "@/lib/tokens";

const ROUTE_NAME = "Forgot Password User";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Please wait while we send you an email to reset your password!";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ForgotPasswordSchema.safeParse(body);

    if (!validated.success) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const fields = validated.data;
    const existing = await db.user.findUnique({
      where: { email: fields.email },
      select: { email: true, name:true },
    });

    if (!existing) {
      return new NextResponse("Email does not exist!", { status: 400 });
    }

    const passwordResetToken = await generatePasswordResetToken(existing.email);

    const response = {
      msg: SUCCESS_MESSAGE,
      values: { token: passwordResetToken.token,email:existing.email, name: existing.name },
    };

    console.log(response);

    return NextResponse.json(response, {
      status: ROUTE_STATUS,
    });
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
