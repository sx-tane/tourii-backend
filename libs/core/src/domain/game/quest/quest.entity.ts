import { QuestType, RewardType } from '@prisma/client';
import { Entity } from '../../entity';
import { TouristSpot } from '../model-route/tourist-spot';
import { TaskEntity } from '../task/task.entity';

export interface QuestProps {
    questName?: string;
    questDesc?: string;
    questType?: QuestType;
    questImage?: string;
    isUnlocked?: boolean;
    isPremium?: boolean;
    totalMagatamaPointAwarded?: number;
    rewardType?: RewardType;
    delFlag?: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
    tasks?: TaskEntity[];
    touristSpot?: TouristSpot;
}

export class QuestEntity extends Entity<QuestProps> {
    // biome-ignore lint/complexity/noUselessConstructor: <explanation>
    constructor(props: QuestProps, id: string | undefined) {
        super(props, id);
    }

    get questId(): string | undefined {
        return this.id;
    }

    get questName(): string | undefined {
        return this.props.questName;
    }

    get questDesc(): string | undefined {
        return this.props.questDesc;
    }

    get questType(): QuestType | undefined {
        return this.props.questType;
    }

    get questImage(): string | undefined {
        return this.props.questImage;
    }

    get isUnlocked(): boolean | undefined {
        return this.props.isUnlocked;
    }

    get isPremium(): boolean | undefined {
        return this.props.isPremium;
    }

    get totalMagatamaPointAwarded(): number | undefined {
        return this.props.totalMagatamaPointAwarded;
    }

    get rewardType(): RewardType | undefined {
        return this.props.rewardType;
    }

    get delFlag(): boolean | undefined {
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

    get tasks(): TaskEntity[] | undefined {
        return this.props.tasks;
    }

    get touristSpot(): TouristSpot | undefined {
        return this.props.touristSpot;
    }
}

export class QuestEntityWithPagination {
    quests: QuestEntity[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalQuests: number;
    };

    constructor(quests: QuestEntity[], totalQuests: number, currentPage: number, limit: number) {
        this.quests = quests;
        this.pagination = {
            currentPage: currentPage,
            totalPages: Math.ceil(totalQuests / limit),
            totalQuests: totalQuests,
        };
    }

    static default(): QuestEntityWithPagination {
        return new QuestEntityWithPagination([], 0, 0, 0);
    }
}
