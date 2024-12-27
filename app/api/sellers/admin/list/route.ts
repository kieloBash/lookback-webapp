import { ApiResponse } from "@/hooks/admin/use-sellers";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Sellers List";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched list of sellers";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse(ROUTE_NAME + ": Unauthorized: No Access", {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url || "");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const searchTerm = searchParams.get("searchTerm") || "";

    const whereClause: any = {
      ...(searchTerm !== "" && {
        OR: [
          {
            name: { contains: searchTerm, mode: "insensitive" },
          },
          {
            email: { contains: searchTerm, mode: "insensitive" },
          },
        ],
      }),
    };

    const response: ApiResponse = {
      payload: [],
    };

    const [data] = await Promise.all([
      await db.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

    response.payload = (data as any[]) ?? [];

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
