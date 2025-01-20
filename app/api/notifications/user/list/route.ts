import { ApiResponse } from "@/hooks/management/use-history";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Notifications List";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched list of notifications";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "USER") {
      return new NextResponse(ROUTE_NAME + ": Unauthorized: No Access", {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url || "");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const searchTerm = searchParams.get("searchTerm") || "";
    const statusFilter = searchParams.get("filter") || "ALL";

    const whereClause: any = { userId: user.id };

    const response: ApiResponse = {
      payload: [],
    };

    const [data] = await Promise.all([
      await db.notification.findMany({
        where: whereClause,
        orderBy: { date: "desc" },
      }),
    ]);

    const formatData = data.map((d) => {
      return {
        ...d,
      };
    });

    response.payload = (formatData as any[]) ?? [];

    return NextResponse.json(response, {
      status: ROUTE_STATUS,
    });
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
