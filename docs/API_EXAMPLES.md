# 🚀 API Examples & Common Workflows

This guide provides real-world examples of using the Tourii Backend APIs, including complete user journeys and common integration patterns.

---

## 📋 Quick Reference

### Base URLs
- **Main API**: `http://localhost:3000` (dev) / `https://your-app.onrender.com` (prod)
- **Onchain API**: `http://localhost:3001` (dev) / `https://your-onchain.onrender.com` (prod)

### Required Headers (All Requests)
```bash
Content-Type: application/json
x-api-key: dev-key  # Replace with actual API key
accept-version: 1.0.0
```

### API Versioning Strategy
```typescript
export const API_VERSIONS = {
  V1: '1.0',
  V2: '2.0',
} as const;

export type ApiVersion = (typeof API_VERSIONS)[keyof typeof API_VERSIONS];
```

### Frontend Integration Pattern
Each API endpoint follows the pattern: **Controller → Service → Repository/External Service**

**Example Flow:**
```
Frontend Request → Security Middleware → Controller → Service → Repository → Database
                                                           ↓
                                              External APIs (Google, Weather, etc.)
```

---

## 🔄 Complete User Journey

### 1. User Signup & Authentication

```bash
# Step 1: Create new user account
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -d '{
    "email": "alice@example.com",
    "socialProvider": "DISCORD",
    "socialId": "discord_user_123"
  }'

# Response:
{
  "success": true,
  "userId": "usr_abc123",
  "passportMinted": true,
  "message": "User created and digital passport minted"
}
```

```bash
# Step 2: Login user
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -d '{
    "username": "alice@example.com",
    "loginType": "EMAIL"
  }'

# Response:
{
  "user_id": "usr_abc123",
  "username": "alice",
  "level": "BONJIN",
  "total_quest_completed": 0,
  "is_premium": false
}
```

### 2. Get User Profile

```bash
# Get current user info
curl -X GET http://localhost:3000/user/me \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -H "x-user-id: usr_abc123"

# Response:
{
  "userId": "usr_abc123",
  "username": "alice",
  "email": "alice@example.com",
  "level": "BONJIN",
  "totalQuestCompleted": 0,
  "totalTravelDistance": 0,
  "isPremium": false,
  "registeredAt": "2024-01-16T10:00:00Z"
}
```

---

## 📚 Story & Quest Workflow

### 3. Explore Available Stories

```bash
# Get all story sagas
curl -X GET http://localhost:3000/stories/sagas \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Response:
{
  "stories": [
    {
      "storyId": "story_tokyo",
      "storyTitle": "Tokyo Urban Adventure",
      "storyDescription": "Explore the bustling streets of Tokyo",
      "regionName": "Kanto",
      "difficulty": "BEGINNER",
      "estimatedDuration": "2-3 hours"
    }
  ]
}
```

```bash
# Get chapters for a specific story
curl -X GET http://localhost:3000/stories/sagas/story_tokyo/chapters \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Response:
{
  "chapters": [
    {
      "chapterId": "chapter_001",
      "chapterTitle": "Shibuya Crossing",
      "chapterDescription": "Experience the world's busiest crossing",
      "chapterOrder": 1,
      "isUnlocked": true
    }
  ]
}
```

### 4. Track Reading Progress

```bash
# Mark chapter as read
curl -X POST http://localhost:3000/stories/chapters/chapter_001/progress \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -d '{
    "userId": "usr_abc123",
    "status": "COMPLETED"
  }'

# Response:
{
  "success": true
}
```

---

## 🗺️ Routes & Location Discovery

### 5. Explore Tourist Routes

```bash
# Get all available routes
curl -X GET http://localhost:3000/routes \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Response:
{
  "routes": [
    {
      "routeId": "route_tokyo_central",
      "routeName": "Tokyo Central Walking Tour",
      "description": "A walking tour through central Tokyo",
      "estimatedDuration": "4 hours",
      "difficulty": "EASY",
      "touristSpots": ["spot_shibuya", "spot_harajuku", "spot_ginza"]
    }
  ]
}
```

```bash
# Get detailed route information
curl -X GET http://localhost:3000/routes/route_tokyo_central \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Response includes weather, tourist spots, and recommendations
```

### 6. Search for Locations (Cost-Optimized Google Places API)

```bash
# Search for location info (NEW: Cost-optimized Google Places integration)
curl -X GET "http://localhost:3000/location-info?query=Tokyo Station&latitude=35.6762&longitude=139.6503" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Response (85-90% cost reduction vs legacy API):
{
  "name": "Tokyo Station",
  "address": "1 Chome Marunouchi, Chiyoda City, Tokyo",
  "location": {
    "latitude": 35.6812362,
    "longitude": 139.7645667
  },
  "rating": 4.1,
  "photos": [
    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEA...",
    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEB..."
  ],
  "placeId": "ChIJC3Cf2PuOGGAR5Ku5WxJ1k",
  "phoneNumber": "+81-3-3212-2111",
  "website": "https://www.jreast.co.jp/estation/station/info.aspx?StationCd=1039"
}
```

```bash
# Get geographic coordinates for an address (Optimized Geocoding)
curl -X GET "http://localhost:3000/geo-info?query=Shibuya Crossing Tokyo" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Response (Uses new Places API with minimal field mask):
{
  "touristSpotName": "Shibuya Crossing",
  "latitude": 35.6598,
  "longitude": 139.7006,
  "formattedAddress": "Shibuya City, Tokyo, Japan"
}
```

---

## 🎯 Quest System Workflow

### 7. Discover & Start Quests

```bash
# Get available quests with filters
curl -X GET "http://localhost:3000/quests?page=1&limit=10&questType=SOLO&userId=usr_abc123" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Response:
{
  "quests": [
    {
      "questId": "quest_shibuya_photo",
      "questName": "Shibuya Crossing Photo Challenge",
      "questType": "SOLO",
      "difficulty": "EASY",
      "estimatedDuration": "30 minutes",
      "magatama_point_reward": 100,
      "isCompleted": false,
      "isUnlocked": true
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

```bash
# Get detailed quest information
curl -X GET "http://localhost:3000/quests/quest_shibuya_photo?userId=usr_abc123" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Response:
{
  "questId": "quest_shibuya_photo",
  "questName": "Shibuya Crossing Photo Challenge",
  "questDescription": "Take a photo at the famous Shibuya crossing",
  "tasks": [
    {
      "taskId": "task_001",
      "taskName": "Arrive at Shibuya Crossing",
      "taskType": "GPS_CHECK_IN",
      "isCompleted": false,
      "requiredLocation": {
        "latitude": 35.6595,
        "longitude": 139.7006,
        "radius": 50
      }
    },
    {
      "taskId": "task_002", 
      "taskName": "Take a photo",
      "taskType": "PHOTO_UPLOAD",
      "isCompleted": false
    }
  ]
}
```

### 8. Complete Quest Tasks

```bash
# Upload photo for quest task
curl -X POST http://localhost:3000/quests/tasks/task_002/photo-upload \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -H "x-user-id: usr_abc123" \
  -F "file=@shibuya_photo.jpg"

# Response:
{
  "success": true,
  "proofUrl": "https://cdn.tourii.xyz/quest-photos/usr_abc123_task_002.jpg",
  "taskCompleted": true,
  "pointsEarned": 50
}
```

---

## 👥 Group Quest Example

### 9. Group Quest Coordination

```bash
# Get group members for a quest
curl -X GET http://localhost:3000/quests/quest_group_tokyo/group/members \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Response:
{
  "questId": "quest_group_tokyo",
  "members": [
    {
      "userId": "usr_abc123",
      "username": "alice",
      "role": "leader",
      "ready": false,
      "joinedAt": "2024-01-16T10:00:00Z"
    },
    {
      "userId": "usr_def456", 
      "username": "bob",
      "role": "member",
      "ready": true,
      "joinedAt": "2024-01-16T10:05:00Z"
    }
  ],
  "status": "waiting_for_members"
}
```

```bash
# Start group quest (leader only)
curl -X POST http://localhost:3000/quests/quest_group_tokyo/group/start \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -d '{
    "userId": "usr_abc123"
  }'

# Response:
{
  "success": true,
  "questStarted": true,
  "message": "Group quest started for all members"
}
```

---

## 📱 Memory Wall & Dashboard

### 10. Get User Activity Feed

```bash
# Get latest moments/activities
curl -X GET "http://localhost:3000/moments?page=1&limit=20" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Response:
{
  "moments": [
    {
      "momentId": "moment_001",
      "userId": "usr_abc123",
      "username": "alice",
      "type": "QUEST_COMPLETED",
      "content": "Completed Shibuya Photo Challenge",
      "imageUrl": "https://cdn.tourii.xyz/quest-photos/...",
      "createdAt": "2024-01-16T14:30:00Z",
      "pointsEarned": 100
    },
    {
      "momentId": "moment_002",
      "userId": "usr_def456",
      "username": "bob", 
      "type": "TRAVEL_LOG",
      "content": "Visited Tokyo Station",
      "location": "Tokyo Station, Tokyo",
      "createdAt": "2024-01-16T13:15:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20
}
```

### 11. Homepage Highlights

```bash
# Get homepage content
curl -X GET http://localhost:3000/v2/homepage/highlights \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Response:
{
  "featuredChapter": {
    "chapterId": "chapter_002",
    "title": "Harajuku Culture",
    "description": "Dive into youth culture and fashion",
    "imageUrl": "https://cdn.tourii.xyz/chapters/harajuku.jpg"
  },
  "popularQuest": {
    "questId": "quest_ramen_tour",
    "title": "Tokyo Ramen Master",
    "description": "Try 5 different ramen shops",
    "completionRate": "78%",
    "averageRating": 4.8
  },
  "recentActivities": [
    {
      "type": "NEW_USER_MILESTONE",
      "message": "Welcome 1000th traveler!"
    }
  ]
}
```

---

## ⛓️ Blockchain Operations

### 12. Onchain Service Examples

```bash
# Get user's blockchain address
curl -X GET http://localhost:3001/keyring/address \
  -H "Cookie: token=your_jwt_token"

# Response:
{
  "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  "publicKey": "0x...",
  "isActive": true
}
```

```bash
# Send blockchain transaction (example)
curl -X POST http://localhost:3001/send-green \
  -H "Cookie: token=your_jwt_token"

# Response:
{
  "transactionHash": "0x...",
  "blockNumber": 12345,
  "status": "success"
}
```

---

## 🧪 Testing & Development

### Using .http files
The repository includes example requests in `etc/http/` folders:

```bash
# Test auth
GET http://localhost:3000/user/me
x-api-key: dev-key
accept-version: 1.0.0
x-user-id: usr_abc123
```

### Common Error Responses

```json
// Invalid API key
{
  "statusCode": 401,
  "message": "Unauthorized",
  "code": "E_TB_001"
}

// Invalid version
{
  "statusCode": 400,
  "message": "Invalid version format",
  "code": "E_TB_021"
}

// User not found
{
  "statusCode": 404,
  "message": "User not found",
  "code": "E_TB_003"
}
```

---

## 📊 Rate Limiting

Default rate limits:
- **General endpoints**: 100 requests per minute
- **Auth endpoints**: 10 requests per minute  
- **Upload endpoints**: 5 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642350000
```

---

## 🔧 Environment-Specific URLs

### Development
```bash
export API_BASE_URL=http://localhost:3000
export ONCHAIN_BASE_URL=http://localhost:3001
export API_KEY=dev-key
```

### Production (Render)
```bash
export API_BASE_URL=https://your-tourii-backend.onrender.com
export ONCHAIN_BASE_URL=https://your-tourii-onchain.onrender.com  
export API_KEY=your_production_api_key
```

---

## 🆘 Troubleshooting API Issues

### Authentication Problems
```bash
# Check if API key is valid
curl -X GET http://localhost:3000/health-check \
  -H "x-api-key: your-key" \
  -H "accept-version: 1.0.0"
```

### Database Connection Issues
```bash
# Check if database is accessible
docker ps | grep postgres
# Should show running postgres container
```

### CORS Issues
Make sure you're including the correct headers and the request is coming from an allowed origin.

---

## 📚 Related Documentation

- [Development Setup](./DEVELOPMENT_SETUP.md) - Complete setup guide
- [API Reference](../README.md#-api-reference) - All available endpoints
- [Security Guidelines](./SECURITY_GUIDELINES.md) - Authentication & security
- [Backend Guidelines](./BACKEND_GUIDELINES.md) - Architecture overview

---

---

## 💰 **Cost Optimization Achievements**

### Google Places API Cost Reduction
The Tourii Backend now implements a **hybrid cost-optimization strategy** for Google Places API calls:

| Metric | Before Optimization | After Optimization | Savings |
|--------|-------------------|-------------------|---------|
| **API Calls per 4 locations** | 56 Places + 15 Geocoding | ~4 Text Search calls | **85-90%** |
| **Cost per 4 locations** | $2.80 - $3.50 | $0.12 - $0.28 | **90% reduction** |
| **Implementation** | Multiple API calls per location | Single Text Search with field masks | Hybrid with fallback |

### Technical Implementation
- **New Places API** with targeted field masks: `places.location,places.formattedAddress,places.displayName`
- **Fallback system** to legacy API for reliability
- **24-hour caching** to minimize repeated API calls
- **Real-time logging** for cost monitoring

---

*Last Updated: June 17, 2025*