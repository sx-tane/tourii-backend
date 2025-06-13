/*
  Warnings:

  - You are about to drop the `user_quest_log` table. If the table is not empty, all the data it contains will be lost.

*/

-- Step 2: Drop the user_quest_log_id generation function

-- Step 3: Create the user_task_log_id generation function
CREATE OR REPLACE FUNCTION generate_user_task_log_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_task_log';
    ts TEXT := to_char(NOW() AT TIME ZONE 'Asia/Tokyo', 'YYYYMMDDHH24MI');
    part1 TEXT := substr(ts, 1, 6);   -- YYYYMM
    part2 TEXT := substr(ts, 7);      -- DDHHMI
    rand1 TEXT := substr(md5(gen_random_uuid()::text), 0, 7);
    rand2 TEXT := substr(md5(gen_random_uuid()::text), 0, 7);
    composite_key TEXT := id_type || '_' || ts;
    next_val INT;
    obfuscated_counter TEXT;
    base32_chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
BEGIN
    -- Atomic counter per timestamp
    INSERT INTO id_sequence (key, ts_prefix, counter)
    VALUES (composite_key, ts, 1)
    ON CONFLICT (key)
    DO UPDATE SET counter = id_sequence.counter + 1
    RETURNING counter INTO next_val;

    -- Obfuscate counter using base32 (4 chars)
    obfuscated_counter := 
        substr(base32_chars, (next_val % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 32)::int % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 1024)::int % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 32768)::int % 32) + 1, 1);

    -- Final ID structure
    RETURN 'UTL' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- Step 4: CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('AVAILABLE', 'ONGOING', 'COMPLETED', 'FAILED');

-- Step 5: DropForeignKey
ALTER TABLE "user_quest_log" DROP CONSTRAINT "user_quest_log_user_id_fkey";

-- Step 6: DropTable
DROP TABLE "user_quest_log";

DROP FUNCTION IF EXISTS generate_user_quest_log_id();


-- Step 7: CreateTable
CREATE TABLE "user_task_log" (
    "user_task_log_id" VARCHAR(255) NOT NULL DEFAULT generate_user_task_log_id(),
    "user_id" TEXT NOT NULL,
    "quest_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'AVAILABLE',
    "action" "TaskType" NOT NULL DEFAULT 'VISIT_LOCATION',
    "user_response" TEXT,
    "group_activity_members" JSONB[],
    "submission_data" JSONB,
    "failed_reason" TEXT,
    "completed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "claimed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "total_magatama_point_awarded" INTEGER NOT NULL DEFAULT 0,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "user_task_log_pkey" PRIMARY KEY ("user_task_log_id")
);

-- Step 8: CreateIndex
CREATE UNIQUE INDEX "user_task_log_user_id_quest_id_task_id_key" ON "user_task_log"("user_id", "quest_id", "task_id");

-- Step 9: AddForeignKey
ALTER TABLE "user_task_log" ADD CONSTRAINT "user_task_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;