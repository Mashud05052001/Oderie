/*
  Warnings:

  - You are about to drop the column `getwayData` on the `payments` table. All the data in the column will be lost.
  - Added the required column `gatewayData` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "getwayData",
ADD COLUMN     "gatewayData" TEXT NOT NULL;
