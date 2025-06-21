# HTTP Request Files Organization

This directory contains organized HTTP request files for testing the Tourii Backend API. All files use environment variables for consistency and maintainability.

## Directory Structure

```
etc/http/
├── environments/           # Environment variable files
│   └── local.env          # Local development variables
├── admin/                 # Admin-only endpoints  
│   ├── pending-submissions.http
│   └── verify-submission.http
├── tasks/                 # Task submission endpoints
│   ├── submit-photo-upload-task.http
│   ├── submit-social-share-task.http
│   ├── submit-qr-scan-task.http
│   ├── submit-answer-text-task.http
│   ├── submit-checkin-task.http
│   └── submit-select-option-task.http
├── auth-request/          # Authentication endpoints
├── homepage-request/      # Homepage endpoints
├── quest-request/         # Quest management endpoints (CRUD)
├── story-request/         # Story management endpoints
├── user-request/          # User management endpoints
└── README.md             # This file
```

## Environment Variables

All HTTP files use variables defined in `environments/local.env`:

### Core Configuration
- `{{baseUrl}}` - API base URL (http://localhost:4000)
- `{{apiKey}}` - API authentication key
- `{{version}}` - API version (1.0.0)

### User IDs
- `{{userId}}` - Regular test user ID
- `{{adminUserId}}` - Admin user ID
- `{{alternateUserId}}` - Alternative test user

### Test Resources
- `{{questId}}` - Test quest ID
- `{{taskId}}` - Test task ID  
- `{{storyChapterId}}` - Test story chapter ID

### Location Coordinates
- `{{latitude}}` / `{{longitude}}` - Fukoji Temple coordinates
- `{{tokyoLatitude}}` / `{{tokyoLongitude}}` - Tokyo coordinates

### Social Media URLs
- `{{twitterUrl}}` - Sample Twitter post URL
- `{{instagramUrl}}` - Sample Instagram post URL
- `{{facebookUrl}}` - Sample Facebook post URL

### QR Codes
- `{{validQrCode}}` - Valid QR code for testing
- `{{invalidQrCode}}` - Invalid QR code for error testing

## Task Submission Endpoints

### Manual Verification Workflow

Photo upload, social share, and text answer tasks use a **manual verification workflow**:

1. **Submission**: Task creates record with `status: ONGOING`
2. **Admin Review**: Admin queries pending submissions via `/admin/pending-submissions`
3. **Verification**: Admin approves/rejects via `/admin/verify-submission`
4. **Completion**: Status updates to `COMPLETED` or `FAILED`

### Auto-Complete Tasks

Check-in, QR scan, and select option tasks are **auto-completed** immediately upon successful submission.

## File Organization by Category

### ✅ **Reorganized & Updated** (New Structure)

#### Task Submissions (`/tasks/`)
- **submit-photo-upload-task.http** - Multipart file uploads with comprehensive scenarios
- **submit-social-share-task.http** - Social media proof URLs with location data
- **submit-qr-scan-task.http** - QR code validation with coordinate testing
- **submit-answer-text-task.http** - Text responses with various answer types
- **submit-checkin-task.http** - Location-based check-ins with edge cases
- **submit-select-option-task.http** - Multiple choice selections with validation

#### Admin Functions (`/admin/`)
- **pending-submissions.http** - Query submissions awaiting verification
- **verify-submission.http** - Approve/reject submissions with reasoning

### 📋 **Existing Files** (Legacy Structure)

These folders contain the original quest management, story, user, and other API endpoints:
- `auth-request/` - User authentication and signup
- `quest-request/` - Quest/task CRUD operations 
- `story-request/` - Story chapter management
- `user-request/` - User profile and admin operations
- `model-route-request/` - Location and route management
- `homepage-request/` - Homepage data endpoints
- `moment-request/` - Travel moment feeds
- `web3-request/` - Blockchain/NFT operations

## HTTP Client Usage

### VS Code REST Client
1. Install "REST Client" extension
2. Open any `.http` file
3. Click "Send Request" above each request

### IntelliJ HTTP Client
1. Open `.http` files directly in IntelliJ
2. Click the green play button next to requests
3. View responses in the integrated panel

### Postman Import
1. Import individual `.http` files or entire folder
2. Set up environment variables matching `local.env`
3. Execute requests with automatic variable substitution

## Test Scenarios

Each file includes comprehensive test scenarios:

### ✅ **Valid Requests**
- Standard use cases with proper parameters
- Edge cases (boundary coordinates, large files, etc.)
- Multiple format variations (different image types, social platforms)

### ❌ **Error Conditions**
- Missing required parameters
- Invalid data types and values
- Unauthorized access attempts
- Malformed requests

### 🔍 **Edge Cases**
- Boundary value testing (coordinates, file sizes)
- Special characters and Unicode
- Extremely long inputs
- Duplicate/conflicting data

## Key Differences from Legacy Files

### Fixed Issues
1. **Correct URLs**: All task endpoints use `/tasks/:taskId/...` (not `/quests/tasks/...`)
2. **Consistent Port**: All requests use `localhost:4000` (not mixed 3000/4000)
3. **Environment Variables**: Standardized variables across all files
4. **Comprehensive Coverage**: Each endpoint has 15-25 test scenarios

### Enhanced Testing
- **Photo Upload**: Supports JPG, PNG, WebP with file type validation
- **Social Share**: Multiple platforms (Twitter, Instagram, Facebook, TikTok, etc.)
- **QR Scan**: Various QR code formats (URL, JSON, numeric, alphanumeric)
- **Text Answers**: Different response styles (essay, blog, academic, poetry)
- **Coordinates**: Global locations with edge case testing
- **Admin Workflows**: Complete submission verification lifecycle

## Usage Examples

### Basic Task Submission
```http
POST {{baseUrl}}/tasks/{{taskId}}/checkin
Content-Type: application/json
x-api-key: {{apiKey}}
x-user-id: {{userId}}

{
  "latitude": {{latitude}},
  "longitude": {{longitude}},
  "userId": "{{userId}}"
}
```

### Admin Verification
```http
POST {{baseUrl}}/admin/verify-submission
Content-Type: application/json
x-api-key: {{apiKey}}
x-user-id: {{adminUserId}}

{
  "userTaskLogId": "UTL202506-photo-123456-001",
  "action": "approve"
}
```

## Development Workflow

1. **Setup**: Configure test users in database using seed scripts
2. **Environment**: Update `local.env` with actual user/quest/task IDs
3. **Testing**: Run request sequences to test complete workflows
4. **Verification**: Check database state and API responses
5. **Debug**: Use comprehensive error scenarios to validate edge cases

## Notes

- All task submission endpoints support the current manual verification system
- Environment variables should be updated with real IDs from your database
- Photo upload tests require actual image files in `./sample-files/` directory
- Admin endpoints require proper role-based access control
- Error scenarios help validate API security and input validation