import { ApiResponse } from "@/hooks/analytics/use-revenue";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Analytics Revenue";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched analytics revenue";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse(ROUTE_NAME + ": Unauthorized: No Access", {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url || "");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new NextResponse(ROUTE_NAME + ": Invalid Input", {
        status: 401,
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const prevMonthStart = new Date(start);
    prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
    const prevMonthEnd = new Date(end);
    prevMonthEnd.setMonth(prevMonthEnd.getMonth() - 1);

    const whereClause: any = {
      transactionType: "SALE",
      createdAt: {
        gte: start,
        lte: end,
      },
    };

    const previousMonthWhereClause: any = {
      transactionType: "SALE",
      createdAt: {
        gte: prevMonthStart,
        lte: prevMonthEnd,
      },
    };

    const [currentRevenue, previousRevenue, dailyRevenues] = await Promise.all([
      db.transaction.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: whereClause,
      }),
      db.transaction.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: previousMonthWhereClause,
      }),
      db.transaction.groupBy({
        by: ["createdAt"],
        _sum: {
          totalAmount: true,
        },
        where: whereClause,
      }),
    ]);

    const currentTotalRevenue = currentRevenue._sum.totalAmount || 0;
    const previousTotalRevenue = previousRevenue._sum.totalAmount || 0;

    const totalDifference = currentTotalRevenue - previousTotalRevenue;
    const percentageDifference =
      previousTotalRevenue > 0
        ? (totalDifference / previousTotalRevenue) * 100
        : 100;

    const revenueByDay: { date: string; revenue: number }[] = [];
    const dateIterator = new Date(start);
    const dateFormat = "yyyy-MM-dd";

    while (dateIterator <= end) {
      const dateString = format(dateIterator, dateFormat);
      const dailyRevenueArr = dailyRevenues.filter((r) =>
        format(r.createdAt, dateFormat).startsWith(dateString)
      );
      const revenue = dailyRevenueArr.reduce(
        (acc, item) => (acc += item._sum.totalAmount ?? 0),
        0
      );
      revenueByDay.push({
        date: dateString,
        revenue: revenue,
      });
      dateIterator.setDate(dateIterator.getDate() + 1);
    }

    const response: ApiResponse = {
      currentTotalRevenue,
      previousTotalRevenue,
      totalDifference,
      percentageDifference,
      status:
        currentTotalRevenue > previousTotalRevenue ? "positive" : "negative",
      revenueByDay,
    };

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
