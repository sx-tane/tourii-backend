# Security Audit Report - Digital Passport & Wallet Integration

## 🚨 Security Risk Assessment: **HIGH RISK**

**Critical Finding**: Multiple hardcoded secrets and production credentials found in source code that pose immediate security threats if deployed to production.

## 🔍 Security Vulnerabilities Identified

### 1. Hardcoded Secrets (CRITICAL)

#### File: `wallet-pass.repository-impl.ts`

**Line 551**: Hardcoded HMAC Secret Key
```typescript
const signature = crypto.createHmac('sha256', 'mock-secret-key').update(manifest).digest('hex');
```
- **Risk**: Authentication bypass, signature forgery
- **Impact**: Attackers could generate valid Apple Wallet passes
- **Remediation**: Use `process.env.APPLE_PASS_SIGNING_KEY` from secure storage

**Line 144**: Hardcoded Test Email
```typescript
organizationName: 'test-issuer@tourii.com',
```
- **Risk**: Information disclosure, unprofessional appearance
- **Impact**: Reveals test environment details in production
- **Remediation**: Use `process.env.APPLE_PASS_ORGANIZATION_NAME`

**Line 681**: Placeholder Signature
```typescript
return 'signature-placeholder';
```
- **Risk**: Invalid wallet passes, authentication bypass
- **Impact**: Google Pay passes will be rejected
- **Remediation**: Implement proper RS256 JWT signing

### 2. Missing Certificate Management (CRITICAL)

#### Apple Wallet Certificate Handling
- **Issue**: No certificate loading or validation mechanism
- **File**: `wallet-pass.repository-impl.ts:319-326`
- **Risk**: Production wallet passes will fail to generate
- **Required**: Implement secure certificate storage and loading

#### Google Wallet Private Key Management
- **Issue**: Missing service account key handling
- **File**: `google-wallet.repository-api.ts:19-20`
- **Risk**: API authentication will fail in production
- **Required**: Secure private key storage and loading

### 3. Environment Variable Exposure (MEDIUM)

#### Missing Environment Variables
```bash
# Missing from .env.example:
APPLE_PASS_TYPE_ID=
APPLE_TEAM_ID=
APPLE_PASS_SIGNING_KEY=
APPLE_PASS_ORGANIZATION_NAME=
GOOGLE_WALLET_ISSUER_EMAIL=
GOOGLE_WALLET_ISSUER_ID=
GOOGLE_WALLET_CLASS_ID=
GOOGLE_WALLET_KEY_PATH=
```

### 4. Mock Data in Production Code (MEDIUM)

#### Hardcoded Test Responses
- **File**: `wallet-pass.repository-impl.ts:37-81, 115-237`
- **Issue**: Mock data for `tokenId: "123"` will be served in production
- **Risk**: Inconsistent user experience, potential data leakage
- **Remediation**: Remove mock data or add feature flag

### 5. Insufficient Input Validation (LOW)

#### Token ID Validation
- **Issue**: No validation of `tokenId` parameter format
- **Risk**: Potential injection attacks or invalid data processing
- **Remediation**: Add input validation and sanitization

## 🛡️ Security Recommendations

### Immediate Actions (Deploy Blockers)

1. **Remove All Hardcoded Secrets**
   ```typescript
   // Before (VULNERABLE)
   const signature = crypto.createHmac('sha256', 'mock-secret-key')
   
   // After (SECURE)
   const signingKey = this.config.get<string>('APPLE_PASS_SIGNING_KEY');
   if (!signingKey) {
     throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_MISSING_CONFIG);
   }
   const signature = crypto.createHmac('sha256', signingKey)
   ```

2. **Implement Certificate Management**
   ```typescript
   // Secure certificate loading
   private loadAppleCertificate(): Buffer {
     const certPath = this.config.get<string>('APPLE_PASS_CERT_PATH');
     if (!existsSync(certPath)) {
       throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_CERT_NOT_FOUND);
     }
     return readFileSync(certPath);
   }
   ```

3. **Add Environment Variable Validation**
   ```typescript
   // Startup validation
   private validateRequiredConfig(): void {
     const required = [
       'APPLE_PASS_TYPE_ID',
       'APPLE_TEAM_ID', 
       'APPLE_PASS_SIGNING_KEY',
       'GOOGLE_WALLET_ISSUER_ID'
     ];
     
     for (const key of required) {
       if (!this.config.get(key)) {
         throw new Error(`Missing required config: ${key}`);
       }
     }
   }
   ```

### Production Security Measures

1. **Certificate Security**
   - Store certificates in Kubernetes secrets or AWS Secrets Manager
   - Implement certificate rotation mechanism
   - Use HSM (Hardware Security Module) for key storage in high-security environments

2. **API Security**
   - Implement rate limiting on wallet pass generation endpoints
   - Add request signing for sensitive operations
   - Monitor for suspicious wallet pass generation patterns

3. **Audit Trail**
   - Log all wallet pass generation requests
   - Track certificate usage and expiration
   - Implement security event monitoring

## 🔐 Secure Configuration Template

### .env.production Template
```bash
# Apple Wallet Configuration
APPLE_PASS_TYPE_ID=pass.com.tourii.passport
APPLE_TEAM_ID=YOUR_APPLE_TEAM_ID
APPLE_PASS_SIGNING_KEY=your-secure-signing-key-here
APPLE_PASS_ORGANIZATION_NAME=Tourii Inc.
APPLE_PASS_CERT_PATH=/secure/certs/apple-pass.p12
APPLE_PASS_CERT_PASSWORD=your-cert-password

# Google Wallet Configuration
GOOGLE_WALLET_ISSUER_EMAIL=wallet@tourii.com
GOOGLE_WALLET_ISSUER_ID=your-google-issuer-id
GOOGLE_WALLET_CLASS_ID=tourii.tourii_passport
GOOGLE_WALLET_KEY_PATH=/secure/keys/google-wallet-key.json
```

### Kubernetes Secrets Example
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: wallet-certificates
type: Opaque
data:
  apple-pass.p12: <base64-encoded-certificate>
  google-wallet-key.json: <base64-encoded-service-account-key>
```

## 📊 Risk Matrix

| Vulnerability | Severity | Probability | Impact | Risk Level |
|---------------|----------|-------------|---------|------------|
| Hardcoded Secrets | Critical | High | Critical | **CRITICAL** |
| Missing Certificates | Critical | High | High | **CRITICAL** |
| Mock Data Exposure | Medium | High | Medium | **HIGH** |
| Missing Input Validation | Low | Medium | Low | **MEDIUM** |

## ✅ Security Checklist

### Pre-Production Requirements
- [ ] All hardcoded secrets removed
- [ ] Apple certificates properly loaded and validated
- [ ] Google service account key securely stored
- [ ] Environment variables validated at startup
- [ ] Mock data removed or feature-flagged
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] Security monitoring enabled

### Security Testing
- [ ] Penetration testing of wallet endpoints
- [ ] Certificate validation testing
- [ ] Input fuzzing for injection vulnerabilities
- [ ] Authentication bypass testing
- [ ] SSL/TLS configuration review

### Ongoing Security
- [ ] Certificate expiration monitoring
- [ ] Security patch management
- [ ] Regular security audits
- [ ] Incident response plan
- [ ] Backup and recovery procedures

## 🚀 Next Steps

1. **Immediate**: Remove all hardcoded secrets (< 1 hour)
2. **Short-term**: Implement certificate management (1-2 days)
3. **Medium-term**: Add comprehensive security testing (1 week)
4. **Long-term**: Implement security monitoring and alerting (2 weeks)

**Security Approval Required**: This code must pass security review before production deployment.

---

*Security Audit Conducted: June 24, 2025*  
*Auditor: Claude Code Analysis*  
*Next Review: After remediation completion*