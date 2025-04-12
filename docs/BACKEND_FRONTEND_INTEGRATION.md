# Backend-Frontend Integration Guide

## Overview

This document outlines the integration points between the Tourii backend and frontend systems, ensuring seamless communication and consistent user experience across the platform.

## API Architecture

### Version Control

The API uses header-based versioning to maintain compatibility while allowing for future changes.

```typescript
// API versions
export const API_VERSIONS = {
  V1: '1.0',
  V2: '2.0'
} as const;

// Version type
export type ApiVersion = typeof API_VERSIONS[keyof typeof API_VERSIONS];
```

### Base Configuration

```typescript
// Base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// API prefix
const API_PREFIX = '/tourii-backend';

// API Client factory with version support
const createApiClient = (version: ApiVersion = API_VERSIONS.V1) => axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
    'x-api-version': version,
    'Accept': `application/vnd.tourii.${version}+json`
  },
});

// Default API client (V1)
const apiClient = createApiClient(API_VERSIONS.V1);

// Request interceptor for authentication and versioning
apiClient.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor with version handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 410) {
      // Handle version deprecation
      console.warn('API version is deprecated. Please upgrade.');
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('apiKey');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
```

### Version Headers

All API requests should include the following headers:

```typescript
interface ApiHeaders {
  'Content-Type': 'application/json';
  'x-api-key': string;
  'x-api-version': ApiVersion;
  'Accept': string; // Format: application/vnd.tourii.{version}+json
}
```

### Version Support Policy

- Each API version is supported for at least 12 months after a new version is released
- Deprecated versions will return a 410 Gone status code
- Version deprecation notices will be sent via response headers
- Emergency security fixes may be applied to all supported versions

### Authentication Flow

```typescript
// Authentication endpoints
const AUTH_ENDPOINTS = {
  login: `${API_PREFIX}/auth/login`,
  register: `${API_PREFIX}/auth/register`,
  refresh: `${API_PREFIX}/auth/refresh`,
  logout: `${API_PREFIX}/auth/logout`,
  // Social auth endpoints
  discord: `${API_PREFIX}/auth/discord`,
  twitter: `${API_PREFIX}/auth/twitter`,
  google: `${API_PREFIX}/auth/google`,
  // API Key management
  apiKeys: `${API_PREFIX}/auth/api-keys`,
  rotateKey: `${API_PREFIX}/auth/api-keys/rotate`,
};

// API Key management functions
const apiKeyService = {
  async generateKey(permissions: string[]): Promise<ApiKeyConfig> {
    const response = await apiClient.post(AUTH_ENDPOINTS.apiKeys, {
      permissions,
    });
    return response.data;
  },

  async rotateKey(oldKey: string): Promise<ApiKeyConfig> {
    const response = await apiClient.post(AUTH_ENDPOINTS.rotateKey, { oldKey });
    return response.data;
  },

  async validateKey(key: string): Promise<boolean> {
    try {
      await apiClient.get(`${AUTH_ENDPOINTS.apiKeys}/validate`, {
        headers: { 'x-api-key': key },
      });
      return true;
    } catch (error) {
      return false;
    }
  },
};
```

## API Endpoints

### 1. Authentication & User Management

- **Base Path**: `/tourii-backend/auth`
- **Version Header**: `x-api-version: 1.0`
- **Endpoints**:
  - `POST /register` - User registration with wallet
  - `POST /login` - User login
  - `POST /login/wallet` - Web3 wallet login
  - `POST /refresh` - Token refresh
  - `POST /logout` - User logout
  - `POST /social/{provider}` - Social authentication
  - `GET /nonce` - Get nonce for wallet signature
  - `POST /verify-signature` - Verify wallet signature

### 2. User Profile & Settings

- **Base Path**: `/tourii-backend/users`
- **Endpoints**:
  - `GET /me` - Get current user profile
  - `PUT /me` - Update user profile
  - `GET /me/wallet` - Get user wallet info

### 3. Story System

- **Base Path**: `/tourii-backend/stories`
- **Endpoints**:
  - `GET /sagas` - List all story sagas
  - `GET /sagas/{id}` - Get saga details
  - `GET /sagas/{id}/chapters` - List chapters in saga
  - `GET /chapters/{id}` - Get chapter details
  - `GET /chapters/{id}/content` - Get chapter content
  - `POST /chapters/{id}/progress` - Update reading progress
  - `GET /chapters/{id}/characters` - Get chapter characters
  - `GET /chapters/{id}/locations` - Get related locations

### 4. Model Routes

- **Base Path**: `/tourii-backend/routes`
- **Endpoints**:
  - `GET /regions` - List available regions
  - `GET /regions/{id}/weather` - Get region weather
  - `GET /routes` - List all routes
  - `GET /routes/{id}` - Get route details
  - `GET /routes/{id}/spots` - Get tourist spots in route
  - `GET /routes/{id}/recommendations` - Get route recommendations
  - `GET /routes/{id}/weather` - Get route weather info

### 5. Quest System

- **Base Path**: `/tourii-backend/quests`
- **Endpoints**:
  - `GET /` - List available quests
  - `GET /{id}` - Get quest details
  - `GET /location/{locationId}` - Get location quests
  - `POST /{id}/start` - Start quest
  - `POST /{id}/complete` - Complete quest
  - `GET /{id}/tasks` - List quest tasks
  - `POST /tasks/{id}/submit` - Submit task response
  - `POST /tasks/{id}/verify` - Verify task completion
  - `GET /progress` - Get quest progress
  - `GET /rewards` - Get available rewards

### 6. Digital Assets & Wallet

- **Base Path**: `/tourii-backend/assets`
- **Endpoints**:
  - Digital Passport:
    - `GET /passport` - Get user's digital passport
    - `GET /passport/metadata` - Get passport metadata
    - `POST /passport/mint` - Mint new passport
    - `GET /passport/level` - Get passport level status
    - `GET /passport/achievements` - Get passport achievements
    - `GET /passport/stamps` - Get collected stamps
  
  - NFT Management:
    - `GET /nfts` - List all owned NFTs
    - `GET /nfts/{id}` - Get NFT details
    - `POST /nfts/transfer` - Transfer NFT
    - `GET /nfts/history` - Get NFT transaction history
  
  - Perks Management:
    - `GET /perks` - List all owned perks
    - `GET /perks/{id}` - Get perk details
    - `POST /perks/{id}/redeem` - Redeem a perk
    - `GET /perks/available` - Get available perks
    - `GET /perks/expired` - Get expired perks
    - `GET /perks/history` - Get perk redemption history
  
  - Wallet:
    - `GET /wallet` - Get wallet overview
    - `GET /wallet/balance` - Get point balance
    - `GET /wallet/transactions` - Get all transactions
    - `POST /wallet/connect` - Connect new wallet
    - `PUT /wallet/primary` - Set primary wallet

### 7. Travel & Activity Logs

- **Base Path**: `/tourii-backend/logs`
- **Endpoints**:
  - Travel History:
    - `GET /travel` - Get all travel logs
    - `GET /travel/recent` - Get recent travels
    - `GET /travel/stats` - Get travel statistics
    - `GET /travel/{locationId}` - Get specific location visits
    - `GET /travel/routes/{routeId}` - Get route completion logs
  
  - Quest Logs:
    - `GET /quests` - Get all quest logs
    - `GET /quests/completed` - Get completed quests
    - `GET /quests/ongoing` - Get ongoing quests
    - `GET /quests/{questId}/history` - Get specific quest history
  
  - Story Logs:
    - `GET /stories` - Get story reading logs
    - `GET /stories/completed` - Get completed stories
    - `GET /stories/progress` - Get reading progress
    - `GET /stories/{storyId}/history` - Get specific story history
  
  - Achievement Logs:
    - `GET /achievements` - Get achievement logs
    - `GET /achievements/recent` - Get recent achievements
    - `GET /achievements/points` - Get points history
    - `GET /achievements/milestones` - Get milestone completions

### 8. Shop & Rewards

- **Base Path**: `/tourii-backend/shop`
- **Endpoints**:
  - `GET /items` - List shop items
  - `GET /items/{id}` - Get item details
  - `POST /items/{id}/purchase` - Purchase item
  - `GET /points` - Get user points
  - `GET /history` - Get purchase history
  - `POST /redeem` - Redeem points for perks

### 9. Social Features

- **Base Path**: `/tourii-backend/social`
- **Endpoints**:
  - `GET /memory-wall` - Get memory wall posts
  - `POST /memory-wall` - Create memory wall post
  - `GET /memory-wall/{id}` - Get post details
  - `POST /memory-wall/{id}/like` - Like post
  - `POST /memory-wall/{id}/comment` - Comment on post
  - `GET /users/{id}/posts` - Get user's posts
  - `GET /feed` - Get personalized feed

### 10. Check-in System

- **Base Path**: `/tourii-backend/check-in`
- **Endpoints**:
  - `POST /location` - Check in at location
  - `GET /history` - Get check-in history
  - `GET /map` - Get check-in map data
  - `POST /verify` - Verify location
  - `GET /nearby` - Get nearby check-in spots

### 11. Admin Panel

- **Base Path**: `/tourii-backend/admin`
- **Endpoints**:
  - `GET /dashboard` - Get dashboard stats
  - `GET /users` - List users
  - `PUT /users/{id}` - Update user
  - `GET /quests` - Manage quests
  - `POST /quests` - Create quest
  - `PUT /quests/{id}` - Update quest
  - `GET /stories` - Manage stories
  - `POST /stories` - Create story
  - `PUT /stories/{id}` - Update story
  - `GET /analytics` - Get analytics data

## WebSocket Events

```typescript
const WS_EVENTS = {
  // Quest Events
  QUEST_STARTED: 'quest:started',
  QUEST_COMPLETED: 'quest:completed',
  TASK_COMPLETED: 'task:completed',
  
  // Social Events
  NEW_MEMORY: 'memory:new',
  NEW_COMMENT: 'comment:new',
  NEW_LIKE: 'like:new',
  
  // NFT Events
  NFT_MINTED: 'nft:minted',
  PERK_REDEEMED: 'perk:redeemed',
  
  // Achievement Events
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',
  LEVEL_UP: 'level:up',
  
  // Friend Events
  FRIEND_REQUEST: 'friend:request',
  FRIEND_ACCEPTED: 'friend:accepted'
};
```

## WebSocket Integration

### Connection Setup

```typescript
// WebSocket configuration
interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxRetries: number;
}

// WebSocket client setup
class TouriiWebSocket {
  private socket: WebSocket | null = null;
  private retries = 0;
  private readonly config: WebSocketConfig;

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  connect() {
    try {
      this.socket = new WebSocket(`${this.config.url}/tourii-backend/ws`);
      this.setupEventHandlers();
    } catch (error) {
      this.handleReconnect();
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.retries = 0;
      // Authenticate WebSocket connection
      this.sendMessage({
        type: 'auth',
        data: { token: localStorage.getItem('token') }
      });
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.socket.onclose = () => {
      this.handleReconnect();
    };
  }

  private handleReconnect() {
    if (this.retries < this.config.maxRetries) {
      this.retries++;
      setTimeout(() => this.connect(), this.config.reconnectInterval);
    }
  }

  sendMessage(message: WebSocketMessage) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
}
```

### Message Types

```typescript
// Base message interface
interface WebSocketMessage {
  type: string;
  data: any;
}

// Quest related messages
interface QuestMessage extends WebSocketMessage {
  type: 'questStarted' | 'questCompleted' | 'taskCompleted';
  data: {
    questId: string;
    userId: string;
    timestamp: Date;
    details: {
      questName: string;
      magatamaPointsEarned?: number;
      progress?: number;
    };
  };
}

// Social interaction messages
interface SocialMessage extends WebSocketMessage {
  type: 'newMemory' | 'newComment' | 'newLike';
  data: {
    postId: string;
    userId: string;
    timestamp: Date;
    content?: string;
    mediaUrl?: string;
    magatamaPointsEarned?: number;
  };
}

// NFT event messages
interface NftMessage extends WebSocketMessage {
  type: 'nftMinted' | 'perkRedeemed';
  data: {
    tokenId: string;
    contractAddress: string;
    userId: string;
    timestamp: Date;
    metadata: {
      name: string;
      description: string;
      image: string;
      attributes?: Array<{
        traitType: string;
        value: string;
      }>;
    };
  };
}

// Achievement messages
interface AchievementMessage extends WebSocketMessage {
  type: 'achievementUnlocked' | 'levelUp';
  data: {
    userId: string;
    timestamp: Date;
    achievementName?: string;
    newLevel?: string;
    magatamaPointsEarned: number;
  };
}

// Friend system messages
interface FriendMessage extends WebSocketMessage {
  type: 'friendRequest' | 'friendAccepted';
  data: {
    fromUserId: string;
    toUserId: string;
    timestamp: Date;
    status: 'pending' | 'accepted' | 'rejected';
  };
}
```

### Usage Example

```typescript
// Initialize WebSocket
const wsConfig: WebSocketConfig = {
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000',
  reconnectInterval: 5000,
  maxRetries: 5
};

const touriiWs = new TouriiWebSocket(wsConfig);

// Connect to WebSocket
touriiWs.connect();

// Listen for quest updates
function handleQuestUpdate(message: QuestMessage) {
  switch (message.type) {
    case 'questStarted':
      // Update UI for quest start
      break;
    case 'questCompleted':
      // Show completion celebration
      // Update points display
      break;
    case 'taskCompleted':
      // Update quest progress
      break;
  }
}

// Send quest progress
function updateQuestProgress(questId: string, progress: number) {
  touriiWs.sendMessage({
    type: 'taskCompleted',
    data: {
      questId,
      userId: currentUserId,
      timestamp: new Date(),
      details: {
        questName: 'Sample Quest',
        progress
      }
    }
  });
}

// Handle memory wall updates
function handleMemoryWallUpdate(message: SocialMessage) {
  switch (message.type) {
    case 'newMemory':
      // Add new memory to wall
      break;
    case 'newComment':
      // Update post comments
      break;
    case 'newLike':
      // Update like count
      break;
  }
}

// Handle NFT events
function handleNftEvent(message: NftMessage) {
  switch (message.type) {
    case 'nftMinted':
      // Show minting success
      // Update digital passport display
      break;
    case 'perkRedeemed':
      // Update perks inventory
      break;
  }
}
```

### Real-time Features Implementation

#### Quest Progress Tracking

```typescript
// In your quest component
class QuestTracker {
  private ws: TouriiWebSocket;
  
  constructor(ws: TouriiWebSocket) {
    this.ws = ws;
  }

  startQuest(questId: string) {
    this.ws.sendMessage({
      type: 'questStarted',
      data: {
        questId,
        userId: currentUserId,
        timestamp: new Date(),
        details: {
          questName: 'Sample Quest'
        }
      }
    });
  }

  updateProgress(questId: string, progress: number) {
    this.ws.sendMessage({
      type: 'taskCompleted',
      data: {
        questId,
        userId: currentUserId,
        timestamp: new Date(),
        details: {
          questName: 'Sample Quest',
          progress,
          magatamaPointsEarned: 100
        }
      }
    });
  }
}
```

#### Memory Wall Real-time Updates

```typescript
// In your memory wall component
class MemoryWallUpdater {
  private ws: TouriiWebSocket;
  
  constructor(ws: TouriiWebSocket) {
    this.ws = ws;
  }

  postMemory(content: string, mediaUrl?: string) {
    this.ws.sendMessage({
      type: 'newMemory',
      data: {
        userId: currentUserId,
        timestamp: new Date(),
        content,
        mediaUrl
      }
    });
  }

  addComment(postId: string, content: string) {
    this.ws.sendMessage({
      type: 'newComment',
      data: {
        postId,
        userId: currentUserId,
        timestamp: new Date(),
        content
      }
    });
  }
}
```

#### NFT Minting Notifications

```typescript
// In your digital passport component
class NftNotifier {
  private ws: TouriiWebSocket;
  
  constructor(ws: TouriiWebSocket) {
    this.ws = ws;
  }

  notifyMinting(tokenId: string, contractAddress: string) {
    this.ws.sendMessage({
      type: 'nftMinted',
      data: {
        tokenId,
        contractAddress,
        userId: currentUserId,
        timestamp: new Date(),
        metadata: {
          name: 'Digital Passport',
          description: 'Tourii Digital Passport NFT',
          image: 'https://...'
        }
      }
    });
  }
}
```

## Data Models

### Story Saga

```typescript
interface StorySaga {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  region: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Model Route

```typescript
interface ModelRoute {
  id: string;
  routeName: string;
  recommendations: {
    category: string;
    items: string[];
  }[];
  touristSpots: TouristSpot[];
  storySaga: StorySaga;
}
```

### Quest

```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  tasks: QuestTask[];
  type: QuestType;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Digital Passport

```typescript
interface DigitalPassport {
  id: string;
  tokenId: string;
  contractAddress: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Memory Wall Post

```typescript
interface MemoryWallPost {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string;
  questId?: string;
  locationId?: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Check-in

```typescript
interface CheckIn {
  id: string;
  userId: string;
  locationId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  verificationMethod: 'QR' | 'GPS';
  verificationData?: string;
  timestamp: Date;
}
```

### Travel Log

```typescript
interface TravelLog {
  id: string;
  userId: string;
  type: 'VISIT' | 'QUEST' | 'ROUTE';
  locationId: string;
  routeId?: string;
  questId?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  timestamp: Date;
  photos?: string[];
  notes?: string;
  pointsEarned: number;
}
```

### Perk

```typescript
interface Perk {
  id: string;
  tokenId: string;
  contractAddress: string;
  type: 'FOOD' | 'EXPERIENCE' | 'DISCOUNT' | 'ACCESS';
  name: string;
  description: string;
  imageUrl: string;
  validFrom: Date;
  validUntil: Date;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  redemptionDetails?: {
    location: string;
    instructions: string;
    qrCode?: string;
    additionalInfo?: string;
  };
  metadata: {
    traits: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}
```

### Wallet

```typescript
interface Wallet {
  id: string;
  userId: string;
  address: string;
  isPrimary: boolean;
  type: 'PASSPORT' | 'PERKS';
  network: string;
  balance: {
    magatama: number;
    points: number;
  };
  nfts: {
    passport?: DigitalPassport;
    perks: Perk[];
    logs: NFTLog[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### User

```typescript
interface User {
  userId: string;
  username: string;
  discordId?: string;
  discordUsername?: string;
  twitterId?: string;
  twitterUsername?: string;
  googleEmail?: string;
  email?: string;
  password: string;
  passportWalletAddress?: string;
  perksWalletAddress: string;
  latestIpAddress?: string;
  isPremium: boolean;
  totalQuestCompleted: number;
  totalTravelDistance: number;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  registeredAt: Date;
  discordJoinedAt: Date;
  isBanned: boolean;
  delFlag: boolean;
  insUserId: string;
  insDateTime: Date;
  updUserId: string;
  updDateTime: Date;
  requestId?: string;
}
```

### UserAchievement

```typescript
interface UserAchievement {
  userAchievementId: string;
  userId: string;
  achievementName: string;
  achievementDesc?: string;
  iconUrl?: string;
  achievementType: 'UNKNOWN' | 'STORY' | 'TRAVEL' | 'EXPLORE' | 'COMMUNITY' | 'MILESTONE';
  magatamaPointAwarded: number;
  delFlag: boolean;
  insUserId: string;
  insDateTime: Date;
  updUserId: string;
  updDateTime: Date;
  requestId?: string;
}
```

### UserInfo

```typescript
interface UserInfo {
  userInfoId: string;
  userId: string;
  digitalPassportAddress: string;
  logNftAddress: string;
  userDigitalPassportType: 'BONJIN' | 'AMATSUKAMI' | 'KUNITSUKAMI' | 'YOKAI';
  level: string; // LevelType enum values
  discountRate?: number;
  magatamaPoints: number;
  magatamaBags?: number;
  totalQuestCompleted: number;
  totalTravelDistance: number;
  isPremium: boolean;
  prayerBead?: number;
  sword?: number;
  orgeMask?: number;
  delFlag: boolean;
  insUserId: string;
  insDateTime: Date;
  updUserId: string;
  updDateTime: Date;
  requestId?: string;
}
```

### UserOnchainItem

```typescript
interface UserOnchainItem {
  userOnchainItemId: string;
  userId?: string;
  itemType: 'UNKNOWN' | 'LOG_NFT' | 'DIGITAL_PASSPORT' | 'PERK';
  itemTxnHash: string;
  blockchainType: 'UNKNOWN' | 'VARA' | 'CAMINO';
  mintedAt?: Date;
  onchainItemId?: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'PENDING';
  delFlag: boolean;
  insUserId: string;
  insDateTime: Date;
  updUserId: string;
  updDateTime: Date;
  requestId?: string;
}
```

### UserItemClaimLog

```typescript
interface UserItemClaimLog {
  userItemClaimLogId: string;
  userId: string;
  onchainItemId?: string;
  offchainItemName?: string;
  itemAmount: number;
  itemDetails?: string;
  type: 'ONCHAIN' | 'OFFCHAIN';
  claimedAt?: Date;
  status: 'SUCCESS' | 'FAILED';
  errorMsg?: string;
  delFlag: boolean;
  insUserId: string;
  insDateTime: Date;
  updUserId: string;
  updDateTime: Date;
  requestId?: string;
}
```

### UserStoryLog

```typescript
interface UserStoryLog {
  userStoryLogId: string;
  userId: string;
  storyId: string;
  status: 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED';
  unlockedAt?: Date;
  finishedAt?: Date;
  delFlag: boolean;
  insUserId: string;
  insDateTime: Date;
  updUserId: string;
  updDateTime: Date;
  requestId?: string;
}
```

### UserQuestLog

```typescript
interface UserQuestLog {
  userQuestLogId: string;
  userId: string;
  questId: string;
  status: 'AVAILABLE' | 'ONGOING' | 'COMPLETED' | 'FAILED';
  action: 'VISIT_LOCATION' | 'PHOTO_UPLOAD' | 'ANSWER_TEXT' | 'SELECT_OPTION' | 'SHARE_SOCIAL' | 'CHECK_IN' | 'GROUP_ACTIVITY' | 'LOCAL_INTERACTION';
  userResponse?: string;
  groupActivityMembers: Array<{
    userId: string;
    discordId: string;
    groupName: string;
  }>;
  submissionData?: {
    imageUrl?: string;
    qrCodeValue?: string;
    [key: string]: any;
  };
  failedReason?: string;
  completedAt?: Date;
  claimedAt?: Date;
  totalMagatamaPointAwarded: number;
  delFlag: boolean;
  insUserId: string;
  insDateTime: Date;
  updUserId: string;
  updDateTime: Date;
  requestId?: string;
}
```

### UserTravelLog

```typescript
interface UserTravelLog {
  userTravelLogId: string;
  userId: string;
  questId: string;
  taskId: string;
  touristSpotId: string;
  userLongitude: number;
  userLatitude: number;
  travelDistanceFromTarget?: number;
  travelDistance: number;
  qrCodeValue?: string;
  checkInMethod?: 'QR_CODE' | 'GPS';
  detectedFraud?: boolean;
  fraudReason?: string;
  delFlag: boolean;
  insUserId: string;
  insDateTime: Date;
  updUserId: string;
  updDateTime: Date;
  requestId?: string;
}
```

## Error Handling

### Standard Error Response

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  apiKey?: {
    valid: boolean;
    permissions?: string[];
    expiresAt?: string;
  };
}
```

### Error Codes

- `400` - Bad Request
- `401` - Unauthorized (Invalid or missing API key)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error

### Version-Related Errors

```typescript
interface VersionError {
  statusCode: 410 | 400;
  message: string;
  supportedVersions: ApiVersion[];
  deprecationDate?: string;
  suggestedVersion?: ApiVersion;
}

// Example version error response
{
  statusCode: 410,
  message: "API version 1.0 is deprecated",
  supportedVersions: ["2.0", "3.0"],
  deprecationDate: "2024-01-01",
  suggestedVersion: "2.0"
}
```

## Rate Limiting

### Configuration

```typescript
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
      // Higher limits for API key holders
      return 1000;
    }
    // Default limit for regular users
    return 100;
  },
  message: 'Too many requests from this IP, please try again later',
  keyGenerator: (req) => {
    // Use API key if present, otherwise use IP
    return req.headers['x-api-key'] || req.ip;
  },
};
```

## Testing Guidelines

### API Testing

- Use Jest for testing
- Implement integration tests
- Mock external services
- Test error scenarios

### Frontend Testing

- Test API integration
- Handle error cases
- Validate responses
- Test loading states

## Documentation

### API Documentation

- Use Swagger/OpenAPI
- Document all endpoints
- Include examples
- Update regularly

### Frontend Documentation

- Document API usage
- Include error handling
- Document data models
- Update with changes

---

**Note**: This is a living document. Update it regularly as new integration points are added or requirements change.
