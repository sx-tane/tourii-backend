# Wallet & Passport Integration HTTP Requests

This folder contains HTTP request examples for testing the wallet integration and passport generation/verification endpoints.

## Prerequisites

- Backend server running on `localhost:4000`
- Valid token IDs (replace `123` in examples with actual token IDs)
- For verification endpoints, valid JWT tokens (replace example tokens with real ones)

## Files Overview

### Wallet Integration Endpoints

- **`apple-pass.http`** - Generate Apple Wallet pass
- **`google-pass.http`** - Generate Google Pay pass  
- **`auto-pass.http`** - Auto-detect platform and generate appropriate pass
- **`both-passes.http`** - Generate both Apple and Google passes
- **`update-pass.http`** - Update existing wallet pass
- **`revoke-pass.http`** - Revoke wallet pass access
- **`pass-status.http`** - Check wallet pass status
- **`detect-platform.http`** - Detect device platform

### Passport Generation Endpoints

- **`passport-generate.http`** - Generate digital passport PDF
- **`passport-metadata.http`** - Get passport metadata
- **`passport-refresh.http`** - Refresh passport with new achievements
- **`passport-preview.http`** - Generate passport preview (no storage)
- **`passport-download.http`** - Download passport PDF
- **`passport-validate.http`** - Validate token ID

### Passport Verification Endpoints

- **`verify-passport.http`** - Verify passport token (public endpoint)
- **`batch-verify.http`** - Batch verify multiple passports
- **`verify-qr.http`** - Verify QR code data
- **`verification-stats.http`** - Get verification statistics

## Usage

### Using VSCode REST Client Extension

1. Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension
2. Open any `.http` file in this folder
3. Click "Send Request" above the request line
4. View the response in the split panel

### Using cURL

```bash
# Example: Generate Apple Wallet pass
curl -X POST http://localhost:4000/api/wallet/apple/pass \
  -H "Content-Type: application/json" \
  -d '{"tokenId": "123"}'
```

### Using Postman

1. Import the requests or manually create them
2. Set the base URL to `http://localhost:4000`
3. Update token IDs and JWT tokens as needed

## Important Notes

- **Token IDs**: Replace `123` with actual token IDs from your system
- **JWT Tokens**: For verification endpoints, use real JWT tokens from passport generation
- **Authentication**: Most endpoints don't require authentication, but check the controller code for specific requirements
- **Rate Limiting**: Endpoints use `ThrottlerGuard`, so respect rate limits during testing

## Expected Responses

### Wallet Pass Generation
```json
{
  "tokenId": "123",
  "platform": "apple",
  "downloadUrl": "https://assets.tourii.com/passports/apple/123_1640995200000.pkpass",
  "redirectUrl": "https://assets.tourii.com/passports/apple/123_1640995200000.pkpass",
  "expiresAt": "2024-01-08T12:00:00.000Z"
}
```

### Passport Verification
```json
{
  "valid": true,
  "tokenId": "123",
  "verifiedAt": "2024-01-01T12:00:00.000Z",
  "expiresAt": "2024-01-02T12:00:00.000Z",
  "passportData": {
    "username": "alice",
    "level": "E-Class Amatsukami",
    "passportType": "Amatsukami",
    "questsCompleted": 15,
    "travelDistance": 250,
    "magatamaPoints": 1500,
    "registeredAt": "2024-01-01T00:00:00.000Z"
  },
  "error": null
}
``` 