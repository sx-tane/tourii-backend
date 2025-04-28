/*
  Warnings:

  - You are about to drop the column `story_saga_id` on the `model_route` table. All the data in the column will be lost.
  - You are about to drop the column `chapter_desc` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `chapter_image` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `chapter_number` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `chapter_pdf_url` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `chapter_title` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `chapter_video_mobile_url` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `chapter_video_url` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `character_name_list` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `is_unlocked` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `real_world_image` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `story_saga_id` on the `story` table. All the data in the column will be lost.
  - You are about to drop the column `tourist_spot_id` on the `story` table. All the data in the column will be lost.
  - You are about to drop the `story_saga` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `story_id` to the `model_route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saga_desc` to the `story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saga_name` to the `story` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "model_route" DROP CONSTRAINT "model_route_story_saga_id_fkey";

-- DropForeignKey
ALTER TABLE "story" DROP CONSTRAINT "story_story_saga_id_fkey";

-- AlterTable
ALTER TABLE "model_route" DROP COLUMN "story_saga_id",
ADD COLUMN     "story_id" TEXT NOT NULL;

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
    RETURN 'STO' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_story_chapter_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'story_chapter';
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
    RETURN 'SCT' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- AlterTable
ALTER TABLE "story" DROP COLUMN "chapter_desc",
DROP COLUMN "chapter_image",
DROP COLUMN "chapter_number",
DROP COLUMN "chapter_pdf_url",
DROP COLUMN "chapter_title",
DROP COLUMN "chapter_video_mobile_url",
DROP COLUMN "chapter_video_url",
DROP COLUMN "character_name_list",
DROP COLUMN "is_unlocked",
DROP COLUMN "real_world_image",
DROP COLUMN "story_saga_id",
DROP COLUMN "tourist_spot_id",
ADD COLUMN     "background_media" VARCHAR(255),
ADD COLUMN     "is_prologue" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_selected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "map_image" VARCHAR(255),
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "saga_desc" TEXT NOT NULL,
ADD COLUMN     "saga_name" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "story_saga";

-- CreateTable
CREATE TABLE "story_chapter" (
    "story_chapter_id" VARCHAR(255) NOT NULL DEFAULT generate_story_chapter_id(),
    "story_id" TEXT NOT NULL,
    "tourist_spot_id" VARCHAR(255) NOT NULL,
    "chapter_number" VARCHAR(255) NOT NULL,
    "chapter_title" VARCHAR(255) NOT NULL,
    "chapter_desc" TEXT NOT NULL,
    "chapter_image" VARCHAR(255) NOT NULL,
    "character_name_list" VARCHAR(255)[],
    "real_world_image" VARCHAR(255) NOT NULL,
    "chapter_video_url" VARCHAR(255) NOT NULL,
    "chapter_video_mobile_url" VARCHAR(255) NOT NULL,
    "chapter_pdf_url" VARCHAR(255) NOT NULL,
    "is_unlocked" BOOLEAN NOT NULL DEFAULT false,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "story_chapter_pkey" PRIMARY KEY ("story_chapter_id")
);

-- AddForeignKey
ALTER TABLE "story_chapter" ADD CONSTRAINT "story_chapter_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "story"("story_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_route" ADD CONSTRAINT "model_route_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "story"("story_id") ON DELETE RESTRICT ON UPDATE CASCADE;
