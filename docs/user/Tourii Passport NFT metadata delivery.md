# 🎫 Tourii Passport NFT Metadata Delivery

This guide explains how to set up the infrastructure for delivering Tourii Digital Passport NFT metadata through AWS S3 and CloudFront CDN for optimal performance and reliability.

---

## 🛠 1. S3 Bucket Setup

**Create S3 bucket:**  
✅ Bucket name: `tourii-passport`

**Settings:**

- [x] Enable **static website hosting** (optional but recommended if you want direct S3 URL access)
- [x] Make sure **Bucket Policy** allows `public-read` for objects (not the bucket list itself).

Example Bucket Policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::tourii-passport/metadata/*"
    }
  ]
}
```

> ✅ This makes ONLY `metadata/` files readable, safer.

---

## 🌍 2. Upload Metadata under `/metadata/`

Your backend will upload like:

```javascript
await s3.putObject({
  Bucket: 'tourii-passport',
  Key: `metadata/${passportId}.json`,
  Body: JSON.stringify(metadata),
  ACL: 'public-read',
  ContentType: 'application/json',
  CacheControl: 'public, max-age=31536000',
});
```

Files will be like:

```
s3://tourii-passport/metadata/1.json
s3://tourii-passport/metadata/2.json
s3://tourii-passport/metadata/3.json
...
```

---

## 🚀 3. CloudFront CDN Setup

**Create CloudFront Distribution:**

| Setting                  | Value                                                         |
| :----------------------- | :------------------------------------------------------------ |
| Origin Domain            | your S3 bucket (`tourii-passport.s3.amazonaws.com`)           |
| Origin Access Control    | Recommended to restrict direct access (optional)              |
| Default Behavior         | Viewer Protocol Policy = **Redirect HTTP to HTTPS**           |
| Cache Policy             | Use `CachingOptimized` or create your own with long cache age |
| Alternate Domain (CNAME) | `cdn.tourii.xyz`                                              |
| SSL Certificate          | Use ACM (Amazon Certificate Manager) SSL for `cdn.tourii.xyz` |

> 🎯 **Goal:** Your metadata will be served from `https://cdn.tourii.xyz/metadata/{passportId}.json`

---

## 🌐 4. DNS (Route53 or wherever your DNS is)

**Add a CNAME record:**

| Name             | Type  | Value                                                     |
| :--------------- | :---- | :-------------------------------------------------------- |
| `cdn.tourii.xyz` | CNAME | your CloudFront domain (e.g., `d1234abcd.cloudfront.net`) |

Done. 🎯

---

## 📋 5. How the full flow looks after setup

- You mint NFT to user with `tokenURI = https://cdn.tourii.xyz/metadata/123.json`
- User's wallet (like MetaMask) or marketplace (like OpenSea) fetches metadata via CloudFront
- Fast global delivery, cache optimized
- If you update metadata, you can **invalidate CloudFront cache** (not mandatory — S3 file overwrite works, cache timeout will eventually expire)

Example backend flow after mint:

```javascript
const metadataUri = `https://cdn.tourii.xyz/metadata/${passportId}.json`;
await contract.mint(userAddress, metadataUri);
```

## 🔄 6. Metadata Schema

### Standard NFT Metadata Structure

```json
{
  "name": "Tourii Passport #123",
  "description": "Digital passport for the Tourii tourism platform",
  "image": "https://cdn.tourii.xyz/images/passport-123.png",
  "external_url": "https://tourii.xyz/passport/123",
  "attributes": [
    {
      "trait_type": "Level",
      "value": "E_CLASS_AMATSUKAMI"
    },
    {
      "trait_type": "Total Distance Traveled",
      "value": 1250.5,
      "display_type": "number"
    },
    {
      "trait_type": "Quests Completed",
      "value": 15,
      "display_type": "number"
    },
    {
      "trait_type": "Home Region",
      "value": "Kanto"
    },
    {
      "trait_type": "Registration Date",
      "value": "2024-03-20",
      "display_type": "date"
    }
  ]
}
```

### Backend Metadata Generation

```typescript
// Example metadata builder
class PassportMetadataBuilder {
  static async buildMetadata(userId: string): Promise<PassportMetadata> {
    const user = await userService.getUserById(userId);
    const stats = await userService.getUserStats(userId);

    return {
      name: `Tourii Passport #${user.id}`,
      description: 'Digital passport for the Tourii tourism platform',
      image: `https://cdn.tourii.xyz/images/passport-${user.id}.png`,
      external_url: `https://tourii.xyz/passport/${user.id}`,
      attributes: [
        {
          trait_type: 'Level',
          value: user.level,
        },
        {
          trait_type: 'Total Distance Traveled',
          value: stats.totalDistance,
          display_type: 'number',
        },
        {
          trait_type: 'Quests Completed',
          value: stats.questsCompleted,
          display_type: 'number',
        },
      ],
    };
  }
}
```

## 🚀 7. Performance Optimization

### Caching Strategy

- **S3 Headers**: Set proper cache-control headers
- **CloudFront**: Configure appropriate TTL settings
- **Metadata Updates**: Implement cache invalidation when passport levels up

### Image Optimization

```javascript
// Optimize passport images
await s3.putObject({
  Bucket: 'tourii-passport',
  Key: `images/passport-${passportId}.png`,
  Body: optimizedImageBuffer,
  ContentType: 'image/png',
  CacheControl: 'public, max-age=31536000', // 1 year cache
  Metadata: {
    'user-id': passportId,
    'generated-at': new Date().toISOString(),
  },
});
```

## 🔧 8. Monitoring & Maintenance

### Health Checks

- Monitor S3 bucket availability
- Track CloudFront cache hit rates
- Set up alerts for metadata access failures

### Backup Strategy

- Regular S3 cross-region replication
- Metadata backup to secondary storage
- Version control for metadata schema changes

---

## 📚 Related Documentation

- [Smart Contract Documentation](../web3/Tourii%20Smart%20Contract.md)
- [Backend Integration Guide](../BACKEND_FRONTEND_INTEGRATION.md)
- [Security Guidelines](../SECURITY_GUIDELINES.md)

---

_Last Updated: June 16, 2025_
