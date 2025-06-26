-- DropForeignKey
ALTER TABLE "model_route" DROP CONSTRAINT "model_route_story_id_fkey";

-- AlterTable
ALTER TABLE "model_route" ALTER COLUMN "story_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tourist_spot" ALTER COLUMN "story_chapter_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "model_route" ADD CONSTRAINT "model_route_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "story"("story_id") ON DELETE SET NULL ON UPDATE CASCADE;
