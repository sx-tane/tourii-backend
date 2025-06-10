import type { StoryStatus } from '@prisma/client';

export interface UserStoryLogProps {
    userStoryLogId: string;
    userId: string;
    storyChapterId: string;
    status: StoryStatus;
    unlockedAt?: Date;
    finishedAt?: Date;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class UserStoryLog {
    constructor(private props: UserStoryLogProps) {}

    get userStoryLogId(): string {
        return this.props.userStoryLogId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get storyChapterId(): string {
        return this.props.storyChapterId;
    }

    get status(): StoryStatus {
        return this.props.status;
    }

    get unlockedAt(): Date | undefined {
        return this.props.unlockedAt;
    }

    get finishedAt(): Date | undefined {
        return this.props.finishedAt;
    }

    get delFlag(): boolean {
        return this.props.delFlag;
    }

    get insUserId(): string {
        return this.props.insUserId;
    }

    get insDateTime(): Date {
        return this.props.insDateTime;
    }

    get updUserId(): string {
        return this.props.updUserId;
    }

    get updDateTime(): Date {
        return this.props.updDateTime;
    }

    get requestId(): string | undefined {
        return this.props.requestId;
    }
}
