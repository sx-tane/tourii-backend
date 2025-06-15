export interface TaskRepository {
    submitAnswerTextTask(
        taskId: string,
        answer: string,
        userId: string,
    ): Promise<SubmitTaskResponse>;

    submitSelectOptionsTask(
        taskId: string,
        selectedOptionIds: number[],
        userId: string,
    ): Promise<SubmitTaskResponse>;

    submitCheckInTask(
        taskId: string,
        longitude: number,
        latitude: number,
        userId: string,
    ): Promise<SubmitTaskResponse>;
}

export class SubmitTaskResponse {
    success: boolean;
    message: string;
}
