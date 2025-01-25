import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notification";
import { RequestSchema } from "@/schemas/request.schema";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Request User";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Successfully Created User Request!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "USER") {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const validatedFields = RequestSchema.safeParse(body);

    if (!validatedFields.success) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const fields = validatedFields.data;

    await db.request.create({
      data: {
        userId: user.id,
        dateOfSymptoms: new Date(fields.dateOfSymptoms),
        dateOfTesting: new Date(fields.dateOfTesting),
        symptoms: fields.symptoms,
        medicalImages: [fields.medicalImage],
      },
    });

    await db.user.update({
      where: { id: user.id },
      data: { contactNumber: fields.contactNumber },
    });

    await createNotification({
      userId: user.id,
      date: new Date(),
      title: "COVID Request",
      message:
        "Please wait while the admins check the validity of your test. Thank you for your patience!",
      type: "DEFAULT",
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
