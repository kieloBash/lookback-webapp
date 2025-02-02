import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Contact List";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully fetched list of contacts";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return new NextResponse(ROUTE_NAME + ": Unauthorized: No Access", {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url || "");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

    const whereClause: any = {
      ...(startDate &&
        endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }),
    };

    console.log(whereClause);

    const response: any = {
      payload: [],
    };

    const [data] = await Promise.all([
      await db.contact.findMany({
        where: whereClause,
        include: {
          user: true,
          usersExposed: true,
        },
        // select: {
        //   date: true,
        //   user: {
        //     select: {
        //       name: true,
        //       email: true,
        //       contactNumber: true,
        //       userProfile: {
        //         select: {
        //           regCode: true,
        //           provCode: true,
        //           citymunCode: true,
        //           brgyCode: true,
        //         },
        //       },
        //     },
        //   },
        //   usersExposed: {
        //     select: {
        //       user: {
        //         select: {
        //           name: true,
        //           email: true,
        //           contactNumber: true,
        //           userProfile: {
        //             select: {
        //               regCode: true,
        //               provCode: true,
        //               citymunCode: true,
        //               brgyCode: true,
        //             },
        //           },
        //         },
        //       },
        //     },
        //   },
        // },
        orderBy: { date: "desc" },
      }),
    ]);

    console.log(data);

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
