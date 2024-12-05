import { UserRole } from "@prisma/client";

export type TJwtPayload = {
  email: string;
  role: UserRole;
};

export type TExtendedUserData = TJwtPayload & {
  password: string;
};
