
export interface UserTaskLogRepository {
    completePhotoTask(userId: string, taskId: string, proofUrl: string): Promise<void>;
    completeSocialTask(userId: string, taskId: string, proofUrl: string): Promise<void>;
}
