/*
  Warnings:

  - You are about to drop the `activity_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invite_reward_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rewarded_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StoryStatus" AS ENUM ('UNREAD', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "QuestStatus" AS ENUM ('AVAILABLE', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('ONCHAIN', 'OFFCHAIN');

-- DropForeignKey
ALTER TABLE "activity_log" DROP CONSTRAINT "activity_log_user_id_fkey";

-- DropForeignKey
ALTER TABLE "discord_user_roles" DROP CONSTRAINT "discord_user_roles_role_id_fkey";

-- DropForeignKey
ALTER TABLE "invite_reward_log" DROP CONSTRAINT "invite_reward_log_inviter_id_fkey";

-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_inviter_id_fkey";

-- DropForeignKey
ALTER TABLE "rewarded_roles" DROP CONSTRAINT "rewarded_roles_user_id_fkey";

-- DropIndex
DROP INDEX "discord_id";

-- DropIndex
DROP INDEX "discord_username";

-- DropTable
DROP TABLE "activity_log";

-- DropTable
DROP TABLE "invite_reward_log";

-- DropTable
DROP TABLE "invites";

-- DropTable
DROP TABLE "rewarded_roles";

-- DropTable
DROP TABLE "roles";

CREATE OR REPLACE FUNCTION generate_user_item_claim_log_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_item_claim_log';
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
    RETURN 'UIC' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_discord_activity_log_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'generate_discord_activity_log';
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

-- CreateTable
CREATE TABLE "user_item_claim_log" (
    "user_item_claim_log_id" VARCHAR(255) NOT NULL DEFAULT generate_user_item_claim_log_id(),
    "user_id" TEXT NOT NULL,
    "onchain_item_id" VARCHAR(255),
    "offchain_item_name" VARCHAR(255),
    "item_amount" INTEGER NOT NULL DEFAULT 0,
    "item_details" TEXT,
    "type" "ItemType" NOT NULL DEFAULT 'OFFCHAIN',
    "claimed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "ItemStatus" NOT NULL DEFAULT 'SUCCESS',
    "error_msg" VARCHAR(255),
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_item_claim_log_pkey" PRIMARY KEY ("user_item_claim_log_id")
);

-- CreateTable
CREATE TABLE "discord_activity_log" (
    "discord_activity_log_id" VARCHAR(255) NOT NULL DEFAULT generate_discord_activity_log_id(),
    "user_id" TEXT NOT NULL,
    "activity_type" VARCHAR(255) NOT NULL,
    "magatama_point_awarded" INTEGER NOT NULL,
    "activity_details" TEXT,
    "activity_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discord_activity_log_pkey" PRIMARY KEY ("discord_activity_log_id")
);

-- CreateTable
CREATE TABLE "invite_log" (
    "id" SERIAL NOT NULL,
    "inviter_id" TEXT NOT NULL,
    "invitee_id" BIGINT NOT NULL,
    "points_awarded" INTEGER NOT NULL,
    "rewarded_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_reward_log_pkc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discord_rewarded_roles" (
    "id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "points_awarded" INTEGER NOT NULL,
    "rewarded_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rewarded_roles_pkc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discord_roles" (
    "role_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discord_roles_pkc" PRIMARY KEY ("role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invite_reward_log_unique" ON "invite_log"("invitee_id");

-- CreateIndex
CREATE UNIQUE INDEX "discord_roles_role_id_key" ON "discord_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "discord_roles_name_key" ON "discord_roles"("name");

-- AddForeignKey
ALTER TABLE "user_item_claim_log" ADD CONSTRAINT "user_item_claim_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discord_activity_log" ADD CONSTRAINT "discord_activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_log" ADD CONSTRAINT "invite_log_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discord_rewarded_roles" ADD CONSTRAINT "discord_rewarded_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discord_user_roles" ADD CONSTRAINT "discord_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "discord_roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;
