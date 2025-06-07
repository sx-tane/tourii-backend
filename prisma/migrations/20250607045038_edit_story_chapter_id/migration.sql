/*
  Warnings:

  - You are about to drop the column `story_id` on the `user_story_log` table. All the data in the column will be lost.
  - Added the required column `story_chapter_id` to the `user_story_log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_story_log" DROP COLUMN "story_id",
ADD COLUMN     "story_chapter_id" TEXT NOT NULL;
