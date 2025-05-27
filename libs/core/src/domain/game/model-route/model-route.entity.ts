import { Entity } from '../../entity';
import type { TouristSpot } from './tourist-spot';

interface ModelRouteProps {
    storyId?: string;
    routeName?: string;
    region?: string;
    regionDesc?: string;
    regionLatitude?: number;
    regionLongitude?: number;
    regionBackgroundMedia?: string;
    touristSpotList?: TouristSpot[];
    recommendation?: string[];
    delFlag?: boolean;
    insUserId?: string;
    insDateTime?: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class ModelRouteEntity extends Entity<ModelRouteProps> {
    constructor(props: ModelRouteProps, id: string | undefined) {
        super(props, id);
    }

    get modelRouteId(): string | undefined {
        return this.id;
    }

    get storyId(): string | undefined {
        return this.props.storyId;
    }

    get routeName(): string | undefined {
        return this.props.routeName;
    }

    get recommendation(): string[] | undefined {
        return this.props.recommendation;
    }

    get region(): string | undefined {
        return this.props.region;
    }

    get regionDesc(): string | undefined {
        return this.props.regionDesc;
    }

    get regionLatitude(): number | undefined {
        return this.props.regionLatitude;
    }

    get regionLongitude(): number | undefined {
        return this.props.regionLongitude;
    }

    get regionBackgroundMedia(): string | undefined {
        return this.props.regionBackgroundMedia;
    }

    get touristSpotList(): TouristSpot[] | undefined {
        return this.props.touristSpotList;
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

    /**
     * Extracts valid pairs of storyChapterId and touristSpotId
     * from the touristSpotList for updating purposes.
     * @returns Array of { storyChapterId, touristSpotId } pairs
     */
    getValidChapterSpotPairs(): { storyChapterId: string; touristSpotId: string }[] {
        if (!this.props.touristSpotList) {
            return []; // Return empty if no list
        }

        return this.props.touristSpotList
            .filter((spot) => spot.storyChapterId && spot.touristSpotId) // Ensure IDs are present
            .map((spot) => ({
                storyChapterId: spot.storyChapterId as string,
                touristSpotId: spot.touristSpotId as string,
            }));
    }
}
