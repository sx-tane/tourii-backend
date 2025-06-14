import { TaskTheme, TaskType } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export interface TaskProps {
    taskId: string;
    taskTheme: TaskTheme;
    taskType: TaskType;
    taskName: string;
    taskDesc: string;
    isUnlocked: boolean;
    requiredAction: string;
    groupActivityMembers?: string[];
    selectOptions?: string[];
    antiCheatRules: JsonValue;
    magatamaPointAwarded: number;
    totalMagatamaPointAwarded: number;
    delFlag: boolean;
    insUserId?: string;
    insDateTime?: Date;
    updUserId?: string;
    updDateTime?: Date;
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

    get groupActivityMembers(): string[] | undefined {
        return this.props.groupActivityMembers;
    }

    get selectOptions(): string[] | undefined {
        return this.props.selectOptions;
    }

    get antiCheatRules(): JsonValue {
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

    get insUserId(): string | undefined {
        return this.props.insUserId;
    }

    get insDateTime(): Date | undefined {
        return this.props.insDateTime;
    }

    get updUserId(): string | undefined {
        return this.props.updUserId;
    }

    get updDateTime(): Date | undefined {
        return this.props.updDateTime;
    }

    get requestId(): string | undefined {
        return this.props.requestId;
    }

    get isCompleted(): boolean | undefined {
        return this.props.isCompleted;
    }
}
