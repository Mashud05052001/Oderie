import { UserRole, UserStatus } from "@prisma/client";

export type TJwtPayload = {
  email: string;
  role: UserRole;
};

export type TExtendedUserData = TJwtPayload & {
  password: string;
  status: UserStatus;
  userId: string;
  vendorId: string | null;
};
