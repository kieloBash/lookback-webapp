import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendInventoryNotification } from "@/lib/mail";
import { generateRandomINV } from "@/lib/utils";
import { InvoiceSchema } from "@/schemas/transaction.schema";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Create Invoice";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Successfully Created Invoice!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== UserRole.ADMIN) {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const validatedFields = InvoiceSchema.safeParse(body);

    if (!validatedFields.success) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const { items, date, seller } = validatedFields.data;
    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const transaction = await db.transaction.create({
      data: {
        sku: generateRandomINV(),
        userId: seller,
        transactionType: "SALE", // Adjust based on your schema's enum values
        totalAmount,
        createdAt: new Date(date),
      },
    });

    const transactionItems = items.map((item) => ({
      transactionId: transaction.id,
      itemId: item.itemId,
      quantity: item.quantity,
      price: item.price,
    }));

    const [] = await Promise.all([
      db.transactionItem.createMany({
        data: transactionItems,
      }),
      items.map(async (item) => {
        await db.item.update({
          where: {
            id: item.itemId,
          },
          data: {
            quantity: {
              decrement: item.quantity, // Decrement the item's quantity
            },
          },
        });
      }),
    ]);

    const updatedStocks = await db.item.findMany({
      where: {
        id: {
          in: items.map((item) => item.itemId),
        },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        quantity: true,
        reorderLevel: true,
      },
    });

    const toNotify = updatedStocks.filter(
      (item) => item.quantity <= item.reorderLevel
    );

    if (toNotify.length > 0)
      await sendInventoryNotification(user.email ?? "", toNotify);

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
