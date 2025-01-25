import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { subDays } from "date-fns";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Reset Status Users";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Updated Successfully!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "HEAD_ADMIN") {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    await db.userProfile.updateMany({
      where: {
        dateTestedPositive: {
          lte: subDays(new Date(), 14),
        },
      },
      data: {
        status: "NEGATIVE",
        dateTestedPositive: null,
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
