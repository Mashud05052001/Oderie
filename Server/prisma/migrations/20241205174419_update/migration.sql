/*
  Warnings:

  - You are about to drop the column `resetPasswwordCode` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "resetPasswwordCode",
ADD COLUMN     "resetPasswordCode" TEXT;
