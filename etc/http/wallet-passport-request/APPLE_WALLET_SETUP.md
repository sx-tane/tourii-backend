# Apple Wallet Pass Setup Guide

## 🚨 Current Issue

The Apple Wallet pass is not working because it requires **proper Apple Developer certificates** to generate valid `.pkpass` files. Currently, the implementation returns JSON data instead of a proper `.pkpass` file.

## 🔍 Why It's Not Working

1. **Invalid File Format**: Apple Wallet expects a `.pkpass` file (which is a ZIP file with specific contents), but we're returning JSON
2. **Missing Certificates**: Apple Wallet requires proper certificates to validate the pass
3. **Missing File Structure**: A proper `.pkpass` file needs:
   - `pass.json` (the pass data)
   - `manifest.json` (file manifest)
   - `signature` (cryptographic signature)
   - `icon.png` (optional)
   - `icon@2x.png` (optional)

## ✅ Solution: Proper Apple Wallet Implementation

### Step 1: Apple Developer Setup

1. **Get Apple Developer Account** ($99/year)
   - Go to [developer.apple.com](https://developer.apple.com)
   - Sign up for Apple Developer Program

2. **Create Pass Type ID**
   - Go to Certificates, Identifiers & Profiles
   - Create new Pass Type ID
   - Download the certificate

3. **Get Apple Wallet Certificate**
   - Request Apple Wallet certificate
   - Download and install

### Step 2: Install Required Packages

```bash
npm install passkit-generator
npm install @types/node
```

### Step 3: Proper Implementation

Replace the current `createApplePass` method with:

```typescript
import { Template } from 'passkit-generator';

private async createApplePass(
    metadata: DigitalPassportMetadata,
    qrToken: string,
    tokenId: string,
): Promise<PKPass> {
    try {
        // Create pass template
        const template = new Template('generic', {
            passTypeIdentifier: 'pass.com.tourii.passport',
            teamIdentifier: 'YOUR_TEAM_ID',
            organizationName: 'Tourii',
            serialNumber: tokenId,
            description: metadata.description,
        });

        // Add pass data
        template.primaryFields.add('name', 'Passport Holder', 
            metadata.attributes.find(a => a.trait_type === 'Username')?.value || 'Unknown');
        
        template.secondaryFields.add('level', 'Level',
            metadata.attributes.find(a => a.trait_type === 'Level')?.value || 'Unknown');
        
        template.secondaryFields.add('type', 'Type',
            metadata.attributes.find(a => a.trait_type === 'Passport Type')?.value || 'Unknown');

        // Add barcode
        template.barcodes({
            message: qrToken,
            format: 'PKBarcodeFormatQR',
            messageEncoding: 'iso-8859-1',
        });

        // Set colors
        template.colors({
            background: 'rgb(103, 126, 234)',
            foreground: 'rgb(255, 255, 255)',
            label: 'rgb(200, 200, 200)',
        });

        // Generate the pass
        const pass = await template.generate();
        
        return {
            getAsBuffer: () => pass,
        } as PKPass;
    } catch (error) {
        this.logger.error('Error creating Apple pass:', error);
        throw error;
    }
}
```

### Step 4: Environment Variables

Add to your `.env` file:

```env
APPLE_PASS_TYPE_ID=pass.com.tourii.passport
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_CERT_PATH=/path/to/your/certificate.p12
APPLE_CERT_PASSWORD=your_certificate_password
```

## 🧪 Current Testing Workaround

For now, you can test the API endpoints, but the generated files won't work with Apple Wallet. The current implementation returns an error message explaining what's needed.

### Test the API (Working):

```bash
curl -X POST http://localhost:4000/api/wallet/apple/pass \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key-2" \
  -H "accept-version: 1.0.0" \
  -d '{"tokenId": "123"}'
```

### Expected Response:

```json
{
  "tokenId": "123",
  "platform": "apple",
  "downloadUrl": "https://...",
  "redirectUrl": "https://...",
  "expiresAt": "2025-07-01T..."
}
```

### What You'll Get:

The downloaded file will contain an error message explaining that proper certificates are needed.

## 🔄 Google Pay Status

Google Pay is also returning an error because it requires:
1. Google Pay API setup
2. Proper JWT token format
3. Google Pay merchant account

## 📋 Next Steps

1. **For Apple Wallet**: Get Apple Developer account and implement proper certificates
2. **For Google Pay**: Set up Google Pay API and merchant account
3. **For Testing**: Use the current endpoints to test API functionality
4. **For Production**: Implement both with proper certificates

## 💡 Alternative Testing

You can test the API functionality without adding to wallets:
- ✅ API authentication works
- ✅ File generation works  
- ✅ File storage works
- ✅ Response format is correct
- ❌ File format is not compatible with wallets (needs certificates)

The API is working correctly - it just needs proper wallet certificates to generate valid pass files! 