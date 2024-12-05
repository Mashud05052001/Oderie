-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetPasswordExpiredDate" TIMESTAMP(3),
ADD COLUMN     "resetPasswwordCode" TEXT;
