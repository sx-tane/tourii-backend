# Google Wallet Integration Setup Guide

This guide walks you through setting up Google Wallet integration for Tourii digital passports.

## Prerequisites

- Google Cloud Project
- Google Wallet issuer account
- Service account with proper permissions

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create New Project** or select existing project
3. **Note your Project ID** (e.g., `resounding-hope-251100`)

## Step 2: Enable Google Wallet API

1. **Navigate to APIs & Services** → Library
2. **Search for "Google Wallet API"**
3. **Enable the API** for your project

## Step 3: Create Service Account

1. **Go to IAM & Admin** → Service Accounts
2. **Create Service Account**:
   - **Name**: `tourii-passport` 
   - **Description**: `Service account for Tourii Google Wallet integration`
3. **Grant Roles**:
   - `Wallet Objects Admin`
   - `Service Account Token Creator` (optional)

## Step 4: Generate Service Account Key

1. **Click on your service account**
2. **Go to Keys tab**
3. **Add Key** → Create new key → **JSON**
4. **Download the JSON file** (e.g., `resounding-hope-251100-ff630650f2f1.json`)
5. **Move to project root** and add to `.gitignore`

## Step 5: Create Google Wallet Issuer Account

1. **Go to Google Wallet Console**: https://pay.google.com/business/console
2. **Create Issuer Account** if you don't have one
3. **Note your Issuer ID** (e.g., `3388000000022942524`)

## Step 6: Create Pass Class

1. **In Google Wallet Console** → Generic Pass
2. **Create New Class**:
   - **Class ID**: `tourii-passport` (will become `{issuer-id}.tourii-passport`)
   - **Display Name**: `Tourii Digital Passport`
   - **Logo**: Upload Tourii logo (optional)
3. **Save the class**

## Step 7: Add Service Account Permissions

### Option A: Google Wallet Console
1. **In Google Wallet Console** → Settings → Users
2. **Add User**: `tourii-passport@resounding-hope-251100.iam.gserviceaccount.com`
3. **Role**: **Editor** or **Owner**

### Option B: Google Cloud Console  
1. **Go to IAM & Admin** → IAM
2. **Add Member**: `tourii-passport@resounding-hope-251100.iam.gserviceaccount.com`
3. **Role**: `Wallet Objects Admin`

## Step 8: Configure Environment Variables

Add to your `.env` file:

```bash
# Google Wallet Configuration
GOOGLE_WALLET_ISSUER_ID=3388000000022942524
GOOGLE_WALLET_CLASS_ID=tourii-passport
GOOGLE_WALLET_KEY_PATH=resounding-hope-251100-ff630650f2f1.json

# QR Code Expiration (2 years for wallet passes)
WALLET_PASS_QR_TOKEN_EXPIRATION_HOURS=17520
```

## Step 9: Secure Service Account Key

1. **Add to .gitignore**:
```bash
# Google Wallet Service Account Keys
google-wallet-key.json
resounding-hope-251100-*.json
*-service-account*.json
```

2. **Set proper permissions**:
```bash
chmod 600 resounding-hope-251100-ff630650f2f1.json
```

## Step 10: Test Integration

### Test Google Wallet Pass Generation:
```bash
curl -s "http://localhost:4000/api/passport/bob/wallet/google" \
  -H "accept-version: 1.0.0" \
  -H "x-api-key: your-api-key-2"
```

### Extract Pass Data:
```bash
curl -s "http://localhost:4000/api/passport/bob/wallet/google" \
  -H "accept-version: 1.0.0" \
  -H "x-api-key: your-api-key-2" | \
  node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
    console.log('Google Wallet URL:', data.redirectUrl);
  "
```

### Test QR Code Verification:
```bash
# First get the JWT from the pass
curl -s "http://localhost:4000/api/passport/bob/wallet/google" \
  -H "accept-version: 1.0.0" \
  -H "x-api-key: your-api-key-2" | \
  node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
    const buffer = Buffer.from(data.passBuffer.data);
    const passObject = JSON.parse(buffer.toString());
    console.log('JWT:', passObject.genericObjects[0].barcode.value);
  "

# Then verify it
curl -s "http://localhost:4000/api/verify/{JWT_TOKEN}" \
  -H "accept-version: 1.0.0" \
  -H "x-api-key: your-api-key-2"
```

## Step 11: Production Considerations

### Security:
- **Never commit service account keys** to version control
- **Use environment variables** for sensitive data
- **Rotate service account keys** regularly
- **Use least privilege principle** for permissions

### Monitoring:
- **Check API quotas** in Google Cloud Console
- **Monitor API usage** and costs
- **Set up alerts** for API errors

### Scaling:
- **Consider caching** pass generation results
- **Implement rate limiting** for pass generation
- **Use batch operations** when possible

## Troubleshooting

### Common Errors:

**"Service account email address did not have edit access on the issuer"**
- Add service account to Google Wallet Console as Editor
- Verify permissions in Google Cloud Console IAM
- Wait 5-10 minutes for permissions to propagate

**"Class not found"**
- Verify class ID format: `{issuer-id}.{class-id}`
- Ensure class exists in Google Wallet Console
- Check class is published/active

**"Invalid JWT"**
- Verify service account key is valid
- Check JWT signing algorithm (RS256 for Google Wallet)
- Ensure proper audience and issuer in JWT

**"API not enabled"**
- Enable Google Wallet API in Google Cloud Console
- Verify project has proper billing account
- Check API quotas and limits

## Configuration Summary

Your final configuration should look like:

```bash
# Environment Variables
GOOGLE_WALLET_ISSUER_ID=3388000000022942524
GOOGLE_WALLET_CLASS_ID=tourii-passport  
GOOGLE_WALLET_KEY_PATH=resounding-hope-251100-ff630650f2f1.json
WALLET_PASS_QR_TOKEN_EXPIRATION_HOURS=17520

# Service Account
tourii-passport@resounding-hope-251100.iam.gserviceaccount.com

# Full Class ID
3388000000022942524.tourii-passport

# Object ID Format  
3388000000022942524.tourii-passport_{tokenId}
```

## Mock Data Testing

The system includes mock data for testing:

**Mock Token IDs**: `['123', '456', '789', 'alice', 'bob', 'charlie', 'test-user-1', 'test-user-2', 'test-user-3']`

**Mock Data Features**:
- Japanese passport styling (妖怪カード, 天津神, etc.)
- JWT QR codes with 2-year expiration
- Consistent verification across PDF, Apple Wallet, and Google Wallet
- Real Google Wallet passes using mock user data

## Support

For additional help:
- **Google Wallet Documentation**: https://developers.google.com/wallet
- **Google Cloud Console**: https://console.cloud.google.com/
- **Google Wallet Console**: https://pay.google.com/business/console

---

**Last Updated**: June 25, 2025  
**Integration Status**: ✅ Working with mock data and real Google Wallet API