/*
  Warnings:

  - The values [UNKNOWN] on the enum `PassportType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `evolve_shard` on the `user_info` table. All the data in the column will be lost.
  - You are about to drop the `level_requirement` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LevelType" AS ENUM ('BONJIN', 'E_CLASS_AMATSUKAMI', 'E_CLASS_KUNITSUKAMI', 'E_CLASS_YOKAI', 'D_CLASS_AMATSUKAMI', 'D_CLASS_KUNITSUKAMI', 'D_CLASS_YOKAI', 'C_CLASS_AMATSUKAMI', 'C_CLASS_KUNITSUKAMI', 'C_CLASS_YOKAI', 'B_CLASS_AMATSUKAMI', 'B_CLASS_KUNITSUKAMI', 'B_CLASS_YOKAI', 'A_CLASS_AMATSUKAMI', 'A_CLASS_KUNITSUKAMI', 'A_CLASS_YOKAI', 'S_CLASS_AMATSUKAMI', 'S_CLASS_KUNITSUKAMI', 'S_CLASS_YOKAI');

-- AlterEnum
BEGIN;
CREATE TYPE "PassportType_new" AS ENUM ('BONJIN', 'AMATSUKAMI', 'KUNITSUKAMI', 'YOKAI');
ALTER TABLE "user_info" ALTER COLUMN "user_digital_passport_type" TYPE "PassportType_new" USING ("user_digital_passport_type"::text::"PassportType_new");
ALTER TYPE "PassportType" RENAME TO "PassportType_old";
ALTER TYPE "PassportType_new" RENAME TO "PassportType";
DROP TYPE "PassportType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "level_requirement" DROP CONSTRAINT "level_requirement_role_id_fkey";

-- AlterTable
ALTER TABLE "user_info" DROP COLUMN "evolve_shard",
ALTER COLUMN "user_digital_passport_type" SET DEFAULT 'BONJIN';

-- DropTable
DROP TABLE "level_requirement";

-- CreateTable
CREATE TABLE "level_requirement_master" (
    "level" "LevelType" NOT NULL,
    "discord_role_id" VARCHAR(255),
    "min_get_magatama_points" INTEGER NOT NULL,
    "max_get_magatama_points" INTEGER NOT NULL,
    "total_onchain_item" INTEGER NOT NULL DEFAULT 0,
    "prayer_bead" INTEGER NOT NULL DEFAULT 0,
    "sword" INTEGER NOT NULL DEFAULT 0,
    "orge_mask" INTEGER NOT NULL DEFAULT 0,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "level_requirement_master_pkey" PRIMARY KEY ("level")
);
