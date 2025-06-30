import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Fetch Generate Report";
const ROUTE_STATUS = 200;
const SUCCESS_MESSAGE = "Successfully generated report";

export async function GET(request: Request) {
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
    const historyId = searchParams.get("historyId") || null;

    if (!historyId)
        return new NextResponse("No history id", {
            status: 401,
        });


    const data = await db.history.findMany({
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
            management: {
                select: {
                    user: true
                }
            }
        },
        orderBy: { date: "desc" },
    });

    return NextResponse.json({ payload: data, message: SUCCESS_MESSAGE }, {
        status: ROUTE_STATUS,
    });
}