# 📦 Tourii Backend

<p align="center">
  <img src="../public/logo.png" width="200" alt="Tourii Logo" />
</p>

<p align="center">Backend Services for the Tourii Tourism Platform</p>

---

## 📘 Overview

The **Tourii Backend** powers the core APIs, blockchain integration, gamified logic, and user management features of the Tourii tourism ecosystem. Built on NestJS and Prisma, it supports Web2 and Web3 authentication, location-based quests, NFT interactions, and rich narrative storytelling.

---

## 🚀 Core Capabilities

### 🔐 Authentication & Roles

- Social logins (Discord, Google, Twitter)
- Web3 wallet login (EIP-191)
- JWT/refresh token with rotation
- Role-based access (User, Admin, Moderator, etc.)

### 📖 Story & Saga Engine

- Saga/chapter/story modeling
- Chapter media (videos, PDFs, real-world imagery)
- Character references & saga-based map visuals

### 🗺️ Quest & Travel Engine

- Multi-step quests linked to tourist spots
- Task types: check-in, upload photo, answer text, select options
- Travel verification via GPS/QR code
- Reward assignment with Magatama points

### 🎮 Gamification & Memory Wall

- Achievement tracking, quest logs, and user journey logging
- Memory feed view combining story, travel, and quest events
- Points-based progression system (LevelType)

### 🧬 Web3 Integration

- Digital Passport & Log NFT minting (on login)
- Onchain item tracking (status, tx hash, metadata)
- Catalog management of NFT types & blockchain traits

### 👥 Discord Integration

- Role mapping & community-based reward logs
- Discord activity tracking (e.g., messages, voice)
- Invite-based growth tracking and role rewards

---

## 🛠️ Tech Stack

| Category   | Tech                                                               |
| ---------- | ------------------------------------------------------------------ |
| Framework  | [NestJS](https://nestjs.com)                                       |
| Database   | [PostgreSQL](https://postgresql.org) + [Prisma](https://prisma.io) |
| Auth       | [Passport.js](http://www.passportjs.org), [JWT](https://jwt.io)    |
| Blockchain | [ethers.js](https://docs.ethers.org), [Gear.js], [Sails.js]        |
| Storage    | [IPFS](https://ipfs.io), [NFT.Storage](https://nft.storage)        |
| Cache      | [Redis](https://redis.io)                                          |
| Docs       | Swagger + OpenAPI                                                  |

---

## 📁 Project Structure

```
tourii-backend/
├── apps/
│   ├── tourii-backend/       # Main API (NestJS)
│   └── tourii-onchain/       # Blockchain logic
├── libs/core/                # Shared utils (guards, decorators)
├── prisma/                   # Prisma schema, migrations, ERD
├── etc/openapi/              # OpenAPI spec files
```

---

## 🚧 Getting Started

### 🧾 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis
- pnpm (preferred)

### 🧪 Setup

```bash
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm start:dev
```

---

## 🔐 Environment Variables

```env
# Core App
PORT=3000
NODE_ENV=development

# Database
DATABASE_SCHEMA=touriidev
MIGRATION_URL=postgresql://user:pass@localhost:5432/tourii?schema=touriidev
DATABASE_URL=postgresql://user:pass@localhost:5432/tourii?schema=touriidev

# Auth
JWT_SECRET=supersecret
JWT_EXPIRATION=15m

# Web3
CHAIN_ID=1116
PROVIDER_URL=https://rpc.vara.network
CONTRACT_ADDRESS=0x...
NFT_STORAGE_KEY=...

# Redis
REDIS_URL=redis://localhost:6379
```

---

## 🔧 Common Commands

```bash
# Run dev server
pnpm start:dev

# Format code
pnpm format

# Lint
pnpm lint

# Test
pnpm test
pnpm test:e2e
pnpm test:cov

# Test Security (Use Testing Controller) - bash
chmod +x tourii-backend/test/security-test.sh
bash tourii-backend/test/security-test.sh

# Test Security (Use Testing Controller) - powershell
.\tourii-backend\test\security-test.ps1
```

---

## 🧬 Database Schema Highlights

**🔐 User & Auth**

- `user`, `user_info`, `user_achievement`
- Supports social + wallet login

**🗺️ Story & Travel**

- `story`, `story_saga`, `tourist_spot`, `model_route`
- Media-rich storytelling tied to GPS coordinates

**🎯 Quest & Tasks**

- `quest`, `quest_task`, `user_quest_log`, `user_travel_log`
- Flexible reward types + point system

**🎮 Memory Feed**

- SQL view `memory_feed` joins user quest, travel, and story progress

**🧾 Onchain Items & NFTs**

- `onchain_item_catalog`, `user_onchain_item`
- Minting logic + catalog for Digital Passports, Log NFTs, Perks

**🎭 Community & Discord**

- `discord_activity_log`, `discord_user_roles`, `discord_rewarded_roles`

More: [Database Docs](../prisma/docs/tourii-db-docs.md)

---

## 📖 API Docs (Swagger)

Available at [`http://localhost:3000/api`](http://localhost:3000/api) with:

- Auth routes
- Quest endpoints
- Story saga navigation
- NFT mint status

---

## ⚙️ Deployment

### Build & Run

```bash
pnpm build
pnpm start:prod
```

### Cloud Targets

- Vercel (for frontend)
- AWS (App Runner / ECS)
- Railway or Render for staging

### CI/CD

- GitHub Actions for lint/test/build
- Deploys to Vercel and runs Supabase migrations via `.github/workflows/deploy.yml` (seed not run)
- Secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `MIGRATION_URL`, `DATABASE_URL`) via GitHub Encrypted Secrets or Doppler

---

## 🔐 Security Considerations

- Row-Level Security via Prisma middleware
- Token validation on all API access
- Contract signing verified client-side before relay
- All logs tracked by `request_id`

For full details: [Security Guidelines](../docs/security-guidelines.md)

---

## 🧪 Blockchain Integration

**Gear.js**: Contract deployment, message encoding, key mgmt  
**Sails.js**: On-chain business logic, rewards, renewals

Supports:

- Digital Passport minting
- Reward claim tx submission
- NFT catalog metadata sync

---

## 📬 Contact

Email: `dev@tourii.com`  
Security: `security@tourii.com`

License: [MIT](LICENSE)

_Last Updated: May 8, 2025_
