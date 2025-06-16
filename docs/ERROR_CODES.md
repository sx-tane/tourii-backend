# 🚨 Error Codes Reference

This document provides a comprehensive reference for all error codes used in the Tourii Backend, helping developers quickly identify and resolve issues.

---

## 📋 Error Response Format

All API errors follow this standardized format:

```json
{
  "code": "E_TB_001",
  "message": "Bad Request",
  "type": "BAD_REQUEST",
  "metadata": {
    "apiKey": { "valid": false },
    "statusCode": 400
  },
  "timestamp": "2024-01-16T10:00:00.000Z",
  "path": "/api/endpoint"
}
```

---

## 🏷️ Error Categories

### 🔐 Authentication & Authorization

| Code         | Message                | HTTP Status | When It Occurs              | Solution                     |
| ------------ | ---------------------- | ----------- | --------------------------- | ---------------------------- |
| **E_TB_002** | Unauthorized           | 401         | Generic unauthorized access | Check authentication headers |
| **E_TB_004** | User is not registered | 401         | User not found in system    | Register user first          |
| **E_TB_005** | Bad Credentials        | 400         | Invalid login credentials   | Verify username/password     |
| **E_TB_010** | API key is required    | 401         | Missing `x-api-key` header  | Add API key header           |
| **E_TB_011** | Invalid API key        | 401         | Wrong API key provided      | Use correct API key          |

**Example:**
```bash
# Missing API key
curl http://localhost:3000/health-check
# Returns: E_TB_010

# Fix: Add the header
curl -H "x-api-key: dev-key" http://localhost:3000/health-check
```

---

### 📝 API Versioning

| Code         | Message                                 | HTTP Status | When It Occurs                  | Solution                     |
| ------------ | --------------------------------------- | ----------- | ------------------------------- | ---------------------------- |
| **E_TB_020** | Version header is required              | 400         | Missing `accept-version` header | Add version header           |
| **E_TB_021** | Invalid version format                  | 400         | Malformed version string        | Use format "1.0.0"           |
| **E_TB_022** | This API version is no longer supported | 400         | Using deprecated version        | Upgrade to supported version |

**Example:**
```bash
# Missing version header
curl -H "x-api-key: dev-key" http://localhost:3000/health-check
# Returns: E_TB_020

# Fix: Add version header  
curl -H "x-api-key: dev-key" -H "accept-version: 1.0.0" http://localhost:3000/health-check
```

---

### 👤 User Management

| Code         | Message             | HTTP Status | When It Occurs         | Solution                   |
| ------------ | ------------------- | ----------- | ---------------------- | -------------------------- |
| **E_TB_006** | User already exists | 400         | Duplicate registration | Check if user exists first |

**Example:**
```bash
# Trying to register existing user
curl -X POST http://localhost:3000/auth/signup \
  -d '{"email": "existing@user.com", ...}'
# Returns: E_TB_006
```

---

### 🎮 Game Content (Stories, Quests, Routes)

| Code         | Message                     | HTTP Status | When It Occurs                  | Solution           |
| ------------ | --------------------------- | ----------- | ------------------------------- | ------------------ |
| **E_TB_023** | Story not found             | 404         | Story ID doesn't exist          | Verify story ID    |
| **E_TB_024** | Story chapter update failed | 400         | Chapter update operation failed | Check request data |
| **E_TB_027** | Model route not found       | 404         | Route ID doesn't exist          | Verify route ID    |
| **E_TB_028** | Quest task not found        | 404         | Task ID doesn't exist           | Verify task ID     |

**Example:**
```bash
# Requesting non-existent story
curl -H "x-api-key: dev-key" -H "accept-version: 1.0.0" \
  http://localhost:3000/stories/sagas/invalid_story_id/chapters
# Returns: E_TB_023
```

---

### 🌍 External API Services

#### Geocoding Errors (Google Maps)

| Code          | Message                                       | HTTP Status | When It Occurs               | Solution                   |
| ------------- | --------------------------------------------- | ----------- | ---------------------------- | -------------------------- |
| **E_GEO_001** | Geocoding: Address not found (ZERO_RESULTS)   | 404         | Location not found           | Try different search terms |
| **E_GEO_002** | Geocoding: API key invalid or request denied  | 401         | Google Maps API key issues   | Check API key and billing  |
| **E_GEO_003** | Geocoding: API provider rate limit exceeded   | 400         | Too many requests            | Wait or upgrade quota      |
| **E_GEO_004** | Geocoding: External API error during request  | 500         | Google Maps service down     | Retry later                |
| **E_GEO_005** | Geocoding: GOOGLE_MAPS_API_KEY not configured | 500         | Missing environment variable | Set GOOGLE_MAPS_API_KEY    |

#### Weather Errors (OpenWeatherMap)

| Code              | Message                                              | HTTP Status | When It Occurs               | Solution                 |
| ----------------- | ---------------------------------------------------- | ----------- | ---------------------------- | ------------------------ |
| **E_WEATHER_001** | Weather API: Location not found or no data available | 404         | Weather data not available   | Try different location   |
| **E_WEATHER_002** | Weather API: API key invalid or request denied       | 401         | Weather API key issues       | Check API key validity   |
| **E_WEATHER_003** | Weather API: API provider rate limit exceeded        | 400         | Too many requests            | Wait or upgrade plan     |
| **E_WEATHER_004** | Weather API: External API error during request       | 500         | Weather service down         | Retry later              |
| **E_WEATHER_005** | Weather API: WEATHER_API_KEY not configured          | 500         | Missing environment variable | Set OPEN_WEATHER_API_KEY |

**Example:**
```bash
# Invalid location search
curl -H "x-api-key: dev-key" -H "accept-version: 1.0.0" \
  "http://localhost:3000/location-info?query=invalid_location_xyz"
# Returns: E_GEO_001
```

---

### ⛓️ Blockchain Integration

| Code         | Message                                           | HTTP Status | When It Occurs                     | Solution                      |
| ------------ | ------------------------------------------------- | ----------- | ---------------------------------- | ----------------------------- |
| **E_TB_003** | SailsCalls is not ready                           | 500         | Blockchain service not initialized | Wait for service startup      |
| **E_TB_007** | Error while issue a voucher to a signless account | 400         | Voucher issuance failed            | Check blockchain connectivity |
| **E_TB_008** | Error while adding tokens to voucher              | 400         | Token addition failed              | Verify account balance        |
| **E_TB_009** | Error while renewing voucher                      | 400         | Voucher renewal failed             | Check voucher status          |

---

### 🔧 System Errors

| Code         | Message                   | HTTP Status | When It Occurs           | Solution              |
| ------------ | ------------------------- | ----------- | ------------------------ | --------------------- |
| **E_TB_000** | Internal Server Error     | 500         | Unhandled system error   | Check server logs     |
| **E_TB_001** | Bad Request               | 400         | Generic bad request      | Verify request format |
| **E_TB_025** | Geo info not found        | 404         | Geographic data missing  | Check location data   |
| **E_TB_026** | Current weather not found | 404         | Weather data unavailable | Try again later       |

---

## 🔍 Debugging Guide

### Step 1: Check the Error Code
Look up the specific error code in the tables above to understand what went wrong.

### Step 2: Verify Required Headers
Most errors are caused by missing headers:
```bash
# Always include these headers
-H "x-api-key: your-api-key"
-H "accept-version: 1.0.0" 
-H "Content-Type: application/json"
```

### Step 3: Check Environment Configuration
For E_TB_005, E_GEO_005, E_WEATHER_005 errors:
```bash
# Verify these environment variables are set
echo $GOOGLE_MAPS_API_KEY
echo $OPEN_WEATHER_API_KEY
echo $JWT_SECRET
```

### Step 4: Validate Request Data
For 400 Bad Request errors, check:
- JSON format is valid
- Required fields are present
- Data types match expected format
- IDs exist in database

### Step 5: Check External Service Status
For external API errors:
- **Google Maps**: Check [Google Cloud Status](https://status.cloud.google.com/)
- **OpenWeatherMap**: Check [OpenWeather Status](https://status.openweathermap.org/)

---

## 🛠️ Common Fixes

### "API key is required" (E_TB_010)
```bash
# Wrong ❌
curl http://localhost:3000/health-check

# Correct ✅  
curl -H "x-api-key: dev-key" \
     -H "accept-version: 1.0.0" \
     http://localhost:3000/health-check
```

### "User is not registered" (E_TB_004)
```bash
# Create user first
curl -X POST http://localhost:3000/auth/signup \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "socialProvider": "DISCORD",
    "socialId": "discord_123"
  }'
```

### "Story not found" (E_TB_023)
```bash
# Get available stories first
curl -H "x-api-key: dev-key" \
     -H "accept-version: 1.0.0" \
     http://localhost:3000/stories/sagas

# Then use valid story ID
curl -H "x-api-key: dev-key" \
     -H "accept-version: 1.0.0" \
     http://localhost:3000/stories/sagas/valid_story_id/chapters
```

### External API Configuration
```bash
# Add to .env file
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_PLACES_API_KEY=your_google_places_key  
OPEN_WEATHER_API_KEY=your_weather_api_key
```

---

## 🚨 Error Monitoring

### Development
```bash
# Watch server logs for errors
pnpm start:dev

# Check specific error patterns
tail -f logs/error.log | grep "E_TB_"
```

### Production (Render)
1. Check Render dashboard logs
2. Set up error tracking (Sentry, LogRocket)
3. Monitor API health endpoints

### Custom Error Handling
```typescript
// In your client code
try {
  const response = await fetch('/api/endpoint', options);
  const data = await response.json();
} catch (error) {
  switch (error.code) {
    case 'E_TB_010':
      // Handle missing API key
      break;
    case 'E_TB_023':
      // Handle story not found
      break;
    default:
      // Handle generic error
  }
}
```

---

## 📚 Related Documentation

- [API Examples](./API_EXAMPLES.md) - See working API requests
- [Development Setup](./DEVELOPMENT_SETUP.md) - Environment configuration
- [Security Guidelines](./SECURITY_GUIDELINES.md) - Authentication details
- [Backend Guidelines](./BACKEND_GUIDELINES.md) - Architecture overview

---

*Last Updated: June 16, 2025*