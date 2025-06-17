-- CreateIndex
CREATE INDEX "idx_quest_tourist_spot_type" ON "quest"("tourist_spot_id", "quest_type");

-- CreateIndex
CREATE INDEX "idx_quest_unlocked_premium" ON "quest"("is_unlocked", "is_premium");

-- CreateIndex
CREATE INDEX "idx_user_email" ON "user"("email");

-- CreateIndex
CREATE INDEX "idx_user_discord_id" ON "user"("discord_id");

-- CreateIndex
CREATE INDEX "idx_user_google_email" ON "user"("google_email");

-- CreateIndex
CREATE INDEX "idx_user_story_log_progress" ON "user_story_log"("story_chapter_id", "finished_at");

-- CreateIndex
CREATE INDEX "idx_user_story_log_user_status" ON "user_story_log"("user_id", "status");

-- CreateIndex
CREATE INDEX "idx_user_task_log_completion" ON "user_task_log"("status", "completed_at");

-- CreateIndex
CREATE INDEX "idx_user_task_log_quest_user" ON "user_task_log"("quest_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_user_travel_log_user_date" ON "user_travel_log"("user_id", "ins_date_time");

-- CreateIndex
CREATE INDEX "idx_user_travel_log_location" ON "user_travel_log"("user_longitude", "user_latitude");
