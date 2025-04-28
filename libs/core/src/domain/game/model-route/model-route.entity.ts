import { Entity } from "../../entity";

interface ModelRouteProps {
	routeName: string;
	storyId: string;
	touristSpots: string[];
	recommendation: string[];
	delFlag: boolean;
	insUserId: string;
	insDateTime: Date;
	updUserId: string;
	updDateTime: Date;
	requestId?: string;
}

export class ModelRouteEntity extends Entity<ModelRouteProps> {
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor(props: ModelRouteProps, id: string | undefined) {
		super(props, id);
	}

	get routeId(): string | undefined {
		return this.id;
	}

	get routeName(): string | undefined {
		return this.props.routeName;
	}

	get storyId(): string | undefined {
		return this.props.storyId;
	}

	get touristSpots(): string[] | undefined {
		return this.props.touristSpots;
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
}
