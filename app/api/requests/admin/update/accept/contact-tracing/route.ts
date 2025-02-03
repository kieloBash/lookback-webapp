import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Covid Status Update";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Successful Contact Tracing!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "HEAD_ADMIN") {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const { userIds: users, diagnosedId, dateOfTesting } = body;

    const userIds = users as any[];

    if (userIds.length < 0 || !diagnosedId || !dateOfTesting) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    if (userIds.length <= 0) {
      return new NextResponse("No Affected Users", { status: 400 });
    }

    const diagnosedUser = await db.userProfile.findFirst({
      where: { id: diagnosedId },
    });

    if (!diagnosedUser) {
      return new NextResponse("No Diagnosed User found!", { status: 400 });
    }

    const newContact = await db.contact.create({
      data: {
        userInfectedId: diagnosedUser.userId,
        date: new Date(dateOfTesting),
      },
    });
    console.log(newContact);
    await db.contactUser.createMany({
      data: userIds.map((u) => ({
        contactId: newContact.id,
        userId: u,
      })),
    });

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
