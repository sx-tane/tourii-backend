declare namespace Components {
  namespace Schemas {
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
    export interface UserEntity {}
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
  namespace TouriiBackendControllerCreateTouristSpot {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type ModelRouteId = string;
      export type XApiKey = string;
    }
    export interface PathParameters {
      modelRouteId: Parameters.ModelRouteId;
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
  namespace TouriiBackendControllerGetUserByUserId {
    export interface HeaderParameters {
      'accept-version': Parameters.AcceptVersion;
      'x-api-key': Parameters.XApiKey;
    }
    namespace Parameters {
      export type AcceptVersion = string;
      export type XApiKey = string;
    }
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
}
