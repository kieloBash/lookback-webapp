import {
  History,
  ManagementProfile,
  User,
  UserProfile,
  UserRole,
} from "@prisma/client";

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

export type FullUserType = User & {
  userProfile: UserProfile;
};
export type FullManagementUserType = User & {
  managementProfile: ManagementProfile;
};
export type FullManagementProfile = ManagementProfile & {
  user: FullManagementUserType;
};
export type FullUserProfile = UserProfile & {
  user: FullUserType;
};

export type FullHistoryType = History & {
  user: FullUserProfile;
  management: FullManagementProfile;
};
