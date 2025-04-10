# Backend-Frontend Integration Guide

This document outlines the integration points between the Tourii backend and frontend systems, ensuring seamless communication and consistent user experience across the platform.

## API Architecture

### Base Configuration

```typescript
// Base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// API versioning
const API_VERSION = 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

// API Key configuration
interface ApiKeyConfig {
  key: string;
  permissions: string[];
  rateLimit: number;
}

// API Client setup with API key
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
  },
});

// API Key interceptor
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

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (invalid API key)
      localStorage.removeItem('apiKey');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
```

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

- **Base Path**: `/api/v1/auth`
- **Endpoints**:
  - `POST /login` - User login
  - `POST /register` - User registration
  - `POST /refresh` - Token refresh
  - `GET /profile` - User profile
  - `PUT /profile` - Update profile
  - `POST /social/{provider}` - Social authentication

### 2. Story & Tourism Features

- **Base Path**: `/api/v1/stories`
- **Endpoints**:
  - `GET /` - List story sagas
  - `GET /:id` - Get saga details
  - `GET /:id/chapters` - List chapters
  - `GET /chapters/:id` - Get chapter content
  - `GET /routes` - List model routes
  - `GET /routes/:id` - Get route details
  - `GET /spots` - List tourist spots
  - `GET /spots/:id` - Get spot details

### 3. Quest System

- **Base Path**: `/api/v1/quests`
- **Endpoints**:
  - `GET /` - List available quests
  - `GET /:id` - Get quest details
  - `POST /:id/start` - Start quest
  - `POST /:id/complete` - Complete quest
  - `POST /:id/tasks/:taskId/complete` - Complete task
  - `GET /progress` - Get quest progress

### 4. Blockchain Integration

- **Base Path**: `/api/v1/blockchain`
- **Endpoints**:
  - `GET /passport` - Get digital passport
  - `POST /passport/mint` - Mint new passport
  - `GET /nfts` - List owned NFTs
  - `POST /nfts/transfer` - Transfer NFT
  - `GET /transactions` - Get transaction history

### 5. User Progress & Achievements

- **Base Path**: `/api/v1/progress`
- **Endpoints**:
  - `GET /achievements` - List achievements
  - `GET /points` - Get magatama points
  - `GET /level` - Get current level
  - `GET /stats` - Get user statistics

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

## WebSocket Integration

### Real-time Updates

```typescript
// WebSocket events
const WS_EVENTS = {
  QUEST_PROGRESS: 'quest:progress',
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',
  NFT_MINTED: 'nft:minted',
  POINTS_UPDATED: 'points:updated',
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
