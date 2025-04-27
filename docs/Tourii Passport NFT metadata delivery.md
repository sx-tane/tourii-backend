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
  CacheControl: 'public, max-age=31536000'
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