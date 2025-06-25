# Wallet Pass Mock Testing Guide

## Overview
This document outlines the enhanced mock data system for testing wallet pass generation without requiring full user authentication.

## Environment Configuration

### Required Environment Variables
```bash
# QR Token Expiration Configuration
PASSPORT_PDF_QR_TOKEN_EXPIRATION_HOURS=24      # PDF QR codes (security)
WALLET_PASS_QR_TOKEN_EXPIRATION_HOURS=17520    # Wallet passes (2 years)
```

## Supported Mock Token IDs

The system now supports multiple test token IDs instead of just `123`:

| Token ID | Profile Type | Description |
|----------|-------------|-------------|
| `123` | Japanese Test User | Original mock - デジタルパスポート, E級 天津神 |
| `456` | Advanced User | S級 国津神, Premium Plus status |
| `789` | Beginner | F級 地神, Standard user |
| `alice` | Explorer | A級 山神, Adventure seeker |
| `bob` | Tech Enthusiast | B級 水神, Standard premium |
| `test-user-1` | Development Profile | C級 火神, Testing profile |

## API Testing Examples

### Wallet Pass Generation

```bash
# Test multiple wallet passes
curl "http://localhost:4000/api/passport/456/wallet/both" \
  -H "accept: application/json" \
  -H "x-api-key: your-api-key-2" \
  -H "accept-version: 1.0.0"

# Test single platform
curl "http://localhost:4000/api/passport/alice/wallet/google" \
  -H "accept: application/json" \
  -H "x-api-key: your-api-key-2" \
  -H "accept-version: 1.0.0"
```

### Response Structure
```json
{
  "tokenId": "456",
  "apple": {
    "tokenId": "456",
    "platform": "apple",
    "redirectUrl": "undefined/api/wallet/apple/pass?tokenId=456",
    "expiresAt": "2099-12-31T23:59:59.000Z",
    "passBuffer": { "type": "Buffer", "data": [...] }
  },
  "google": {
    "tokenId": "456", 
    "platform": "google",
    "redirectUrl": "https://pay.google.com/gp/v/save/eyJ...",
    "expiresAt": "2099-12-31T23:59:59.000Z"
  }
}
```

## QR Token Expiration Strategy

### Two-Tier Expiration System
1. **Wallet Pass QR Codes**: 2 years (17,520 hours)
   - Long-term use in mobile wallets
   - No frequent re-downloads needed
   - Better user experience

2. **PDF QR Codes**: 24 hours  
   - Security for printed documents
   - Temporary verification use
   - Appropriate for short-term access

### Benefits
- **User Experience**: Wallet passes don't expire frequently
- **Security**: PDF verification codes remain short-lived
- **Flexibility**: Configurable via environment variables

## Mock Data Profiles

Each mock token ID represents a different user persona:

### 123 - Japanese Test User
- Level: E級 天津神 (Amatsukami Class E)
- Quests: 15 completed
- Distance: 250km traveled
- Status: プレミアム (Premium)

### 456 - Advanced User  
- Level: S級 国津神 (Kunitsukami Class S)
- Quests: 42 completed
- Distance: 1,250km traveled  
- Status: Premium Plus

### 789 - Beginner
- Level: F級 地神 (Chijin Class F)
- Quests: 3 completed
- Distance: 25km traveled
- Status: スタンダード (Standard)

## Implementation Details

### Code Changes
- Extended `isMockTokenId()` to support multiple IDs
- Added `getMockMetadata()` with diverse profiles
- Updated both wallet and PDF repositories
- Fixed QR token expiration configuration

### Testing Status
✅ Wallet pass generation working for all mock IDs  
✅ QR tokens expire after 2 years (wallet passes)  
✅ Multiple user profiles with diverse attributes  
⚠️ PDF generation endpoint not yet implemented  

## Next Steps
1. Implement PDF passport generation endpoint
2. Add more mock profiles as needed
3. Consider database storage for QR token revocation (future enhancement)