/**
 * Constants for AI Route Recommendation System
 * Centralizes magic numbers and configuration values
 */

export const AI_ROUTE_LIMITS = {
    MAX_KEYWORDS: 10,
    MAX_KEYWORD_LENGTH: 50,
    MAX_ROUTES: 20,
    MAX_ROUTES_DEFAULT: 5,
    MAX_HASHTAGS_FOR_PROMPT: 50,
    SAMPLE_HASHTAGS_FOR_LOGGING: 10,
    TOP_HASHTAGS_LIMIT: 20,
    MAX_EXPANSIONS_DEFAULT: 15,
    EXISTING_ROUTES_LIMIT: 10,
} as const;

export const CLUSTERING_DEFAULTS = {
    PROXIMITY_RADIUS_KM: 50,
    MIN_SPOTS_PER_CLUSTER: 2,
    MAX_SPOTS_PER_CLUSTER: 8,
} as const;

export const OPENAI_CONFIG = {
    MODEL_DEFAULT: 'gpt-4o-mini',
    TEMPERATURE: 0.3,
    MAX_TOKENS: 1000,
} as const;

/**
 * Japanese Prefecture Coordinate Boundaries
 * Used for region detection from GPS coordinates
 */
export const PREFECTURE_BOUNDARIES = {
    TOKYO: {
        latMin: 35.0,
        latMax: 36.0,
        lngMin: 139.0,
        lngMax: 140.0,
    },
    OSAKA: {
        latMin: 34.5,
        latMax: 35.5,
        lngMin: 135.0,
        lngMax: 136.0,
    },
    KYOTO: {
        latMin: 34.8,
        latMax: 35.5,
        lngMin: 135.5,
        lngMax: 136.0,
    },
    HOKKAIDO: {
        latMin: 43.0,
        latMax: 45.5,
        lngMin: 139.0,
        lngMax: 146.0,
    },
    OITA: {
        latMin: 32.0,
        latMax: 34.0,
        lngMin: 130.0,
        lngMax: 132.0,
    },
} as const;

/**
 * Fallback region images for different prefectures
 */
export const REGION_FALLBACK_IMAGES = {
    Kanto: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop',
    Kansai: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop',
    Chubu: 'https://images.unsplash.com/photo-1605816626069-40d9da29dded?w=1920&h=1080&fit=crop',
    Tohoku: 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=1920&h=1080&fit=crop',
    Kyushu: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920&h=1080&fit=crop',
    Chugoku: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=1920&h=1080&fit=crop',
    Shikoku: 'https://images.unsplash.com/photo-1563787263-026ba78cac1b?w=1920&h=1080&fit=crop',
    Hokkaido: 'https://images.unsplash.com/photo-1551524164-6ca04ac833fb?w=1920&h=1080&fit=crop',
    Tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop',
    Osaka: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop',
    Kyoto: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop',
    Oita: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920&h=1080&fit=crop',
} as const;

/**
 * Common tourism keyword mappings for fallback expansion
 */
export const TOURISM_KEYWORD_MAPPINGS = {
    food: ['ramen', 'sushi', 'yakitori', 'restaurant', 'cuisine', '食べ物', 'グルメ'],
    temple: ['shrine', 'buddhist', 'sacred', 'religious', '寺', '神社'],
    nature: ['hiking', 'mountain', 'forest', 'park', '自然', 'ハイキング'],
    'hot spring': ['onsen', 'spa', 'thermal', '温泉', '湯'],
    culture: ['traditional', 'history', 'museum', 'art', '文化', '伝統'],
    festival: ['matsuri', 'celebration', 'event', '祭り', 'イベント'],
    shopping: ['market', 'souvenir', 'store', '買い物', 'ショッピング'],
    nightlife: ['bar', 'entertainment', 'night', '夜', 'バー'],
} as const;

/**
 * Semantic keyword mappings for intelligent matching
 */
export const SEMANTIC_MAPPINGS = {
    food: ['ramen', 'sushi', 'restaurant', 'dining', 'cuisine'],
    water: ['waterfall', 'river', 'lake', 'spring'],
    spiritual: ['shrine', 'temple', 'sacred', 'religious'],
    nature: ['mountain', 'forest', 'park', 'hiking'],
    activity: ['rafting', 'climbing', 'hiking', 'adventure'],
} as const;

/**
 * Common algorithm identifiers
 */
export const ALGORITHM_VERSIONS = {
    AI_CLUSTERING_V1: 'ai-clustering-v1',
    KEYWORD_EXPANSION_V1: 'keyword-expansion-v1',
} as const;
