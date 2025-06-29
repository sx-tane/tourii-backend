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
curl http://localhost:4000/health-check
# Returns: E_TB_010

# Fix: Add the header
curl -H "x-api-key: dev-key" http://localhost:4000/health-check
```

---

### 📝 API Versioning

| Code         | Message                                 | HTTP Status | When It Occurs                  | Solution                       |
| ------------ | --------------------------------------- | ----------- | ------------------------------- | ------------------------------ |
| **E_TB_020** | Version header is required              | 400         | Missing `accept-version` header | Add version header             |
| **E_TB_021** | Invalid version format                  | 400         | Malformed version header        | Use valid version (e.g. 1.0.0) |
| **E_TB_022** | This API version is no longer supported | 400         | Using deprecated version        | Upgrade to supported version   |

**Example:**

```bash
# Missing version header
curl -H "x-api-key: dev-key" http://localhost:4000/health-check
# Returns: E_TB_020

# Fix: Add version header
curl -H "x-api-key: dev-key" -H "accept-version: 1.0.0" http://localhost:4000/health-check

# Invalid version format
curl -H "x-api-key: dev-key" -H "accept-version: invalid" http://localhost:4000/health-check
# Returns: E_TB_021

# Fix: Use proper version format
curl -H "x-api-key: dev-key" -H "accept-version: 1.0.0" http://localhost:4000/health-check
```

---

### 👤 User Management

| Code         | Message             | HTTP Status | When It Occurs         | Solution                   |
| ------------ | ------------------- | ----------- | ---------------------- | -------------------------- |
| **E_TB_006** | User already exists | 400         | Duplicate registration | Check if user exists first |

**Example:**

```bash
# Trying to register existing user
curl -X POST http://localhost:4000/auth/signup \
  -d '{"email": "existing@user.com", ...}'
# Returns: E_TB_006
```

---

### 🎮 Game Content (Stories, Quests, Routes)

| Code         | Message                     | HTTP Status | When It Occurs                  | Solution           |
| ------------ | --------------------------- | ----------- | ------------------------------- | ------------------ |
| **E_TB_023** | Story not found             | 404         | Story ID doesn't exist          | Verify story ID    |
| **E_TB_024** | Story chapter update failed | 400         | Chapter update operation failed | Check request data |
| **E_MR_004** | Model route not found       | 404         | Route ID doesn't exist          | Verify route ID    |
| **E_TB_028** | Quest task not found        | 404         | Task ID doesn't exist           | Verify task ID     |

**Example:**

```bash
# Requesting non-existent story
curl -H "x-api-key: dev-key" -H "accept-version: 1.0.0" \
  http://localhost:4000/stories/sagas/invalid_story_id/chapters
# Returns: E_TB_023
```

---

### 🌍 External API Services

#### Geocoding Errors (Google Maps - Cost-Optimized)

| Code          | Message                                       | HTTP Status | When It Occurs               | Solution                   |
| ------------- | --------------------------------------------- | ----------- | ---------------------------- | -------------------------- |
| **E_GEO_001** | Geocoding: Address not found (ZERO_RESULTS)   | 404         | Location not found           | Try different search terms |
| **E_GEO_002** | Geocoding: API key invalid or request denied  | 401         | Google Maps API key issues   | Check API key and billing  |
| **E_GEO_003** | Geocoding: API provider rate limit exceeded   | 400         | Too many requests            | Wait or upgrade quota      |
| **E_GEO_004** | Geocoding: External API error during request  | 500         | Google Maps service down     | Retry later                |
| **E_GEO_005** | Geocoding: GOOGLE_MAPS_API_KEY not configured | 500         | Missing environment variable | Set GOOGLE_MAPS_API_KEY    |

**Note**: The system now uses cost-optimized Google Places API with automatic fallback to legacy API, reducing costs by 85-90% while maintaining reliability.

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
  "http://localhost:4000/location-info?query=invalid_location_xyz"
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

### 🗄️ Storage Errors

| Code         | Message                                                                   | HTTP Status | When It Occurs                         | Solution                                |
| ------------ | ------------------------------------------------------------------------- | ----------- | -------------------------------------- | --------------------------------------- |
| **E_TB_035** | R2 storage endpoint not configured. Set R2_ENDPOINT or R2_ACCOUNT_ID environment variable | 500         | Missing R2 configuration               | Set R2_ACCOUNT_ID environment variable  |
| **E_TB_036** | R2 storage bucket not configured. Set R2_BUCKET environment variable     | 500         | Missing bucket configuration           | Set R2_BUCKET environment variable      |
| **E_TB_037** | File upload to R2 storage failed                                         | 500         | Storage upload failure                 | Check R2 credentials and connectivity   |
| **E_TB_038** | Metadata upload to R2 storage failed                                     | 500         | Metadata upload failure                | Check R2 credentials and connectivity   |
| **E_TB_039** | R2 public domain not configured. Set R2_PUBLIC_DOMAIN environment variable | 500         | Missing public domain configuration    | Set R2_PUBLIC_DOMAIN environment variable |

**Example:**

```bash
# Missing R2 configuration
# Returns: E_TB_035, E_TB_036, or E_TB_039

# Fix: Set required environment variables
export R2_ACCOUNT_ID=your-cloudflare-account-id
export R2_BUCKET=your-bucket-name  
export R2_PUBLIC_DOMAIN=https://your-domain.com
```

---

### 🔐 Authentication Configuration Errors

| Code         | Message                                                  | HTTP Status | When It Occurs                    | Solution                          |
| ------------ | -------------------------------------------------------- | ----------- | ---------------------------------- | --------------------------------- |
| **E_TB_040** | JWT_SECRET environment variable is required for security | 500         | Missing JWT secret configuration   | Set JWT_SECRET environment variable |
| **E_TB_041** | ENCRYPTION_KEY environment variable is required for security | 500 | Missing encryption key configuration | Set ENCRYPTION_KEY environment variable |

**Example:**

```bash
# Missing security configuration  
# Returns: E_TB_040 or E_TB_041

# Fix: Set required security environment variables
export JWT_SECRET=your-strong-random-64-char-string
export ENCRYPTION_KEY=your-strong-random-32-char-string

# Generate secure keys:
openssl rand -base64 64  # For JWT_SECRET
openssl rand -hex 32     # For ENCRYPTION_KEY
```

---

### 🎯 Quest & Task Management

| Code         | Message                                              | HTTP Status | When It Occurs                      | Solution                         |
| ------------ | ---------------------------------------------------- | ----------- | ----------------------------------- | -------------------------------- |
| **E_TB_028** | Quest task not found                                 | 404         | Task ID doesn't exist               | Verify task ID exists            |
| **E_TB_030** | Invalid task type for QR code scanning              | 400         | Wrong task type for QR scan         | Use CHECK_IN task type           |
| **E_TB_031** | Invalid QR code                                      | 400         | QR code doesn't match expected value | Scan the correct QR code         |
| **E_TB_032** | Task already completed                               | 400         | Attempting to complete finished task | Check task completion status     |
| **E_TB_033** | Invalid task configuration - malformed required_action | 400         | Task has invalid configuration      | Contact administrator            |

### 🔐 JWT & Token Validation

| Code         | Message                    | HTTP Status | When It Occurs              | Solution                     |
| ------------ | -------------------------- | ----------- | --------------------------- | ---------------------------- |
| **E_TB_045** | Invalid QR token structure | 400         | QR token format is invalid  | Use properly formatted token |
| **E_TB_046** | QR token has expired       | 400         | QR token past expiration    | Generate new QR token        |
| **E_TB_047** | Request validation failed  | 400         | Request body validation error | Fix request data format      |

**Example:**

```bash
# Completing a QR scan task
curl -X POST http://localhost:4000/tasks/task-123/qr-scan \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -H "x-user-id: user-123" \
  -d '{"qrCodeValue": "expected-qr-value"}'
```

---

### 🤖 AI Route Recommendations

AI route recommendation errors occur during the 3-step route discovery process (region selection → hashtag discovery → unified route generation).

| Code         | Message                                              | HTTP Status | When It Occurs                      | Solution                         |
| ------------ | ---------------------------------------------------- | ----------- | ----------------------------------- | -------------------------------- |
| **E_MR_005** | No tourist spots found matching keywords            | 404         | No spots match search criteria      | Try different or broader keywords |
| **E_MR_006** | AI content generation failed                        | 500         | OpenAI API error or misconfiguration | Check OpenAI API key and service status |
| **E_MR_007** | AI route recommendation validation failed           | 400         | Invalid request parameters          | Verify request format and parameters |
| **E_MR_008** | No tourist spots found matching criteria            | 404         | Geographic or filter constraints too strict | Adjust proximity radius or filters |
| **E_MR_009** | Geographic clustering failed                        | 500         | Error during spot clustering algorithm | Retry with different parameters |
| **E_MR_010** | AI content generation service unavailable          | 503         | OpenAI API service unavailable      | Retry later or check service status |
| **E_MR_011** | Route creation failed during database operation     | 500         | Database error during route creation | Check database connectivity |
| **E_MR_012** | Maximum 10 keywords allowed                         | 400         | Too many keywords in request        | Limit keywords to 10 or fewer |
| **E_MR_013** | Keywords must be 50 characters or less             | 400         | Individual keyword too long         | Shorten keywords to 50 chars max |
| **E_MR_014** | Max routes must be between 1 and 20                | 400         | Invalid maxRoutes parameter         | Set maxRoutes between 1-20 |
| **E_MR_015** | Invalid clustering options                          | 400         | Malformed clustering parameters     | Check clustering configuration |
| **E_MR_016** | Proximity radius must be greater than 0            | 400         | Invalid proximityRadiusKm value     | Set radius > 0 (default: 50km) |
| **E_MR_017** | Minimum spots per cluster must be at least 1       | 400         | Invalid minSpotsPerCluster value    | Set minSpotsPerCluster >= 1 |
| **E_MR_018** | Maximum spots per cluster must be greater than or equal to minimum | 400 | maxSpotsPerCluster < minSpotsPerCluster | Ensure max >= min spots |

**Common AI Route Issues:**

```bash
# No spots found with restrictive criteria
curl -X POST "http://localhost:4000/ai/routes/recommendations" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": ["very-specific-keyword"],
    "proximityRadiusKm": 1,
    "region": "Remote Area"
  }'
# Returns: E_MR_005 or E_MR_008

# Validation errors - too many keywords
curl -X POST "http://localhost:4000/ai/routes/recommendations" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"],
    "maxRoutes": 25
  }'
# Returns: E_MR_012 (too many keywords) or E_MR_014 (invalid maxRoutes)

# Fix: Use broader parameters
curl -X POST "http://localhost:4000/ai/routes/recommendations" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": ["food", "culture"],
    "proximityRadiusKm": 50,
    "mode": "any"
  }'
```

**Rate Limiting for AI Routes:**

AI route generation is rate-limited. If you exceed limits, you'll get a standard 429 error:

```bash
# Too many requests
curl -X POST "http://localhost:4000/ai/routes/recommendations" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"
# Returns: 429 Too Many Requests after 10 requests/minute (authenticated) or 3/minute (anonymous)

# Fix: Include user ID for higher limits
curl -X POST "http://localhost:4000/ai/routes/recommendations" \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0" \
  -H "x-user-id: alice"
```

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

For configuration errors (E_TB_035-041, E_GEO_005, E_WEATHER_005):

```bash
# Verify these environment variables are set
echo $GOOGLE_MAPS_API_KEY
echo $OPEN_WEATHER_API_KEY
echo $JWT_SECRET
echo $ENCRYPTION_KEY
echo $R2_ACCOUNT_ID
echo $R2_BUCKET
echo $R2_PUBLIC_DOMAIN
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
curl http://localhost:4000/health-check

# Correct ✅
curl -H "x-api-key: dev-key" \
     -H "accept-version: 1.0.0" \
     http://localhost:4000/health-check
```

### "User is not registered" (E_TB_004)

```bash
# Create user first
curl -X POST http://localhost:4000/auth/signup \
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
     http://localhost:4000/stories/sagas

# Then use valid story ID
curl -H "x-api-key: dev-key" \
     -H "accept-version: 1.0.0" \
     http://localhost:4000/stories/sagas/valid_story_id/chapters
```

### External API Configuration

```bash
# Add to .env file
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_PLACES_API_KEY=your_google_places_key  # Enable new Places API for cost savings
OPEN_WEATHER_API_KEY=your_weather_api_key

# Optional: Configure cache TTL for cost optimization
LOCATION_CACHE_TTL_SECONDS=86400  # 24-hour cache for location data
GEO_CACHE_TTL_SECONDS=86400       # 24-hour cache for geocoding data
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
- [README.md](../README.md) - Environment configuration and setup
- [Security Guide](./SECURITY.md) - Authentication details
- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Architecture overview

---

_Last Updated: June 29, 2025_
