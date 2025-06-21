# 🔗 Tourii Backend API Examples

> **Real-world API usage examples and integration patterns for the Tourii tourism platform**

This guide provides comprehensive examples of how to integrate with the Tourii Backend API, including authentication, quest management, story progression, and blockchain interactions.

## 📋 Prerequisites

### Required Headers

All API requests require the following headers:

```http
x-api-key: your-api-key
accept-version: 1.0.0
Content-Type: application/json
```

### Base URLs

- **Main API**: `http://localhost:4000` (development) / `https://api.tourii.xyz` (production)
- **Blockchain Service**: `http://localhost:3001` (development) / `https://onchain.tourii.xyz` (production)

---

## 🔐 Authentication & User Management

### User Signup

Create a new user account with social or Web3 authentication:

```http
POST http://localhost:4000/auth/signup
Content-Type: application/json
x-api-key: your-api-key
accept-version: 1.0.0

{
  "email": "traveler@example.com",
  "socialProvider": "DISCORD",
  "socialId": "123456789012345678"
}
```

**Response:**
```json
{
  "user": {
    "user_id": "TSU202506-a1b2c3-141501-d4e5f6-AAAA",
    "username": "traveler_123",
    "email": "traveler@example.com",
    "digital_passport_type": "BONJIN",
    "level": "BONJIN"
  },
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Login

Authenticate existing user:

```http
POST http://localhost:4000/login
Content-Type: application/json
x-api-key: your-api-key
accept-version: 1.0.0

{
  "email": "traveler@example.com",
  "socialProvider": "DISCORD",
  "socialId": "123456789012345678"
}
```

### Get Current User Profile

Retrieve authenticated user's basic profile:

```http
GET http://localhost:4000/user/me
x-api-key: your-api-key
accept-version: 1.0.0
x-user-id: TSU202506-a1b2c3-141501-d4e5f6-AAAA
```

**Response:**
```json
{
  "user_id": "TSU202506-a1b2c3-141501-d4e5f6-AAAA",
  "username": "traveler_123",
  "level": "BONJIN",
  "magatama_points": 150,
  "total_quest_completed": 3,
  "total_travel_distance": 12.5,
  "is_premium": false
}
```

### Get User Sensitive Information

Retrieve extended user profile with sensitive data:

```http
GET http://localhost:4000/user/sensitive-info
x-api-key: your-api-key
accept-version: 1.0.0
x-user-id: TSU202506-a1b2c3-141501-d4e5f6-AAAA
```

---

## 📚 Story Management

### Get All Story Sagas

Retrieve all available story sagas:

```http
GET http://localhost:4000/stories/sagas
x-api-key: your-api-key
accept-version: 1.0.0
```

**Response:**
```json
[
  {
    "story_id": "STO202506-a1b2c3-141501-d4e5f6-AAAA",
    "saga_name": "Bungo Ono",
    "saga_desc": "Explore the mystical waterfalls and ancient legends of Bungo Ono",
    "background_media": "https://cdn.tourii.app/sagas/bungo-ono-cover.jpg",
    "location": "Oita, Japan",
    "is_prologue": false,
    "is_selected": true
  }
]
```

### Get Story Chapters

Retrieve chapters for a specific story:

```http
GET http://localhost:4000/stories/sagas/STO202506-a1b2c3-141501-d4e5f6-AAAA/chapters
x-api-key: your-api-key
accept-version: 1.0.0
```

### Track Chapter Progress

Record user progress while reading a story chapter:

```http
POST http://localhost:4000/stories/chapters/SCT202506-a1b2c3-141501-d4e5f6-AAAA/progress
Content-Type: application/json
x-api-key: your-api-key
accept-version: 1.0.0

{
  "userId": "TSU202506-a1b2c3-141501-d4e5f6-AAAA",
  "status": "IN_PROGRESS",
  "latitude": 33.1234,
  "longitude": 131.5678
}
```

### Consolidated Story Action

Handle story start, complete, and progress actions:

```http
POST http://localhost:4000/stories/chapters/SCT202506-a1b2c3-141501-d4e5f6-AAAA/action
Content-Type: application/json
x-api-key: your-api-key
accept-version: 1.0.0
X-Story-Action: complete

{
  "userId": "TSU202506-a1b2c3-141501-d4e5f6-AAAA",
  "latitude": 33.1234,
  "longitude": 131.5678
}
```

---

## 🗺️ Routes & Tourist Spots

### Get All Model Routes

Retrieve available travel routes:

```http
GET http://localhost:4000/routes
x-api-key: your-api-key
accept-version: 1.0.0
```

### Get Route by ID

Get detailed information about a specific route:

```http
GET http://localhost:4000/routes/MRT202506-a1b2c3-141501-d4e5f6-AAAA
x-api-key: your-api-key
accept-version: 1.0.0
```

**Response:**
```json
{
  "model_route_id": "MRT202506-a1b2c3-141501-d4e5f6-AAAA",
  "route_name": "Mystical Waterfalls Route",
  "region": "Bungo Ono",
  "region_desc": "Ancient volcanic landscape with stunning waterfalls",
  "region_latitude": 33.1234,
  "region_longitude": 131.5678,
  "recommendation": ["Local Food", "Nature", "Hidden Legends"],
  "tourist_spots": [
    {
      "tourist_spot_id": "TST202506-a1b2c3-141501-d4e5f6-AAAA",
      "tourist_spot_name": "Harajiri Falls",
      "latitude": 33.1234,
      "longitude": 131.5678,
      "address": "Harajiri, Ogata, Bungo-ono, Oita, Japan"
    }
  ]
}
```

### Get Tourist Spots by Story Chapter

Retrieve tourist spots linked to a story chapter:

```http
GET http://localhost:4000/routes/tourist-spots/SCT202506-a1b2c3-141501-d4e5f6-AAAA
x-api-key: your-api-key
accept-version: 1.0.0
```

### Get Location Information

Search for location details using Google Places API:

```http
GET http://localhost:4000/location-info?query=Harajiri Falls&latitude=33.1234&longitude=131.5678
x-api-key: your-api-key
accept-version: 1.0.0
```

**Response:**
```json
{
  "places": [
    {
      "name": "Harajiri Falls",
      "address": "Harajiri, Ogata, Bungo-ono, Oita, Japan",
      "latitude": 33.1234,
      "longitude": 131.5678,
      "rating": 4.5,
      "user_ratings_total": 1250,
      "photos": [
        {
          "photo_reference": "Aap_uEA7vb0DDYVJWEaX3O-AtYp77AaswQKSGtDaimt3gt7QCNpdjp8fVkxTKOG8TF...",
          "width": 4032,
          "height": 3024
        }
      ]
    }
  ]
}
```

---

## 🎯 Quest System

### Get Quests with Pagination

Retrieve quests with filtering and pagination:

```http
GET http://localhost:4000/quests?page=1&limit=10&questType=TRAVEL_TO_EARN&isPremium=false&userId=TSU202506-a1b2c3-141501-d4e5f6-AAAA
x-api-key: your-api-key
accept-version: 1.0.0
```

**Response:**
```json
{
  "quests": [
    {
      "quest_id": "QST202506-a1b2c3-141501-d4e5f6-AAAA",
      "quest_name": "Waterfall Seeker",
      "quest_desc": "Discover the hidden waterfalls of Bungo Ono",
      "quest_type": "TRAVEL_TO_EARN",
      "is_unlocked": true,
      "is_premium": false,
      "total_magatama_point_awarded": 100,
      "reward_type": "LOCAL_EXPERIENCES",
      "tourist_spot": {
        "tourist_spot_name": "Harajiri Falls",
        "latitude": 33.1234,
        "longitude": 131.5678
      },
      "tasks": [
        {
          "quest_task_id": "TSK202506-a1b2c3-141501-d4e5f6-AAAA",
          "task_type": "VISIT_LOCATION",
          "task_name": "Visit the Falls",
          "task_desc": "Check in at Harajiri Falls to earn points!",
          "is_unlocked": true,
          "magatama_point_awarded": 50
        }
      ]
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "total_pages": 3
  }
}
```

### Get Quest by ID

Retrieve detailed information about a specific quest:

```http
GET http://localhost:4000/quests/QST202506-a1b2c3-141501-d4e5f6-AAAA?userId=TSU202506-a1b2c3-141501-d4e5f6-AAAA
x-api-key: your-api-key
accept-version: 1.0.0
```

### Get Quests by Tourist Spot

Retrieve quests available at a specific location:

```http
GET http://localhost:4000/quests/tourist-spot/TST202506-a1b2c3-141501-d4e5f6-AAAA?userId=TSU202506-a1b2c3-141501-d4e5f6-AAAA&latitude=33.1234&longitude=131.5678
x-api-key: your-api-key
accept-version: 1.0.0
```

---

## ✅ Task Completion

### Complete QR Scan Task

Validate scanned QR code and complete the task:

```http
POST http://localhost:4000/tasks/TSK202506-a1b2c3-141501-d4e5f6-AAAA/qr-scan
Content-Type: application/json
x-api-key: your-api-key
accept-version: 1.0.0
x-user-id: TSU202506-a1b2c3-141501-d4e5f6-AAAA

{
  "code": "XG45-7YV9",
  "latitude": 33.1234,
  "longitude": 131.5678
}
```

**Response:**
```json
{
  "success": true,
  "message": "QR code validated successfully",
  "task_status": "COMPLETED",
  "magatama_points_earned": 50,
  "reward_earned": "Local Experience Voucher"
}
```

### Upload Task Photo

Submit photo for photo upload tasks:

```http
POST http://localhost:4000/quests/tasks/TSK202506-a1b2c3-141501-d4e5f6-AAAA/photo-upload
Content-Type: multipart/form-data
x-api-key: your-api-key
accept-version: 1.0.0
x-user-id: TSU202506-a1b2c3-141501-d4e5f6-AAAA

--boundary
Content-Disposition: form-data; name="file"; filename="waterfall.jpg"
Content-Type: image/jpeg

[Binary image data]
--boundary--
```

### Complete Social Sharing Task

Record social media sharing task completion:

```http
POST http://localhost:4000/tasks/TSK202506-a1b2c3-141501-d4e5f6-AAAA/share-social
Content-Type: application/json
x-api-key: your-api-key
accept-version: 1.0.0
x-user-id: TSU202506-a1b2c3-141501-d4e5f6-AAAA

{
  "proofUrl": "https://twitter.com/user/status/1234567890",
  "latitude": 33.1234,
  "longitude": 131.5678
}
```

### Submit Text Answer Task

Submit response for text-based questions:

```http
POST http://localhost:4000/tasks/answer-text
Content-Type: application/json
x-api-key: your-api-key
accept-version: 1.0.0

{
  "taskId": "TSK202506-a1b2c3-141501-d4e5f6-AAAA",
  "answer": "The waterfall represents the eternal flow of time in Japanese folklore",
  "userId": "TSU202506-a1b2c3-141501-d4e5f6-AAAA"
}
```

### Submit Multiple Choice Task

Complete multiple choice questions:

```http
POST http://localhost:4000/tasks/select-option
Content-Type: application/json
x-api-key: your-api-key
accept-version: 1.0.0

{
  "taskId": "TSK202506-a1b2c3-141501-d4e5f6-AAAA",
  "selectedOptionIds": ["option_1", "option_3"],
  "userId": "TSU202506-a1b2c3-141501-d4e5f6-AAAA"
}
```

### Submit Check-in Task

Complete location-based check-in:

```http
POST http://localhost:4000/tasks/checkin
Content-Type: application/json
x-api-key: your-api-key
accept-version: 1.0.0

{
  "taskId": "TSK202506-a1b2c3-141501-d4e5f6-AAAA",
  "latitude": 33.1234,
  "longitude": 131.5678,
  "userId": "TSU202506-a1b2c3-141501-d4e5f6-AAAA"
}
```

---

## 👥 Group Quests

### Get Group Members

Retrieve current members of a group quest:

```http
GET http://localhost:4000/quests/QST202506-a1b2c3-141501-d4e5f6-AAAA/group/members
x-api-key: your-api-key
accept-version: 1.0.0
```

**Response:**
```json
{
  "quest_id": "QST202506-a1b2c3-141501-d4e5f6-AAAA",
  "members": [
    {
      "user_id": "TSU202506-a1b2c3-141501-d4e5f6-AAAA",
      "username": "traveler_123",
      "discord_id": "123456789012345678",
      "role": "LEADER"
    },
    {
      "user_id": "TSU202506-b2c3d4-141501-e5f6g7-BBBB",
      "username": "explorer_456",
      "discord_id": "234567890123456789",
      "role": "MEMBER"
    }
  ],
  "total_members": 2,
  "max_members": 5
}
```

### Start Group Quest

Leader initiates quest for all group members:

```http
POST http://localhost:4000/quests/QST202506-a1b2c3-141501-d4e5f6-AAAA/group/start
Content-Type: application/json
x-api-key: your-api-key
accept-version: 1.0.0

{
  "userId": "TSU202506-a1b2c3-141501-d4e5f6-AAAA",
  "latitude": 33.1234,
  "longitude": 131.5678
}
```

---

## 📱 Activity Feeds & Dashboard

### Get User Checkins

Retrieve user travel history with location coordinates:

```http
GET http://localhost:4000/checkins?page=1&limit=20&startDate=2025-06-01&endDate=2025-06-20
x-api-key: your-api-key
accept-version: 1.0.0
x-user-id: TSU202506-a1b2c3-141501-d4e5f6-AAAA
```

**Response:**
```json
{
  "checkins": [
    {
      "user_travel_log_id": "UTL202506-a1b2c3-141501-d4e5f6-AAAA",
      "tourist_spot": {
        "tourist_spot_name": "Harajiri Falls",
        "latitude": 33.1234,
        "longitude": 131.5678
      },
      "quest": {
        "quest_name": "Waterfall Seeker",
        "quest_type": "TRAVEL_TO_EARN"
      },
      "check_in_method": "QR_CODE",
      "travel_distance": 2.5,
      "ins_date_time": "2025-06-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20
  }
}
```

### Get Latest Moments

Retrieve activity feed with user moments:

```http
GET http://localhost:4000/moments?page=1&limit=10
x-api-key: your-api-key
accept-version: 1.0.0
```

**Response:**
```json
{
  "moments": [
    {
      "id": "moment_123",
      "user": {
        "username": "traveler_123"
      },
      "image_url": "https://cdn.tourii.app/uploads/waterfall_photo.jpg",
      "description": "Just completed the Waterfall Seeker quest at Harajiri Falls!",
      "reward_text": "Earned 100 Magatama Points",
      "moment_type": "QUEST_COMPLETION",
      "ins_date_time": "2025-06-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10
  }
}
```

---

## 🏠 Homepage

### Get Homepage Highlights

Retrieve featured content for the homepage:

```http
GET http://localhost:4000/v2/homepage/highlights
x-api-key: your-api-key
accept-version: 1.0.0
```

**Response:**
```json
{
  "latest_chapter": {
    "story_chapter_id": "SCT202506-a1b2c3-141501-d4e5f6-AAAA",
    "chapter_title": "The Legend of Harajiri",
    "saga_name": "Bungo Ono",
    "chapter_image": "https://cdn.tourii.app/chapters/harajiri_legend.jpg"
  },
  "popular_quests": [
    {
      "quest_id": "QST202506-a1b2c3-141501-d4e5f6-AAAA",
      "quest_name": "Waterfall Seeker",
      "quest_image": "https://cdn.tourii.app/quests/waterfall_seeker.jpg",
      "completion_count": 1250,
      "reward_type": "LOCAL_EXPERIENCES"
    }
  ]
}
```

---

## ⛓️ Blockchain Service

### Health Check

Verify blockchain service status:

```http
GET http://localhost:3001/health-check
```

### Get User Keyring Address

Retrieve user's blockchain wallet address:

```http
GET http://localhost:3001/user-keyring-address
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Get Passport Metadata

Retrieve digital passport NFT metadata:

```http
GET http://localhost:3001/passport-metadata/TSU202506-a1b2c3-141501-d4e5f6-AAAA
x-api-key: your-api-key
accept-version: 1.0.0
```

**Response:**
```json
{
  "name": "Tourii Digital Passport #1234",
  "description": "Travel credential for the Tourii ecosystem",
  "image": "https://cdn.tourii.app/passports/passport_1234.png",
  "attributes": [
    {
      "trait_type": "Passport Type",
      "value": "BONJIN"
    },
    {
      "trait_type": "Level",
      "value": "E_CLASS_BONJIN"
    },
    {
      "trait_type": "Quests Completed",
      "value": 15
    },
    {
      "trait_type": "Distance Traveled",
      "value": "125.5 km"
    }
  ]
}
```

---

## 🚨 Error Handling

### Standard Error Response

All API errors follow this format:

```json
{
  "error": {
    "code": "E_TB_001",
    "message": "Authentication required",
    "type": "AUTHENTICATION_ERROR",
    "timestamp": "2025-06-20T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `E_TB_001` | Authentication required | 401 |
| `E_TB_002` | Invalid API version | 400 |
| `E_TB_003` | User not found | 404 |
| `E_TB_004` | Quest not available | 403 |
| `E_TB_005` | Invalid task response | 400 |

---

## 🔧 Integration Tips

### Authentication Flow

1. **User Signup**: Use `/auth/signup` with social provider
2. **Store Tokens**: Save access and refresh tokens
3. **Include Headers**: Add `x-user-id` header for authenticated requests
4. **Handle Refresh**: Implement token refresh logic

### Quest Completion Workflow

1. **Get Available Quests**: Use `/quests` with user filters
2. **Check Quest Details**: Get specific quest with `/quests/{id}`
3. **Complete Tasks**: Use appropriate task completion endpoints
4. **Track Progress**: Monitor task status and rewards
5. **Update Feed**: Refresh user moments and checkins

### Location-Based Features

1. **Request Location Permission**: Get user's GPS coordinates
2. **Search Locations**: Use `/location-info` for place discovery
3. **Verify Proximity**: Check user distance from target locations
4. **Complete Check-ins**: Use GPS coordinates for task completion

### Error Recovery

1. **Retry Logic**: Implement exponential backoff for failed requests
2. **Offline Support**: Cache critical data for offline functionality
3. **Validation**: Validate input data before API calls
4. **User Feedback**: Provide meaningful error messages

---

## 👑 Admin Management API

### Get All Users with Filtering

Retrieve paginated list of users with comprehensive filtering and search capabilities:

```http
GET http://localhost:4000/admin/users?page=1&limit=20&sortBy=total_quest_completed&sortOrder=desc
x-api-key: your-api-key-1
accept-version: 1.0.0
x-user-id: TSU202506-614e2f-211442-172685-KAAA
```

**Response:**
```json
{
  "users": [
    {
      "userId": "TSU202506-a1b2c3-141501-d4e5f6-AAAA",
      "username": "elite_traveler",
      "email": "elite@tourii.dev",
      "role": "USER",
      "isPremium": true,
      "isBanned": false,
      "totalQuestCompleted": 52,
      "totalTravelDistance": 2847.3,
      "registeredAt": "2025-03-15T10:30:00.000Z",
      "userInfo": {
        "level": "S_CLASS",
        "magatamaPoints": 5200,
        "userDigitalPassportType": "YOKAI"
      },
      "summaryStats": {
        "achievementCount": 15,
        "storyCompletedCount": 8,
        "taskCompletedCount": 52,
        "totalCheckinsCount": 127,
        "discordActivityCount": 34
      }
    }
  ],
  "pagination": {
    "totalCount": 13,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  },
  "filters": {
    "sortBy": "total_quest_completed",
    "sortOrder": "desc"
  }
}
```

### Advanced User Search and Filtering

Search users by multiple criteria:

```http
GET http://localhost:4000/admin/users?searchTerm=discord&isPremium=true&role=USER&limit=10
x-api-key: your-api-key-1
accept-version: 1.0.0
x-user-id: TSU202506-614e2f-211442-172685-KAAA
```

### Filter by Date Range

Get users who registered in a specific time period:

```http
GET http://localhost:4000/admin/users?startDate=2025-01-01&endDate=2025-06-30&sortBy=registered_at&sortOrder=desc
x-api-key: your-api-key-1
accept-version: 1.0.0
x-user-id: TSU202506-614e2f-211442-172685-KAAA
```

### Get Premium Users Dashboard

Retrieve top premium users for analytics:

```http
GET http://localhost:4000/admin/users?isPremium=true&sortBy=total_travel_distance&sortOrder=desc&limit=10
x-api-key: your-api-key-1
accept-version: 1.0.0
x-user-id: TSU202506-614e2f-211442-172685-KAAA
```

### Admin Dashboard Queries

**Top Performers Leaderboard:**
```http
GET http://localhost:4000/admin/users?sortBy=total_quest_completed&sortOrder=desc&limit=10
```

**Recent Signups:**
```http
GET http://localhost:4000/admin/users?startDate=2025-05-22&sortBy=registered_at&sortOrder=desc
```

**At-Risk Users (Low Activity):**
```http
GET http://localhost:4000/admin/users?sortBy=total_quest_completed&sortOrder=asc&isBanned=false&limit=10
```

**Problem Users Monitoring:**
```http
GET http://localhost:4000/admin/users?isBanned=true&sortBy=registered_at&sortOrder=desc
```

### Admin Workflow Examples

#### User Analytics Dashboard Integration

1. **Overview Statistics**: Get recent users with high activity
2. **Performance Metrics**: Sort by quest completion and travel distance
3. **User Health Check**: Monitor banned users and low-activity accounts
4. **Growth Analysis**: Track new registrations and engagement patterns

#### Search and Filter Workflow

1. **Quick Search**: Use `searchTerm` for username/email lookup
2. **Role Management**: Filter by USER/MODERATOR/ADMIN roles
3. **Premium Analysis**: Track premium user engagement and retention
4. **Date Range Analysis**: Monitor growth patterns and seasonal trends

#### Best Practices for Admin API

1. **Pagination**: Always use appropriate `limit` values (max 100)
2. **Sorting**: Use meaningful sort fields for dashboard views
3. **Filtering**: Combine multiple filters for targeted analytics
4. **Caching**: Cache dashboard queries for better performance

---

_Last Updated: June 21, 2025_