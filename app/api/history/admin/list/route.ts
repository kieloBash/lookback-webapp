import { ApiResponse } from "@/hooks/admin/use-history";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { endOfMonth, startOfMonth } from "date-fns";
import { NextResponse } from "next/server";

import {
  getBarangayDescription,
  getCityDescription,
  getProvinceDescription,
  getRegionDescription,
} from "@/lib/utils";

const ROUTE_NAME = "Fetch History List";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched list of history";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (
      !user ||
      !user.id ||
      (user.role !== "HEAD_ADMIN" && user.role !== "ADMIN")
    ) {
      return new NextResponse(ROUTE_NAME + ": Unauthorized: No Access", {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url || "");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const searchTerm = searchParams.get("searchTerm") || "";

    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const startDate = startDateParam
      ? new Date(startDateParam)
      : startOfMonth(new Date());
    const endDate = endDateParam
      ? new Date(endDateParam)
      : endOfMonth(new Date());

    const whereClause: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(searchTerm && {
        user: {
          user: {
            name: { contains: searchTerm, mode: "insensitive" },
          },
        },
      }),
    };

    const response: ApiResponse = {
      payload: [],
      totalData: 0,
      totalPages: 0,
      currentPage: 1,
    };

    const [data, totalData] = await Promise.all([
      await db.history.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereClause,
        select: {
          id: true,
          date: true,

          user: {
            select: {
              id: true,
              fname: true,
              lname: true,
              gender: true,

              regCode: true,
              provCode: true,
              citymunCode: true,
              brgyCode: true,
              status: true,
              user: {
                select: {
                  email: true,
                  contactNumber: true,
                },
              },
            },
          },
        },
        orderBy: { date: "desc" },
      }),
      await db.history.count({ where: whereClause }),
    ]);

    const formatData = data.map((d) => {
      return {
        ...d,
        user: {
          ...d.user,
          regCode: getRegionDescription(d.user?.regCode ?? "")
            .split(",")
            .join(" "),
          provCode: getProvinceDescription(d.user?.provCode ?? "")
            .split(",")
            .join(" "),
          citymunCode: getCityDescription(d.user?.citymunCode ?? "")
            .split(",")
            .join(" "),
          brgyCode: getBarangayDescription(d.user?.brgyCode ?? "")
            .split(",")
            .join(" "),
        },
      };
    });

    response.payload = (formatData as any[]) ?? [];
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
