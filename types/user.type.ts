import {
  History,
  ManagementProfile,
  Request,
  User,
  UserProfile,
  UserRole,
  Notification,
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
  requests: Request[];
};
export type FullManagementUserType = User & {
  managementProfile: ManagementProfile;
};

export type FullAllUserType = User & {
  userProfile: UserProfile;
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

export type FullRequestType = Request & {
  user: FullUserType;
};

export type FullNotificationType = Notification & {};
