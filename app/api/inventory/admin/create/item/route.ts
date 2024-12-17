import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { CategorySchema } from "@/schemas/category.schema";
import { RestockInventorySchema } from "@/schemas/transaction.schema";

const ROUTE_NAME = "Add new Item to Inventory";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Successfully Added new item to inventory!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== UserRole.ADMIN) {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const validatedFields = RestockInventorySchema.safeParse(body);

    if (!validatedFields.success) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const fields = validatedFields.data;

    const existingSKU = await db.item.findFirst({
      where: { sku: fields.item.sku },
    });

    if (existingSKU)
      return new NextResponse(ROUTE_NAME + ": Invalid SKU", { status: 400 });

    await db.item.create({
      data: {
        name: fields.item.name,
        sku: fields.item.sku,
        categoryId: fields.item.category,

        quantity: fields.item.quantity,
        reorderLevel: fields.item.reorderLevel,
        price: fields.item.price,

        createdAt: new Date(fields.date),
      },
    });

    return new NextResponse(SUCCESS_MESSAGE, { status: ROUTE_STATUS });
  } catch (error: any) {
    console.error("Error: " + ROUTE_NAME, error);

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
