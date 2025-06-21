export interface UserTaskLogRepository {
    // REDACTED - Legacy auto-complete methods (preserved for potential future use)
    completePhotoTask(userId: string, taskId: string, proofUrl: string): Promise<void>;
    // REDACTED - Legacy auto-complete methods (preserved for potential future use)
    completeSocialTask(userId: string, taskId: string, proofUrl: string): Promise<void>;
    completeQrScanTask(
        userId: string,
        taskId: string,
        qrCodeValue: string,
    ): Promise<{ questId: string; magatama_point_awarded: number }>;

    // Manual verification methods (current implementation)
    submitPhotoTaskForVerification(userId: string, taskId: string, proofUrl: string): Promise<void>;
    submitSocialTaskForVerification(
        userId: string,
        taskId: string,
        proofUrl: string,
    ): Promise<void>;
    submitTextTaskForVerification(
        userId: string,
        taskId: string,
        textAnswer: string,
    ): Promise<void>;
    submitLocalInteractionTaskForVerification(
        userId: string,
        taskId: string,
        interactionType: 'text' | 'photo' | 'audio',
        content: string,
    ): Promise<void>;
    getPendingSubmissions(options: {
        page: number;
        limit: number;
        taskType?: 'PHOTO_UPLOAD' | 'SHARE_SOCIAL' | 'ANSWER_TEXT';
    }): Promise<{
        submissions: Array<{
            userTaskLogId: string;
            userId: string;
            username: string;
            taskId: string;
            questId: string;
            questName: string;
            action: string;
            submissionData: any;
            userResponse: string | null;
            completedAt: Date | null;
        }>;
        totalCount: number;
    }>;
    verifySubmission(
        userTaskLogId: string,
        action: 'approve' | 'reject',
        adminUserId: string,
        rejectionReason?: string,
    ): Promise<void>;
}
