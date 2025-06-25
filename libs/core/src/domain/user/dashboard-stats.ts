/**
 * Dashboard statistics interface for User domain
 * Contains aggregated user activity data for dashboard display
 */
export interface DashboardStats {
    /** Total number of achievements earned by the user */
    achievementCount: number;

    /** Total number of quests completed */
    completedQuestsCount: number;

    /** Total number of stories completed */
    completedStoriesCount: number;

    /** Total number of check-ins/travel logs */
    totalCheckinsCount: number;

    /** Total magatama points earned from completed tasks */
    totalMagatamaPoints: number;

    /** Number of unique quests currently active (with in-progress tasks) */
    activeQuestsCount: number;

    /** Current reading progress information */
    readingProgress?: ReadingProgress;
}

/**
 * Reading progress interface for current story being read
 */
export interface ReadingProgress {
    /** ID of the current story chapter being read */
    currentChapterId?: string;

    /** Title of the current chapter */
    currentChapterTitle?: string;

    /** Reading completion percentage (0-100) */
    completionPercentage?: number;
}