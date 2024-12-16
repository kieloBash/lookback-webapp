import { UserRole } from "@prisma/client";

export type FullAdminType = {
  email: string;
  name: string;
  role: UserRole;
};

export type FullStaffType = {
  email: string;
  name: string;
  role: UserRole;
};
