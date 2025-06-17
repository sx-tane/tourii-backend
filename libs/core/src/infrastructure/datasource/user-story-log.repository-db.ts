import { UserStoryLogRepository, StoryCompletionResult } from '@app/core/domain/game/story/user-story-log.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { ContextStorage } from '@app/core/support/context/context-storage';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable } from '@nestjs/common';
import { StoryStatus } from '@prisma/client';

@Injectable()
export class UserStoryLogRepositoryDb implements UserStoryLogRepository {
    constructor(private readonly prisma: PrismaService) {}

    async trackProgress(userId: string, chapterId: string, status: StoryStatus): Promise<void> {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

        const chapter = await this.prisma.story_chapter.findUnique({
            where: { story_chapter_id: chapterId },
            select: { story_id: true, story_chapter_id: true },
        });
        if (!chapter) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }

        const existing = await this.prisma.user_story_log.findFirst({
            where: { user_id: userId, story_chapter_id: chapter.story_chapter_id },
        });

        if (existing) {
            await this.prisma.user_story_log.update({
                where: { user_story_log_id: existing.user_story_log_id },
                data: {
                    status,
                    ...(status === StoryStatus.IN_PROGRESS && !existing.unlocked_at
                        ? { unlocked_at: now }
                        : {}),
                    ...(status === StoryStatus.COMPLETED ? { finished_at: now } : {}),
                    upd_date_time: now,
                },
            });
        } else {
            await this.prisma.user_story_log.create({
                data: {
                    user_id: userId,
                    story_chapter_id: chapter.story_chapter_id,
                    status,
                    unlocked_at: now,
                    finished_at: status === StoryStatus.COMPLETED ? now : null,
                    request_id: ContextStorage.getStore()?.getRequestId()?.value,
                    ins_user_id: userId,
                    ins_date_time: now,
                    upd_user_id: userId,
                    upd_date_time: now,
                },
            });
        }
    }

    async completeStoryWithQuestUnlocking(userId: string, chapterId: string): Promise<StoryCompletionResult> {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

        return await this.prisma.$transaction(async (prisma) => {
            // First, verify the chapter exists and get its details
            const chapter = await prisma.story_chapter.findUnique({
                where: { story_chapter_id: chapterId },
                select: {
                    story_chapter_id: true,
                    story_id: true,
                    chapter_title: true,
                    tourist_spot_id: true,
                },
            });

            if (!chapter) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
            }

            // Check if already completed
            const existing = await prisma.user_story_log.findFirst({
                where: { user_id: userId, story_chapter_id: chapterId },
            });

            if (existing?.status === StoryStatus.COMPLETED) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_029);
            }

            // Update or create story progress
            if (existing) {
                await prisma.user_story_log.update({
                    where: { user_story_log_id: existing.user_story_log_id },
                    data: {
                        status: StoryStatus.COMPLETED,
                        finished_at: now,
                        upd_date_time: now,
                        upd_user_id: userId,
                    },
                });
            } else {
                await prisma.user_story_log.create({
                    data: {
                        user_id: userId,
                        story_chapter_id: chapterId,
                        status: StoryStatus.COMPLETED,
                        unlocked_at: now,
                        finished_at: now,
                        request_id: ContextStorage.getStore()?.getRequestId()?.value,
                        ins_user_id: userId,
                        ins_date_time: now,
                        upd_user_id: userId,
                        upd_date_time: now,
                    },
                });
            }

            // Award magatama points for story completion
            const STORY_COMPLETION_REWARD = 10;
            await prisma.user_info.update({
                where: { user_id: userId },
                data: {
                    magatama_points: {
                        increment: STORY_COMPLETION_REWARD,
                    },
                    upd_date_time: now,
                    upd_user_id: userId,
                },
            });

            // Find and unlock related quests
            const unlockedQuests: StoryCompletionResult['unlockedQuests'] = [];
            
            if (chapter.tourist_spot_id) {
                // Get tourist spot details
                const touristSpot = await prisma.tourist_spot.findUnique({
                    where: { tourist_spot_id: chapter.tourist_spot_id },
                    select: { tourist_spot_name: true },
                });

                // Find quests to unlock at this tourist spot (non-premium only)
                const questsToUnlock = await prisma.quest.findMany({
                    where: {
                        tourist_spot_id: chapter.tourist_spot_id,
                        del_flag: false,
                        is_unlocked: false,
                        is_premium: false,
                    },
                    select: {
                        quest_id: true,
                        quest_name: true,
                        quest_desc: true,
                        quest_image: true,
                        total_magatama_point_awarded: true,
                        is_premium: true,
                    },
                });

                // Unlock the quests
                if (questsToUnlock.length > 0) {
                    const questIds = questsToUnlock.map(q => q.quest_id);
                    await prisma.quest.updateMany({
                        where: {
                            quest_id: { in: questIds },
                        },
                        data: {
                            is_unlocked: true,
                            upd_date_time: now,
                            upd_user_id: userId,
                        },
                    });

                    // Build the unlocked quests response
                    unlockedQuests.push(...questsToUnlock.map(quest => ({
                        questId: quest.quest_id,
                        questName: quest.quest_name,
                        questDesc: quest.quest_desc,
                        questImage: quest.quest_image,
                        touristSpotName: touristSpot?.tourist_spot_name || 'Unknown Location',
                        totalMagatamaPointAwarded: quest.total_magatama_point_awarded,
                        isPremium: quest.is_premium,
                    })));
                }
            }

            // Check for achievements (simple implementation)
            const achievementsUnlocked: string[] = [];
            const userStoryCount = await prisma.user_story_log.count({
                where: {
                    user_id: userId,
                    status: StoryStatus.COMPLETED,
                },
            });

            // Award achievements based on story completion milestones
            let additionalRewards = 0;
            if (userStoryCount === 1) {
                achievementsUnlocked.push('First Story Completed');
                additionalRewards += 25;
            } else if (userStoryCount === 5) {
                achievementsUnlocked.push('Story Explorer');
                additionalRewards += 50;
            } else if (userStoryCount === 10) {
                achievementsUnlocked.push('Story Master');
                additionalRewards += 100;
            }

            // Award additional achievement rewards
            if (additionalRewards > 0) {
                await prisma.user_info.update({
                    where: { user_id: userId },
                    data: {
                        magatama_points: {
                            increment: additionalRewards,
                        },
                        upd_date_time: now,
                        upd_user_id: userId,
                    },
                });
            }

            return {
                chapter: {
                    storyChapterId: chapter.story_chapter_id,
                    chapterTitle: chapter.chapter_title,
                    status: StoryStatus.COMPLETED,
                    completedAt: now,
                },
                unlockedQuests,
                rewards: {
                    magatamaPointsEarned: STORY_COMPLETION_REWARD + additionalRewards,
                    achievementsUnlocked,
                },
            };
        });
    }

    async startStoryReading(userId: string, chapterId: string): Promise<void> {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();

        const chapter = await this.prisma.story_chapter.findUnique({
            where: { story_chapter_id: chapterId },
            select: { story_id: true, story_chapter_id: true },
        });
        if (!chapter) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }

        const existing = await this.prisma.user_story_log.findFirst({
            where: { user_id: userId, story_chapter_id: chapterId },
        });

        if (existing) {
            // Only update if not already started or completed
            if (existing.status === StoryStatus.UNREAD) {
                await this.prisma.user_story_log.update({
                    where: { user_story_log_id: existing.user_story_log_id },
                    data: {
                        status: StoryStatus.IN_PROGRESS,
                        unlocked_at: now,
                        upd_date_time: now,
                        upd_user_id: userId,
                    },
                });
            }
        } else {
            await this.prisma.user_story_log.create({
                data: {
                    user_id: userId,
                    story_chapter_id: chapterId,
                    status: StoryStatus.IN_PROGRESS,
                    unlocked_at: now,
                    finished_at: null,
                    request_id: ContextStorage.getStore()?.getRequestId()?.value,
                    ins_user_id: userId,
                    ins_date_time: now,
                    upd_user_id: userId,
                    upd_date_time: now,
                },
            });
        }
    }

    async getStoryProgress(userId: string, chapterId: string): Promise<{
        status: StoryStatus;
        unlockedAt: Date | null;
        finishedAt: Date | null;
    } | null> {
        const log = await this.prisma.user_story_log.findFirst({
            where: { user_id: userId, story_chapter_id: chapterId },
            select: {
                status: true,
                unlocked_at: true,
                finished_at: true,
            },
        });

        if (!log) return null;

        return {
            status: log.status,
            unlockedAt: log.unlocked_at,
            finishedAt: log.finished_at,
        };
    }
}
