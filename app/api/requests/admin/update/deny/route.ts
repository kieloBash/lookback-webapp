import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notification";
import { addMinutes, endOfDay, subDays } from "date-fns";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Covid Status Update";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE =
  "Successfully changed status of request and notifications has been sent to users affected!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "HEAD_ADMIN") {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const { newStatus, id } = body;

    if (!newStatus || !id) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    console.log(newStatus, id);

    const existing = await db.request.findFirst({
      where: { id },
      include: { user: { include: { userProfile: true } } },
    });
    if (!existing) {
      return new NextResponse(ROUTE_NAME + ": Data not found", { status: 404 });
    }

    await db.userProfile.update({
      where: { userId: existing.userId },
      data: {
        status: "NEGATIVE",
        dateTestedPositive: null,
      },
    });
    await createNotification({
      userId: existing.userId,
      date: new Date(),
      title: "Request Denied!",
      message: "Your Request has been denied!",
      type: "DEFAULT",
    });
    await db.request.update({
      where: { id: existing.id },
      data: { status: newStatus },
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
