/*
  Warnings:

  - The values [Unknown,Amatsukami,Kunitsukami,Yokai] on the enum `PassportType` will be removed. If these variants are still used in the database, this will fail.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[user_id]` on the table `user_info` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "OnchainItemType" AS ENUM ('UNKNOWN', 'LOG_NFT', 'DIGITAL_PASSPORT', 'PERK');

-- CreateEnum
CREATE TYPE "OnchainItemStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "BlockchainType" AS ENUM ('UNKNOWN', 'VARA', 'CAMINO');

-- AlterEnum
BEGIN;
CREATE TYPE "PassportType_new" AS ENUM ('UNKNOWN', 'AMATSUKAMI', 'KUNITSUKAMI', 'YOKAI');
ALTER TABLE "user_info" ALTER COLUMN "user_digital_passport_type" TYPE "PassportType_new" USING ("user_digital_passport_type"::text::"PassportType_new");
ALTER TYPE "PassportType" RENAME TO "PassportType_old";
ALTER TYPE "PassportType_new" RENAME TO "PassportType";
DROP TYPE "PassportType_old";
COMMIT;

-- DropIndex
DROP INDEX "user_info_log_nft_address_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "UserRoleType" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "UserRole";

CREATE OR REPLACE FUNCTION generate_user_onchain_item_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_onchain_item';
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
    RETURN 'UOI' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_onchain_item_catalog_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_onchain_item';
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
    RETURN 'OIC' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "user_onchain_item" (
    "user_onchain_item_id" VARCHAR(255) NOT NULL DEFAULT generate_user_onchain_item_id(),
    "user_id" TEXT DEFAULT 'user',
    "item_type" "OnchainItemType" NOT NULL DEFAULT 'UNKNOWN',
    "item_txn_hash" TEXT NOT NULL,
    "blockchain_type" "BlockchainType" NOT NULL DEFAULT 'UNKNOWN',
    "minted_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "onchain_item_id" TEXT,
    "status" "OnchainItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "user_onchain_item_pkey" PRIMARY KEY ("user_onchain_item_id")
);

-- CreateTable
CREATE TABLE "onchain_item_catalog" (
    "onchain_item_id" VARCHAR(255) NOT NULL DEFAULT generate_onchain_item_catalog_id(),
    "item_type" "OnchainItemType" NOT NULL DEFAULT 'UNKNOWN',
    "nft_name" VARCHAR(255) NOT NULL,
    "nft_description" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "contract_address" VARCHAR(255) NOT NULL,
    "token_id" VARCHAR(255),
    "metadata_url" VARCHAR(255),
    "attributes" JSONB[],
    "release_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "expiry_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "max_supply" INTEGER DEFAULT 0,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "onchain_item_catalog_pkey" PRIMARY KEY ("onchain_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_onchain_item_item_txn_hash_key" ON "user_onchain_item"("item_txn_hash");

-- CreateIndex
CREATE UNIQUE INDEX "user_onchain_item_onchain_item_id_key" ON "user_onchain_item"("onchain_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_info_user_id_key" ON "user_info"("user_id");

-- AddForeignKey
ALTER TABLE "user_onchain_item" ADD CONSTRAINT "user_onchain_item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onchain_item_catalog" ADD CONSTRAINT "onchain_item_catalog_onchain_item_id_fkey" FOREIGN KEY ("onchain_item_id") REFERENCES "user_onchain_item"("onchain_item_id") ON DELETE RESTRICT ON UPDATE CASCADE;
