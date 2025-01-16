import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { addMinutes, subMinutes } from "date-fns";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Logged User History";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Successfully logged user history!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const existingManagement = await db.user.findFirst({
      where: { id: token, role: "MANAGEMENT" },
      include: { managementProfile: true },
    });

    const existingUser = await db.user.findFirst({
      where: { id: user.id, role: "USER" },
      include: { userProfile: true },
    });

    if (!existingManagement || !existingUser) {
      return new NextResponse(ROUTE_NAME + ": Management or User not found!", {
        status: 404,
      });
    }

    const existingHistory = await db.history.findFirst({
      where: {
        userId: existingUser.userProfile?.id ?? "",
        managementId: existingManagement.managementProfile?.id ?? "",
        date: {
          gte: subMinutes(new Date(), 5),
          lt: addMinutes(new Date(), 5),
        },
      },
    });

    if (existingHistory) {
      return new NextResponse(
        "Already Logged History!",
        { status: 200 } // Or use 409 (Conflict) if applicable
      );
    }

    const logHistory = await db.history.create({
      data: {
        userId: existingUser.userProfile?.id ?? "",
        managementId: existingManagement.managementProfile?.id ?? "",
        date: new Date(),
      },
    });

    return NextResponse.json(
      {
        msg: SUCCESS_MESSAGE,
        values: { ...logHistory },
      },
      { status: ROUTE_STATUS }
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
