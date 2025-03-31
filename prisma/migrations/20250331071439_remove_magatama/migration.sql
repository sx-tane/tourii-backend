/*
  Warnings:

  - You are about to drop the column `magatama_bags` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `magatama_points` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "magatama_bags",
DROP COLUMN "magatama_points";
