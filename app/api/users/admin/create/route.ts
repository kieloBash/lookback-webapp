import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminUserSchema } from "@/schemas/auth.schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/user";

const ROUTE_NAME = "Create User";
const ROUTE_STATUS = 201;
const SUCCESS_MESSAGE = "Successfully Created User!";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || user.role !== "HEAD_ADMIN") {
      return new NextResponse(ROUTE_NAME + ": No Access", { status: 401 });
    }

    const body = await request.json();
    const validatedFields = AdminUserSchema.safeParse(body);

    if (!validatedFields.success) {
      return new NextResponse(ROUTE_NAME + ": Invalid fields", { status: 400 });
    }

    const {
      password,
      email,
      name,
      role,
      user: UserProfile,
      management: ManagementProfile,
    } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password as any, 10);
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return new NextResponse(ROUTE_NAME + ": Email already exists!", {
        status: 400,
      });
    }

    const formattedName =
      role === "ADMIN"
        ? name
        : role === "MANAGEMENT"
        ? ManagementProfile?.name ?? ""
        : `${UserProfile?.fname} ${UserProfile?.lname}`;

    const newData = await db.user.create({
      data: {
        name: formattedName,
        email,
        password: hashedPassword,
        role,
        isOnboarded: true,
        emailVerified: new Date(),

        ...(role === "USER" &&
          UserProfile && {
            userProfile: {
              create: {
                ...UserProfile,
                birthDate: new Date(UserProfile.birthDate),
                status: UserProfile?.status ?? "NEGATIVE",
              },
            },
          }),

        ...(role === "MANAGEMENT" &&
          ManagementProfile && {
            managementProfile: {
              create: {
                regCode: ManagementProfile.regCode,
                provCode: ManagementProfile.provCode,
                citymunCode: ManagementProfile.citymunCode,
                brgyCode: ManagementProfile.brgyCode,
              },
            },
          }),
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
