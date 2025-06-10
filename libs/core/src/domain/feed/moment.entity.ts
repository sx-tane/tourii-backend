import type { MomentType } from './moment-type';

interface MomentProps {
    id: string;
    userId: string;
    username?: string;
    imageUrl?: string;
    description?: string;
    rewardText?: string;
    insDateTime: Date;
    momentType: MomentType;
    totalItems: number;
}

interface MomentViewData {
    id: string;
    userId: string;
    username?: string | null;
    imageUrl?: string | null;
    description?: string | null;
    rewardText?: string | null;
    insDateTime: Date;
    momentType: string;
    totalItems: number;
}

export class MomentEntity {
    constructor(private readonly props: MomentProps) {}

    get id(): string {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get username(): string | undefined {
        return this.props.username;
    }

    get imageUrl(): string | undefined {
        return this.props.imageUrl;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get rewardText(): string | undefined {
        return this.props.rewardText;
    }

    get totalItems(): number {
        return this.props.totalItems;
    }

    get insDateTime(): Date {
        return this.props.insDateTime;
    }

    get momentType(): MomentType {
        return this.props.momentType;
    }

    /**
     * Factory method to create MomentEntity from view data with type-specific transformations
     */
    static fromViewData(data: MomentViewData): MomentEntity {
        const momentType = data.momentType as MomentType;

        // Convert null values to undefined
        const baseProps = {
            id: data.id,
            userId: data.userId,
            username: data.username || undefined,
            imageUrl: data.imageUrl || undefined,
            description: data.description || undefined,
            rewardText: data.rewardText || undefined,
            insDateTime: data.insDateTime,
            momentType,
            totalItems: data.totalItems,
        };

        // Apply type-specific transformations
        switch (momentType) {
            case 'TRAVEL':
                return new MomentEntity({
                    ...baseProps,
                    description: baseProps.description || 'Visited a location',
                });

            case 'QUEST':
                return new MomentEntity({
                    ...baseProps,
                    description: baseProps.description || 'Completed a quest',
                });

            case 'STORY':
                return new MomentEntity({
                    ...baseProps,
                    description: baseProps.description || 'Story completed',
                    rewardText: baseProps.rewardText || 'Story completed',
                });

            case 'ITEM':
                return new MomentEntity({
                    ...baseProps,
                    description: baseProps.description || 'Claimed item',
                    rewardText: baseProps.rewardText || 'Claimed item',
                });

            case 'INVITE':
                return new MomentEntity({
                    ...baseProps,
                    imageUrl: undefined, // Invite events never have images
                    description: 'Invited a friend',
                    rewardText: baseProps.rewardText || 'Earned points for inviting',
                });

            default:
                // Fallback for any new types
                return new MomentEntity(baseProps);
        }
    }
}
