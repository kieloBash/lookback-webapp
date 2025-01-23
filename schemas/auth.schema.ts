import { UserRole } from "@prisma/client";
import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
  role: z.enum([UserRole.MANAGEMENT, UserRole.USER, UserRole.ADMIN]),
  email: z.string().email({
    message: "Must be a valid email!",
  }),
});

export const RegisterSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    role: z.enum([UserRole.MANAGEMENT, UserRole.USER]),
    confirmPassword: z.string(),
    email: z.string().email({
      message: "Must be a valid email!",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const SettingsUserSchema = z
  .object({
    image: z.optional(z.string()),
    fname: z.optional(z.string().min(2)),
    lname: z.optional(z.string().min(2)),
    gender: z.optional(z.string()),
    birthDate: z.string(),

    regCode: z.optional(z.string()),
    provCode: z.optional(z.string()),
    citymunCode: z.optional(z.string()),
    brgyCode: z.optional(z.string()),

    email: z.optional(z.string().email()),
    oldPassword: z.optional(z.string().min(4)),
    newPassword: z.optional(
      z
        .string()
        .min(8, {
          message: "Password must be at least 8 characters long.",
        })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[0-9]/, {
          message: "Password must contain at least one number.",
        })
        .regex(/[^a-zA-Z0-9]/, {
          message: "Password must contain at least one special character.",
        })
    ),
  })
  .refine(
    (data) => {
      if (data.oldPassword && !data.newPassword) return false;
      return true;
    },
    { message: "New Password is required!", path: ["newPassword"] }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.oldPassword) return false;

      return true;
    },
    { message: "Old Password is required!", path: ["password"] }
  );

  export const SettingsManagementSchema = z
  .object({
    name: z.optional(z.string().min(2)),

    regCode: z.optional(z.string()),
    provCode: z.optional(z.string()),
    citymunCode: z.optional(z.string()),
    brgyCode: z.optional(z.string()),

    email: z.optional(z.string().email()),
    oldPassword: z.optional(z.string().min(4)),
    newPassword: z.optional(
      z
        .string()
        .min(8, {
          message: "Password must be at least 8 characters long.",
        })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[0-9]/, {
          message: "Password must contain at least one number.",
        })
        .regex(/[^a-zA-Z0-9]/, {
          message: "Password must contain at least one special character.",
        })
    ),
  })
  .refine(
    (data) => {
      if (data.oldPassword && !data.newPassword) return false;
      return true;
    },
    { message: "New Password is required!", path: ["newPassword"] }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.oldPassword) return false;

      return true;
    },
    { message: "Old Password is required!", path: ["password"] }
  );

export const LoginSchema = z.object({
  password: z.string().min(2, {
    message: "password must be at least 4 characters.",
  }),
  email: z.string().email({
    message: "Must be a valid email!",
  }),
});

export const NotificationsSchema = z.object({
  scholarshipDeadlines: z.boolean(),
  email: z.string().email({
    message: "Must be a valid email!",
  }),
});

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Must be a valid email!",
  }),
});

export const UserProfileSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  gender: z.enum(["Male", "Female", "Other"], { message: "Invalid gender" }),
  birthDate: z.string(),

  regCode: z.string().min(1, "Region code is required"),
  provCode: z.string().min(1, "Province code is required"),
  citymunCode: z.string().min(1, "City/Municipality code is required"),
  brgyCode: z.string().min(1, "Barangay code is required"),
  status: z.optional(
    z.enum(["NEGATIVE", "POSITIVE"], { message: "Invalid status" })
  ),
});

export const ManagementProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  regCode: z.string().min(1, "Region code is required"),
  provCode: z.string().min(1, "Province code is required"),
  citymunCode: z.string().min(1, "City/Municipality code is required"),
  brgyCode: z.string().min(1, "Barangay code is required"),
});

export const OnboardingSchema = z
  .object({
    management: ManagementProfileSchema.optional(),
    user: UserProfileSchema.optional(),
    role: z.enum([UserRole.MANAGEMENT, UserRole.USER]).default("USER"),
  })
  .refine(
    (data) => {
      if (data.role === UserRole.USER) {
        return data.user !== undefined && data.management === undefined;
      } else if (data.role === UserRole.MANAGEMENT) {
        return data.management !== undefined && data.user === undefined;
      }
      return true;
    },
    {
      message:
        "Role and profile mismatch: If role is USER, user profile must be defined and management profile must be undefined, and vice versa.",
      path: ["role"],
    }
  );

export const AdminUserSchema = z
  .object({
    name: z.string(),
    password: z.optional(
      z
        .string()
        .min(8, {
          message: "Password must be at least 8 characters long.",
        })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[0-9]/, {
          message: "Password must contain at least one number.",
        })
        .regex(/[^a-zA-Z0-9]/, {
          message: "Password must contain at least one special character.",
        })
    ),
    role: z
      .enum([UserRole.MANAGEMENT, UserRole.USER, UserRole.ADMIN])
      .default("USER"),
    email: z.string().email({
      message: "Must be a valid email!",
    }),
    management: ManagementProfileSchema.optional(),
    user: UserProfileSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.role === UserRole.USER) {
        return data.user !== undefined && data.management === undefined;
      } else if (data.role === UserRole.MANAGEMENT) {
        return data.management !== undefined && data.user === undefined;
      }
      return true;
    },
    {
      message:
        "Role and profile mismatch: If role is USER, user profile must be defined and management profile must be undefined, and vice versa.",
      path: ["role"],
    }
  );
