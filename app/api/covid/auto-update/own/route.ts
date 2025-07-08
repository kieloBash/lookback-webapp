import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Covid Status Update";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Update actual user!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const { userId, status } = body;

    console.log({ userId })
    let title = "COVID Positive Alert"
    let message = "You may have contracted COVID-19 disease."

    if (status === "NEGATIVE") {
      title = "COVID Negetaive Alert"
      message = "Contact is now negative, please stay safe and recover!"
    }

    const notification = await db.notification.create({
      data: {
        userId,
        date: new Date(),
        title,
        message,
        type: "COVID",
      }
    })

    const updatedStatus = await db.userProfile.update({
      where: { userId },
      data: {
        status
      }
    })


    return NextResponse.json(
      {
        values: { updatedStatus, notification },
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
