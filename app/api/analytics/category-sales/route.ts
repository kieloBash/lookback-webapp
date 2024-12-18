import { ApiResponse } from "@/hooks/analytics/use-category-sales";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Analytics Category Sales";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched analytics category sales";

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

    const salesData = await db.transaction.findMany({
      where: whereClause,
      select: {
        items: {
          select: {
            quantity: true,
            price: true,
            item: {
              select: {
                id: true,
                name: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    icon: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Aggregate quantity sold per item and per category
    const itemSales: Record<
      string,
      { id: string; name: string; quantity: number; price: number }
    > = {};
    const categorySales: Record<
      string,
      {
        id: string;
        name: string;
        quantity: number;
        icon: string;
        price: number;
      }
    > = {};

    salesData.forEach((transaction) => {
      transaction.items.forEach((item) => {
        const { id: itemId, name: itemName, category } = item.item;
        const {
          id: categoryId,
          name: categoryName,
          icon: categoryIcon,
        } = category || {
          id: "uncategorized",
          name: "Uncategorized",
          icon: "Uncategorized",
        };

        // Count quantities per item
        if (!itemSales[itemId]) {
          itemSales[itemId] = {
            id: itemId,
            name: itemName,
            quantity: 0,
            price: 0,
          };
        }
        itemSales[itemId].quantity += item.quantity;
        itemSales[itemId].price += item.quantity * item.price;

        // Count quantities per category
        if (!categorySales[categoryId]) {
          categorySales[categoryId] = {
            id: categoryId,
            name: categoryName,
            icon: categoryIcon,
            quantity: 0,
            price: 0,
          };
        }
        categorySales[categoryId].quantity += item.quantity;
        categorySales[categoryId].price += item.quantity * item.price;
      });
    });

    // Find the highest-selling item and category
    const highestItemSale = Object.values(itemSales).reduce(
      (max, item) => (item.price > max.price ? item : max),
      { id: "", name: "", quantity: 0, price: 0 }
    );

    const highestCategorySale = Object.values(categorySales).reduce(
      (max, category) => (category.price > max.price ? category : max),
      { id: "", name: "", quantity: 0, price: 0 }
    );

    const response: ApiResponse = {
      itemSales: Object.values(itemSales)
        .map((item) => item)
        .sort((a, b) => b.price - a.price) as any[],
      categorySales: Object.values(categorySales)
        .map((item) => item)
        .sort((a, b) => b.price - a.price) as any[],
      highestItemSale: highestItemSale as any,
      highestCategorySale: highestCategorySale as any,
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
