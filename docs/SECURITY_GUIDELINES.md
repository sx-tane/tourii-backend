# 🔐 Security Guidelines for Tourii Backend

This document consolidates **backend security best practices** with real-world considerations from the Tourii system, including **API integration, database protection, authentication flows, smart contracts, and deployment hygiene**.

> ✅ Also see: `Api Domains Breakdown` and `BACKEND_FRONTEND_INTEGRATION.md` for endpoint structure and token flow.

---

## 1. Authentication & Authorization

### 🔑 JWT & Session Tokens

- Use RS256 (asymmetric) for signing
- Store tokens in HTTP-only, SameSite-strict cookies
- Rotate refresh tokens on use
- Access tokens: short lifespan (~15m)
- Logout: clear cookie, revoke refresh token

### 🧩 Web3 Authentication

- Generate session-bound nonces (short expiry)
- Verify EIP-191 signature via `eth_sign`
- Invalidate nonce on login
- Monitor wallet login attempts

### 🛡️ API Key Management

- UUIDv4 or strong random keys with `frontend_`, `admin_` prefixes
- Expiry + regeneration features
- Stored only in secret managers (Vault, AWS SSM)
- Never exposed to frontend or committed in code

### 🧠 OAuth2 / Social Logins

- Used for Discord, Twitter, Google
- Always validate `state` param (CSRF)
- Secure storage of provider tokens
- Session expiry fallback for stale tokens

### 👥 Role-Based Access

- Use NestJS `@Roles()` decorator + guards
- Enforce hierarchical access: USER < MODERATOR < ADMIN < SYSTEM
- Apply per-route permissions in controller
- Cross-check with Discord roles if needed

---

## 2. API & Interface Security

### 📥 Request Validation

- All input DTOs use `class-validator`
- Enum types, length limits, required fields
- Strip extra fields (whitelist mode)

### 🚦 Rate Limiting

- NestJS guards + sliding window
- Per-IP and per-token rules (`/auth` tighter than `/story`)
- Logs auto-flag bursty sessions

### 🌐 CORS

- Only allow `https://*.tourii.app`
- Disallow wildcard `*`
- Allow credentials where cookies are used

### 🔐 Secure Headers

- Helmet integration
- Content-Security-Policy: restrict inline scripts
- Disable `x-powered-by`, enforce frame guards

---

## 3. Database Security

### 🔒 Row-Level Security (RLS)

- RLS enabled on all user-linked tables
- Prisma middleware to inject tenant-level filters
- Example: `user_id = current_user`
- Test RLS coverage in API e2e tests

### 🔐 Field-Level Encryption

- Encrypt fields like `discord_id`, `google_email`, `ip_address`
- Use pgcrypto or Prisma encryption extensions
- AES-256, rotate keys annually

### ✅ Input Protection

- SQL injection prevention via Prisma param binding
- Clean untrusted JSON (user story logs, etc)
- XSS sanitization on rich text fields

---

## 4. Blockchain, NFT & Smart Contract Security

### 🔑 Key & Wallet Hygiene

- Operator private keys stored in Vault or HSM
- Use separate mint, signer, and burner wallets
- Rotate admin keys quarterly

### 🔗 Contract Security

- Audits mandatory for production contracts
- Implement OpenZeppelin guards: Ownable, Pausable, UUPS (upgradeable)
- Validate tx input and signatures before submitting

### 🧬 NFT & Metadata Integrity

- Use IPFS/Arweave for metadata
- Hash-lock metadata to prevent tampering
- Validate ownership & tokenId before allowing reward claims
- Use Merkle-based allowlists for special mints

### 🧾 Transaction Safety

- Estimate gas before tx
- Nonce handling: queue on retry
- Store tx hash + block confirmation + revert reason

---

## 5. Logging, Monitoring & Alerts

### 🧩 Logging

- Use `pino` or `winston` with redaction
- Include `request_id`, `ip`, `user_id`, `role`
- Pipe logs to centralized system (e.g., Grafana Loki)

### 🔔 Real-Time Alerts

- Sentry/Slack/Discord integrations
- Alert on:
  - Failed login bursts
  - Abnormal API consumption
  - Mint/claim failures

### 🔍 Weekly Audits

- Failed login and 5xx logs
- Top 10 frequent users by IP + geo
- Admin access usage

---

## 6. Deployment & Environment

### 🧱 Infrastructure

- Environments: dev, staging, prod are strictly isolated
- Use CI secrets via GitHub Actions, not `.env`
- Enforce 2FA for Vercel, AWS, Cloudflare, Discord

### 🔐 Secret Management

- Use Vault, SSM, or Doppler
- Secrets encrypted at rest (KMS/AES256)
- Rotate Discord, Google, Twitter client secrets quarterly

### 🛠️ Network & Infra

- WAF on all APIs (Cloudflare)
- SSL/TLS enforced
- Admin panels (if any) behind VPN or IP whitelist
- No direct DB port access

---

## 7. Package & Dependency Security

### 📦 Package Hygiene

- Lock via `package-lock.json`
- Audit with `npm audit`, Snyk
- Auto-patch with Renovate/Dependabot
- Review all prod dependency upgrades via PR

### 🧪 Versioning

- Stick to stable semver ranges
- Test upgrades before merge
- Document high-risk packages (blockchain SDKs, wallet libs)

---

## 8. Incident Response

### 🚨 Response Flow

1. Detection (logs, alerts)
2. Containment (disable route, revoke keys)
3. Communication (Slack/Discord → ops/security)
4. Patch + deploy hotfix
5. Post-mortem review

### 📇 Escalation Contacts

- Security Lead
- Backend/Infra Dev
- Blockchain Ops
- Legal (breach)
- External Auditors (for smart contracts)

---

## 9. API Key Best Practices

- Store only in secret managers
- Keys scoped by feature (analytics, content, minting)
- Revoked if misused
- Logged per usage with `x-api-version`

Example:

```ts
// Request headers
{
  'Content-Type': 'application/json',
  'x-api-key': '<key>',
  'x-api-version': '1.0',
  'Accept': 'application/vnd.tourii.1.0+json'
}
```

---

## 🔍 Memory Wall & Feed Security Considerations

- `memory_feed` is a SQL VIEW
- Logs sourced from `user_story_log`, `user_travel_log`, `user_quest_log`
- Future: like/comment system should inherit per-row RLS from underlying logs
- Prevent abuse by rate-limiting feed writes (especially travel)

```sql
CREATE VIEW memory_feed AS
SELECT user_id, 'TRAVEL' AS type, tourist_spot_id AS related_id, travel_distance, ins_date_time AS created_at FROM user_travel_log
UNION
SELECT user_id, 'QUEST', quest_id, NULL, completed_at FROM user_quest_log WHERE status = 'COMPLETED'
UNION
SELECT user_id, 'STORY', story_id, NULL, finished_at FROM user_story_log WHERE status = 'COMPLETED';
```

---

## 📬 Reporting Vulnerabilities

If you find a security issue:

1. Do **not** disclose publicly
2. Email: `security@tourii.com`
3. Include: endpoint, reproduction, and expected behavior
4. Wait for responsible disclosure window

---

_Last Updated: May 8, 2025_
