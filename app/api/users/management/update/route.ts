import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {  SettingsManagementSchema } from "@/schemas/auth.schema";
import { NextResponse } from "next/server";

const ROUTE_NAME = "User Account Update";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Updated Successfully!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "MANAGEMENT") {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const { id, profileId, ...toValidate } = body;

    if (!toValidate || !id || !profileId) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const validatedFields = SettingsManagementSchema.safeParse(body);

    if (!validatedFields.success) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const fields = validatedFields.data;

    const userExists = await db.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return new NextResponse(ROUTE_NAME + ": User not found", { status: 404 });
    }

    await db.user.update({
      where: { id: userExists.id },
      data: {
        name: fields.name,
      },
    });

    await db.managementProfile.update({
      where: { id: profileId },
      data: {
        regCode: fields.regCode,
        provCode: fields.provCode,
        citymunCode: fields.citymunCode,
        brgyCode: fields.brgyCode,
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
