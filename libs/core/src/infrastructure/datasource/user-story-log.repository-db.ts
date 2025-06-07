import { UserStoryLogRepository } from '@app/core/domain/game/story/user-story-log.repository';
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
            select: { story_id: true },
        });
        if (!chapter) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }

        const existing = await this.prisma.user_story_log.findFirst({
            where: { user_id: userId, story_id: chapter.story_id },
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
                    story_id: chapter.story_id,
                    status,
                    unlocked_at: now,
                    finished_at: status === StoryStatus.COMPLETED ? now : null,
                    ins_user_id: userId,
                    ins_date_time: now,
                    upd_user_id: userId,
                    upd_date_time: now,
                },
            });
        }
    }
}
