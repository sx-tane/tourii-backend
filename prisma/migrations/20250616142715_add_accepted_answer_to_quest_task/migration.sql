-- AlterTable
ALTER TABLE "quest_task" ADD COLUMN     "accepted_answer" VARCHAR(255);

-- AlterTable
ALTER TABLE "user_task_log" ALTER COLUMN "action" SET DEFAULT 'SELECT_OPTION';
