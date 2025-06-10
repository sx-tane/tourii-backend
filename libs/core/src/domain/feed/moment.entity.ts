import type { MomentType } from './moment-type';

interface MomentProps {
    userId: string;
    username?: string;
    imageUrl?: string;
    description?: string;
    rewardText?: string;
    insDateTime: Date;
    momentType: MomentType;
}

export class MomentEntity {
    constructor(private readonly props: MomentProps) {}

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

    get insDateTime(): Date {
        return this.props.insDateTime;
    }

    get momentType(): MomentType {
        return this.props.momentType;
    }
}
