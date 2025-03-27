-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PremiumUser', 'User', 'Moderator', 'Admin');

-- CreateTable
CREATE TABLE "id_sequence" (
    "key" TEXT NOT NULL,
    "ts_prefix" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "id_sequence_pkey" PRIMARY KEY ("key")
);

CREATE OR REPLACE FUNCTION generate_user_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user';
    ts TEXT := to_char(NOW() AT TIME ZONE 'Asia/Tokyo', 'YYYYMMDDHH24MI'); -- full timestamp
    part1 TEXT := substr(ts, 1, 6);  -- YYYYMM
    part2 TEXT := substr(ts, 7);     -- DDHHMI
    rand1 TEXT := substr(md5(gen_random_uuid()::text), 0, 7);
    rand2 TEXT := substr(md5(gen_random_uuid()::text), 0, 7);
    composite_key TEXT := id_type || '_' || ts;
    next_val INT;
    obfuscated_counter TEXT;
    base32_chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
BEGIN
    -- Atomic counter per full timestamp
    INSERT INTO id_sequence (key, ts_prefix, counter)
    VALUES (composite_key, ts, 1)
    ON CONFLICT (key)
    DO UPDATE SET counter = id_sequence.counter + 1
    RETURNING counter INTO next_val;

    -- Base32-encode counter (e.g. CZ3N)
    obfuscated_counter := 
        substr(base32_chars, (next_val % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 32)::int % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 1024)::int % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 32768)::int % 32) + 1, 1);

    -- Final ID
    RETURN 'TSU' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;


-- create user achievement id generator function
CREATE OR REPLACE FUNCTION generate_achievement_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_achievement';
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
    RETURN 'UAT' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;


-- CreateTable
CREATE TABLE "user" (
    "user_id" VARCHAR(255) NOT NULL DEFAULT generate_user_id(),
    "discord_id" TEXT,
    "discord_username" TEXT,
    "twitter_id" TEXT,
    "twitter_username" TEXT,
    "google_email" TEXT,
    "wallet_address" TEXT NOT NULL,
    "latest_ip_address" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "magatama_points" BIGINT NOT NULL DEFAULT 0,
    "magatama_bags" INTEGER NOT NULL DEFAULT 0,
    "total_quest_completed" INTEGER NOT NULL DEFAULT 0,
    "total_travel_distance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "role" "UserRole" NOT NULL DEFAULT 'User',
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discord_joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_achievement" (
    "user_achievement_id" VARCHAR(255) NOT NULL DEFAULT generate_achievement_id(),
    "user_id" TEXT NOT NULL,
    "achievement_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "magatama_point_awarded" INTEGER NOT NULL DEFAULT 0,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "user_achievement_pkey" PRIMARY KEY ("user_achievement_id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_type" VARCHAR(255) NOT NULL,
    "points_awarded" INTEGER NOT NULL,
    "activity_details" TEXT,
    "activity_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_log_pkc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invite_reward_log" (
    "id" SERIAL NOT NULL,
    "inviter_id" TEXT NOT NULL,
    "invitee_id" BIGINT NOT NULL,
    "points_awarded" INTEGER NOT NULL,
    "rewarded_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_reward_log_pkc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invites" (
    "id" SERIAL NOT NULL,
    "invitee_id" BIGINT NOT NULL,
    "inviter_id" TEXT NOT NULL,
    "invite_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invites_pkc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_log" (
    "id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "item_type" VARCHAR(255) NOT NULL,
    "item_amount" INTEGER NOT NULL,
    "item_get_details" TEXT,
    "item_get_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_log_pkc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kendama_random_range" (
    "id" SERIAL NOT NULL,
    "landed" DECIMAL NOT NULL,
    "missed" DECIMAL NOT NULL,
    "win_rate" DECIMAL NOT NULL,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kendama_random_range_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level_requirement" (
    "role_id" BIGINT NOT NULL,
    "min_points" INTEGER NOT NULL,
    "max_points" INTEGER NOT NULL,
    "goshuin" INTEGER NOT NULL DEFAULT 0,
    "sprint_shard" INTEGER NOT NULL DEFAULT 0,
    "prayer_bead" INTEGER NOT NULL DEFAULT 0,
    "sword" INTEGER NOT NULL DEFAULT 0,
    "orge_mask" INTEGER NOT NULL DEFAULT 0,
    "magatama_points" INTEGER NOT NULL DEFAULT 0,
    "hunter" INTEGER NOT NULL DEFAULT 0,
    "purifier" INTEGER NOT NULL DEFAULT 0,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "level_requirement_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "rewarded_roles" (
    "id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "points_awarded" INTEGER NOT NULL,
    "rewarded_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rewarded_roles_pkc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL,
    "role_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "assigned_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkc" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_discord_id_key" ON "user"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_twitter_id_key" ON "user"("twitter_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_address_key" ON "user"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "discord_id" ON "user"("discord_id");

-- CreateIndex
CREATE INDEX "discord_username" ON "user"("discord_username");

-- CreateIndex
CREATE INDEX "activity_type" ON "activity_log"("activity_type");

-- CreateIndex
CREATE INDEX "activity_date" ON "activity_log"("activity_date");

-- CreateIndex
CREATE UNIQUE INDEX "invite_reward_log_unique" ON "invite_reward_log"("invitee_id");

-- CreateIndex
CREATE UNIQUE INDEX "invites_unique" ON "invites"("invitee_id");

-- CreateIndex
CREATE INDEX "item_type" ON "item_log"("item_type");

-- CreateIndex
CREATE INDEX "item_get_date" ON "item_log"("item_get_date");

-- CreateIndex
CREATE INDEX "role_id" ON "rewarded_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "rewarded_roles_user_id_role_id_key" ON "rewarded_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_id_key" ON "roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- AddForeignKey
ALTER TABLE "user_achievement" ADD CONSTRAINT "user_achievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_reward_log" ADD CONSTRAINT "invite_reward_log_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_log" ADD CONSTRAINT "item_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level_requirement" ADD CONSTRAINT "level_requirement_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewarded_roles" ADD CONSTRAINT "rewarded_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
