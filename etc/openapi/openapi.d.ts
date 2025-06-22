declare namespace Components {
  namespace Schemas {
    export interface AdminUserListResponseDto {
      /**
       * List of users
       */
      users: {
        /**
         * User ID
         */
        userId: string;
        /**
         * Username
         */
        username: string;
        /**
         * Discord ID
         */
        discordId?: string;
        /**
         * Discord username
         */
        discordUsername?: string;
        /**
         * Twitter ID
         */
        twitterId?: string;
        /**
         * Twitter username
         */
        twitterUsername?: string;
        /**
         * Google email
         */
        googleEmail?: string;
        /**
         * Email
         */
        email?: string;
        /**
         * Passport wallet address
         */
        passportWalletAddress?: string;
        /**
         * Perks wallet address
         */
        perksWalletAddress?: string;
        /**
         * Latest IP address
         */
        latestIpAddress?: string;
        /**
         * Premium status
         */
        isPremium: boolean;
        /**
         * Total quests completed
         */
        totalQuestCompleted: number;
        /**
         * Total travel distance
         */
        totalTravelDistance: number;
        /**
         * User role
         */
        role: 'USER' | 'MODERATOR' | 'ADMIN';
        /**
         * Registration date
         */
        registeredAt: any;
        /**
         * Discord joined date
         */
        discordJoinedAt: any;
        /**
         * Ban status
         */
        isBanned: boolean;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
        /**
         * User detailed info
         */
        userInfo?: {
          /**
           * User ID
           */
          userId: string;
          /**
           * Digital passport NFT address
           */
          digitalPassportAddress: string;
          /**
           * Log NFT address
           */
          logNftAddress: string;
          /**
           * Digital passport type
           */
          userDigitalPassportType?:
            | 'BONJIN'
            | 'AMATSUKAMI'
            | 'KUNITSUKAMI'
            | 'YOKAI';
          /**
           * User level
           */
          level?:
            | 'BONJIN'
            | 'E_CLASS_AMATSUKAMI'
            | 'E_CLASS_KUNITSUKAMI'
            | 'E_CLASS_YOKAI'
            | 'D_CLASS_AMATSUKAMI'
            | 'D_CLASS_KUNITSUKAMI'
            | 'D_CLASS_YOKAI'
            | 'C_CLASS_AMATSUKAMI'
            | 'C_CLASS_KUNITSUKAMI'
            | 'C_CLASS_YOKAI'
            | 'B_CLASS_AMATSUKAMI'
            | 'B_CLASS_KUNITSUKAMI'
            | 'B_CLASS_YOKAI'
            | 'A_CLASS_AMATSUKAMI'
            | 'A_CLASS_KUNITSUKAMI'
            | 'A_CLASS_YOKAI'
            | 'S_CLASS_AMATSUKAMI'
            | 'S_CLASS_KUNITSUKAMI'
            | 'S_CLASS_YOKAI';
          /**
           * User discount rate
           */
          discountRate?: number;
          /**
           * Magatama points balance
           */
          magatamaPoints: number;
          /**
           * Magatama bags count
           */
          magatamaBags?: number;
          /**
           * Total quests completed
           */
          totalQuestCompleted: number;
          /**
           * Total travel distance
           */
          totalTravelDistance: number;
          /**
           * Premium status
           */
          isPremium: boolean;
          /**
           * Prayer bead count
           */
          prayerBead?: number;
          /**
           * Sword count
           */
          sword?: number;
          /**
           * Orge mask count
           */
          orgeMask?: number;
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        };
        /**
         * User achievements
         */
        userAchievements?: {
          /**
           * Achievement ID
           */
          userAchievementId: string;
          /**
           * User ID
           */
          userId: string;
          /**
           * Achievement name
           */
          achievementName: string;
          /**
           * Achievement description
           */
          achievementDesc?: string;
          /**
           * Icon URL
           */
          iconUrl?: string;
          /**
           * Achievement type
           */
          achievementType:
            | 'UNKNOWN'
            | 'STORY'
            | 'TRAVEL'
            | 'EXPLORE'
            | 'COMMUNITY'
            | 'MILESTONE';
          /**
           * Magatama points awarded
           */
          magatamaPointAwarded: number;
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        }[];
        /**
         * User onchain items
         */
        userOnchainItems?: {
          /**
           * Onchain item ID
           */
          userOnchainItemId: string;
          /**
           * User ID
           */
          userId?: string;
          /**
           * Item type
           */
          itemType: 'UNKNOWN' | 'LOG_NFT' | 'DIGITAL_PASSPORT' | 'PERK';
          /**
           * Transaction hash
           */
          itemTxnHash: string;
          /**
           * Blockchain type
           */
          blockchainType: 'UNKNOWN' | 'VARA' | 'CAMINO';
          /**
           * Minted date
           */
          mintedAt?: any;
          /**
           * Onchain item ID
           */
          onchainItemId?: string;
          /**
           * Item status
           */
          status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'PENDING';
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        }[];
        /**
         * User item claim logs
         */
        userItemClaimLogs?: {
          /**
           * Item claim log ID
           */
          userItemClaimLogId: string;
          /**
           * User ID
           */
          userId: string;
          /**
           * Onchain item ID
           */
          onchainItemId?: string;
          /**
           * Offchain item name
           */
          offchainItemName?: string;
          /**
           * Item amount
           */
          itemAmount: number;
          /**
           * Item details
           */
          itemDetails?: string;
          /**
           * Item type
           */
          type: 'ONCHAIN' | 'OFFCHAIN';
          /**
           * Claimed date
           */
          claimedAt?: any;
          /**
           * Claim status
           */
          status: 'SUCCESS' | 'FAILED';
          /**
           * Error message
           */
          errorMsg?: string;
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        }[];
        /**
         * User story logs
         */
        userStoryLogs?: {
          /**
           * Story log ID
           */
          userStoryLogId: string;
          /**
           * User ID
           */
          userId: string;
          /**
           * Story chapter ID
           */
          storyChapterId: string;
          /**
           * Story status
           */
          status: 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED';
          /**
           * Unlocked date
           */
          unlockedAt?: any;
          /**
           * Finished date
           */
          finishedAt?: any;
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        }[];
        /**
         * User task logs
         */
        userTaskLogs?: {
          /**
           * Task log ID
           */
          userTaskLogId: string;
          /**
           * User ID
           */
          userId: string;
          /**
           * Quest ID
           */
          questId: string;
          /**
           * Task ID
           */
          taskId: string;
          /**
           * Task status
           */
          status: 'AVAILABLE' | 'ONGOING' | 'COMPLETED' | 'FAILED';
          /**
           * Task action type
           */
          action:
            | 'VISIT_LOCATION'
            | 'PHOTO_UPLOAD'
            | 'ANSWER_TEXT'
            | 'SELECT_OPTION'
            | 'SHARE_SOCIAL'
            | 'CHECK_IN'
            | 'GROUP_ACTIVITY'
            | 'LOCAL_INTERACTION';
          /**
           * User response
           */
          userResponse?: string;
          /**
           * Group activity members
           */
          groupActivityMembers: any[];
          /**
           * Submission data
           */
          submissionData?: any;
          /**
           * Failed reason
           */
          failedReason?: string;
          /**
           * Completed date
           */
          completedAt?: any;
          /**
           * Claimed date
           */
          claimedAt?: any;
          /**
           * Total magatama points awarded
           */
          totalMagatamaPointAwarded: number;
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        }[];
        /**
         * User travel logs
         */
        userTravelLogs?: {
          /**
           * Travel log ID
           */
          userTravelLogId: string;
          /**
           * User ID
           */
          userId: string;
          /**
           * Quest ID
           */
          questId: string;
          /**
           * Task ID
           */
          taskId: string;
          /**
           * Tourist spot ID
           */
          touristSpotId: string;
          /**
           * User longitude
           */
          userLongitude: number;
          /**
           * User latitude
           */
          userLatitude: number;
          /**
           * Distance from target
           */
          travelDistanceFromTarget?: number;
          /**
           * Travel distance
           */
          travelDistance: number;
          /**
           * QR code value
           */
          qrCodeValue?: string;
          /**
           * Check-in method
           */
          checkInMethod?:
            | 'QR_CODE'
            | 'GPS'
            | 'AUTO_DETECTED'
            | 'BACKGROUND_GPS';
          /**
           * Fraud detected
           */
          detectedFraud?: boolean;
          /**
           * Fraud reason
           */
          fraudReason?: string;
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        }[];
        /**
         * Discord activity logs
         */
        discordActivityLogs?: {
          /**
           * Discord activity log ID
           */
          discordActivityLogId: string;
          /**
           * User ID
           */
          userId: string;
          /**
           * Activity type
           */
          activityType: string;
          /**
           * Activity details
           */
          activityDetails?: string;
          /**
           * Magatama points awarded
           */
          magatamaPointAwarded: number;
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        }[];
        /**
         * Discord user roles
         */
        discordUserRoles?: {
          /**
           * Discord user roles ID
           */
          discordUserRolesId: string;
          /**
           * User ID
           */
          userId: string;
          /**
           * Role ID
           */
          roleId: string;
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        }[];
        /**
         * Discord rewarded roles
         */
        discordRewardedRoles?: {
          /**
           * Discord rewarded roles ID
           */
          discordRewardedRolesId: string;
          /**
           * User ID
           */
          userId: string;
          /**
           * Role ID
           */
          roleId: string;
          /**
           * Magatama points awarded
           */
          magatamaPointAwarded: number;
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        }[];
        /**
         * User invite logs
         */
        userInviteLogs?: {
          /**
           * Invite log ID
           */
          inviteLogId: string;
          /**
           * User ID
           */
          userId: string;
          /**
           * Invitee Discord ID
           */
          inviteeDiscordId?: string;
          /**
           * Invitee user ID
           */
          inviteeUserId?: string;
          /**
           * Magatama points awarded
           */
          magatamaPointAwarded: number;
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        }[];
        /**
         * Summary statistics for admin view
         */
        summaryStats?: {
          /**
           * Total achievements earned
           */
          achievementCount: number;
          /**
           * Total onchain items
           */
          onchainItemCount: number;
          /**
           * Stories completed
           */
          storyCompletedCount: number;
          /**
           * Tasks completed
           */
          taskCompletedCount: number;
          /**
           * Total check-ins
           */
          totalCheckinsCount: number;
          /**
           * Discord activities
           */
          discordActivityCount: number;
          /**
           * Invitations sent
           */
          invitesSentCount: number;
        };
      }[];
      /**
       * Pagination information
       */
      pagination: {
        /**
         * Total number of users
         */
        totalCount: number;
        /**
         * Current page number
         */
        page: number;
        /**
         * Users per page
         */
        limit: number;
        /**
         * Total number of pages
         */
        totalPages: number;
      };
      /**
       * Applied filters
       */
      filters: {
        /**
         * Applied search term
         */
        searchTerm?: string;
        /**
         * Applied role filter
         */
        role?: string;
        /**
         * Applied premium filter
         */
        isPremium?: boolean;
        /**
         * Applied banned filter
         */
        isBanned?: boolean;
        /**
         * Applied start date filter
         */
        startDate?: any;
        /**
         * Applied end date filter
         */
        endDate?: any;
        /**
         * Applied sort field
         */
        sortBy?: string;
        /**
         * Applied sort order
         */
        sortOrder?: string;
      };
    }
    export interface AdminUserQueryDto {
      /**
       * Page number
       */
      page?: string;
      /**
       * Users per page (max 100)
       */
      limit?: string;
      /**
       * Search in username, email, discord/twitter usernames
       */
      searchTerm?: string;
      /**
       * Filter by user role
       */
      role?: 'USER' | 'MODERATOR' | 'ADMIN';
      /**
       * Filter by premium status (true/false)
       */
      isPremium?: string;
      /**
       * Filter by banned status (true/false)
       */
      isBanned?: string;
      /**
       * Filter by registration start date (ISO format)
       */
      startDate?: string;
      /**
       * Filter by registration end date (ISO format)
       */
      endDate?: string;
      /**
       * Sort field
       */
      sortBy?:
        | 'username'
        | 'registered_at'
        | 'total_quest_completed'
        | 'total_travel_distance';
      /**
       * Sort order
       */
      sortOrder?: 'asc' | 'desc';
    }
    export interface AuthSignupRequestDto {
      /**
       * Email address for signup
       */
      email: string; // email
      /**
       * Social provider for signup
       */
      socialProvider: string;
      /**
       * Social ID for signup
       */
      socialId: string;
    }
    export interface AuthSignupResponseDto {
      /**
       * Unique identifier for the user
       */
      userId: string;
      /**
       * Wallet address for the user
       */
      walletAddress: string;
    }
    export interface CheckinsFetchRequestDto {
      /**
       * Page number (default: 1)
       */
      page: string;
      /**
       * Items per page (default: 20, max: 100)
       */
      limit: string;
      /**
       * Filter by specific user ID (admin only)
       */
      userId?: string;
      /**
       * Filter by specific quest ID
       */
      questId?: string;
      /**
       * Filter by specific tourist spot ID
       */
      touristSpotId?: string;
      /**
       * Filter by check-in method
       */
      checkInMethod?: 'QR_CODE' | 'GPS' | 'AUTO_DETECTED' | 'BACKGROUND_GPS';
      /**
       * Filter by source type (manual=QR_CODE|GPS, auto=AUTO_DETECTED|BACKGROUND_GPS)
       */
      source?: 'manual' | 'auto';
      /**
       * Filter from date (ISO format)
       */
      startDate: string;
      /**
       * Filter to date (ISO format)
       */
      endDate: string;
    }
    export interface GroupMembersResponseDto {
      /**
       * Unique identifier for the group
       */
      groupId: string;
      /**
       * User ID of the group leader
       */
      leaderUserId: string;
      /**
       * List of group members
       */
      members: {
        /**
         * User ID of the member
         */
        userId: string;
        /**
         * Username of the member
         */
        username: string;
      }[];
    }
    export interface HomepageHighlightsResponseDto {
      latestChapter: {
        /**
         * Story ID
         */
        storyId: string;
        /**
         * Chapter ID
         */
        chapterId: string;
        /**
         * Chapter number (e.g., "Chapter 1", "Prologue")
         */
        chapterNumber: string;
        /**
         * Chapter title
         */
        title: string;
        /**
         * Cover image URL
         */
        imageUrl: string | null;
        /**
         * Region of the story
         */
        region: string | null;
        /**
         * Deep link to chapter
         */
        link: string | null;
      } | null;
      /**
       * Top 3 popular quests
       */
      popularQuests: {
        /**
         * Quest ID
         */
        questId: string;
        /**
         * Quest title
         */
        title: string;
        /**
         * Quest image URL
         */
        imageUrl: string | null;
        /**
         * Deep link to quest
         */
        link: string | null;
      }[];
    }
    export interface LocationInfoResponseDto {
      /**
       * Location name from Google Places
       */
      name: string;
      /**
       * Formatted address from Google Places
       */
      formattedAddress?: string;
      /**
       * International phone number
       */
      phoneNumber?: string;
      /**
       * Website URL
       */
      website?: string;
      /**
       * Google Places rating (1-5 scale)
       */
      rating?: number;
      /**
       * Direct Google Maps URL
       */
      googleMapsUrl?: string;
      /**
       * Opening hours for each day of the week
       */
      openingHours?: string[];
      /**
       * Thumbnail images of the location (up to 3 images, 400x400px)
       */
      images?: {
        /**
         * Direct URL to the image from Google Places Photos API
         */
        url: string;
        /**
         * Image width in pixels
         */
        width: number;
        /**
         * Image height in pixels
         */
        height: number;
        /**
         * Google Places photo reference ID
         */
        photoReference: string;
      }[];
    }
    export interface LocationQueryDto {
      /**
       * Place name or search query
       */
      query: string;
      /**
       * Latitude for location bias
       */
      latitude?: string;
      /**
       * Longitude for location bias
       */
      longitude?: string;
      /**
       * Address for enhanced search accuracy
       */
      address?: string;
    }
    export interface LoginRequestDto {
      /**
       * Username for login
       */
      username?: string;
      /**
       * User password
       */
      password: string;
      /**
       * Passport wallet address to validate
       */
      passportWalletAddress?: string;
      /**
       * Discord user ID
       */
      discordId?: string;
      /**
       * Google email address
       */
      googleEmail?: string;
    }
    export interface ModelRouteCreateRequestDto {
      /**
       * Unique identifier for the story
       */
      storyId: string;
      /**
       * Name of the model route
       */
      routeName: string;
      /**
       * Region of the model route
       */
      region: string;
      /**
       * Description of the region
       */
      regionDesc: string;
      /**
       * Background media of the region
       */
      regionBackgroundMedia: string;
      /**
       * Recommendation of the model route
       */
      recommendation: string[];
      /**
       * List of tourist spots in the model route
       */
      touristSpotList: {
        /**
         * Unique identifier for the story chapter
         */
        storyChapterId: string;
        /**
         * Name of the tourist spot
         */
        touristSpotName: string;
        /**
         * Description of the tourist spot
         */
        touristSpotDesc: string;
        /**
         * Best visit time of the tourist spot
         */
        bestVisitTime: string;
        /**
         * Hashtags associated with this location
         */
        touristSpotHashtag: string[];
        /**
         * Image set for the tourist spot
         */
        imageSet?: {
          /**
           * Main image of the tourist spot
           */
          main: string;
          /**
           * Small images of the tourist spot
           */
          small: string[];
        };
        /**
         * Address for enhanced search accuracy
         */
        address?: string;
      }[];
    }
    export interface ModelRouteResponseDto {
      /**
       * Unique identifier for the model route
       */
      modelRouteId: string;
      /**
       * Unique identifier for the story
       */
      storyId: string;
      /**
       * Name of the model route
       */
      routeName: string;
      /**
       * Region of the model route
       */
      region: string;
      /**
       * Description of the region
       */
      regionDesc: string;
      /**
       * Recommendation of the model route
       */
      recommendation: string[];
      /**
       * Latitude of the region
       */
      regionLatitude: number;
      /**
       * Longitude of the region
       */
      regionLongitude: number;
      /**
       * URL to the region's cover media
       */
      regionBackgroundMedia: string;
      /**
       * List of tourist spots in the model route
       */
      touristSpotList: {
        /**
         * Unique identifier for the tourist spot
         */
        touristSpotId: string;
        /**
         * Unique identifier for the story chapter
         */
        storyChapterId: string;
        /**
         * Name of the tourist spot
         */
        touristSpotName: string;
        /**
         * Description of the tourist spot
         */
        touristSpotDesc: string;
        /**
         * Best visit time of the tourist spot
         */
        bestVisitTime: string;
        /**
         * Address of the tourist spot
         */
        address: string;
        /**
         * Latitude of the tourist spot
         */
        touristSpotLatitude: number;
        /**
         * Longitude of the tourist spot
         */
        touristSpotLongitude: number;
        /**
         * Hashtags associated with this location
         */
        touristSpotHashtag: string[];
        /**
         * Link to the related story chapter
         */
        storyChapterLink?: string;
        /**
         * Image set for the tourist spot
         */
        imageSet?: {
          /**
           * Main image of the tourist spot
           */
          main: string;
          /**
           * Small images of the tourist spot
           */
          small: string[];
        };
        /**
         * Weather info for the tourist spot
         */
        weatherInfo?: {
          /**
           * Temperature of the weather
           */
          temperatureCelsius: number;
          /**
           * Name of the weather
           */
          weatherName: string;
          /**
           * Description of the weather
           */
          weatherDesc: string;
        };
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * Current weather info for the region
       */
      regionWeatherInfo: {
        /**
         * Temperature of the weather
         */
        temperatureCelsius: number;
        /**
         * Name of the weather
         */
        weatherName: string;
        /**
         * Description of the weather
         */
        weatherDesc: string;
        /**
         * Name of the region
         */
        regionName: string;
      };
      /**
       * Flag to indicate if the record is deleted
       */
      delFlag?: boolean;
      /**
       * ID of user who created this record
       */
      insUserId?: string;
      /**
       * Timestamp of record creation
       */
      insDateTime?: string;
      /**
       * ID of user who last updated this record
       */
      updUserId?: string;
      /**
       * Timestamp of last record update
       */
      updDateTime?: string;
    }
    export interface ModelRouteUpdateRequestDto {
      /**
       * Unique identifier for the story
       */
      storyId: string;
      /**
       * Name of the model route
       */
      routeName: string;
      /**
       * Region of the model route
       */
      region: string;
      /**
       * Description of the region
       */
      regionDesc: string;
      /**
       * Background media of the region
       */
      regionBackgroundMedia: string;
      /**
       * Recommendation of the model route
       */
      recommendation: string[];
      /**
       * List of tourist spots in the model route
       */
      touristSpotList: {
        /**
         * Unique identifier for the story chapter
         */
        storyChapterId: string;
        /**
         * Name of the tourist spot
         */
        touristSpotName: string;
        /**
         * Description of the tourist spot
         */
        touristSpotDesc: string;
        /**
         * Best visit time of the tourist spot
         */
        bestVisitTime: string;
        /**
         * Hashtags associated with this location
         */
        touristSpotHashtag: string[];
        /**
         * Image set for the tourist spot
         */
        imageSet?: {
          /**
           * Main image of the tourist spot
           */
          main: string;
          /**
           * Small images of the tourist spot
           */
          small: string[];
        };
        /**
         * Address for enhanced search accuracy
         */
        address?: string;
        /**
         * Unique identifier for the tourist spot
         */
        touristSpotId: string;
        /**
         * Flag to indicate if the tourist spot is deleted
         */
        delFlag: boolean;
        /**
         * Unique identifier for the user who updated the tourist spot
         */
        updUserId: string;
      }[];
      /**
       * Unique identifier for the model route
       */
      modelRouteId: string;
      /**
       * Flag to indicate if the model route is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the user who updated the model route
       */
      updUserId: string;
    }
    export interface MomentListResponseDto {
      moments: {
        /**
         * URL of the moment image
         */
        imageUrl?: string | null;
        /**
         * Traveler display name
         */
        username?: string | null;
        /**
         * Short moment description
         */
        description?: string | null;
        /**
         * Text describing earned rewards
         */
        rewardText?: string | null;
        /**
         * Timestamp when the moment occurred
         */
        insDateTime: string;
      }[];
      pagination: {
        /**
         * Current page number
         */
        currentPage: number;
        /**
         * Total number of pages
         */
        totalPages: number;
        /**
         * Total number of items
         */
        totalItems: number;
      };
    }
    /**
     * Traveler moment information
     */
    export interface MomentResponseDto {
      /**
       * URL of the moment image
       */
      imageUrl?: string | null;
      /**
       * Traveler display name
       */
      username?: string | null;
      /**
       * Short moment description
       */
      description?: string | null;
      /**
       * Text describing earned rewards
       */
      rewardText?: string | null;
      /**
       * Timestamp when the moment occurred
       */
      insDateTime: string;
    }
    export interface QrScanRequestDto {
      code: string; // ^[A-Za-z0-9_\-:./#]+$
      latitude?: number;
      longitude?: number;
    }
    export interface QrScanResponseDto {
      success: boolean;
      message: string;
      taskId: string;
      questId: string;
      magatama_point_awarded: number;
      completed_at: string; // date-time
    }
    export interface QuestCreateRequestDto {
      /**
       * Unique identifier for the tourist spot
       */
      touristSpotId: string;
      /**
       * Name of the quest
       */
      questName: string;
      /**
       * Description of the quest
       */
      questDesc: string;
      /**
       * URL to the quest image
       */
      questImage?: string;
      /**
       * Quest type
       */
      questType:
        | 'UNKNOWN'
        | 'TRAVEL_TO_EARN'
        | 'EARN_TO_TRAVEL'
        | 'CAMPAIGN'
        | 'COMMUNITY_EVENT';
      /**
       * Whether quest is unlocked
       */
      isUnlocked: boolean;
      /**
       * Whether quest is premium
       */
      isPremium: boolean;
      /**
       * Total Magatama points awarded
       */
      totalMagatamaPointAwarded: number;
      /**
       * Reward type
       */
      rewardType:
        | 'UNKNOWN'
        | 'LOCAL_EXPERIENCES'
        | 'CULINARY'
        | 'ADVENTURE_NATURE'
        | 'CULTURAL_COMMUNITY'
        | 'HIDDEN_PERKS'
        | 'SURPRISE_TREATS'
        | 'BONUS_UPGRADES'
        | 'SOCIAL_RECOGNITION'
        | 'RETURNING_VISITOR_BONUS'
        | 'ELITE_EXPERIENCES'
        | 'WELLNESS'
        | 'SHOPPING'
        | 'ENTERTAINMENT'
        | 'TRANSPORT_CONNECTIVITY'
        | 'LOCAL_PARTNERSHIPS';
      /**
       * Flag to indicate if the quest is deleted
       */
      delFlag: boolean;
    }
    export interface QuestListResponseDto {
      quests: {
        /**
         * Unique identifier for the quest
         */
        questId: string;
        /**
         * Name of the quest
         */
        questName: string;
        /**
         * Description of the quest
         */
        questDesc: string;
        /**
         * URL to the quest image
         */
        questImage?: string;
        /**
         * Quest type
         */
        questType:
          | 'UNKNOWN'
          | 'TRAVEL_TO_EARN'
          | 'EARN_TO_TRAVEL'
          | 'CAMPAIGN'
          | 'COMMUNITY_EVENT';
        /**
         * Whether quest is unlocked
         */
        isUnlocked: boolean;
        /**
         * Whether quest is premium
         */
        isPremium: boolean;
        /**
         * Total Magatama points awarded
         */
        totalMagatamaPointAwarded: number;
        /**
         * Tasks associated with this quest
         */
        tasks?: {
          /**
           * Unique identifier for the task
           */
          taskId: string;
          /**
           * Theme of the task
           */
          taskTheme:
            | 'STORY'
            | 'LOCAL_CULTURE'
            | 'FOOD'
            | 'URBAN_EXPLORE'
            | 'NATURE';
          /**
           * Type of the task
           */
          taskType:
            | 'VISIT_LOCATION'
            | 'PHOTO_UPLOAD'
            | 'ANSWER_TEXT'
            | 'SELECT_OPTION'
            | 'SHARE_SOCIAL'
            | 'CHECK_IN'
            | 'GROUP_ACTIVITY'
            | 'LOCAL_INTERACTION';
          /**
           * Name of the task
           */
          taskName: string;
          /**
           * Description of the task
           */
          taskDesc: string;
          /**
           * Whether task is unlocked
           */
          isUnlocked: boolean;
          /**
           * Action required to complete the task
           */
          requiredAction: string;
          /**
           * Members for group activities
           */
          groupActivityMembers?: any[];
          /**
           * Options for selection tasks
           */
          selectOptions?: any[];
          /**
           * Rules to prevent cheating
           */
          antiCheatRules: any;
          /**
           * Magatama points awarded for this task
           */
          magatamaPointAwarded: number;
          /**
           * Reward earned for this task
           */
          rewardEarned?: string;
          /**
           * Whether task is completed
           */
          isCompleted: boolean;
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        }[];
        /**
         * Tourist spot associated with this quest
         */
        touristSpot?: {
          /**
           * Unique identifier for the tourist spot
           */
          touristSpotId: string;
          /**
           * Unique identifier for the story chapter
           */
          storyChapterId: string;
          /**
           * Name of the tourist spot
           */
          touristSpotName: string;
          /**
           * Description of the tourist spot
           */
          touristSpotDesc: string;
          /**
           * Best visit time of the tourist spot
           */
          bestVisitTime: string;
          /**
           * Address of the tourist spot
           */
          address: string;
          /**
           * Latitude of the tourist spot
           */
          touristSpotLatitude: number;
          /**
           * Longitude of the tourist spot
           */
          touristSpotLongitude: number;
          /**
           * Hashtags associated with this location
           */
          touristSpotHashtag: string[];
          /**
           * Link to the related story chapter
           */
          storyChapterLink?: string;
          /**
           * Image set for the tourist spot
           */
          imageSet?: {
            /**
             * Main image of the tourist spot
             */
            main: string;
            /**
             * Small images of the tourist spot
             */
            small: string[];
          };
          /**
           * Weather info for the tourist spot
           */
          weatherInfo?: {
            /**
             * Temperature of the weather
             */
            temperatureCelsius: number;
            /**
             * Name of the weather
             */
            weatherName: string;
            /**
             * Description of the weather
             */
            weatherDesc: string;
          };
          /**
           * Flag to indicate if the record is deleted
           */
          delFlag?: boolean;
          /**
           * ID of user who created this record
           */
          insUserId?: string;
          /**
           * Timestamp of record creation
           */
          insDateTime?: string;
          /**
           * ID of user who last updated this record
           */
          updUserId?: string;
          /**
           * Timestamp of last record update
           */
          updDateTime?: string;
        };
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalQuests: number;
      };
    }
    export interface QuestResponseDto {
      /**
       * Unique identifier for the quest
       */
      questId: string;
      /**
       * Name of the quest
       */
      questName: string;
      /**
       * Description of the quest
       */
      questDesc: string;
      /**
       * URL to the quest image
       */
      questImage?: string;
      /**
       * Quest type
       */
      questType:
        | 'UNKNOWN'
        | 'TRAVEL_TO_EARN'
        | 'EARN_TO_TRAVEL'
        | 'CAMPAIGN'
        | 'COMMUNITY_EVENT';
      /**
       * Whether quest is unlocked
       */
      isUnlocked: boolean;
      /**
       * Whether quest is premium
       */
      isPremium: boolean;
      /**
       * Total Magatama points awarded
       */
      totalMagatamaPointAwarded: number;
      /**
       * Tasks associated with this quest
       */
      tasks?: {
        /**
         * Unique identifier for the task
         */
        taskId: string;
        /**
         * Theme of the task
         */
        taskTheme:
          | 'STORY'
          | 'LOCAL_CULTURE'
          | 'FOOD'
          | 'URBAN_EXPLORE'
          | 'NATURE';
        /**
         * Type of the task
         */
        taskType:
          | 'VISIT_LOCATION'
          | 'PHOTO_UPLOAD'
          | 'ANSWER_TEXT'
          | 'SELECT_OPTION'
          | 'SHARE_SOCIAL'
          | 'CHECK_IN'
          | 'GROUP_ACTIVITY'
          | 'LOCAL_INTERACTION';
        /**
         * Name of the task
         */
        taskName: string;
        /**
         * Description of the task
         */
        taskDesc: string;
        /**
         * Whether task is unlocked
         */
        isUnlocked: boolean;
        /**
         * Action required to complete the task
         */
        requiredAction: string;
        /**
         * Members for group activities
         */
        groupActivityMembers?: any[];
        /**
         * Options for selection tasks
         */
        selectOptions?: any[];
        /**
         * Rules to prevent cheating
         */
        antiCheatRules: any;
        /**
         * Magatama points awarded for this task
         */
        magatamaPointAwarded: number;
        /**
         * Reward earned for this task
         */
        rewardEarned?: string;
        /**
         * Whether task is completed
         */
        isCompleted: boolean;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * Tourist spot associated with this quest
       */
      touristSpot?: {
        /**
         * Unique identifier for the tourist spot
         */
        touristSpotId: string;
        /**
         * Unique identifier for the story chapter
         */
        storyChapterId: string;
        /**
         * Name of the tourist spot
         */
        touristSpotName: string;
        /**
         * Description of the tourist spot
         */
        touristSpotDesc: string;
        /**
         * Best visit time of the tourist spot
         */
        bestVisitTime: string;
        /**
         * Address of the tourist spot
         */
        address: string;
        /**
         * Latitude of the tourist spot
         */
        touristSpotLatitude: number;
        /**
         * Longitude of the tourist spot
         */
        touristSpotLongitude: number;
        /**
         * Hashtags associated with this location
         */
        touristSpotHashtag: string[];
        /**
         * Link to the related story chapter
         */
        storyChapterLink?: string;
        /**
         * Image set for the tourist spot
         */
        imageSet?: {
          /**
           * Main image of the tourist spot
           */
          main: string;
          /**
           * Small images of the tourist spot
           */
          small: string[];
        };
        /**
         * Weather info for the tourist spot
         */
        weatherInfo?: {
          /**
           * Temperature of the weather
           */
          temperatureCelsius: number;
          /**
           * Name of the weather
           */
          weatherName: string;
          /**
           * Description of the weather
           */
          weatherDesc: string;
        };
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      };
      /**
       * Flag to indicate if the record is deleted
       */
      delFlag?: boolean;
      /**
       * ID of user who created this record
       */
      insUserId?: string;
      /**
       * Timestamp of record creation
       */
      insDateTime?: string;
      /**
       * ID of user who last updated this record
       */
      updUserId?: string;
      /**
       * Timestamp of last record update
       */
      updDateTime?: string;
    }
    export interface QuestTaskCreateRequestDto {
      /**
       * Theme of the task
       */
      taskTheme:
        | 'STORY'
        | 'LOCAL_CULTURE'
        | 'FOOD'
        | 'URBAN_EXPLORE'
        | 'NATURE';
      /**
       * Type of the task
       */
      taskType:
        | 'VISIT_LOCATION'
        | 'PHOTO_UPLOAD'
        | 'ANSWER_TEXT'
        | 'SELECT_OPTION'
        | 'SHARE_SOCIAL'
        | 'CHECK_IN'
        | 'GROUP_ACTIVITY'
        | 'LOCAL_INTERACTION';
      /**
       * Name of the task
       */
      taskName: string;
      /**
       * Description of the task
       */
      taskDesc: string;
      /**
       * Whether task is unlocked
       */
      isUnlocked: boolean;
      /**
       * Action required to complete the task
       */
      requiredAction: string;
      /**
       * Members for group activities
       */
      groupActivityMembers?: any[];
      /**
       * Options for selection tasks
       */
      selectOptions?: any[];
      /**
       * Rules to prevent cheating
       */
      antiCheatRules: any;
      /**
       * Magatama points awarded for this task
       */
      magatamaPointAwarded: number;
      /**
       * Reward earned for this task
       */
      rewardEarned?: string;
    }
    export interface QuestTaskPhotoUploadResponseDto {
      /**
       * Result message for photo upload
       */
      message: string;
      /**
       * Public URL for the uploaded proof image
       */
      proofUrl: string; // uri
    }
    export interface QuestTaskSocialShareResponseDto {
      /**
       * Result message for social share completion
       */
      message: string;
    }
    export interface QuestTaskUpdateRequestDto {
      /**
       * Theme of the task
       */
      taskTheme:
        | 'STORY'
        | 'LOCAL_CULTURE'
        | 'FOOD'
        | 'URBAN_EXPLORE'
        | 'NATURE';
      /**
       * Type of the task
       */
      taskType:
        | 'VISIT_LOCATION'
        | 'PHOTO_UPLOAD'
        | 'ANSWER_TEXT'
        | 'SELECT_OPTION'
        | 'SHARE_SOCIAL'
        | 'CHECK_IN'
        | 'GROUP_ACTIVITY'
        | 'LOCAL_INTERACTION';
      /**
       * Name of the task
       */
      taskName: string;
      /**
       * Description of the task
       */
      taskDesc: string;
      /**
       * Whether task is unlocked
       */
      isUnlocked: boolean;
      /**
       * Action required to complete the task
       */
      requiredAction: string;
      /**
       * Members for group activities
       */
      groupActivityMembers?: any[];
      /**
       * Options for selection tasks
       */
      selectOptions?: any[];
      /**
       * Rules to prevent cheating
       */
      antiCheatRules: any;
      /**
       * Magatama points awarded for this task
       */
      magatamaPointAwarded: number;
      /**
       * Reward earned for this task
       */
      rewardEarned?: string;
      /**
       * Unique identifier for the task
       */
      taskId: string;
      /**
       * Flag to indicate if the task is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the user who updated the task
       */
      updUserId: string;
    }
    export interface QuestUpdateRequestDto {
      /**
       * Unique identifier for the tourist spot
       */
      touristSpotId: string;
      /**
       * Name of the quest
       */
      questName: string;
      /**
       * Description of the quest
       */
      questDesc: string;
      /**
       * URL to the quest image
       */
      questImage?: string;
      /**
       * Quest type
       */
      questType:
        | 'UNKNOWN'
        | 'TRAVEL_TO_EARN'
        | 'EARN_TO_TRAVEL'
        | 'CAMPAIGN'
        | 'COMMUNITY_EVENT';
      /**
       * Whether quest is unlocked
       */
      isUnlocked: boolean;
      /**
       * Whether quest is premium
       */
      isPremium: boolean;
      /**
       * Total Magatama points awarded
       */
      totalMagatamaPointAwarded: number;
      /**
       * Reward type
       */
      rewardType:
        | 'UNKNOWN'
        | 'LOCAL_EXPERIENCES'
        | 'CULINARY'
        | 'ADVENTURE_NATURE'
        | 'CULTURAL_COMMUNITY'
        | 'HIDDEN_PERKS'
        | 'SURPRISE_TREATS'
        | 'BONUS_UPGRADES'
        | 'SOCIAL_RECOGNITION'
        | 'RETURNING_VISITOR_BONUS'
        | 'ELITE_EXPERIENCES'
        | 'WELLNESS'
        | 'SHOPPING'
        | 'ENTERTAINMENT'
        | 'TRANSPORT_CONNECTIVITY'
        | 'LOCAL_PARTNERSHIPS';
      /**
       * Flag to indicate if the quest is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the quest
       */
      questId: string;
      /**
       * Unique identifier for the user who updated the quest
       */
      updUserId: string;
      /**
       * List of tasks for the quest
       */
      taskList?: {
        /**
         * Theme of the task
         */
        taskTheme:
          | 'STORY'
          | 'LOCAL_CULTURE'
          | 'FOOD'
          | 'URBAN_EXPLORE'
          | 'NATURE';
        /**
         * Type of the task
         */
        taskType:
          | 'VISIT_LOCATION'
          | 'PHOTO_UPLOAD'
          | 'ANSWER_TEXT'
          | 'SELECT_OPTION'
          | 'SHARE_SOCIAL'
          | 'CHECK_IN'
          | 'GROUP_ACTIVITY'
          | 'LOCAL_INTERACTION';
        /**
         * Name of the task
         */
        taskName: string;
        /**
         * Description of the task
         */
        taskDesc: string;
        /**
         * Whether task is unlocked
         */
        isUnlocked: boolean;
        /**
         * Action required to complete the task
         */
        requiredAction: string;
        /**
         * Members for group activities
         */
        groupActivityMembers?: any[];
        /**
         * Options for selection tasks
         */
        selectOptions?: any[];
        /**
         * Rules to prevent cheating
         */
        antiCheatRules: any;
        /**
         * Magatama points awarded for this task
         */
        magatamaPointAwarded: number;
        /**
         * Reward earned for this task
         */
        rewardEarned?: string;
        /**
         * Unique identifier for the task
         */
        taskId: string;
        /**
         * Flag to indicate if the task is deleted
         */
        delFlag: boolean;
        /**
         * Unique identifier for the user who updated the task
         */
        updUserId: string;
      }[];
    }
    export interface StartGroupQuestRequestDto {
      /**
       * User ID of the quest leader starting the quest
       */
      userId: string;
      /**
       * Optional latitude for location tracking
       */
      latitude?: number;
      /**
       * Optional longitude for location tracking
       */
      longitude?: number;
    }
    export interface StartGroupQuestResponseDto {
      /**
       * Result message for starting the quest
       */
      message: string;
    }
    export interface StoryChapterCreateRequestDto {
      /**
       * Unique identifier for the tourist spot
       */
      touristSpotId: string;
      /**
       * Chapter number or position (e.g., 'Prologue', 'Chapter 1')
       */
      chapterNumber: string;
      /**
       * Title of the story chapter
       */
      chapterTitle: string;
      /**
       * Detailed description or content of the story
       */
      chapterDesc: string;
      /**
       * URL to the fictional chapter image
       */
      chapterImage: string;
      /**
       * List of character names involved in the chapter
       */
      characterNameList: string[];
      /**
       * URL to the real-world location image
       */
      realWorldImage: string;
      /**
       * URL to the chapter video for desktop viewing
       */
      chapterVideoUrl: string;
      /**
       * URL to the chapter video optimized for mobile
       */
      chapterVideoMobileUrl: string;
      /**
       * URL to the downloadable PDF version
       */
      chapterPdfUrl: string;
      /**
       * Whether the chapter is available to users without prerequisites
       */
      isUnlocked: boolean;
    }
    export interface StoryChapterResponseDto {
      /**
       * Unique identifier for the story
       */
      storyId: string;
      /**
       * Unique identifier for the tourist spot
       */
      touristSpotId: string;
      /**
       * Unique identifier for the story chapter
       */
      storyChapterId: string;
      /**
       * Name of the saga
       */
      sagaName: string;
      /**
       * Chapter number or position
       */
      chapterNumber: string;
      /**
       * Title of the chapter
       */
      chapterTitle: string;
      /**
       * Detailed description of the chapter
       */
      chapterDesc: string;
      /**
       * URL to the fictional chapter image
       */
      chapterImage: string;
      /**
       * List of character names involved in the chapter
       */
      characterNameList: string[];
      /**
       * URL to the real-world location image
       */
      realWorldImage: string;
      /**
       * URL to the chapter video for desktop viewing
       */
      chapterVideoUrl: string;
      /**
       * URL to the chapter video optimized for mobile
       */
      chapterVideoMobileUrl: string;
      /**
       * URL to the downloadable PDF version
       */
      chapterPdfUrl: string;
      /**
       * Whether the chapter is available to users without prerequisites
       */
      isUnlocked: boolean;
      /**
       * Flag to indicate if the record is deleted
       */
      delFlag?: boolean;
      /**
       * ID of user who created this record
       */
      insUserId?: string;
      /**
       * Timestamp of record creation
       */
      insDateTime?: string;
      /**
       * ID of user who last updated this record
       */
      updUserId?: string;
      /**
       * Timestamp of last record update
       */
      updDateTime?: string;
    }
    export interface StoryChapterUpdateRequestDto {
      /**
       * Unique identifier for the tourist spot
       */
      touristSpotId: string;
      /**
       * Chapter number or position (e.g., 'Prologue', 'Chapter 1')
       */
      chapterNumber: string;
      /**
       * Title of the story chapter
       */
      chapterTitle: string;
      /**
       * Detailed description or content of the story
       */
      chapterDesc: string;
      /**
       * URL to the fictional chapter image
       */
      chapterImage: string;
      /**
       * List of character names involved in the chapter
       */
      characterNameList: string[];
      /**
       * URL to the real-world location image
       */
      realWorldImage: string;
      /**
       * URL to the chapter video for desktop viewing
       */
      chapterVideoUrl: string;
      /**
       * URL to the chapter video optimized for mobile
       */
      chapterVideoMobileUrl: string;
      /**
       * URL to the downloadable PDF version
       */
      chapterPdfUrl: string;
      /**
       * Whether the chapter is available to users without prerequisites
       */
      isUnlocked: boolean;
      /**
       * Unique identifier for the story chapter
       */
      storyChapterId: string;
      /**
       * Flag to indicate if the story chapter is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the user who updated the story chapter
       */
      updUserId: string;
    }
    export interface StoryCompletionResponseDto {
      /**
       * Whether the story completion was successful
       */
      success: boolean;
      /**
       * Success or error message
       */
      message: string;
      /**
       * Story progress information
       */
      storyProgress: {
        /**
         * ID of the completed story chapter
         */
        storyChapterId: string;
        /**
         * Title of the completed chapter
         */
        chapterTitle: string;
        /**
         * Current story status
         */
        status: 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED';
        /**
         * Timestamp when the story was completed
         */
        completedAt: null;
      };
      /**
       * List of quests unlocked by completing this story
       */
      unlockedQuests: {
        /**
         * ID of the unlocked quest
         */
        questId: string;
        /**
         * Name of the unlocked quest
         */
        questName: string;
        /**
         * Description of the unlocked quest
         */
        questDesc: string;
        /**
         * Image URL for the quest
         */
        questImage: string | null;
        /**
         * Name of the tourist spot where the quest is located
         */
        touristSpotName: string;
        /**
         * Total magatama points awarded for completing this quest
         */
        totalMagatamaPointAwarded: number;
        /**
         * Whether this is a premium quest
         */
        isPremium: boolean;
      }[];
      /**
       * Rewards earned from story completion
       */
      rewards: {
        /**
         * Total magatama points earned from story completion and achievements
         */
        magatamaPointsEarned: number;
        /**
         * List of achievement names unlocked
         */
        achievementsUnlocked: string[];
      };
    }
    export interface StoryCreateRequestDto {
      /**
       * Name of the story saga (e.g., 'Prologue', 'Bungo Ono')
       */
      sagaName: string;
      /**
       * Detailed description of the saga's narrative
       */
      sagaDesc: string;
      /**
       * URL to the saga's cover media (image or video)
       */
      backgroundMedia: string;
      /**
       * URL to the map image for the saga
       */
      mapImage?: string;
      /**
       * Real-world location of the saga (e.g., 'Tokyo')
       */
      location?: string;
      /**
       * Display order in the saga list
       */
      order: number;
      /**
       * Whether the saga is a prologue
       */
      isPrologue: boolean;
      /**
       * Whether the saga is selected by default
       */
      isSelected: boolean;
      /**
       * List of chapters in the saga
       */
      chapterList?: {
        /**
         * Unique identifier for the tourist spot
         */
        touristSpotId: string;
        /**
         * Chapter number or position (e.g., 'Prologue', 'Chapter 1')
         */
        chapterNumber: string;
        /**
         * Title of the story chapter
         */
        chapterTitle: string;
        /**
         * Detailed description or content of the story
         */
        chapterDesc: string;
        /**
         * URL to the fictional chapter image
         */
        chapterImage: string;
        /**
         * List of character names involved in the chapter
         */
        characterNameList: string[];
        /**
         * URL to the real-world location image
         */
        realWorldImage: string;
        /**
         * URL to the chapter video for desktop viewing
         */
        chapterVideoUrl: string;
        /**
         * URL to the chapter video optimized for mobile
         */
        chapterVideoMobileUrl: string;
        /**
         * URL to the downloadable PDF version
         */
        chapterPdfUrl: string;
        /**
         * Whether the chapter is available to users without prerequisites
         */
        isUnlocked: boolean;
      }[];
    }
    export interface StoryProgressResponseDto {
      /**
       * ID of the story chapter
       */
      storyChapterId: string;
      /**
       * Current reading status
       */
      status: 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED';
      /**
       * Timestamp when the user started reading
       */
      unlockedAt: null;
      /**
       * Timestamp when the user finished reading
       */
      finishedAt: null;
      /**
       * Whether the user can start reading this chapter
       */
      canStart: boolean;
      /**
       * Whether the user can complete this chapter
       */
      canComplete: boolean;
    }
    export interface StoryReadingCompleteRequestDto {
      /**
       * ID of the user completing the story chapter
       */
      userId: string;
    }
    export interface StoryReadingStartRequestDto {
      /**
       * ID of the user starting to read the story chapter
       */
      userId: string;
    }
    export interface StoryResponseDto {
      /**
       * Unique identifier for the story saga
       */
      storyId: string;
      /**
       * Name of the story saga
       */
      sagaName: string;
      /**
       * Detailed description of the saga's narrative
       */
      sagaDesc: string;
      /**
       * URL to the saga's cover media (image or video)
       */
      backgroundMedia: string;
      /**
       * URL to the map image for the saga
       */
      mapImage: string;
      /**
       * Real-world location of the saga
       */
      location: string;
      /**
       * Display order in the saga list
       */
      order: number;
      /**
       * Whether the saga is a prologue
       */
      isPrologue: boolean;
      /**
       * Whether the saga is selected by default
       */
      isSelected: boolean;
      /**
       * List of stories in the saga
       */
      chapterList?: {
        /**
         * Unique identifier for the story
         */
        storyId: string;
        /**
         * Unique identifier for the tourist spot
         */
        touristSpotId: string;
        /**
         * Unique identifier for the story chapter
         */
        storyChapterId: string;
        /**
         * Name of the saga
         */
        sagaName: string;
        /**
         * Chapter number or position
         */
        chapterNumber: string;
        /**
         * Title of the chapter
         */
        chapterTitle: string;
        /**
         * Detailed description of the chapter
         */
        chapterDesc: string;
        /**
         * URL to the fictional chapter image
         */
        chapterImage: string;
        /**
         * List of character names involved in the chapter
         */
        characterNameList: string[];
        /**
         * URL to the real-world location image
         */
        realWorldImage: string;
        /**
         * URL to the chapter video for desktop viewing
         */
        chapterVideoUrl: string;
        /**
         * URL to the chapter video optimized for mobile
         */
        chapterVideoMobileUrl: string;
        /**
         * URL to the downloadable PDF version
         */
        chapterPdfUrl: string;
        /**
         * Whether the chapter is available to users without prerequisites
         */
        isUnlocked: boolean;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * Flag to indicate if the record is deleted
       */
      delFlag?: boolean;
      /**
       * ID of user who created this record
       */
      insUserId?: string;
      /**
       * Timestamp of record creation
       */
      insDateTime?: string;
      /**
       * ID of user who last updated this record
       */
      updUserId?: string;
      /**
       * Timestamp of last record update
       */
      updDateTime?: string;
    }
    export interface StoryUpdateRequestDto {
      /**
       * Name of the story saga (e.g., 'Prologue', 'Bungo Ono')
       */
      sagaName: string;
      /**
       * Detailed description of the saga's narrative
       */
      sagaDesc: string;
      /**
       * URL to the saga's cover media (image or video)
       */
      backgroundMedia: string;
      /**
       * URL to the map image for the saga
       */
      mapImage?: string;
      /**
       * Real-world location of the saga (e.g., 'Tokyo')
       */
      location?: string;
      /**
       * Display order in the saga list
       */
      order: number;
      /**
       * Whether the saga is a prologue
       */
      isPrologue: boolean;
      /**
       * Whether the saga is selected by default
       */
      isSelected: boolean;
      /**
       * List of chapters
       */
      chapterList: {
        /**
         * Unique identifier for the tourist spot
         */
        touristSpotId: string;
        /**
         * Chapter number or position (e.g., 'Prologue', 'Chapter 1')
         */
        chapterNumber: string;
        /**
         * Title of the story chapter
         */
        chapterTitle: string;
        /**
         * Detailed description or content of the story
         */
        chapterDesc: string;
        /**
         * URL to the fictional chapter image
         */
        chapterImage: string;
        /**
         * List of character names involved in the chapter
         */
        characterNameList: string[];
        /**
         * URL to the real-world location image
         */
        realWorldImage: string;
        /**
         * URL to the chapter video for desktop viewing
         */
        chapterVideoUrl: string;
        /**
         * URL to the chapter video optimized for mobile
         */
        chapterVideoMobileUrl: string;
        /**
         * URL to the downloadable PDF version
         */
        chapterPdfUrl: string;
        /**
         * Whether the chapter is available to users without prerequisites
         */
        isUnlocked: boolean;
        /**
         * Unique identifier for the story chapter
         */
        storyChapterId: string;
        /**
         * Flag to indicate if the story chapter is deleted
         */
        delFlag: boolean;
        /**
         * Unique identifier for the user who updated the story chapter
         */
        updUserId: string;
      }[];
      /**
       * Unique identifier for the story saga
       */
      sagaId: string;
      /**
       * Flag to indicate if the story saga is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the user who updated the story saga
       */
      updUserId: string;
    }
    export interface SubmitAnswerTextRequestTaskDto {
      /**
       * Answer to the task
       */
      answer: string;
    }
    export interface SubmitCheckInTaskRequestDto {
      /**
       * Longitude of the user
       */
      longitude: number;
      /**
       * Latitude of the user
       */
      latitude: number;
    }
    export interface SubmitSelectOptionsTaskRequestDto {
      /**
       * IDs of the selected options
       */
      selectedOptionIds: number[];
    }
    export interface SubmitTaskResponseDto {
      /**
       * Whether the answer is correct
       */
      success: boolean;
      /**
       * Message to the user
       */
      message: string;
    }
    export interface TaskResponseDto {
      /**
       * Unique identifier for the task
       */
      taskId: string;
      /**
       * Theme of the task
       */
      taskTheme:
        | 'STORY'
        | 'LOCAL_CULTURE'
        | 'FOOD'
        | 'URBAN_EXPLORE'
        | 'NATURE';
      /**
       * Type of the task
       */
      taskType:
        | 'VISIT_LOCATION'
        | 'PHOTO_UPLOAD'
        | 'ANSWER_TEXT'
        | 'SELECT_OPTION'
        | 'SHARE_SOCIAL'
        | 'CHECK_IN'
        | 'GROUP_ACTIVITY'
        | 'LOCAL_INTERACTION';
      /**
       * Name of the task
       */
      taskName: string;
      /**
       * Description of the task
       */
      taskDesc: string;
      /**
       * Whether task is unlocked
       */
      isUnlocked: boolean;
      /**
       * Action required to complete the task
       */
      requiredAction: string;
      /**
       * Members for group activities
       */
      groupActivityMembers?: any[];
      /**
       * Options for selection tasks
       */
      selectOptions?: any[];
      /**
       * Rules to prevent cheating
       */
      antiCheatRules: any;
      /**
       * Magatama points awarded for this task
       */
      magatamaPointAwarded: number;
      /**
       * Reward earned for this task
       */
      rewardEarned?: string;
      /**
       * Whether task is completed
       */
      isCompleted: boolean;
      /**
       * Flag to indicate if the record is deleted
       */
      delFlag?: boolean;
      /**
       * ID of user who created this record
       */
      insUserId?: string;
      /**
       * Timestamp of record creation
       */
      insDateTime?: string;
      /**
       * ID of user who last updated this record
       */
      updUserId?: string;
      /**
       * Timestamp of last record update
       */
      updDateTime?: string;
    }
    export interface TouristSpotCreateRequestDto {
      /**
       * Unique identifier for the story chapter
       */
      storyChapterId: string;
      /**
       * Name of the tourist spot
       */
      touristSpotName: string;
      /**
       * Description of the tourist spot
       */
      touristSpotDesc: string;
      /**
       * Best visit time of the tourist spot
       */
      bestVisitTime: string;
      /**
       * Hashtags associated with this location
       */
      touristSpotHashtag: string[];
      /**
       * Image set for the tourist spot
       */
      imageSet?: {
        /**
         * Main image of the tourist spot
         */
        main: string;
        /**
         * Small images of the tourist spot
         */
        small: string[];
      };
      /**
       * Address for enhanced search accuracy
       */
      address?: string;
    }
    export interface TouristSpotResponseDto {
      /**
       * Unique identifier for the tourist spot
       */
      touristSpotId: string;
      /**
       * Unique identifier for the story chapter
       */
      storyChapterId: string;
      /**
       * Name of the tourist spot
       */
      touristSpotName: string;
      /**
       * Description of the tourist spot
       */
      touristSpotDesc: string;
      /**
       * Best visit time of the tourist spot
       */
      bestVisitTime: string;
      /**
       * Address of the tourist spot
       */
      address: string;
      /**
       * Latitude of the tourist spot
       */
      touristSpotLatitude: number;
      /**
       * Longitude of the tourist spot
       */
      touristSpotLongitude: number;
      /**
       * Hashtags associated with this location
       */
      touristSpotHashtag: string[];
      /**
       * Link to the related story chapter
       */
      storyChapterLink?: string;
      /**
       * Image set for the tourist spot
       */
      imageSet?: {
        /**
         * Main image of the tourist spot
         */
        main: string;
        /**
         * Small images of the tourist spot
         */
        small: string[];
      };
      /**
       * Weather info for the tourist spot
       */
      weatherInfo?: {
        /**
         * Temperature of the weather
         */
        temperatureCelsius: number;
        /**
         * Name of the weather
         */
        weatherName: string;
        /**
         * Description of the weather
         */
        weatherDesc: string;
      };
      /**
       * Flag to indicate if the record is deleted
       */
      delFlag?: boolean;
      /**
       * ID of user who created this record
       */
      insUserId?: string;
      /**
       * Timestamp of record creation
       */
      insDateTime?: string;
      /**
       * ID of user who last updated this record
       */
      updUserId?: string;
      /**
       * Timestamp of last record update
       */
      updDateTime?: string;
    }
    export interface TouristSpotUpdateRequestDto {
      /**
       * Unique identifier for the story chapter
       */
      storyChapterId: string;
      /**
       * Name of the tourist spot
       */
      touristSpotName: string;
      /**
       * Description of the tourist spot
       */
      touristSpotDesc: string;
      /**
       * Best visit time of the tourist spot
       */
      bestVisitTime: string;
      /**
       * Hashtags associated with this location
       */
      touristSpotHashtag: string[];
      /**
       * Image set for the tourist spot
       */
      imageSet?: {
        /**
         * Main image of the tourist spot
         */
        main: string;
        /**
         * Small images of the tourist spot
         */
        small: string[];
      };
      /**
       * Address for enhanced search accuracy
       */
      address?: string;
      /**
       * Unique identifier for the tourist spot
       */
      touristSpotId: string;
      /**
       * Flag to indicate if the tourist spot is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the user who updated the tourist spot
       */
      updUserId: string;
    }
    export interface UserEntity {}
    export interface UserResponseDto {
      /**
       * User ID
       */
      userId: string;
      /**
       * Username
       */
      username: string;
      /**
       * Discord ID
       */
      discordId?: string;
      /**
       * Discord username
       */
      discordUsername?: string;
      /**
       * Twitter ID
       */
      twitterId?: string;
      /**
       * Twitter username
       */
      twitterUsername?: string;
      /**
       * Google email
       */
      googleEmail?: string;
      /**
       * Passport wallet address
       */
      passportWalletAddress?: string;
      /**
       * Perks wallet address
       */
      perksWalletAddress?: string;
      /**
       * Email
       */
      email?: string;
      /**
       * Premium status
       */
      isPremium: boolean;
      /**
       * Total quests completed
       */
      totalQuestCompleted: number;
      /**
       * Total travel distance
       */
      totalTravelDistance: number;
      /**
       * User role
       */
      role: 'USER' | 'MODERATOR' | 'ADMIN';
      /**
       * Registration date
       */
      registeredAt: any;
      /**
       * Discord joined date
       */
      discordJoinedAt: any;
      /**
       * Ban status
       */
      isBanned: boolean;
      /**
       * Flag to indicate if the record is deleted
       */
      delFlag?: boolean;
      /**
       * ID of user who created this record
       */
      insUserId?: string;
      /**
       * Timestamp of record creation
       */
      insDateTime?: string;
      /**
       * ID of user who last updated this record
       */
      updUserId?: string;
      /**
       * Timestamp of last record update
       */
      updDateTime?: string;
      /**
       * User info
       */
      userInfo?: {
        /**
         * User ID
         */
        userId: string;
        /**
         * Digital passport NFT address
         */
        digitalPassportAddress: string;
        /**
         * Log NFT address
         */
        logNftAddress: string;
        /**
         * Digital passport type
         */
        userDigitalPassportType?:
          | 'BONJIN'
          | 'AMATSUKAMI'
          | 'KUNITSUKAMI'
          | 'YOKAI';
        /**
         * User level
         */
        level?:
          | 'BONJIN'
          | 'E_CLASS_AMATSUKAMI'
          | 'E_CLASS_KUNITSUKAMI'
          | 'E_CLASS_YOKAI'
          | 'D_CLASS_AMATSUKAMI'
          | 'D_CLASS_KUNITSUKAMI'
          | 'D_CLASS_YOKAI'
          | 'C_CLASS_AMATSUKAMI'
          | 'C_CLASS_KUNITSUKAMI'
          | 'C_CLASS_YOKAI'
          | 'B_CLASS_AMATSUKAMI'
          | 'B_CLASS_KUNITSUKAMI'
          | 'B_CLASS_YOKAI'
          | 'A_CLASS_AMATSUKAMI'
          | 'A_CLASS_KUNITSUKAMI'
          | 'A_CLASS_YOKAI'
          | 'S_CLASS_AMATSUKAMI'
          | 'S_CLASS_KUNITSUKAMI'
          | 'S_CLASS_YOKAI';
        /**
         * User discount rate
         */
        discountRate?: number;
        /**
         * Magatama points balance
         */
        magatamaPoints: number;
        /**
         * Magatama bags count
         */
        magatamaBags?: number;
        /**
         * Total quests completed
         */
        totalQuestCompleted: number;
        /**
         * Total travel distance
         */
        totalTravelDistance: number;
        /**
         * Premium status
         */
        isPremium: boolean;
        /**
         * Prayer bead count
         */
        prayerBead?: number;
        /**
         * Sword count
         */
        sword?: number;
        /**
         * Orge mask count
         */
        orgeMask?: number;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      };
      /**
       * User achievements
       */
      userAchievements?: {
        /**
         * Achievement ID
         */
        userAchievementId: string;
        /**
         * User ID
         */
        userId: string;
        /**
         * Achievement name
         */
        achievementName: string;
        /**
         * Achievement description
         */
        achievementDesc?: string;
        /**
         * Icon URL
         */
        iconUrl?: string;
        /**
         * Achievement type
         */
        achievementType:
          | 'UNKNOWN'
          | 'STORY'
          | 'TRAVEL'
          | 'EXPLORE'
          | 'COMMUNITY'
          | 'MILESTONE';
        /**
         * Magatama points awarded
         */
        magatamaPointAwarded: number;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * User onchain items
       */
      userOnchainItems?: {
        /**
         * Onchain item ID
         */
        userOnchainItemId: string;
        /**
         * User ID
         */
        userId?: string;
        /**
         * Item type
         */
        itemType: 'UNKNOWN' | 'LOG_NFT' | 'DIGITAL_PASSPORT' | 'PERK';
        /**
         * Transaction hash
         */
        itemTxnHash: string;
        /**
         * Blockchain type
         */
        blockchainType: 'UNKNOWN' | 'VARA' | 'CAMINO';
        /**
         * Minted date
         */
        mintedAt?: any;
        /**
         * Onchain item ID
         */
        onchainItemId?: string;
        /**
         * Item status
         */
        status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'PENDING';
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * User item claim logs
       */
      userItemClaimLogs?: {
        /**
         * Item claim log ID
         */
        userItemClaimLogId: string;
        /**
         * User ID
         */
        userId: string;
        /**
         * Onchain item ID
         */
        onchainItemId?: string;
        /**
         * Offchain item name
         */
        offchainItemName?: string;
        /**
         * Item amount
         */
        itemAmount: number;
        /**
         * Item details
         */
        itemDetails?: string;
        /**
         * Item type
         */
        type: 'ONCHAIN' | 'OFFCHAIN';
        /**
         * Claimed date
         */
        claimedAt?: any;
        /**
         * Claim status
         */
        status: 'SUCCESS' | 'FAILED';
        /**
         * Error message
         */
        errorMsg?: string;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * User story logs
       */
      userStoryLogs?: {
        /**
         * Story log ID
         */
        userStoryLogId: string;
        /**
         * User ID
         */
        userId: string;
        /**
         * Story chapter ID
         */
        storyChapterId: string;
        /**
         * Story status
         */
        status: 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED';
        /**
         * Unlocked date
         */
        unlockedAt?: any;
        /**
         * Finished date
         */
        finishedAt?: any;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * User task logs
       */
      userTaskLogs?: {
        /**
         * Task log ID
         */
        userTaskLogId: string;
        /**
         * User ID
         */
        userId: string;
        /**
         * Quest ID
         */
        questId: string;
        /**
         * Task ID
         */
        taskId: string;
        /**
         * Task status
         */
        status: 'AVAILABLE' | 'ONGOING' | 'COMPLETED' | 'FAILED';
        /**
         * Task action type
         */
        action:
          | 'VISIT_LOCATION'
          | 'PHOTO_UPLOAD'
          | 'ANSWER_TEXT'
          | 'SELECT_OPTION'
          | 'SHARE_SOCIAL'
          | 'CHECK_IN'
          | 'GROUP_ACTIVITY'
          | 'LOCAL_INTERACTION';
        /**
         * User response
         */
        userResponse?: string;
        /**
         * Group activity members
         */
        groupActivityMembers: any[];
        /**
         * Submission data
         */
        submissionData?: any;
        /**
         * Failed reason
         */
        failedReason?: string;
        /**
         * Completed date
         */
        completedAt?: any;
        /**
         * Claimed date
         */
        claimedAt?: any;
        /**
         * Total magatama points awarded
         */
        totalMagatamaPointAwarded: number;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * User travel logs
       */
      userTravelLogs?: {
        /**
         * Travel log ID
         */
        userTravelLogId: string;
        /**
         * User ID
         */
        userId: string;
        /**
         * Quest ID
         */
        questId: string;
        /**
         * Task ID
         */
        taskId: string;
        /**
         * Tourist spot ID
         */
        touristSpotId: string;
        /**
         * User longitude
         */
        userLongitude: number;
        /**
         * User latitude
         */
        userLatitude: number;
        /**
         * Distance from target
         */
        travelDistanceFromTarget?: number;
        /**
         * Travel distance
         */
        travelDistance: number;
        /**
         * QR code value
         */
        qrCodeValue?: string;
        /**
         * Check-in method
         */
        checkInMethod?: 'QR_CODE' | 'GPS' | 'AUTO_DETECTED' | 'BACKGROUND_GPS';
        /**
         * Fraud detected
         */
        detectedFraud?: boolean;
        /**
         * Fraud reason
         */
        fraudReason?: string;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * Discord activity logs
       */
      discordActivityLogs?: {
        /**
         * Discord activity log ID
         */
        discordActivityLogId: string;
        /**
         * User ID
         */
        userId: string;
        /**
         * Activity type
         */
        activityType: string;
        /**
         * Activity details
         */
        activityDetails?: string;
        /**
         * Magatama points awarded
         */
        magatamaPointAwarded: number;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * Discord user roles
       */
      discordUserRoles?: {
        /**
         * Discord user roles ID
         */
        discordUserRolesId: string;
        /**
         * User ID
         */
        userId: string;
        /**
         * Role ID
         */
        roleId: string;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * Discord rewarded roles
       */
      discordRewardedRoles?: {
        /**
         * Discord rewarded roles ID
         */
        discordRewardedRolesId: string;
        /**
         * User ID
         */
        userId: string;
        /**
         * Role ID
         */
        roleId: string;
        /**
         * Magatama points awarded
         */
        magatamaPointAwarded: number;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * User invite logs
       */
      userInviteLogs?: {
        /**
         * Invite log ID
         */
        inviteLogId: string;
        /**
         * User ID
         */
        userId: string;
        /**
         * Invitee Discord ID
         */
        inviteeDiscordId?: string;
        /**
         * Invitee user ID
         */
        inviteeUserId?: string;
        /**
         * Magatama points awarded
         */
        magatamaPointAwarded: number;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
    }
    export interface UserSensitiveInfoResponseDto {
      /**
       * Password
       */
      password: string;
      /**
       * Refresh token
       */
      refreshToken?: string;
      /**
       * Encrypted private key
       */
      encryptedPrivateKey?: string;
      /**
       * Passport wallet address
       */
      passportWalletAddress?: string;
      /**
       * Perks wallet address
       */
      perksWalletAddress?: string;
      /**
       * Latest IP address
       */
      latestIpAddress?: string;
    }
    export interface UserTravelLogListResponseDto {
      /**
       * List of user travel log checkins
       */
      checkins: {
        /**
         * Travel log ID
         */
        userTravelLogId: string;
        /**
         * User ID
         */
        userId: string;
        /**
         * Quest ID
         */
        questId: string;
        /**
         * Task ID
         */
        taskId: string;
        /**
         * Tourist spot ID
         */
        touristSpotId: string;
        /**
         * User longitude
         */
        userLongitude: number;
        /**
         * User latitude
         */
        userLatitude: number;
        /**
         * Distance from target
         */
        travelDistanceFromTarget?: number;
        /**
         * Travel distance
         */
        travelDistance: number;
        /**
         * QR code value
         */
        qrCodeValue?: string;
        /**
         * Check-in method
         */
        checkInMethod?: 'QR_CODE' | 'GPS' | 'AUTO_DETECTED' | 'BACKGROUND_GPS';
        /**
         * Fraud detected
         */
        detectedFraud?: boolean;
        /**
         * Fraud reason
         */
        fraudReason?: string;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }[];
      /**
       * Pagination information
       */
      pagination: {
        /**
         * Current page number
         */
        currentPage: number;
        /**
         * Total number of pages
         */
        totalPages: number;
        /**
         * Total number of items
         */
        totalItems: number;
      };
    }
  }
}
declare namespace Paths {
  namespace TestControllerTestApiKey {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    namespace Responses {
      export interface $200 {
        /**
         * example:
         * API key is valid
         */
        message?: string;
      }
      export interface $401 {
        /**
         * example:
         * E_TB_010
         */
        code?: string;
        /**
         * example:
         * API key is required
         */
        message?: string;
        /**
         * example:
         * UNAUTHORIZED
         */
        type?: string;
      }
    }
  }
  namespace TestControllerTestHeaders {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    namespace Responses {
      export interface $200 {
        /**
         * example:
         * Check response headers
         */
        message?: string;
      }
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {
        /**
         * example:
         * E_TB_010
         */
        code?: string;
        /**
         * example:
         * API key is required
         */
        message?: string;
        /**
         * example:
         * UNAUTHORIZED
         */
        type?: string;
      }
    }
  }
  namespace TestControllerTestRateLimit {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    namespace Responses {
      export interface $200 {
        /**
         * example:
         * Rate limit test endpoint
         */
        message?: string;
      }
      export interface $401 {
        /**
         * example:
         * E_TB_010
         */
        code?: string;
        /**
         * example:
         * API key is required
         */
        message?: string;
        /**
         * example:
         * UNAUTHORIZED
         */
        type?: string;
      }
      export interface $429 {
        /**
         * example:
         * ThrottlerException: Too Many Requests
         */
        message?: string;
      }
    }
  }
  namespace TestControllerTestVersion {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    namespace Responses {
      export interface $200 {
        /**
         * example:
         * API version is supported
         */
        message?: string;
      }
      export interface $400 {
        /**
         * example:
         * E_TB_020
         */
        code?: string;
        /**
         * example:
         * Version header is required
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {
        /**
         * example:
         * E_TB_010
         */
        code?: string;
        /**
         * example:
         * API key is required
         */
        message?: string;
        /**
         * example:
         * UNAUTHORIZED
         */
        type?: string;
      }
    }
  }
  namespace TouriiBackendControllerCheckHealth {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    namespace Responses {
      /**
       * example:
       * OK
       */
      export type $201 = string;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerCompleteQrScanTask {
    export interface HeaderParameters {
      'x-user-id': Parameters.XUserId;
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type TaskId = string;
      export type XApiKey = string;
      export type XUserId = string;
    }
    export interface PathParameters {
      taskId: Parameters.TaskId;
    }
    export interface RequestBody {
      code: string; // ^[A-Za-z0-9_\-:./#]+$
      latitude?: number;
      longitude?: number;
    }
    namespace Responses {
      export type $200 = Components.Schemas.QrScanResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerCompleteSocialShareTask {
    export interface HeaderParameters {
      'x-user-id': Parameters.XUserId;
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type TaskId = string;
      export type XApiKey = string;
      export type XUserId = string;
    }
    export interface PathParameters {
      taskId: Parameters.TaskId;
    }
    export interface RequestBody {
      proofUrl: string; // uri
      /**
       * Optional latitude for location tracking
       */
      latitude?: number;
      /**
       * Optional longitude for location tracking
       */
      longitude?: number;
    }
    namespace Responses {
      export type $200 = Components.Schemas.QuestTaskSocialShareResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerCreateModelRoute {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    export interface RequestBody {
      /**
       * Unique identifier for the story
       */
      storyId: string;
      /**
       * Name of the model route
       */
      routeName: string;
      /**
       * Region of the model route
       */
      region: string;
      /**
       * Description of the region
       */
      regionDesc: string;
      /**
       * Background media of the region
       */
      regionBackgroundMedia: string;
      /**
       * Recommendation of the model route
       */
      recommendation: string[];
      /**
       * List of tourist spots in the model route
       */
      touristSpotList: {
        /**
         * Unique identifier for the story chapter
         */
        storyChapterId: string;
        /**
         * Name of the tourist spot
         */
        touristSpotName: string;
        /**
         * Description of the tourist spot
         */
        touristSpotDesc: string;
        /**
         * Best visit time of the tourist spot
         */
        bestVisitTime: string;
        /**
         * Hashtags associated with this location
         */
        touristSpotHashtag: string[];
        /**
         * Image set for the tourist spot
         */
        imageSet?: {
          /**
           * Main image of the tourist spot
           */
          main: string;
          /**
           * Small images of the tourist spot
           */
          small: string[];
        };
        /**
         * Address for enhanced search accuracy
         */
        address?: string;
      }[];
    }
    namespace Responses {
      export type $201 = Components.Schemas.ModelRouteResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerCreateQuest {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    export interface RequestBody {
      /**
       * Unique identifier for the tourist spot
       */
      touristSpotId: string;
      /**
       * Name of the quest
       */
      questName: string;
      /**
       * Description of the quest
       */
      questDesc: string;
      /**
       * URL to the quest image
       */
      questImage?: string;
      /**
       * Quest type
       */
      questType:
        | 'UNKNOWN'
        | 'TRAVEL_TO_EARN'
        | 'EARN_TO_TRAVEL'
        | 'CAMPAIGN'
        | 'COMMUNITY_EVENT';
      /**
       * Whether quest is unlocked
       */
      isUnlocked: boolean;
      /**
       * Whether quest is premium
       */
      isPremium: boolean;
      /**
       * Total Magatama points awarded
       */
      totalMagatamaPointAwarded: number;
      /**
       * Reward type
       */
      rewardType:
        | 'UNKNOWN'
        | 'LOCAL_EXPERIENCES'
        | 'CULINARY'
        | 'ADVENTURE_NATURE'
        | 'CULTURAL_COMMUNITY'
        | 'HIDDEN_PERKS'
        | 'SURPRISE_TREATS'
        | 'BONUS_UPGRADES'
        | 'SOCIAL_RECOGNITION'
        | 'RETURNING_VISITOR_BONUS'
        | 'ELITE_EXPERIENCES'
        | 'WELLNESS'
        | 'SHOPPING'
        | 'ENTERTAINMENT'
        | 'TRANSPORT_CONNECTIVITY'
        | 'LOCAL_PARTNERSHIPS';
      /**
       * Flag to indicate if the quest is deleted
       */
      delFlag: boolean;
    }
    namespace Responses {
      export type $201 = Components.Schemas.QuestResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerCreateQuestTask {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type QuestId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      questId: Parameters.QuestId;
    }
    export interface RequestBody {
      /**
       * Theme of the task
       */
      taskTheme:
        | 'STORY'
        | 'LOCAL_CULTURE'
        | 'FOOD'
        | 'URBAN_EXPLORE'
        | 'NATURE';
      /**
       * Type of the task
       */
      taskType:
        | 'VISIT_LOCATION'
        | 'PHOTO_UPLOAD'
        | 'ANSWER_TEXT'
        | 'SELECT_OPTION'
        | 'SHARE_SOCIAL'
        | 'CHECK_IN'
        | 'GROUP_ACTIVITY'
        | 'LOCAL_INTERACTION';
      /**
       * Name of the task
       */
      taskName: string;
      /**
       * Description of the task
       */
      taskDesc: string;
      /**
       * Whether task is unlocked
       */
      isUnlocked: boolean;
      /**
       * Action required to complete the task
       */
      requiredAction: string;
      /**
       * Members for group activities
       */
      groupActivityMembers?: any[];
      /**
       * Options for selection tasks
       */
      selectOptions?: any[];
      /**
       * Rules to prevent cheating
       */
      antiCheatRules: any;
      /**
       * Magatama points awarded for this task
       */
      magatamaPointAwarded: number;
      /**
       * Reward earned for this task
       */
      rewardEarned?: string;
    }
    namespace Responses {
      export type $201 = Components.Schemas.TaskResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerCreateStory {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    export type RequestBody = Components.Schemas.StoryCreateRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.StoryResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerCreateStoryChapter {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type StoryId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      storyId: Parameters.StoryId;
    }
    export type RequestBody = Components.Schemas.StoryChapterCreateRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.StoryChapterResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerCreateTouristSpot {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type RouteId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      routeId: Parameters.RouteId;
    }
    export interface RequestBody {
      /**
       * Unique identifier for the story chapter
       */
      storyChapterId: string;
      /**
       * Name of the tourist spot
       */
      touristSpotName: string;
      /**
       * Description of the tourist spot
       */
      touristSpotDesc: string;
      /**
       * Best visit time of the tourist spot
       */
      bestVisitTime: string;
      /**
       * Hashtags associated with this location
       */
      touristSpotHashtag: string[];
      /**
       * Image set for the tourist spot
       */
      imageSet?: {
        /**
         * Main image of the tourist spot
         */
        main: string;
        /**
         * Small images of the tourist spot
         */
        small: string[];
      };
      /**
       * Address for enhanced search accuracy
       */
      address?: string;
    }
    namespace Responses {
      export type $201 = Components.Schemas.TouristSpotResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerCreateUser {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    export type RequestBody = Components.Schemas.UserEntity;
    namespace Responses {
      export type $201 = Components.Schemas.UserEntity;
      export interface $400 {
        /**
         * example:
         * E_TB_006
         */
        code?: string;
        /**
         * example:
         * User already exists
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerDeleteModelRoute {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type RouteId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      routeId: Parameters.RouteId;
    }
    namespace Responses {
      export interface $204 {}
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerDeleteQuest {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type QuestId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      questId: Parameters.QuestId;
    }
    namespace Responses {
      export interface $204 {}
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerDeleteQuestTask {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type TaskId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      taskId: Parameters.TaskId;
    }
    namespace Responses {
      export interface $204 {}
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerDeleteStory {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type StoryId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      storyId: Parameters.StoryId;
    }
    namespace Responses {
      export interface $204 {}
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerDeleteStoryChapter {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type ChapterId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      chapterId: Parameters.ChapterId;
    }
    namespace Responses {
      export interface $204 {}
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerDeleteTouristSpot {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type TouristSpotId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      touristSpotId: Parameters.TouristSpotId;
    }
    namespace Responses {
      export interface $204 {}
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetAllUsersForAdmin {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-user-id': Parameters.XUserId;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type EndDate = string;
      export type IsBanned = string;
      export type IsPremium = string;
      export type Limit = number;
      export type Page = number;
      export type Role = 'USER' | 'MODERATOR' | 'ADMIN';
      export type SearchTerm = string;
      export type SortBy =
        | 'username'
        | 'registered_at'
        | 'total_quest_completed'
        | 'total_travel_distance';
      export type SortOrder = 'asc' | 'desc';
      export type StartDate = string;
      export type XApiKey = string;
      export type XUserId = string;
    }
    export interface QueryParameters {
      sortOrder?: Parameters.SortOrder;
      sortBy?: Parameters.SortBy;
      endDate?: Parameters.EndDate;
      startDate?: Parameters.StartDate;
      isBanned?: Parameters.IsBanned;
      isPremium?: Parameters.IsPremium;
      role?: Parameters.Role;
      searchTerm?: Parameters.SearchTerm;
      limit?: Parameters.Limit;
      page?: Parameters.Page;
    }
    namespace Responses {
      export type $200 = Components.Schemas.AdminUserListResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetCheckins {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-user-id': Parameters.XUserId;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type EndDate = string;
      export type Limit = number;
      export type Page = number;
      export type QuestId = string;
      export type StartDate = string;
      export type TouristSpotId = string;
      export type UserId = string;
      export type XApiKey = string;
      export type XUserId = string;
    }
    export interface QueryParameters {
      endDate?: Parameters.EndDate;
      startDate?: Parameters.StartDate;
      touristSpotId?: Parameters.TouristSpotId;
      questId?: Parameters.QuestId;
      userId?: Parameters.UserId;
      limit?: Parameters.Limit;
      page?: Parameters.Page;
    }
    namespace Responses {
      export type $200 = Components.Schemas.UserTravelLogListResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetGroupMembers {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type QuestId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      questId: Parameters.QuestId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.GroupMembersResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetHomepageHighlights {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    namespace Responses {
      export type $200 = Components.Schemas.HomepageHighlightsResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetLocationInfo {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type Address = string;
      export type Latitude = string;
      export type Longitude = string;
      export type Query = string;
      export type XApiKey = string;
    }
    export interface QueryParameters {
      address?: Parameters.Address;
      longitude?: Parameters.Longitude;
      latitude?: Parameters.Latitude;
      query: Parameters.Query;
    }
    namespace Responses {
      export type $200 = Components.Schemas.LocationInfoResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetMoments {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type Limit = number;
      export type Page = number;
      export type XApiKey = string;
    }
    export interface QueryParameters {
      limit?: Parameters.Limit;
      page?: Parameters.Page;
    }
    namespace Responses {
      export type $200 = Components.Schemas.MomentListResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetPendingSubmissions {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-user-id': Parameters.XUserId;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type Limit = number;
      export type Page = number;
      export type TaskType = 'PHOTO_UPLOAD' | 'SHARE_SOCIAL' | 'ANSWER_TEXT';
      export type XApiKey = string;
      export type XUserId = string;
    }
    export interface QueryParameters {
      page?: Parameters.Page;
      limit?: Parameters.Limit;
      taskType?: Parameters.TaskType;
    }
    namespace Responses {
      export interface $200 {}
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetQuestById {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type QuestId = string;
      export type UserId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      questId: Parameters.QuestId;
    }
    export interface QueryParameters {
      userId?: Parameters.UserId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.QuestResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetQuestByTouristSpotId {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type Latitude = number;
      export type Longitude = number;
      export type TouristSpotId = string;
      export type UserId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      touristSpotId: Parameters.TouristSpotId;
    }
    export interface QueryParameters {
      userId?: Parameters.UserId;
      latitude?: Parameters.Latitude;
      longitude?: Parameters.Longitude;
    }
    namespace Responses {
      export type $200 = Components.Schemas.QuestResponseDto[];
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetQuestList {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type IsPremium = boolean;
      export type IsUnlocked = boolean;
      export type Limit = number;
      export type Page = number;
      export type QuestType =
        | 'UNKNOWN'
        | 'TRAVEL_TO_EARN'
        | 'EARN_TO_TRAVEL'
        | 'CAMPAIGN'
        | 'COMMUNITY_EVENT';
      export type UserId = string;
      export type XApiKey = string;
    }
    export interface QueryParameters {
      userId?: Parameters.UserId;
      questType?: Parameters.QuestType;
      isUnlocked?: Parameters.IsUnlocked;
      isPremium?: Parameters.IsPremium;
      limit?: Parameters.Limit;
      page?: Parameters.Page;
    }
    namespace Responses {
      export type $200 = Components.Schemas.QuestListResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetRouteById {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type Id = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.ModelRouteResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetRoutes {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    namespace Responses {
      export type $200 = Components.Schemas.ModelRouteResponseDto[];
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetSagas {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    namespace Responses {
      export type $200 = Components.Schemas.StoryResponseDto[];
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetStoryChaptersByStoryId {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type StoryId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      storyId: Parameters.StoryId;
    }
    namespace Responses {
      export interface $200 {
        /**
         * Unique identifier for the story
         */
        storyId: string;
        /**
         * Unique identifier for the tourist spot
         */
        touristSpotId: string;
        /**
         * Unique identifier for the story chapter
         */
        storyChapterId: string;
        /**
         * Name of the saga
         */
        sagaName: string;
        /**
         * Chapter number or position
         */
        chapterNumber: string;
        /**
         * Title of the chapter
         */
        chapterTitle: string;
        /**
         * Detailed description of the chapter
         */
        chapterDesc: string;
        /**
         * URL to the fictional chapter image
         */
        chapterImage: string;
        /**
         * List of character names involved in the chapter
         */
        characterNameList: string[];
        /**
         * URL to the real-world location image
         */
        realWorldImage: string;
        /**
         * URL to the chapter video for desktop viewing
         */
        chapterVideoUrl: string;
        /**
         * URL to the chapter video optimized for mobile
         */
        chapterVideoMobileUrl: string;
        /**
         * URL to the downloadable PDF version
         */
        chapterPdfUrl: string;
        /**
         * Whether the chapter is available to users without prerequisites
         */
        isUnlocked: boolean;
        /**
         * Flag to indicate if the record is deleted
         */
        delFlag?: boolean;
        /**
         * ID of user who created this record
         */
        insUserId?: string;
        /**
         * Timestamp of record creation
         */
        insDateTime?: string;
        /**
         * ID of user who last updated this record
         */
        updUserId?: string;
        /**
         * Timestamp of last record update
         */
        updDateTime?: string;
      }
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetTouristSpotsByChapterId {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type StoryChapterId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      storyChapterId: Parameters.StoryChapterId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.TouristSpotResponseDto[];
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerGetUserSensitiveInfo {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-user-id': Parameters.XUserId;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
      export type XUserId = string;
    }
    namespace Responses {
      export type $200 = Components.Schemas.UserSensitiveInfoResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerHandleStoryAction {
    export interface HeaderParameters {
      'X-Story-Action': Parameters.XStoryAction;
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type ChapterId = string;
      export type UserId = string;
      export type XApiKey = string;
      export type XStoryAction = 'start' | 'complete' | 'progress';
    }
    export interface PathParameters {
      chapterId: Parameters.ChapterId;
    }
    export interface QueryParameters {
      userId?: Parameters.UserId;
    }
    export interface RequestBody {
      /**
       * ID of the user performing the story action
       */
      userId: string;
    }
    namespace Responses {
      export type $200 =
        | {
            success?: boolean;
            message?: string;
          }
        | {
            /**
             * Whether the story completion was successful
             */
            success: boolean;
            /**
             * Success or error message
             */
            message: string;
            /**
             * Story progress information
             */
            storyProgress: {
              /**
               * ID of the completed story chapter
               */
              storyChapterId: string;
              /**
               * Title of the completed chapter
               */
              chapterTitle: string;
              /**
               * Current story status
               */
              status: 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED';
              /**
               * Timestamp when the story was completed
               */
              completedAt: null;
            };
            /**
             * List of quests unlocked by completing this story
             */
            unlockedQuests: {
              /**
               * ID of the unlocked quest
               */
              questId: string;
              /**
               * Name of the unlocked quest
               */
              questName: string;
              /**
               * Description of the unlocked quest
               */
              questDesc: string;
              /**
               * Image URL for the quest
               */
              questImage: string | null;
              /**
               * Name of the tourist spot where the quest is located
               */
              touristSpotName: string;
              /**
               * Total magatama points awarded for completing this quest
               */
              totalMagatamaPointAwarded: number;
              /**
               * Whether this is a premium quest
               */
              isPremium: boolean;
            }[];
            /**
             * Rewards earned from story completion
             */
            rewards: {
              /**
               * Total magatama points earned from story completion and achievements
               */
              magatamaPointsEarned: number;
              /**
               * List of achievement names unlocked
               */
              achievementsUnlocked: string[];
            };
          }
        | {
            /**
             * ID of the story chapter
             */
            storyChapterId: string;
            /**
             * Current reading status
             */
            status: 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED';
            /**
             * Timestamp when the user started reading
             */
            unlockedAt: null;
            /**
             * Timestamp when the user finished reading
             */
            finishedAt: null;
            /**
             * Whether the user can start reading this chapter
             */
            canStart: boolean;
            /**
             * Whether the user can complete this chapter
             */
            canComplete: boolean;
          };
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerLogin {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    export type RequestBody = Components.Schemas.LoginRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.UserEntity;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
      export interface $404 {
        /**
         * example:
         * E_TB_004
         */
        code?: string;
        /**
         * example:
         * User is not registered
         */
        message?: string;
        /**
         * example:
         * UNAUTHORIZED
         */
        type?: string;
      }
    }
  }
  namespace TouriiBackendControllerMarkChapterProgress {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type ChapterId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      chapterId: Parameters.ChapterId;
    }
    export interface RequestBody {
      /**
       * ID of the user reading the chapter
       */
      userId: string;
      /**
       * Current story status
       */
      status: 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED';
      /**
       * Optional latitude for location tracking
       */
      latitude?: number;
      /**
       * Optional longitude for location tracking
       */
      longitude?: number;
    }
    namespace Responses {
      export interface $201 {}
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerMe {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-user-id': Parameters.XUserId;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
      export type XUserId = string;
    }
    namespace Responses {
      export type $200 = Components.Schemas.UserResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_001
         */
        code?: string;
        /**
         * example:
         * Bad Request
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
      export interface $404 {
        /**
         * example:
         * E_TB_004
         */
        code?: string;
        /**
         * example:
         * User is not registered
         */
        message?: string;
        /**
         * example:
         * UNAUTHORIZED
         */
        type?: string;
      }
    }
  }
  namespace TouriiBackendControllerSignup {
    export type RequestBody = Components.Schemas.AuthSignupRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.AuthSignupResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_001
         */
        code?: string;
        /**
         * example:
         * Bad Request
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerStartGroupQuest {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type QuestId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      questId: Parameters.QuestId;
    }
    export interface RequestBody {
      /**
       * User ID of the quest leader starting the quest
       */
      userId: string;
      /**
       * Optional latitude for location tracking
       */
      latitude?: number;
      /**
       * Optional longitude for location tracking
       */
      longitude?: number;
    }
    namespace Responses {
      export type $200 = Components.Schemas.StartGroupQuestResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerSubmitAnswerTextTask {
    export interface HeaderParameters {
      'x-user-id': Parameters.XUserId;
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type TaskId = string;
      export type XApiKey = string;
      export type XUserId = string;
    }
    export interface PathParameters {
      taskId: Parameters.TaskId;
    }
    export type RequestBody = Components.Schemas.SubmitAnswerTextRequestTaskDto;
    namespace Responses {
      export type $200 = Components.Schemas.SubmitTaskResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerSubmitCheckInTask {
    export interface HeaderParameters {
      'x-user-id': Parameters.XUserId;
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type TaskId = string;
      export type XApiKey = string;
      export type XUserId = string;
    }
    export interface PathParameters {
      taskId: Parameters.TaskId;
    }
    export type RequestBody = Components.Schemas.SubmitCheckInTaskRequestDto;
    namespace Responses {
      export type $200 = Components.Schemas.SubmitTaskResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerSubmitSelectOptionTask {
    export interface HeaderParameters {
      'x-user-id': Parameters.XUserId;
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type TaskId = string;
      export type XApiKey = string;
      export type XUserId = string;
    }
    export interface PathParameters {
      taskId: Parameters.TaskId;
    }
    export type RequestBody =
      Components.Schemas.SubmitSelectOptionsTaskRequestDto;
    namespace Responses {
      export type $200 = Components.Schemas.SubmitTaskResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerUpdateModelRoute {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    export interface RequestBody {
      /**
       * Unique identifier for the story
       */
      storyId: string;
      /**
       * Name of the model route
       */
      routeName: string;
      /**
       * Region of the model route
       */
      region: string;
      /**
       * Description of the region
       */
      regionDesc: string;
      /**
       * Background media of the region
       */
      regionBackgroundMedia: string;
      /**
       * Recommendation of the model route
       */
      recommendation: string[];
      /**
       * List of tourist spots in the model route
       */
      touristSpotList: {
        /**
         * Unique identifier for the story chapter
         */
        storyChapterId: string;
        /**
         * Name of the tourist spot
         */
        touristSpotName: string;
        /**
         * Description of the tourist spot
         */
        touristSpotDesc: string;
        /**
         * Best visit time of the tourist spot
         */
        bestVisitTime: string;
        /**
         * Hashtags associated with this location
         */
        touristSpotHashtag: string[];
        /**
         * Image set for the tourist spot
         */
        imageSet?: {
          /**
           * Main image of the tourist spot
           */
          main: string;
          /**
           * Small images of the tourist spot
           */
          small: string[];
        };
        /**
         * Address for enhanced search accuracy
         */
        address?: string;
        /**
         * Unique identifier for the tourist spot
         */
        touristSpotId: string;
        /**
         * Flag to indicate if the tourist spot is deleted
         */
        delFlag: boolean;
        /**
         * Unique identifier for the user who updated the tourist spot
         */
        updUserId: string;
      }[];
      /**
       * Unique identifier for the model route
       */
      modelRouteId: string;
      /**
       * Flag to indicate if the model route is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the user who updated the model route
       */
      updUserId: string;
    }
    namespace Responses {
      export type $201 = Components.Schemas.ModelRouteResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerUpdateQuest {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    export interface RequestBody {
      /**
       * Unique identifier for the tourist spot
       */
      touristSpotId: string;
      /**
       * Name of the quest
       */
      questName: string;
      /**
       * Description of the quest
       */
      questDesc: string;
      /**
       * URL to the quest image
       */
      questImage?: string;
      /**
       * Quest type
       */
      questType:
        | 'UNKNOWN'
        | 'TRAVEL_TO_EARN'
        | 'EARN_TO_TRAVEL'
        | 'CAMPAIGN'
        | 'COMMUNITY_EVENT';
      /**
       * Whether quest is unlocked
       */
      isUnlocked: boolean;
      /**
       * Whether quest is premium
       */
      isPremium: boolean;
      /**
       * Total Magatama points awarded
       */
      totalMagatamaPointAwarded: number;
      /**
       * Reward type
       */
      rewardType:
        | 'UNKNOWN'
        | 'LOCAL_EXPERIENCES'
        | 'CULINARY'
        | 'ADVENTURE_NATURE'
        | 'CULTURAL_COMMUNITY'
        | 'HIDDEN_PERKS'
        | 'SURPRISE_TREATS'
        | 'BONUS_UPGRADES'
        | 'SOCIAL_RECOGNITION'
        | 'RETURNING_VISITOR_BONUS'
        | 'ELITE_EXPERIENCES'
        | 'WELLNESS'
        | 'SHOPPING'
        | 'ENTERTAINMENT'
        | 'TRANSPORT_CONNECTIVITY'
        | 'LOCAL_PARTNERSHIPS';
      /**
       * Flag to indicate if the quest is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the quest
       */
      questId: string;
      /**
       * Unique identifier for the user who updated the quest
       */
      updUserId: string;
      /**
       * List of tasks for the quest
       */
      taskList?: {
        /**
         * Theme of the task
         */
        taskTheme:
          | 'STORY'
          | 'LOCAL_CULTURE'
          | 'FOOD'
          | 'URBAN_EXPLORE'
          | 'NATURE';
        /**
         * Type of the task
         */
        taskType:
          | 'VISIT_LOCATION'
          | 'PHOTO_UPLOAD'
          | 'ANSWER_TEXT'
          | 'SELECT_OPTION'
          | 'SHARE_SOCIAL'
          | 'CHECK_IN'
          | 'GROUP_ACTIVITY'
          | 'LOCAL_INTERACTION';
        /**
         * Name of the task
         */
        taskName: string;
        /**
         * Description of the task
         */
        taskDesc: string;
        /**
         * Whether task is unlocked
         */
        isUnlocked: boolean;
        /**
         * Action required to complete the task
         */
        requiredAction: string;
        /**
         * Members for group activities
         */
        groupActivityMembers?: any[];
        /**
         * Options for selection tasks
         */
        selectOptions?: any[];
        /**
         * Rules to prevent cheating
         */
        antiCheatRules: any;
        /**
         * Magatama points awarded for this task
         */
        magatamaPointAwarded: number;
        /**
         * Reward earned for this task
         */
        rewardEarned?: string;
        /**
         * Unique identifier for the task
         */
        taskId: string;
        /**
         * Flag to indicate if the task is deleted
         */
        delFlag: boolean;
        /**
         * Unique identifier for the user who updated the task
         */
        updUserId: string;
      }[];
    }
    namespace Responses {
      export type $201 = Components.Schemas.QuestResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerUpdateQuestTask {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    export interface RequestBody {
      /**
       * Theme of the task
       */
      taskTheme:
        | 'STORY'
        | 'LOCAL_CULTURE'
        | 'FOOD'
        | 'URBAN_EXPLORE'
        | 'NATURE';
      /**
       * Type of the task
       */
      taskType:
        | 'VISIT_LOCATION'
        | 'PHOTO_UPLOAD'
        | 'ANSWER_TEXT'
        | 'SELECT_OPTION'
        | 'SHARE_SOCIAL'
        | 'CHECK_IN'
        | 'GROUP_ACTIVITY'
        | 'LOCAL_INTERACTION';
      /**
       * Name of the task
       */
      taskName: string;
      /**
       * Description of the task
       */
      taskDesc: string;
      /**
       * Whether task is unlocked
       */
      isUnlocked: boolean;
      /**
       * Action required to complete the task
       */
      requiredAction: string;
      /**
       * Members for group activities
       */
      groupActivityMembers?: any[];
      /**
       * Options for selection tasks
       */
      selectOptions?: any[];
      /**
       * Rules to prevent cheating
       */
      antiCheatRules: any;
      /**
       * Magatama points awarded for this task
       */
      magatamaPointAwarded: number;
      /**
       * Reward earned for this task
       */
      rewardEarned?: string;
      /**
       * Unique identifier for the task
       */
      taskId: string;
      /**
       * Flag to indicate if the task is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the user who updated the task
       */
      updUserId: string;
    }
    namespace Responses {
      export type $201 = Components.Schemas.TaskResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerUpdateStory {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    export interface RequestBody {
      /**
       * Name of the story saga (e.g., 'Prologue', 'Bungo Ono')
       */
      sagaName: string;
      /**
       * Detailed description of the saga's narrative
       */
      sagaDesc: string;
      /**
       * URL to the saga's cover media (image or video)
       */
      backgroundMedia: string;
      /**
       * URL to the map image for the saga
       */
      mapImage?: string;
      /**
       * Real-world location of the saga (e.g., 'Tokyo')
       */
      location?: string;
      /**
       * Display order in the saga list
       */
      order: number;
      /**
       * Whether the saga is a prologue
       */
      isPrologue: boolean;
      /**
       * Whether the saga is selected by default
       */
      isSelected: boolean;
      /**
       * List of chapters
       */
      chapterList: {
        /**
         * Unique identifier for the tourist spot
         */
        touristSpotId: string;
        /**
         * Chapter number or position (e.g., 'Prologue', 'Chapter 1')
         */
        chapterNumber: string;
        /**
         * Title of the story chapter
         */
        chapterTitle: string;
        /**
         * Detailed description or content of the story
         */
        chapterDesc: string;
        /**
         * URL to the fictional chapter image
         */
        chapterImage: string;
        /**
         * List of character names involved in the chapter
         */
        characterNameList: string[];
        /**
         * URL to the real-world location image
         */
        realWorldImage: string;
        /**
         * URL to the chapter video for desktop viewing
         */
        chapterVideoUrl: string;
        /**
         * URL to the chapter video optimized for mobile
         */
        chapterVideoMobileUrl: string;
        /**
         * URL to the downloadable PDF version
         */
        chapterPdfUrl: string;
        /**
         * Whether the chapter is available to users without prerequisites
         */
        isUnlocked: boolean;
        /**
         * Unique identifier for the story chapter
         */
        storyChapterId: string;
        /**
         * Flag to indicate if the story chapter is deleted
         */
        delFlag: boolean;
        /**
         * Unique identifier for the user who updated the story chapter
         */
        updUserId: string;
      }[];
      /**
       * Unique identifier for the story saga
       */
      sagaId: string;
      /**
       * Flag to indicate if the story saga is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the user who updated the story saga
       */
      updUserId: string;
    }
    namespace Responses {
      export type $201 = Components.Schemas.StoryResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerUpdateStoryChapter {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    export interface RequestBody {
      /**
       * Unique identifier for the tourist spot
       */
      touristSpotId: string;
      /**
       * Chapter number or position (e.g., 'Prologue', 'Chapter 1')
       */
      chapterNumber: string;
      /**
       * Title of the story chapter
       */
      chapterTitle: string;
      /**
       * Detailed description or content of the story
       */
      chapterDesc: string;
      /**
       * URL to the fictional chapter image
       */
      chapterImage: string;
      /**
       * List of character names involved in the chapter
       */
      characterNameList: string[];
      /**
       * URL to the real-world location image
       */
      realWorldImage: string;
      /**
       * URL to the chapter video for desktop viewing
       */
      chapterVideoUrl: string;
      /**
       * URL to the chapter video optimized for mobile
       */
      chapterVideoMobileUrl: string;
      /**
       * URL to the downloadable PDF version
       */
      chapterPdfUrl: string;
      /**
       * Whether the chapter is available to users without prerequisites
       */
      isUnlocked: boolean;
      /**
       * Unique identifier for the story chapter
       */
      storyChapterId: string;
      /**
       * Flag to indicate if the story chapter is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the user who updated the story chapter
       */
      updUserId: string;
    }
    namespace Responses {
      export type $201 = Components.Schemas.StoryChapterResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerUpdateTouristSpot {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
    export interface RequestBody {
      /**
       * Unique identifier for the story chapter
       */
      storyChapterId: string;
      /**
       * Name of the tourist spot
       */
      touristSpotName: string;
      /**
       * Description of the tourist spot
       */
      touristSpotDesc: string;
      /**
       * Best visit time of the tourist spot
       */
      bestVisitTime: string;
      /**
       * Hashtags associated with this location
       */
      touristSpotHashtag: string[];
      /**
       * Image set for the tourist spot
       */
      imageSet?: {
        /**
         * Main image of the tourist spot
         */
        main: string;
        /**
         * Small images of the tourist spot
         */
        small: string[];
      };
      /**
       * Address for enhanced search accuracy
       */
      address?: string;
      /**
       * Unique identifier for the tourist spot
       */
      touristSpotId: string;
      /**
       * Flag to indicate if the tourist spot is deleted
       */
      delFlag: boolean;
      /**
       * Unique identifier for the user who updated the tourist spot
       */
      updUserId: string;
    }
    namespace Responses {
      export type $201 = Components.Schemas.TouristSpotResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerUploadTaskPhoto {
    export interface HeaderParameters {
      'x-user-id': Parameters.XUserId;
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type TaskId = string;
      export type XApiKey = string;
      export type XUserId = string;
    }
    export interface PathParameters {
      taskId: Parameters.TaskId;
    }
    export interface RequestBody {
      file?: string; // binary
    }
    namespace Responses {
      export type $200 = Components.Schemas.QuestTaskPhotoUploadResponseDto;
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
  namespace TouriiBackendControllerVerifySubmission {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-user-id': Parameters.XUserId;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type Id = string;
      export type XApiKey = string;
      export type XUserId = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export interface $200 {}
      export interface $400 {
        /**
         * example:
         * E_TB_021
         */
        code?: string;
        /**
         * example:
         * Invalid version format
         */
        message?: string;
        /**
         * example:
         * BAD_REQUEST
         */
        type?: string;
      }
      export interface $401 {}
    }
  }
}
