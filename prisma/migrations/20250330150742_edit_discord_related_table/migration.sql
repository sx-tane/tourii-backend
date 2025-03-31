/*
  Warnings:

  - You are about to drop the column `activity_date` on the `discord_activity_log` table. All the data in the column will be lost.
  - The primary key for the `discord_rewarded_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `discord_rewarded_roles` table. All the data in the column will be lost.
  - You are about to drop the column `points_awarded` on the `discord_rewarded_roles` table. All the data in the column will be lost.
  - You are about to drop the column `rewarded_at` on the `discord_rewarded_roles` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `discord_roles` table. All the data in the column will be lost.
  - The primary key for the `discord_user_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assigned_at` on the `discord_user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `discord_user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `invitee_id` on the `invite_log` table. All the data in the column will be lost.
  - You are about to drop the column `inviter_id` on the `invite_log` table. All the data in the column will be lost.
  - You are about to drop the column `points_awarded` on the `invite_log` table. All the data in the column will be lost.
  - You are about to drop the column `rewarded_at` on the `invite_log` table. All the data in the column will be lost.
  - The primary key for the `kendama_random_range` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `kendama_random_range` table. All the data in the column will be lost.
  - You are about to drop the `item_log` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `ins_date_time` on table `discord_activity_log` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `magatama_point_awarded` to the `discord_rewarded_roles` table without a default value. This is not possible if the table is not empty.
  - Made the column `ins_date_time` on table `discord_rewarded_roles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ins_date_time` on table `discord_roles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ins_date_time` on table `discord_user_roles` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_id` to the `invite_log` table without a default value. This is not possible if the table is not empty.
  - Made the column `ins_date_time` on table `invite_log` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ins_date_time` on table `kendama_random_range` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "KendamaSeason" AS ENUM ('NORMAL', 'EVENT');

-- DropForeignKey
ALTER TABLE "invite_log" DROP CONSTRAINT "invite_log_inviter_id_fkey";

-- DropForeignKey
ALTER TABLE "item_log" DROP CONSTRAINT "item_log_user_id_fkey";

-- DropIndex
DROP INDEX "discord_user_roles_user_id_role_id_key";

-- DropIndex
DROP INDEX "invite_reward_log_unique";

-- AlterTable
ALTER TABLE "discord_activity_log" DROP COLUMN "activity_date",
ADD COLUMN     "del_flag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ins_user_id" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "request_id" TEXT,
ADD COLUMN     "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "upd_user_id" TEXT NOT NULL DEFAULT 'user',
ALTER COLUMN "ins_date_time" SET NOT NULL,
ALTER COLUMN "ins_date_time" SET DATA TYPE TIMESTAMP(3);

CREATE OR REPLACE FUNCTION generate_discord_rewarded_roles_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'discord_rewarded_roles';
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
    RETURN 'DAY' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

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
    RETURN 'DAY' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;


-- AlterTable
-- Rename constraint separately
ALTER TABLE "discord_rewarded_roles" RENAME CONSTRAINT "rewarded_roles_pkc" TO "discord_rewarded_roles_pkey";

-- Now drop old PK and modify the table
ALTER TABLE "discord_rewarded_roles"
DROP CONSTRAINT "discord_rewarded_roles_pkey",
DROP COLUMN "id",
DROP COLUMN "points_awarded",
DROP COLUMN "rewarded_at",
ADD COLUMN "del_flag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "discord_rewarded_roles_id" VARCHAR(255) NOT NULL DEFAULT generate_discord_rewarded_roles_id(),
ADD COLUMN "ins_user_id" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN "magatama_point_awarded" INTEGER NOT NULL,
ADD COLUMN "request_id" TEXT,
ADD COLUMN "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "upd_user_id" TEXT NOT NULL DEFAULT 'user',
ALTER COLUMN "ins_date_time" SET NOT NULL,
ALTER COLUMN "ins_date_time" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "discord_rewarded_roles_pkey" PRIMARY KEY ("discord_rewarded_roles_id");


-- Rename constraint separately
ALTER TABLE "discord_roles" RENAME CONSTRAINT "discord_roles_pkc" TO "discord_roles_pkey";

-- Then modify table
ALTER TABLE "discord_roles"
DROP COLUMN "description",
ADD COLUMN "del_flag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "ins_user_id" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN "request_id" TEXT,
ADD COLUMN "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "upd_user_id" TEXT NOT NULL DEFAULT 'user',
ALTER COLUMN "ins_date_time" SET NOT NULL,
ALTER COLUMN "ins_date_time" SET DATA TYPE TIMESTAMP(3);


CREATE OR REPLACE FUNCTION generate_discord_user_roles_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'discord_user_roles_id';
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
    RETURN 'DAY' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- Rename constraint separately
ALTER TABLE "discord_user_roles" RENAME CONSTRAINT "user_roles_pkc" TO "discord_user_roles_pkey";

-- Drop old PK
ALTER TABLE "discord_user_roles" DROP CONSTRAINT "discord_user_roles_pkey";

-- Then apply other changes
ALTER TABLE "discord_user_roles"
DROP COLUMN "assigned_at",
DROP COLUMN "id",
ADD COLUMN "del_flag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "discord_user_roles_id" VARCHAR(255) NOT NULL DEFAULT generate_discord_user_roles_id(),
ADD COLUMN "ins_user_id" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN "request_id" TEXT,
ADD COLUMN "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "upd_user_id" TEXT NOT NULL DEFAULT 'user',
ALTER COLUMN "ins_date_time" SET NOT NULL,
ALTER COLUMN "ins_date_time" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "discord_user_roles_pkey" PRIMARY KEY ("discord_user_roles_id");


-- AlterTable
ALTER TABLE "invite_log" DROP COLUMN "invitee_id",
DROP COLUMN "inviter_id",
DROP COLUMN "points_awarded",
DROP COLUMN "rewarded_at",
ADD COLUMN     "del_flag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ins_user_id" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "invitee_discord_id" TEXT,
ADD COLUMN     "invitee_user_id" TEXT,
ADD COLUMN     "magatama_point_awarded" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "request_id" TEXT,
ADD COLUMN     "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "upd_user_id" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "ins_date_time" SET NOT NULL,
ALTER COLUMN "ins_date_time" SET DATA TYPE TIMESTAMP(3);

-- Rename PK constraint first
ALTER TABLE "kendama_random_range" RENAME CONSTRAINT "kendama_random_range_pkey" TO "temp_kendama_random_range_pkey";

-- Drop old PK
ALTER TABLE "kendama_random_range" DROP CONSTRAINT "temp_kendama_random_range_pkey";

-- Modify table
ALTER TABLE "kendama_random_range"
DROP COLUMN "id",
ADD COLUMN "del_flag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "ins_user_id" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN "request_id" TEXT,
ADD COLUMN "season" "KendamaSeason" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "upd_user_id" TEXT NOT NULL DEFAULT 'user',
ALTER COLUMN "ins_date_time" SET NOT NULL,
ALTER COLUMN "ins_date_time" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "kendama_random_range_pkey" PRIMARY KEY ("season");


-- AlterTable
ALTER TABLE "user_item_claim_log" ADD COLUMN     "request_id" TEXT;

-- DropTable
DROP TABLE "item_log";

-- AddForeignKey
ALTER TABLE "invite_log" ADD CONSTRAINT "invite_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
