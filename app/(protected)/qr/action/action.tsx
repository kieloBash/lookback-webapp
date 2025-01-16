"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/user";

export const newLogHistory = async (token: string) => {
  console.log(token)

  const user = currentUser();

  if (!user) {
    return { error: "Email does not exist!" };
  }

  const existingToken = await db.verificationToken.findFirst({
    where: { token },
  });

  // if (!existingUser) {
  //   return { error: "Email does not exist!" };
  // }


  return { success: "Successfully Logged history!" };
};
