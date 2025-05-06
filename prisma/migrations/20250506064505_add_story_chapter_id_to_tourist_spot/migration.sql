/*
  Warnings:

  - Added the required column `story_chapter_id` to the `tourist_spot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tourist_spot" ADD COLUMN     "story_chapter_id" TEXT NOT NULL;
