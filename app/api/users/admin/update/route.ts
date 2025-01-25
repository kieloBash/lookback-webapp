import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notification";
import { AdminUserSchema } from "@/schemas/auth.schema";
import { addMinutes, subDays } from "date-fns";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const ROUTE_NAME = "User Account Update";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Updated Successfully!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "HEAD_ADMIN") {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const { id, ...toValidate } = body;

    if (!toValidate || !id) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const validatedFields = AdminUserSchema.safeParse(body);

    if (!validatedFields.success) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const fields = validatedFields.data;
    let updatedData = {};
    if (fields.password) {
      const hashedPassword = await bcrypt.hash(fields.password as any, 10);
      updatedData = { password: hashedPassword };
    }

    if (fields.role === "USER" && fields.user) {
      await db.user.update({
        where: { id: id },
        data: {
          name: `${fields.user.fname} ${fields.user.lname}`,
          email: fields.email,
          ...updatedData,
        },
      });
      await db.userProfile.update({
        where: { userId: id },
        data: {
          fname: fields.user.fname,
          lname: fields.user.lname,
          gender: fields.user.gender,
          birthDate: new Date(fields.user.birthDate),
          status: fields.user.status ?? "NEGATIVE",
          regCode: fields.user.regCode,
          provCode: fields.user.provCode,
          citymunCode: fields.user.citymunCode,
          brgyCode: fields.user.brgyCode,
        },
      });
    } else if (fields.role === "MANAGEMENT" && fields.management) {
      console.log(fields);
      await db.user.update({
        where: { id: id },
        data: {
          name: fields.management.name,
          email: fields.email,
          ...updatedData,
        },
      });
      await db.managementProfile.update({
        where: { userId: id },
        data: {
          regCode: fields.management.regCode,
          provCode: fields.management.provCode,
          citymunCode: fields.management.citymunCode,
          brgyCode: fields.management.brgyCode,
        },
      });
    }

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
