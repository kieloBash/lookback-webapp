import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Covid Status Update";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Sent Notifications to affected users!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "HEAD_ADMIN") {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const { userIds: users } = body;

    const userIds = users as string[];

    if (userIds.length <= 0) {
      return new NextResponse("No Affected User", { status: ROUTE_STATUS });
    }

    const [notifications, updatedStatus] = await Promise.all([
      db.notification.createMany({
        data: userIds.map((d: any) => ({
          userId: d,
          date: new Date(),
          title: "COVID Exposure Alert",
          message:
            "You may have been exposed to someone who tested positive for COVID-19. Please monitor your health and consider getting tested.",
          type: "COVID",
        })),
      }),
      db.userProfile.updateMany({
        where: {
          userId: { in: userIds },
        },
        data: {
          status: "EXPOSED",
        },
      }),
    ]);

    console.log(notifications);
    console.log(updatedStatus);

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
