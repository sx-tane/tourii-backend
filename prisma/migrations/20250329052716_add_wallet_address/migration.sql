/*
  Warnings:

  - You are about to drop the column `wallet_address` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[passport_wallet_address]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[perks_wallet_address]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_wallet_address_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "wallet_address",
ADD COLUMN     "passport_wallet_address" TEXT,
ADD COLUMN     "perks_wallet_address" TEXT NOT NULL DEFAULT '''''';

-- CreateIndex
CREATE UNIQUE INDEX "user_passport_wallet_address_key" ON "user"("passport_wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_perks_wallet_address_key" ON "user"("perks_wallet_address");
