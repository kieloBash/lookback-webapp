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
      return new NextResponse(ROUTE_NAME + ": Request not found", {
        status: 404,
      });
    }

    const userHistories = await db.history.findMany({
      where: {
        userId: existing.user?.userProfile?.id ?? "",
        date: {
          gte: subDays(existing.dateOfSymptoms, 14),
          lte: endOfDay(new Date(existing.dateOfTesting)),
        },
      },
      select: {
        // user: {
        //   select: {
        //     id: true,
        //     status: true,
        //     user: { select: { name: true, id: true } },
        //   },
        // },
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

    // {
    //     user: {
    //       id: '678dfd27bd3d9511c381b301',
    //       user: { name: 'Usering Testing', id: '678dfd27bd3d9511c381b300' }
    //     },
    //     date: new Date('2025-01-23T08:29:25.000Z')
    //   },

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
