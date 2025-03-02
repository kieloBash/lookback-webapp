import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";

const failedAttempts = new Map<
  string,
  { attempts: number; lastAttempt: number }
>();
const delayMapping: { [key: number]: number } = {
  5: 30 * 1000, // 30 seconds
  6: 60 * 1000, // 1 minute
  7: 2 * 60 * 1000, // 2 minutes
  8: 5 * 60 * 1000, // 5 minutes
  9: 10 * 60 * 1000, // 10 minutes
  10: 15 * 60 * 1000, // 15 minutes
  11: 30 * 60 * 1000, // 30 minutes
  12: 60 * 60 * 1000, // 1 hour
  13: 2 * 60 * 60 * 1000, // 2 hours
  14: 3 * 60 * 60 * 1000, // 3 hours
  15: 6 * 60 * 60 * 1000, // 6 hours
  16: 12 * 60 * 60 * 1000, // 12 hours
};

function getDelayForAttempt(attempts: number): number {
  if (attempts >= 17) {
    return (attempts - 15) * 12 * 60 * 60 * 1000; // starting from 17, add 12 hours
  }
  return delayMapping[attempts] || 0;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log(email, password);

    if (!email || !password) {
      console.log(`Missing Information`);
      return new NextResponse("Missing Information", { status: 400 });
    }

    const userAttempts = failedAttempts.get(email) || {
      attempts: 0,
      lastAttempt: 0,
    };
    console.log(
      `Attempt ${userAttempts.attempts + 1}: ${email} trying to sign up`
    );
    if (userAttempts.attempts >= 5) {
      const delay = getDelayForAttempt(userAttempts.attempts);
      const timeSinceLastAttempt = Date.now() - userAttempts.lastAttempt;

      if (timeSinceLastAttempt < delay) {
        console.log("attempt");
        return new NextResponse(
          `Please wait ${Math.ceil(
            (delay - timeSinceLastAttempt) / 1000
          )} seconds before trying again.`,
          { status: 429 }
        );
      }
    }
    const fetchedUser = await db.user.findUnique({ where: { email } });

    if (!fetchedUser || !fetchedUser.password) return handleFailedLogin(email);

    const isPasswordValid = await bcrypt.compare(
      password,
      fetchedUser.password
    );

    if (!fetchedUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        fetchedUser.email
      );

      return NextResponse.json(
        {
          token: verificationToken.token,
        },
        { status: 200 }
      );
    }

    if (!isPasswordValid) return handleFailedLogin(email);

    failedAttempts.delete(email);

    console.log(`${email} has logged in!`);
    return NextResponse.json(fetchedUser);
  } catch (error: any) {
    console.log(`[ERROR] handleFailedLogin: ${error.message}`);

    console.log(error.stack);
    const isDebug = process.env.NEXT_PUBLIC_DEBUG !== "production";
    const errorResponse = {
      message: "Internal Error: Logging in",
      ...(isDebug && {
        stack: error instanceof Error ? error.stack : "Unknown stack trace",
      }),
    };
    return new NextResponse(JSON.stringify(errorResponse), { status: 500 });
  }
}

function handleFailedLogin(email: string) {
  try {
    const userAttempts = failedAttempts.get(email) || {
      attempts: 0,
      lastAttempt: 0,
    };
    userAttempts.attempts += 1;
    userAttempts.lastAttempt = Date.now();
    failedAttempts.set(email, userAttempts);

    setTimeout(() => {
      try {
        const currentAttempts = failedAttempts.get(email);
        if (
          currentAttempts &&
          currentAttempts.lastAttempt === userAttempts.lastAttempt
        ) {
          failedAttempts.delete(email);
        }
      } catch (timeoutError) {
        console.log(
          `[ERROR] Timeout in handleFailedLogin: ${
            timeoutError instanceof Error
              ? timeoutError.message
              : "Unknown error"
          }`
        );
      }
    }, 60 * 60 * 1000); // 1 hour

    console.log(`${email} has invalid credentials`);
    return new NextResponse("Invalid credentials", { status: 400 });
  } catch (handleError: any) {
    const isDebug = process.env.NODE_ENV !== "production";
    const errorResponse = {
      message: "Internal Error",
      ...(isDebug && {
        stack:
          handleError instanceof Error
            ? handleError.stack
            : "Unknown stack trace",
      }),
    };
    console.log(`[ERROR] handleFailedLogin: ${handleError.message}`);
    return new NextResponse(JSON.stringify(errorResponse), { status: 500 });
  }
}
