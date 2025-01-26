import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notification";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Covid Status Update";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Successful update of request!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "HEAD_ADMIN") {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const { requestId, userId, dateOfTesting } = body;

    if (!requestId || !userId || !dateOfTesting) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 401 });
    }

    await Promise.all([
      db.userProfile.update({
        where: { id: userId },
        data: {
          status: "POSITIVE",
          dateTestedPositive: dateOfTesting,
        },
      }),
      await db.request.update({
        where: { id: requestId },
        data: { status: "QUALIFIED" },
      }),
      await createNotification({
        userId,
        date: new Date(),
        title: "Request Accepted!",
        message:
          "Your request has been accepted! please practice caution and quarantine for 14 days",
        type: "DEFAULT",
      }),
    ]);

    return NextResponse.json(
      {
        values: {},
        msg: SUCCESS_MESSAGE,
      },
      {
        status: ROUTE_STATUS,
      }
    );
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
