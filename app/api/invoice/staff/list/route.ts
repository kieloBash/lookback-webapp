import { ApiResponse } from "@/hooks/admin/use-invoices";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Invoice List";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE =
  "Successfully fetched list of invoices with the specified range!";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user || user.role !== "STAFF") {
      return new NextResponse(ROUTE_NAME + ": Unauthorized: No Access", {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url || "");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const searchTerm = searchParams.get("searchTerm") || "";
    const filter = searchParams.get("filter") || "all";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new NextResponse(ROUTE_NAME + ": Invalid Input", {
        status: 401,
      });
    }

    const whereClause: any = {
      transactionType: "SALE", // Match transactions of type SALE
      createdAt: {
        gte: new Date(startDate), // Greater than or equal to the start date
        lte: new Date(endDate), // Less than or equal to the end date
      },
      ...(searchTerm !== "" && {
        OR: [
          {
            items: {
              some: {
                item: {
                  name: { contains: searchTerm, mode: "insensitive" }, // Match by item name
                },
              },
            },
          },
          {
            sku: { contains: searchTerm, mode: "insensitive" },
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
      await db.transaction.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          sku: true,
          createdAt: true,
          updatedAt: true,
          totalAmount: true,
          user: { select: { id: true, name: true } },
          items: {
            select: {
              quantity: true,
              price: true,
              item: {
                select: {
                  id: true,
                  sku: true,
                  name: true,
                  category: {
                    select: { id: true, name: true, icon: true },
                  },
                },
              },
            },
          },
        },
        where: whereClause,
        orderBy: { createdAt: "desc" },
      }),
      db.transaction.count({ where: whereClause }),
    ]);

    const formatData = data.map((d) => {
      return {
        ...d,
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
