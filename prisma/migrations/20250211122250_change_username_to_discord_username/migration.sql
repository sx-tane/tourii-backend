/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - Added the required column `discord_username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "username";

-- AlterTable
ALTER TABLE "users" RENAME COLUMN "username" TO "discord_username";

-- CreateIndex
CREATE INDEX "discord_username" ON "users"("discord_username");
