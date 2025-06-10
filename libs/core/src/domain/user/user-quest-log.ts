import type { QuestStatus, TaskType } from '@prisma/client';

export interface UserQuestLogProps {
    userQuestLogId: string;
    userId: string;
    questId: string;
    status: QuestStatus;
    action: TaskType;
    userResponse?: string;
    groupActivityMembers: any[];
    submissionData?: any;
    failedReason?: string;
    completedAt?: Date;
    claimedAt?: Date;
    totalMagatamaPointAwarded: number;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class UserQuestLog {
    constructor(private props: UserQuestLogProps) {}

    get userQuestLogId(): string {
        return this.props.userQuestLogId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get questId(): string {
        return this.props.questId;
    }

    get status(): QuestStatus {
        return this.props.status;
    }

    get action(): TaskType {
        return this.props.action;
    }

    get userResponse(): string | undefined {
        return this.props.userResponse;
    }

    get groupActivityMembers(): any[] {
        return this.props.groupActivityMembers;
    }

    get submissionData(): any | undefined {
        return this.props.submissionData;
    }

    get failedReason(): string | undefined {
        return this.props.failedReason;
    }

    get completedAt(): Date | undefined {
        return this.props.completedAt;
    }

    get claimedAt(): Date | undefined {
        return this.props.claimedAt;
    }

    get totalMagatamaPointAwarded(): number {
        return this.props.totalMagatamaPointAwarded;
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
