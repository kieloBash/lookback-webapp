import { ApiResponse } from "@/hooks/admin/use-categories";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Category List";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched list of categories";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user || user.role !== "ADMIN") {
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
        ],
      }),
    };

    const response: ApiResponse = {
      payload: [],
      totalData: 0,
      totalPages: 0,
      currentPage: 1,
    };

    const [data, totalData] = await Promise.all([
      await db.category.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereClause,
        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          items: {
            select: {
              id: true,
              name: true,
              quantity: true,
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      await db.category.count({ where: whereClause }),
    ]);

    response.payload = (data as any[]) ?? [];
    response.totalData = totalData;
    response.totalPages = Math.ceil(totalData / limit);
    response.currentPage = page;

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
