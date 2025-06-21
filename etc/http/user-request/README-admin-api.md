# Admin User Management API - HTTP Request Collection

This directory contains comprehensive HTTP request files for testing the Admin User Management API. The API provides powerful filtering, searching, sorting, and pagination capabilities for managing users in the Tourii platform.

## 📋 Files Overview

### Core Functionality
- **`admin-get-all-users.http`** - Basic user retrieval with sorting options
- **`admin-filter-users.http`** - Filter users by role, premium status, banned status
- **`admin-search-users.http`** - Search users by username, email, Discord/Twitter handles
- **`admin-pagination-examples.http`** - Pagination examples with various page sizes

### Advanced Queries
- **`admin-date-filters.http`** - Filter users by registration date ranges
- **`admin-complex-queries.http`** - Complex combinations of filters and sorting
- **`admin-dashboard-queries.http`** - Ready-to-use queries for admin dashboard views
- **`admin-edge-cases.http`** - Edge cases and error handling tests

## 🔑 Authentication

All requests require these headers:
```http
x-api-key: your-api-key-1
accept-version: 1.0.0
x-user-id: TSU202506-614e2f-211442-172685-KAAA  # Admin user ID
```

**Note**: The `x-user-id` should be an actual admin user ID for proper authorization.

## 🎯 API Endpoint

```
GET http://localhost:4000/admin/users
```

## 📊 Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `page=2` |
| `limit` | number | Users per page (1-100, default: 20) | `limit=50` |
| `searchTerm` | string | Search in username, email, Discord/Twitter usernames | `searchTerm=alice` |
| `role` | enum | Filter by user role | `role=ADMIN` |
| `isPremium` | boolean | Filter by premium status | `isPremium=true` |
| `isBanned` | boolean | Filter by banned status | `isBanned=false` |
| `startDate` | string | Filter from registration date (ISO format) | `startDate=2025-01-01` |
| `endDate` | string | Filter to registration date (ISO format) | `endDate=2025-12-31` |
| `sortBy` | enum | Sort field | `sortBy=total_quest_completed` |
| `sortOrder` | enum | Sort order | `sortOrder=desc` |

### Valid Enum Values

**Role**: `USER`, `MODERATOR`, `ADMIN`
**Sort By**: `username`, `registered_at`, `total_quest_completed`, `total_travel_distance`
**Sort Order**: `asc`, `desc`

## 📈 Response Structure

```json
{
  "users": [
    {
      "userId": "TSU202506-...",
      "username": "alice_explorer",
      "email": "alice@tourii.dev",
      "role": "USER",
      "isPremium": false,
      "isBanned": false,
      "totalQuestCompleted": 5,
      "totalTravelDistance": 124.5,
      "registeredAt": "2025-04-08T22:38:51.867Z",
      "latestIpAddress": "192.168.1.10",
      "userInfo": {
        "level": "BONJIN",
        "magatamaPoints": 150,
        "userDigitalPassportType": "BONJIN",
        // ... more user details
      },
      "summaryStats": {
        "achievementCount": 0,
        "onchainItemCount": 0,
        "storyCompletedCount": 1,
        "taskCompletedCount": 3,
        "totalCheckinsCount": 0,
        "discordActivityCount": 0,
        "invitesSentCount": 0
      },
      // Related data arrays (achievements, task logs, etc.)
    }
  ],
  "pagination": {
    "totalCount": 13,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  },
  "filters": {
    "searchTerm": "alice",
    "role": "USER",
    "isPremium": false,
    "sortBy": "registered_at",
    "sortOrder": "desc"
  }
}
```

## 🎮 Quick Start Examples

### 1. Get All Users (Basic)
```http
GET http://localhost:4000/admin/users
```

### 2. Search for Users
```http
GET http://localhost:4000/admin/users?searchTerm=alice
```

### 3. Filter Premium Users
```http
GET http://localhost:4000/admin/users?isPremium=true
```

### 4. Top Quest Completers
```http
GET http://localhost:4000/admin/users?sortBy=total_quest_completed&sortOrder=desc&limit=10
```

### 5. Recent Signups
```http
GET http://localhost:4000/admin/users?startDate=2025-01-01&sortBy=registered_at&sortOrder=desc
```

## 🎛️ Dashboard Query Examples

### User Overview Dashboard
```http
GET http://localhost:4000/admin/users?page=1&limit=50&sortBy=registered_at&sortOrder=desc
```

### Leaderboard (Top Performers)
```http
GET http://localhost:4000/admin/users?sortBy=total_quest_completed&sortOrder=desc&limit=10
```

### Problem Users Monitoring
```http
GET http://localhost:4000/admin/users?isBanned=true&sortBy=registered_at&sortOrder=desc
```

### At-Risk Users (Low Activity)
```http
GET http://localhost:4000/admin/users?sortBy=total_quest_completed&sortOrder=asc&isBanned=false&limit=10
```

## 🔍 Advanced Search Examples

### Multi-Field Search
```http
GET http://localhost:4000/admin/users?searchTerm=@tourii.dev&isPremium=true
```

### Date Range + Role Filter
```http
GET http://localhost:4000/admin/users?startDate=2025-01-01&role=ADMIN
```

### Complex User Analytics
```http
GET http://localhost:4000/admin/users?isPremium=false&sortBy=total_travel_distance&sortOrder=desc&limit=5
```

## 🛠️ Testing Notes

1. **Pagination**: Test with various page sizes (1, 5, 20, 50, 100)
2. **Search**: Test case-insensitive, partial matches, special characters
3. **Filters**: Test combinations of role, premium, banned status
4. **Sorting**: Test all sort fields with both asc/desc orders
5. **Edge Cases**: Invalid parameters, large page numbers, future dates

## 🎯 Test Data Available

The database contains 13 diverse users including:
- **Roles**: 10 Users, 1 Moderator, 1 Admin
- **Premium Status**: 6 Premium, 7 Free users
- **Activity Levels**: From 1 quest to 52 quests completed
- **Special Cases**: 1 banned user, various registration dates
- **Passport Types**: BONJIN, AMATSUKAMI, KUNITSUKAMI, YOKAI

## 🚀 Usage in Development

1. Open any `.http` file in VS Code with REST Client extension
2. Click "Send Request" above any query
3. View formatted JSON response
4. Modify parameters to test different scenarios
5. Use these queries as reference for frontend implementation

Perfect for testing admin dashboard features, user management tools, and API integration during development!