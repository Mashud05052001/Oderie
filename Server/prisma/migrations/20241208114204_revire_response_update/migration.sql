-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "vendorResponses" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
