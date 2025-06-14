/*
  Warnings:

  - You are about to drop the column `total_magatama_point_awarded` on the `quest_task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "quest_task" DROP COLUMN "total_magatama_point_awarded",
ADD COLUMN     "reward_earned" VARCHAR(255);
