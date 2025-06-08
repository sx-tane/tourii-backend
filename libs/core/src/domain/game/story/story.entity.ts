import { Entity } from '../../entity';
import type { StoryChapter } from './chapter-story';

interface StoryProps {
    sagaName?: string;
    sagaDesc?: string;
    backgroundMedia?: string;
    mapImage?: string;
    location?: string;
    order?: number;
    isPrologue?: boolean;
    isSelected?: boolean;
    chapterList?: StoryChapter[];
    delFlag?: boolean;
    insUserId?: string;
    insDateTime?: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class StoryEntity extends Entity<StoryProps> {
    constructor(props: StoryProps, id: string | undefined) {
        super(props, id);
    }

    get storyId(): string | undefined {
        return this.id;
    }

    get sagaName(): string | undefined {
        return this.props.sagaName;
    }

    get sagaDesc(): string | undefined {
        return this.props.sagaDesc;
    }

    get backgroundMedia(): string | undefined {
        return this.props.backgroundMedia;
    }

    get mapImage(): string | undefined {
        return this.props.mapImage;
    }

    get location(): string | undefined {
        return this.props.location;
    }

    get order(): number | undefined {
        return this.props.order;
    }

    get isPrologue(): boolean | undefined {
        return this.props.isPrologue;
    }

    get isSelected(): boolean | undefined {
        return this.props.isSelected;
    }

    get chapterList(): StoryChapter[] | undefined {
        return this.props.chapterList;
    }

    get delFlag(): boolean | undefined {
        return this.props.delFlag;
    }

    get insUserId(): string | undefined {
        return this.props.insUserId;
    }

    get insDateTime(): Date | undefined {
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
