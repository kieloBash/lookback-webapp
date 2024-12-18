import { ApiResponse } from "@/hooks/analytics/use-seller-sales";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Analytics Seller Sales";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched analytics seller sales";

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

    const whereClause = {
      transactionType: "SALE",
      createdAt: {
        gte: start,
        lte: end,
      },
    } as any;

    const [seller_sales, sellers] = await Promise.all([
      db.transaction.groupBy({
        by: ["userId"],
        _sum: {
          totalAmount: true,
        },
        where: whereClause,
      }),
      db.user.findMany({ select: { id: true, name: true, image: true } }),
    ]);

    const formatted = sellers.map((d, idx) => {
      const sales =
        seller_sales.find((ss) => ss.userId === d.id)?._sum.totalAmount ?? 0;

      return {
        sales,
        seller: { ...d },
        fill: `var(--color-seller${(idx % 5) + 1})`,
      };
    });

    const response: ApiResponse = {
      salesBySeller: formatted,
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
