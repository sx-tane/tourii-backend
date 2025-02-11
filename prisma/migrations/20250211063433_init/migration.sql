-- CreateTable
CREATE TABLE "users" (
    "user_id" BIGSERIAL NOT NULL,
    "discord_id" BIGINT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "discord_handle" VARCHAR(255) NOT NULL,
    "magatama_points" INTEGER DEFAULT 0,
    "magatama_bag" INTEGER DEFAULT 0,
    "prayer_bead" INTEGER DEFAULT 0,
    "sword" INTEGER DEFAULT 0,
    "orge_mask" INTEGER DEFAULT 0,
    "sprint_shard" INTEGER DEFAULT 0,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "gachapon_shard" INTEGER DEFAULT 0,
    "gachapon_ticket" INTEGER DEFAULT 0,
    "tourii_omamori" INTEGER DEFAULT 0,
    "multiplier_1hr" INTEGER DEFAULT 0,
    "multiplier_3hr" INTEGER DEFAULT 0,

    CONSTRAINT "users_pkc" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
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
    "inviter_id" BIGINT NOT NULL,
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
    "inviter_id" BIGINT NOT NULL,
    "invite_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invites_pkc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_log" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
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
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "points_awarded" INTEGER NOT NULL,
    "rewarded_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rewarded_roles_pkc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "role_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "assigned_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ins_date_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkc" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_discord_id_key" ON "users"("discord_id");

-- CreateIndex
CREATE INDEX "discord_id" ON "users"("discord_id");

-- CreateIndex
CREATE INDEX "username" ON "users"("username");

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
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_reward_log" ADD CONSTRAINT "invite_reward_log_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_log" ADD CONSTRAINT "item_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level_requirement" ADD CONSTRAINT "level_requirement_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewarded_roles" ADD CONSTRAINT "rewarded_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
