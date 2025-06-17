import { LevelType, PassportType } from '@prisma/client';

export interface UserInfoProps {
    userId: string;
    digitalPassportAddress: string;
    logNftAddress: string;
    passportTokenId?: string;
    userDigitalPassportType?: PassportType;
    level?: LevelType;
    discountRate?: number;
    magatamaPoints: number;
    magatamaBags?: number;
    totalQuestCompleted: number;
    totalTravelDistance: number;
    isPremium: boolean;
    prayerBead?: number;
    sword?: number;
    orgeMask?: number;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class UserInfo {
    constructor(private props: UserInfoProps) {}

    get userId(): string {
        return this.props.userId;
    }
    get digitalPassportAddress(): string {
        return this.props.digitalPassportAddress;
    }
    get logNftAddress(): string {
        return this.props.logNftAddress;
    }
    get passportTokenId(): string | undefined {
        return this.props.passportTokenId;
    }
    get userDigitalPassportType(): PassportType | undefined {
        return this.props.userDigitalPassportType;
    }
    get level(): LevelType | undefined {
        return this.props.level;
    }
    get discountRate(): number | undefined {
        return this.props.discountRate;
    }
    get magatamaPoints(): number {
        return this.props.magatamaPoints;
    }
    get magatamaBags(): number | undefined {
        return this.props.magatamaBags;
    }
    get totalQuestCompleted(): number {
        return this.props.totalQuestCompleted;
    }
    get totalTravelDistance(): number {
        return this.props.totalTravelDistance;
    }
    get isPremium(): boolean {
        return this.props.isPremium;
    }
    get prayerBead(): number | undefined {
        return this.props.prayerBead;
    }
    get sword(): number | undefined {
        return this.props.sword;
    }
    get orgeMask(): number | undefined {
        return this.props.orgeMask;
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
