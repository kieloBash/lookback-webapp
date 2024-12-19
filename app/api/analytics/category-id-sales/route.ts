import { ApiResponse } from "@/hooks/analytics/use-categoryid-sales";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { NextResponse } from "next/server";
import { subMonths } from "date-fns";

const ROUTE_NAME = "Fetch Analytics Single Category Sales";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched analytics single category sales";

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
    const categoryId = searchParams.get("id");

    if (!startDate || !endDate || !categoryId) {
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
      items: {
        some: {
          item: {
            categoryId: categoryId,
          },
        },
      },
    } as any;

    const prevWhereClause = {
      transactionType: "SALE",
      createdAt: {
        gte: subMonths(start, 1),
        lte: subMonths(end, 1),
      },
      items: {
        some: {
          item: {
            categoryId: categoryId,
          },
        },
      },
    } as any;

    const [sales, prevSales] = await Promise.all([
      await db.transaction.findMany({
        where: whereClause,
        select: {
          id: true,
          sku: true,
          createdAt: true,
          items: {
            select: {
              item: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  categoryId: true,
                },
              },
            },
          },
        },
      }),
      await db.transaction.findMany({
        where: prevWhereClause,
        select: {
          id: true,
          sku: true,
          createdAt: true,
          items: {
            select: {
              item: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  categoryId: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const salesByDay: { date: string; sales: number; prevSales: number }[] = [];
    const dateIterator = new Date(start);
    const dateFormat = "yyyy-MM-dd";

    while (dateIterator <= end) {
      const dateString = format(dateIterator, dateFormat);
      const prevDateString = format(subMonths(dateIterator, 1), dateFormat);

      const filteredInvoices = sales.filter((sale) => {
        const saleDate = format(sale.createdAt, dateFormat);
        return saleDate === dateString;
      });

      const prevFilteredInvoices = prevSales.filter((sale) => {
        const saleDate = format(sale.createdAt, dateFormat);
        return saleDate === prevDateString;
      });

      const totalSales = filteredInvoices
        .map((sale) => {
          const arr = sale.items.filter(
            (item) => item.item.categoryId === categoryId
          );
          return arr.reduce((acc, curr) => acc + curr.item.price, 0);
        })
        .reduce((acc, curr) => acc + curr, 0);

      const prevTotalSales = prevFilteredInvoices
        .map((sale) => {
          const arr = sale.items.filter(
            (item) => item.item.categoryId === categoryId
          );
          return arr.reduce((acc, curr) => acc + curr.item.price, 0);
        })
        .reduce((acc, curr) => acc + curr, 0);

      salesByDay.push({
        date: dateString,
        sales: totalSales,
        prevSales: prevTotalSales,
      });

      dateIterator.setDate(dateIterator.getDate() + 1);
    }

    const response: ApiResponse = {
      salesByDay,
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
