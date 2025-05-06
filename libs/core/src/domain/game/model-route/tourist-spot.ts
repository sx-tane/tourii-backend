interface TouristSpotProps {
    storyChapterId?: string;
    touristSpotId?: string;
    touristSpotName?: string;
    touristSpotDesc?: string;
    latitude?: number;
    longitude?: number;
    bestVisitTime?: string;
    address?: string;
    storyChapterLink?: string;
    touristSpotHashtag?: string[];
    imageSet?: { main: string; small: string[] };
    delFlag?: boolean;
    insUserId?: string;
    insDateTime?: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class TouristSpot {
    private props: TouristSpotProps;

    constructor(props: TouristSpotProps) {
        this.props = props;
    }

    get storyChapterId(): string | undefined {
        return this.props.storyChapterId;
    }

    get touristSpotId(): string | undefined {
        return this.props.touristSpotId;
    }

    get touristSpotName(): string | undefined {
        return this.props.touristSpotName;
    }

    get touristSpotDesc(): string | undefined {
        return this.props.touristSpotDesc;
    }

    get latitude(): number | undefined {
        return this.props.latitude;
    }

    get longitude(): number | undefined {
        return this.props.longitude;
    }

    get bestVisitTime(): string | undefined {
        return this.props.bestVisitTime;
    }

    get address(): string | undefined {
        return this.props.address;
    }

    get storyChapterLink(): string | undefined {
        return this.props.storyChapterLink;
    }

    get touristSpotHashtag(): string[] | undefined {
        return this.props.touristSpotHashtag;
    }

    get imageSet(): { main: string; small: string[] } | undefined {
        return this.props.imageSet;
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
