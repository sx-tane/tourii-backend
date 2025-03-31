/*
  Warnings:

  - The values [PremiumUser] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `discord_username` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `twitter_username` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `achievement_name` on the `user_achievement` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `description` on the `user_achievement` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `icon_url` on the `user_achievement` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[google_email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PassportType" AS ENUM ('Unknown', 'Amatsukami', 'Kunitsukami', 'Yokai');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('User', 'Moderator', 'Admin');
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_user_id_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "discord_username" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "twitter_username" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "user_achievement" ADD COLUMN     "achievement_type" VARCHAR(255),
ALTER COLUMN "achievement_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "icon_url" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "user_roles";

CREATE OR REPLACE FUNCTION generate_user_info_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_info';
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
    RETURN 'UIF' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "user_info" (
    "user_info_id" VARCHAR(255) NOT NULL DEFAULT generate_user_info_id(),
    "user_id" TEXT NOT NULL,
    "digital_passport_address" TEXT NOT NULL DEFAULT '''''',
    "log_nft_address" TEXT NOT NULL DEFAULT '''''',
    "user_digital_passport_type" "PassportType",
    "level" VARCHAR(255),
    "discount_rate" DOUBLE PRECISION,
    "magatama_points" INTEGER NOT NULL DEFAULT 0,
    "magatama_bags" INTEGER DEFAULT 0,
    "total_quest_completed" INTEGER NOT NULL DEFAULT 0,
    "total_travel_distance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "prayer_bead" INTEGER DEFAULT 0,
    "sword" INTEGER DEFAULT 0,
    "orge_mask" INTEGER DEFAULT 0,
    "evolve_shard" INTEGER DEFAULT 0,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "user_info_pkey" PRIMARY KEY ("user_info_id")
);

-- CreateTable
CREATE TABLE "discord_user_roles" (
    "id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "assigned_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkc" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_info_digital_passport_address_key" ON "user_info"("digital_passport_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_info_log_nft_address_key" ON "user_info"("log_nft_address");

-- CreateIndex
CREATE UNIQUE INDEX "discord_user_roles_user_id_role_id_key" ON "discord_user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_google_email_key" ON "user"("google_email");

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discord_user_roles" ADD CONSTRAINT "discord_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discord_user_roles" ADD CONSTRAINT "discord_user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
