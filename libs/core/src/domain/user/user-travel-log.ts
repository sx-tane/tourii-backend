import type { CheckInMethod } from '@prisma/client';

export interface UserTravelLogProps {
    userTravelLogId: string;
    userId: string;
    questId: string;
    taskId: string;
    touristSpotId: string;
    userLongitude: number;
    userLatitude: number;
    travelDistanceFromTarget?: number;
    travelDistance: number;
    qrCodeValue?: string;
    checkInMethod?: CheckInMethod;
    detectedFraud?: boolean;
    fraudReason?: string;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class UserTravelLog {
    constructor(private props: UserTravelLogProps) {}

    get userTravelLogId(): string {
        return this.props.userTravelLogId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get questId(): string {
        return this.props.questId;
    }

    get taskId(): string {
        return this.props.taskId;
    }

    get touristSpotId(): string {
        return this.props.touristSpotId;
    }

    get userLongitude(): number {
        return this.props.userLongitude;
    }

    get userLatitude(): number {
        return this.props.userLatitude;
    }

    get travelDistanceFromTarget(): number | undefined {
        return this.props.travelDistanceFromTarget;
    }

    get travelDistance(): number {
        return this.props.travelDistance;
    }

    get qrCodeValue(): string | undefined {
        return this.props.qrCodeValue;
    }

    get checkInMethod(): CheckInMethod | undefined {
        return this.props.checkInMethod;
    }

    get detectedFraud(): boolean | undefined {
        return this.props.detectedFraud;
    }

    get fraudReason(): string | undefined {
        return this.props.fraudReason;
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
