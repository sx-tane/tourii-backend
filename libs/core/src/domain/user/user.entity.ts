import { Entity } from "../entity";

interface UserProps {
	discordId: number;
	userName: string;
	discordHandle: string;
	magatamaPoints: number;
	magatamaBag: number;
	prayerBead: number;
	sword: number;
	orgeMask: number;
	sprintShard: number;
	gachaponShard: number;
	gachaponTicket: number;
	touriiOmamori: number;
	multiplier1hr: number;
	multiplier3hr: number;
	insDateTime: Date;
}

export class UserEntity extends Entity<UserProps> {
	constructor(props: UserProps, id: string) {
		super(props, id);
	}

	get userId(): string {
		return this.id;
	}

	get discordId(): number {
		return this.props.discordId;
	}

	get userName(): string {
		return this.props.userName;
	}

	get discordHandle(): string {
		return this.props.discordHandle;
	}

	get magatamaPoints(): number {
		return this.props.magatamaPoints;
	}

	get magatamaBag(): number {
		return this.props.magatamaBag;
	}

	get prayerBead(): number {
		return this.props.prayerBead;
	}

	get sword(): number {
		return this.props.sword;
	}

	get orgeMask(): number {
		return this.props.orgeMask;
	}

	get sprintShard(): number {
		return this.props.sprintShard;
	}

	get gachaponShard(): number {
		return this.props.gachaponShard;
	}

	get gachaponTicket(): number {
		return this.props.gachaponTicket;
	}

	get touriiOmamori(): number {
		return this.props.touriiOmamori;
	}

	get multiplier1hr(): number {
		return this.props.multiplier1hr;
	}

	get multiplier3hr(): number {
		return this.props.multiplier3hr;
	}

	get insDateTime(): Date {
		return this.props.insDateTime;
	}
}
