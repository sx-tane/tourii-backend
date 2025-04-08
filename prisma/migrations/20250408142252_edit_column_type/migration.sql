-- AlterTable
ALTER TABLE "quest_task" ADD COLUMN     "group_activity_members" JSONB[];

-- AlterTable
ALTER TABLE "story" ADD COLUMN     "character_name_list" VARCHAR(255)[];

-- AlterTable
ALTER TABLE "user_quest_log" ADD COLUMN     "group_activity_members" JSONB[];
