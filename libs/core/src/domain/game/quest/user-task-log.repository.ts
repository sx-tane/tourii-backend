export interface UserTaskLogRepository {
    // REDACTED - Legacy auto-complete methods (preserved for potential future use)
    /***
     * @deprecated - Use submitPhotoTaskForVerification instead
     */
    completePhotoTask(userId: string, taskId: string, proofUrl: string): Promise<void>;
    // REDACTED - Legacy auto-complete methods (preserved for potential future use)
    /***
     * @deprecated - Use submitSocialTaskForVerification instead
     */
    completeSocialTask(userId: string, taskId: string, proofUrl: string): Promise<void>;
    /***
     * Get the quest id and magatama point awarded for a QR scan task
     * @param userId - The user id
     * @param taskId - The task id
     * @param qrCodeValue - The QR code value
     * @returns The quest id and magatama point awarded
     */
    completeQrScanTask(
        userId: string,
        taskId: string,
        qrCodeValue: string,
    ): Promise<{ questId: string; magatama_point_awarded: number }>;

    // Manual verification methods (current implementation)
    /***
     * Submit a photo task for verification
     * @param userId - The user id
     * @param taskId - The task id
     * @param proofUrl - The proof URL
     * @returns The quest id and magatama point awarded
     */
    submitPhotoTaskForVerification(userId: string, taskId: string, proofUrl: string): Promise<void>;
    /***
     * Submit a social task for verification
     * @param userId - The user id
     * @param taskId - The task id
     * @param proofUrl - The proof URL
     * @returns The quest id and magatama point awarded
     */
    submitSocialTaskForVerification(
        userId: string,
        taskId: string,
        proofUrl: string,
    ): Promise<void>;
    /***
     * Submit a text task for verification
     * @param userId - The user id
     * @param taskId - The task id
     * @param textAnswer - The text answer
     * @returns The quest id and magatama point awarded
     */
    submitTextTaskForVerification(
        userId: string,
        taskId: string,
        textAnswer: string,
    ): Promise<void>;
    /***
     * Get pending submissions
     * @param options - The options
     * @returns The pending submissions
     */
    getPendingSubmissions(options: {
        page: number;
        limit: number;
        taskType?: 'PHOTO_UPLOAD' | 'SHARE_SOCIAL' | 'ANSWER_TEXT' | 'LOCAL_INTERACTION';
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
    /***
     * Verify a submission
     * @param userTaskLogId - The user task log id
     * @param action - The action
     * @param adminUserId - The admin user id
     * @param rejectionReason - The rejection reason
     * @returns The quest id and magatama point awarded
     */
    verifySubmission(
        userTaskLogId: string,
        action: 'approve' | 'reject',
        adminUserId: string,
        rejectionReason?: string,
    ): Promise<void>;

    /***
     * Submit a local interaction task for verification
     * @param userId - The user id
     * @param taskId - The task id
     * @param interactionType - The interaction type
     * @param content - The content
     */
    submitLocalInteractionTaskForVerification(
        userId: string,
        taskId: string,
        interactionType: 'text' | 'photo' | 'audio',
        content: string,
    ): Promise<void>;
}
