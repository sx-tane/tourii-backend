# 🔐 **Tourii Backend Security Guide**

*Comprehensive security guidelines, critical fixes, and best practices*

*Last Updated: June 17, 2025*

---

## 📋 **Quick Security Status**

| Component | Status | Action Required |
|-----------|--------|-----------------|
| ✅ **JWT_SECRET** | SECURED | Environment variable required |
| ✅ **ENCRYPTION_KEY** | SECURED | Environment variable required |
| ✅ **API_KEYS** | SECURED | Configuration required |
| ✅ **CORS** | SECURED | Proper middleware enforcement |
| ✅ **Caching** | SECURED | Race conditions fixed |

**🟢 ALL CRITICAL SECURITY VULNERABILITIES RESOLVED - PRODUCTION READY**

---

## 🚨 **Recently Fixed Critical Vulnerabilities**

### **✅ Security Fixes Completed (June 17, 2025)**

**Summary of Fixes Applied:**
1. ✅ JWT_SECRET default fallback removed - now requires environment variable
2. ✅ CORS duplicate enablement removed - security middleware handles CORS
3. ✅ API_KEYS bypass fixed - fails immediately if not configured  
4. ✅ Caching race condition fixed - proper null checking added
5. ✅ ENCRYPTION_KEY default fallback removed - now requires environment variable

### **🔐 Required Environment Variables**

The following environment variables are now **REQUIRED** for the application to start:

```bash
# Authentication & Security (REQUIRED)
JWT_SECRET=<strong-random-64-char-string>
ENCRYPTION_KEY=<strong-random-32-char-string>
API_KEYS=<comma-separated-api-keys>

# Generate strong secrets:
openssl rand -base64 64  # For JWT_SECRET
openssl rand -hex 32     # For ENCRYPTION_KEY
openssl rand -hex 16     # For each API key
```

---

## 🔒 **Security Guidelines & Best Practices**

### **1. Authentication & Authorization**

#### **🔑 JWT & Session Tokens**
- Use RS256 (asymmetric) for signing
- Store tokens in HTTP-only, SameSite-strict cookies
- Rotate refresh tokens on use
- Access tokens: short lifespan (~15m)
- Logout: clear cookie, revoke refresh token

#### **🧩 Web3 Authentication**
- Generate session-bound nonces (short expiry)
- Verify EIP-191 signature via `eth_sign`
- Invalidate nonce on login
- Monitor wallet login attempts

#### **🛡️ API Key Management**
- UUIDv4 or strong random keys with `frontend_`, `admin_` prefixes
- Expiry + regeneration features
- Stored only in secret managers (Vault, AWS SSM)
- Never exposed to frontend or committed in code

#### **🧠 OAuth2 / Social Logins**
- Used for Discord, Twitter, Google
- Always validate `state` param (CSRF)
- Secure storage of provider tokens
- Session expiry fallback for stale tokens

#### **👥 Role-Based Access**
- Use NestJS `@Roles()` decorator + guards
- Enforce hierarchical access: USER < MODERATOR < ADMIN < SYSTEM
- Apply per-route permissions in controller
- Cross-check with Discord roles if needed

### **2. API & Interface Security**

#### **🌐 Request Validation**
- Zod schemas for all input validation
- Rate limiting on authentication endpoints
- Content-Type validation (application/json)
- Request size limits (1MB default)

#### **🔒 CORS Configuration**
```typescript
// Proper CORS setup in SecurityMiddleware
cors({
  origin: (origin, callback) => {
    const allowedOrigin = 'https://*.tourii.xyz';
    const pattern = allowedOrigin.replace('*.', '(.+\\.)?');
    const regex = new RegExp(`^${pattern.replace(/\./g, '\\.')}$`);
    
    if (regex.test(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  maxAge: 86400
})
```

#### **🛡️ Security Headers**
```typescript
// Helmet configuration
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
})
```

### **3. Database Security**

#### **🗄️ Row-Level Security (RLS)**
```sql
-- Example: User data isolation
ALTER TABLE user_story_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_story_log_policy ON user_story_log
FOR ALL TO backend_role
USING (user_id = current_setting('app.current_user_id'));
```

#### **🔍 Query Security**
- Always use Prisma ORM (prevents SQL injection)
- Parameterized queries only
- No dynamic SQL construction
- Input sanitization before database operations

#### **🔐 Data Encryption**
```typescript
// Sensitive data encryption
class EncryptionService {
  encryptString(text: string): string {
    const algorithm = 'aes-256-ctr';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, this.secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }
}
```

### **4. Web3 & Blockchain Security**

#### **⛓️ Smart Contract Interactions**
- Validate all contract addresses
- Use typed contract interfaces (Sails.js)
- Implement transaction retry logic
- Monitor for failed transactions

#### **🔐 Wallet Security**
- Never store private keys
- Use secure keyring management
- Validate signature formats (EIP-191)
- Implement nonce-based authentication

### **5. Infrastructure Security**

#### **🐳 Container Security**
```dockerfile
# Security-focused Dockerfile
FROM node:20-alpine AS runtime
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs
WORKDIR /app
COPY --chown=nextjs:nodejs . .
EXPOSE 4000
CMD ["node", "dist/apps/tourii-backend/main.js"]
```

#### **🔧 Environment Configuration**
```bash
# Security environment variables
NODE_ENV=production
JWT_SECRET=<strong-secret>
ENCRYPTION_KEY=<strong-key>
API_KEYS=<comma-separated-keys>
CORS_ORIGIN=https://tourii.xyz
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

---

## 🔍 **Security Testing & Validation**

### **Automated Security Testing**
```bash
# Security test suite
pnpm test:security

# Dependency audit
pnpm audit

# OWASP ZAP scan
zap-baseline.py -t http://localhost:4000
```

### **Manual Security Checklist**
- [ ] All environment variables configured
- [ ] HTTPS enforced in production
- [ ] Rate limiting active
- [ ] CORS properly configured
- [ ] Authentication flows tested
- [ ] Authorization boundaries verified
- [ ] Input validation comprehensive
- [ ] Error messages don't leak sensitive data

### **Penetration Testing**
```bash
# Test authentication bypass
curl -X GET http://localhost:4000/user/me
# Expected: 401 Unauthorized

# Test CORS restrictions
curl -H "Origin: https://malicious-site.com" http://localhost:4000/health-check
# Expected: CORS error

# Test rate limiting
for i in {1..20}; do curl -X POST http://localhost:4000/auth/login & done
# Expected: 429 Too Many Requests
```

---

## 🚨 **Incident Response**

### **Security Breach Protocol**
1. **Immediate**: Rotate all secrets (JWT_SECRET, API_KEYS)
2. **Assessment**: Check logs for unauthorized access
3. **Containment**: Block malicious IPs
4. **Recovery**: Restore from secure backup
5. **Post-incident**: Update security measures

### **Monitoring & Alerting**
```typescript
// Security event logging
Logger.warn(`Failed login attempt: ${clientIP} for user ${email}`);
Logger.error(`Invalid API key: ${apiKey} from origin ${origin}`);
Logger.critical(`Potential breach: Multiple failed auth attempts from ${clientIP}`);
```

---

## 📚 **Related Security Documentation**

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Security architecture overview
- [API Examples](./API_EXAMPLES.md) - Secure API usage patterns
- [Error Codes](./ERROR_CODES.md) - Security-related error codes
- [Testing Strategy](./TESTING_STRATEGY.md) - Security testing approaches

---

**🛡️ Remember: Security is an ongoing process, not a one-time setup. Regular reviews and updates are essential.**

*This document consolidates security guidelines and critical fixes. All vulnerabilities have been resolved as of June 17, 2025.*