import { ApiResponse } from "@/hooks/management/use-history";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Requet List";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched list of requests";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "HEAD_ADMIN") {
      return new NextResponse(ROUTE_NAME + ": Unauthorized: No Access", {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url || "");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const searchTerm = searchParams.get("searchTerm") || "";
    const statusFilter = searchParams.get("filter") || "ALL";

    const whereClause: any = {};

    const response: ApiResponse = {
      payload: [],
    };

    const [data] = await Promise.all([
      await db.request.findMany({
        where: whereClause,
        select: {
          id: true,
          dateOfSymptoms: true,
          dateOfTesting: true,
          medicalImages: true,
          symptoms: true,
          status: true,
          user: {
            select: {
              id: true,
              userProfile: {
                select: {
                  id: true,
                  fname: true,
                  regCode: true,
                  provCode: true,
                  citymunCode: true,
                  brgyCode: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
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
