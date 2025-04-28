/*
  Warnings:

  - You are about to drop the column `story_desc` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `story_image` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `story_pdf_url` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `story_title` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `story_video_mobile_url` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `story_video_url` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `cover_image` on the `story_saga` table. All the data in the column will be lost.
  - You are about to drop the column `cover_video` on the `story_saga` table. All the data in the column will be lost.
  - Added the required column `chapter_desc` to the `story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapter_image` to the `story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapter_pdf_url` to the `story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapter_title` to the `story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapter_video_mobile_url` to the `story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapter_video_url` to the `story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "story" DROP COLUMN "story_desc",
DROP COLUMN "story_image",
DROP COLUMN "story_pdf_url",
DROP COLUMN "story_title",
DROP COLUMN "story_video_mobile_url",
DROP COLUMN "story_video_url",
ADD COLUMN     "chapter_desc" TEXT NOT NULL,
ADD COLUMN     "chapter_image" VARCHAR(255) NOT NULL,
ADD COLUMN     "chapter_pdf_url" VARCHAR(255) NOT NULL,
ADD COLUMN     "chapter_title" VARCHAR(255) NOT NULL,
ADD COLUMN     "chapter_video_mobile_url" VARCHAR(255) NOT NULL,
ADD COLUMN     "chapter_video_url" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "story_saga" DROP COLUMN "cover_image",
DROP COLUMN "cover_video",
ADD COLUMN     "background_media" VARCHAR(255),
ADD COLUMN     "is_prologue" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_selected" BOOLEAN NOT NULL DEFAULT false;
