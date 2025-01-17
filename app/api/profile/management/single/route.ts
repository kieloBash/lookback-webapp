import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Management Profile";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched management profile";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return new NextResponse(ROUTE_NAME + ": Unauthorized: No Access", {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url || "");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const searchTerm = searchParams.get("searchTerm") || "";
    const id = searchParams.get("managementId") || "";

    if (!id) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", {
        status: 400,
      });
    }

    const whereClause: any = {
      userId: id,
    };

    const [data] = await Promise.all([
      await db.managementProfile.findFirst({
        where: whereClause,
        include: {
          user: true,
        },
      }),
    ]);

    if (!data) {
      return new NextResponse(ROUTE_NAME + ": Profile not found!", {
        status: 404,
      });
    }

    return NextResponse.json(
      { payload: data },
      {
        status: ROUTE_STATUS,
      }
    );
  } catch (error: any) {
    console.log(error);

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
