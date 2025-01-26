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
    const { user_histories } = body;

    if (!user_histories) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const affectedUsers = new Set<{
      id: string;
      name: string;
      userProfile: { id: string; status: string };
    }>();

    console.log(user_histories);

    for (const history of user_histories) {
      const relatedHistories = await db.history.findMany({
        where: {
          managementId: history.managementId,
          date: {
            gte: history.date,
            lte: addMinutes(history.date, 30),
          },
          userId: { not: history.userId },
          // user: { status: "NEGATIVE" }, //all affected should be in contact
        },
        include: {
          user: {
            select: {
              id: true,
              status: true,
              user: { select: { id: true, name: true } },
            },
          },
        },
      });

      relatedHistories.forEach((relatedHistory) => {
        if (relatedHistory.userId) {
          const formatted = {
            ...relatedHistory.user.user,
            userProfile: {
              id: relatedHistory.user.id,
              status: relatedHistory.user.status,
            },
          };

          affectedUsers.add(formatted);
        }
      });
    }

    console.log(affectedUsers);

    return NextResponse.json(
      {
        values: {
          affectedUsers: Array.from(affectedUsers),
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
