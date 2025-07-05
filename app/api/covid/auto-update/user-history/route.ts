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

    console.log({ user })

    if (!user || !user.id || user.role !== "HEAD_ADMIN") {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    console.log("HELLO")

    const body = await request.json();
    const { contactProfileId, dateOfSymptoms, dateOfTesting, symptoms } = body;
    console.log({ contactProfileId, dateOfSymptoms, dateOfTesting, symptoms });

    if (!contactProfileId || !dateOfTesting || !dateOfSymptoms || !symptoms) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    console.log({ contactProfileId, dateOfSymptoms, dateOfTesting, symptoms });


    const userHistories = await db.history.findMany({
      where: {
        userId: contactProfileId,
        date: {
          gte: subDays(new Date(dateOfSymptoms), 14),
          lte: endOfDay(new Date(dateOfTesting)),
        },
      },
      select: {
        id: true,
        date: true,
        managementId: true,
        userId: true,
      },
    });

    console.log(userHistories);

    const formatted = userHistories.map((uh) => {
      return {
        ...uh,
        // date: uh.date,
        // user: uh.user.user,
        // profileId: uh.user.id,
        // status: uh.user.status,
      };
    });

    console.log(formatted);

    return NextResponse.json(
      {
        values: {
          histories: formatted,
        },
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
