import { TaskTheme, TaskType } from '@prisma/client';

export interface TaskProps {
    taskId: string;
    questId: string;
    taskTheme: TaskTheme;
    taskType: TaskType;
    taskName: string;
    taskDesc: string;
    isUnlocked: boolean;
    requiredAction: string;
    groupActivityMembers?: any[];
    selectOptions?: any[];
    antiCheatRules: any;
    magatamaPointAwarded: number;
    totalMagatamaPointAwarded: number;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
    isCompleted?: boolean;
}

export class Task {
    private props: TaskProps;

    constructor(props: TaskProps) {
        this.props = props;
    }

    get taskId(): string | undefined {
        return this.props.taskId;
    }

    get questId(): string {
        return this.props.questId;
    }

    get taskTheme(): TaskTheme {
        return this.props.taskTheme;
    }

    get taskType(): TaskType {
        return this.props.taskType;
    }

    get taskName(): string {
        return this.props.taskName;
    }

    get taskDesc(): string {
        return this.props.taskDesc;
    }

    get isUnlocked(): boolean {
        return this.props.isUnlocked;
    }

    get requiredAction(): string {
        return this.props.requiredAction;
    }

    get groupActivityMembers(): any[] | undefined {
        return this.props.groupActivityMembers;
    }

    get selectOptions(): any[] | undefined {
        return this.props.selectOptions;
    }

    get antiCheatRules(): any {
        return this.props.antiCheatRules;
    }

    get magatamaPointAwarded(): number {
        return this.props.magatamaPointAwarded;
    }

    get totalMagatamaPointAwarded(): number {
        return this.props.totalMagatamaPointAwarded;
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

    get isCompleted(): boolean | undefined {
        return this.props.isCompleted;
    }
}
