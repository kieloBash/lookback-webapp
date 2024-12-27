import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { CategorySchema } from "@/schemas/category.schema";

const ROUTE_NAME = "Update Category";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Successfully Updated Category!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const { id, ...toValidate } = body;
    const validatedFields = CategorySchema.safeParse(toValidate);

    if (!validatedFields.success || !id) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const fields = validatedFields.data;

    await db.category.update({
      where: { id },
      data: { ...fields },
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
