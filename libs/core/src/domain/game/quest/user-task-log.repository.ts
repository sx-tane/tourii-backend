export interface UserTaskLogRepository {
    completePhotoTask(userId: string, taskId: string, proofUrl: string): Promise<void>;
    completeSocialTask(userId: string, taskId: string, proofUrl: string): Promise<void>;
    completeQrScanTask(userId: string, taskId: string, qrCodeValue: string): Promise<{ questId: string; magatama_point_awarded: number }>;
}
