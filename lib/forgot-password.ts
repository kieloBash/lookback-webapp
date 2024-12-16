import { db } from "@/lib/db";

export const getForgotPasswordByToken = async (token: string) => {
  try {
    const forgotPasswordToken = await db.passwordResetToken.findUnique({
      where: { token },
    });
    return forgotPasswordToken;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getForgotPasswordByEmail = async (email: string) => {
  try {
    const forgotPasswordToken = await db.passwordResetToken.findFirst({
      where: { email },
    });
    return forgotPasswordToken;
  } catch (e) {
    console.log(e);
    return null;
  }
};
