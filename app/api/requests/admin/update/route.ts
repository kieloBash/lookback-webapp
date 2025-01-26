import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notification";
import { addMinutes, endOfDay, subDays } from "date-fns";
import { NextResponse } from "next/server";

const ROUTE_NAME = "Covid Status Update";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE =
  "Successfully changed status of request and notifications has been sent to users affected!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "HEAD_ADMIN") {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const { newStatus, id } = body;

    if (!newStatus || !id) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    console.log(newStatus, id);

    const existing = await db.request.findFirst({
      where: { id },
      include: { user: { include: { userProfile: true } } },
    });
    if (!existing) {
      return new NextResponse(ROUTE_NAME + ": Data not found", { status: 404 });
    }

    if (newStatus === "QUALIFIED") {
      const userHistories = await db.history.findMany({
        where: {
          userId: existing.user?.userProfile?.id ?? "",
          date: {
            gte: subDays(existing.dateOfSymptoms, 14),
            lte: endOfDay(new Date(existing.dateOfTesting)),
          },
        },
      });

      console.log(userHistories);

      const affectedUserIds = new Set<string>();

      for (const history of userHistories) {
        const relatedHistories = await db.history.findMany({
          where: {
            managementId: history.managementId,
            date: {
              gte: history.date,
              lte: addMinutes(history.date, 30),
            },
          },
          include: { user: { select: { id: true } } },
        });

        relatedHistories.forEach((relatedHistory) => {
          if (
            relatedHistory.userId &&
            relatedHistory.userId !== existing.userId
          ) {
            affectedUserIds.add(relatedHistory.userId);
          }
        });
      }
      ///
      const contactUsers = [];

      console.log(affectedUserIds);

      for (const userId of affectedUserIds) {
        if (existing.user?.userProfile?.id !== userId) {
          //exclude self
          const user = await db.user.findFirst({
            where: { userProfile: { id: userId } },
            include: { userProfile: { select: { status: true } } },
          });

          if (user) {
            console.log(user);
            contactUsers.push(user);
            await createNotification({
              userId: user.id,
              date: new Date(),
              title: "COVID Exposure Alert",
              message:
                "You may have been exposed to someone who tested positive for COVID-19. Please monitor your health and consider getting tested.",
              type: "COVID",
            });

            if (user.userProfile?.status === "NEGATIVE") {
              console.log(user.userProfile);
              await db.userProfile.update({
                where: { userId: user.id },
                data: { status: "EXPOSED" },
              });
            }
          }
        }
      }
      ///
      await db.userProfile.update({
        where: { userId: existing.userId },
        data: {
          status: "POSITIVE",
          dateTestedPositive: existing.dateOfTesting,
        },
      });

      await createNotification({
        userId: existing.userId,
        date: new Date(),
        title: "Request Accepted!",
        message:
          "Your request has been accepted! please practice caution and quarantine for 14 days",
        type: "DEFAULT",
      });

      //TODO: record the contact list
      // console.log(contactUsers);
      const newContact = await db.contact.create({
        data: { userInfectedId: existing.userId, date: existing.dateOfTesting },
      });

      console.log(newContact);
      await db.contactUser.createMany({
        data: contactUsers.map((u) => ({
          contactId: newContact.id,
          userId: u.id,
        })),
      });

      ///
      // await db.contact.create({
      //   data: {
      //     userInfectedId: existing.userId,
      //     date: existing.dateOfTesting,
      //     usersExposed: {
      //       createMany: {
      //         data: contactUsers.map((u) => ({ userId: u.id })),
      //       },
      //     },
      //   },
      // });
      ///

      await db.request.update({
        where: { id: existing.id },
        data: { status: newStatus },
      });

      return NextResponse.json(
        {
          values: contactUsers.map((d) => ({ id: d.id, email: d.email })),
          // values: [],
          msg: SUCCESS_MESSAGE,
        },
        {
          status: ROUTE_STATUS,
        }
      );
    } else {
      await db.userProfile.update({
        where: { userId: existing.userId },
        data: {
          status: "NEGATIVE",
          dateTestedPositive: null,
        },
      });
      await createNotification({
        userId: existing.userId,
        date: new Date(),
        title: "Request Denied!",
        message: "Your Request has been denied!",
        type: "DEFAULT",
      });
      await db.request.update({
        where: { id: existing.id },
        data: { status: newStatus },
      });
    }

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
