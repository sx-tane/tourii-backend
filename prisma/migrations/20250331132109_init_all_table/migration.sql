/*
  Warnings:

  - You are about to drop the column `description` on the `user_achievement` table. All the data in the column will be lost.
  - The `achievement_type` column on the `user_achievement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `level` column on the `user_info` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `invite_log` table. If the table is not empty, all the data it contains will be lost.

*/

CREATE OR REPLACE FUNCTION generate_discord_activity_log_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'discord_activity_log';
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
    RETURN 'DRR' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_discord_user_roles_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'discord_user_roles';
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
    RETURN 'DUR' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;


-- CreateEnum
CREATE TYPE "QuestType" AS ENUM ('UNKNOWN', 'TRAVEL_TO_EARN', 'EARN_TO_TRAVEL', 'CAMPAIGN', 'COMMUNITY_EVENT');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('UNKNOWN', 'LOCAL_EXPERIENCES', 'CULINARY', 'ADVENTURE_NATURE', 'CULTURAL_COMMUNITY', 'HIDDEN_PERKS', 'SURPRISE_TREATS', 'BONUS_UPGRADES', 'SOCIAL_RECOGNITION', 'RETURNING_VISITOR_BONUS', 'ELITE_EXPERIENCES', 'WELLNESS', 'SHOPPING', 'ENTERTAINMENT', 'TRANSPORT_CONNECTIVITY', 'LOCAL_PARTNERSHIPS');

-- CreateEnum
CREATE TYPE "TaskTheme" AS ENUM ('STORY', 'LOCAL_CULTURE', 'FOOD', 'URBAN_EXPLORE', 'NATURE');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('VISIT_LOCATION', 'PHOTO_UPLOAD', 'ANSWER_TEXT', 'SELECT_OPTION', 'SHARE_SOCIAL', 'CHECK_IN', 'GROUP_ACTIVITY', 'LOCAL_INTERACTION');

-- CreateEnum
CREATE TYPE "CheckInMethod" AS ENUM ('QR_CODE', 'GPS');

-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('UNKNOWN', 'STORY', 'TRAVEL', 'EXPLORE', 'COMMUNITY', 'MILESTONE');

-- AlterEnum
ALTER TYPE "QuestStatus" ADD VALUE 'FAILED';

-- DropForeignKey
ALTER TABLE "invite_log" DROP CONSTRAINT "invite_log_user_id_fkey";

-- AlterTable
ALTER TABLE "onchain_item_catalog" ADD COLUMN     "blockchain_type" "BlockchainType" NOT NULL DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "user_achievement" DROP COLUMN "description",
ADD COLUMN     "achievement_desc" VARCHAR(255),
ALTER COLUMN "achievement_name" SET DEFAULT '''''',
DROP COLUMN "achievement_type",
ADD COLUMN     "achievement_type" "AchievementType" NOT NULL DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "user_info" DROP COLUMN "level",
ADD COLUMN     "level" "LevelType" DEFAULT 'BONJIN';

-- DropTable
DROP TABLE "invite_log";

CREATE OR REPLACE FUNCTION generate_user_story_log_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_story_log';
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
    RETURN 'USL' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;


-- CreateTable
CREATE TABLE "user_story_log" (
    "user_story_log_id" VARCHAR(255) NOT NULL DEFAULT generate_user_story_log_id(),
    "user_id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "status" "StoryStatus" NOT NULL DEFAULT 'UNREAD',
    "unlocked_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "user_story_log_pkey" PRIMARY KEY ("user_story_log_id")
);

CREATE OR REPLACE FUNCTION generate_user_quest_log_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_quest_log';
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
    RETURN 'UQL' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "user_quest_log" (
    "user_quest_log_id" VARCHAR(255) NOT NULL DEFAULT generate_user_quest_log_id(),
    "user_id" TEXT NOT NULL,
    "quest_id" TEXT NOT NULL,
    "status" "QuestStatus" NOT NULL DEFAULT 'AVAILABLE',
    "action" "TaskType" NOT NULL DEFAULT 'VISIT_LOCATION',
    "user_response" TEXT,
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

    CONSTRAINT "user_quest_log_pkey" PRIMARY KEY ("user_quest_log_id")
);

CREATE OR REPLACE FUNCTION generate_user_travel_log_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_travel_log';
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

-- CreateTable
CREATE TABLE "user_travel_log" (
    "user_travel_log_id" VARCHAR(255) NOT NULL DEFAULT generate_user_travel_log_id(),
    "user_id" TEXT NOT NULL,
    "quest_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "tourist_spot_id" TEXT NOT NULL,
    "user_longitude" DOUBLE PRECISION NOT NULL,
    "user_latitude" DOUBLE PRECISION NOT NULL,
    "travel_distance_from_target" DOUBLE PRECISION,
    "travel_distance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "qr_code_value" TEXT,
    "check_in_method" "CheckInMethod",
    "detected_fraud" BOOLEAN,
    "fraud_reason" TEXT,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "user_travel_log_pkey" PRIMARY KEY ("user_travel_log_id")
);

CREATE OR REPLACE FUNCTION generate_invite_log_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_invite_log';
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
    RETURN 'UIL' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "user_invite_log" (
    "invite_log_id" VARCHAR(255) NOT NULL DEFAULT generate_invite_log_id(),
    "user_id" TEXT NOT NULL,
    "invitee_discord_id" TEXT,
    "invitee_user_id" TEXT,
    "magatama_point_awarded" INTEGER NOT NULL DEFAULT 0,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "user_invite_log_pkey" PRIMARY KEY ("invite_log_id")
);

CREATE OR REPLACE FUNCTION generate_story_saga_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'story_saga';
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
    RETURN 'SSG' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;


-- CreateTable
CREATE TABLE "story_saga" (
    "story_saga_id" VARCHAR(255) NOT NULL DEFAULT generate_story_saga_id(),
    "saga_name" VARCHAR(255) NOT NULL,
    "saga_desc" TEXT NOT NULL,
    "cover_image" VARCHAR(255),
    "cover_video" VARCHAR(255),
    "map_image" VARCHAR(255),
    "location" VARCHAR(255),
    "order" INTEGER NOT NULL,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "story_saga_pkey" PRIMARY KEY ("story_saga_id")
);

CREATE OR REPLACE FUNCTION generate_story_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'story';
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
    RETURN 'STY' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "story" (
    "story_id" VARCHAR(255) NOT NULL DEFAULT generate_story_id(),
    "story_saga_id" TEXT NOT NULL,
    "tourist_spot_id" VARCHAR(255) NOT NULL,
    "chapter_number" VARCHAR(255) NOT NULL,
    "story_title" VARCHAR(255) NOT NULL,
    "story_desc" TEXT NOT NULL,
    "story_image" VARCHAR(255) NOT NULL,
    "real_world_image" VARCHAR(255) NOT NULL,
    "story_video_url" VARCHAR(255) NOT NULL,
    "story_video_mobile_url" VARCHAR(255) NOT NULL,
    "story_pdf_url" VARCHAR(255) NOT NULL,
    "is_unlocked" BOOLEAN NOT NULL DEFAULT false,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "story_pkey" PRIMARY KEY ("story_id")
);

CREATE OR REPLACE FUNCTION generate_model_route_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'model_route';
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
    RETURN 'MRT' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "model_route" (
    "model_route_id" VARCHAR(255) NOT NULL DEFAULT generate_model_route_id(),
    "story_saga_id" TEXT NOT NULL,
    "route_name" VARCHAR(255) NOT NULL,
    "recommendation" JSONB[],
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "model_route_pkey" PRIMARY KEY ("model_route_id")
);

CREATE OR REPLACE FUNCTION generate_tourist_spot_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'tourist_spot';
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
    RETURN 'TST' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "tourist_spot" (
    "tourist_spot_id" VARCHAR(255) NOT NULL DEFAULT generate_tourist_spot_id(),
    "model_route_id" TEXT NOT NULL,
    "tourist_spot_name" VARCHAR(255) NOT NULL,
    "tourist_spot_desc" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "best_visit_time" VARCHAR(255),
    "address" VARCHAR(255),
    "story_chapter_link" VARCHAR(255),
    "tourist_spot_hashtag" VARCHAR(255)[],
    "image_set" JSONB,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "tourist_spot_pkey" PRIMARY KEY ("tourist_spot_id")
);

CREATE OR REPLACE FUNCTION generate_quest_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'quest';
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
    RETURN 'QST' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "quest" (
    "quest_id" VARCHAR(255) NOT NULL DEFAULT generate_quest_id(),
    "tourist_spot_id" VARCHAR(255) NOT NULL,
    "quest_name" VARCHAR(255) NOT NULL,
    "quest_desc" TEXT NOT NULL,
    "quest_type" "QuestType" NOT NULL DEFAULT 'UNKNOWN',
    "quest_image" VARCHAR(255),
    "is_unlocked" BOOLEAN NOT NULL DEFAULT false,
    "total_magatama_point_awarded" INTEGER NOT NULL DEFAULT 0,
    "reward_type" "RewardType" NOT NULL DEFAULT 'UNKNOWN',
    "reward_items" JSONB[],
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "quest_pkey" PRIMARY KEY ("quest_id")
);

CREATE OR REPLACE FUNCTION generate_quest_task_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'quest_task';
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
    RETURN 'TSK' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "quest_task" (
    "quest_task_id" VARCHAR(255) NOT NULL DEFAULT generate_quest_task_id(),
    "quest_id" TEXT NOT NULL,
    "task_theme" "TaskTheme" NOT NULL DEFAULT 'STORY',
    "task_type" "TaskType" NOT NULL DEFAULT 'SELECT_OPTION',
    "task_name" VARCHAR(255) NOT NULL,
    "task_desc" TEXT NOT NULL,
    "required_action" VARCHAR(255) NOT NULL,
    "select_options" JSONB[],
    "anti_cheat_rules" JSONB NOT NULL,
    "magatama_point_awarded" INTEGER NOT NULL DEFAULT 0,
    "is_unlocked" BOOLEAN NOT NULL DEFAULT false,
    "total_magatama_point_awarded" INTEGER NOT NULL DEFAULT 0,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "quest_task_pkey" PRIMARY KEY ("quest_task_id")
);

-- AddForeignKey
ALTER TABLE "user_story_log" ADD CONSTRAINT "user_story_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_log" ADD CONSTRAINT "user_quest_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_travel_log" ADD CONSTRAINT "user_travel_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_invite_log" ADD CONSTRAINT "user_invite_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story" ADD CONSTRAINT "story_story_saga_id_fkey" FOREIGN KEY ("story_saga_id") REFERENCES "story_saga"("story_saga_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_route" ADD CONSTRAINT "model_route_story_saga_id_fkey" FOREIGN KEY ("story_saga_id") REFERENCES "story_saga"("story_saga_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tourist_spot" ADD CONSTRAINT "tourist_spot_model_route_id_fkey" FOREIGN KEY ("model_route_id") REFERENCES "model_route"("model_route_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest" ADD CONSTRAINT "quest_tourist_spot_id_fkey" FOREIGN KEY ("tourist_spot_id") REFERENCES "tourist_spot"("tourist_spot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_task" ADD CONSTRAINT "quest_task_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quest"("quest_id") ON DELETE RESTRICT ON UPDATE CASCADE;
