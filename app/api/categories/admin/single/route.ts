import { ApiResponse } from "@/hooks/admin/use-categoryid";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Single Category";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched single category";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse(ROUTE_NAME + ": Unauthorized: No Access", {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url || "");
    const categoryId = searchParams.get("id") || "";

    if (!categoryId) {
      return new NextResponse(ROUTE_NAME + ": Invalid Input", {
        status: 401,
      });
    }

    const whereClause: any = { id: categoryId };

    const payload = await db.category.findFirst({
      where: whereClause,
      include: { items: true },
    });

    return NextResponse.json(
      { payload },
      {
        status: ROUTE_STATUS,
      }
    );
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
