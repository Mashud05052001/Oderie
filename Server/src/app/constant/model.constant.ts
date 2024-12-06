import { Prisma } from "@prisma/client";

export const allProductIncludes: (keyof Prisma.ProductInclude)[] = [
  "Category",
  "Coupon",
  "Order",
  "Review",
  "Vendor",
];

export const paginateProps = ["page", "limit", "sortBy", "sortOrder"];
