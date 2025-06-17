# 🌸 Tourii Backend

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

> A sophisticated tourism platform backend combining traditional travel experiences with Web3 technology and NFT digital passports.

## 🚀 **Quick Start**

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 3. Setup database
pnpm prisma:migrate:dev

# 4. Seed database (new modular system)
npx tsx prisma/seed-new.ts

# 5. Start development server
pnpm start:dev
```

**🎯 Ready to go! API available at `http://localhost:4000`**

## 📖 **Documentation Quick Links**

| Document | Purpose | Audience |
|----------|---------|----------|
| [**🔧 Development Setup**](./docs/DEVELOPMENT_SETUP.md) | 5-minute onboarding guide | New developers |
| [**🏗️ System Architecture**](./docs/SYSTEM_ARCHITECTURE.md) | Complete architecture & patterns | All developers |
| [**🔒 Security Guide**](./docs/SECURITY.md) | Security best practices & fixes | All developers |
| [**🗃️ Database Guide**](./docs/DATABASE.md) | Database operations | Backend developers |
| [**🌱 Seeding Guide**](./docs/SEEDING_GUIDE.md) | Data seeding system | Backend developers |
| [**🔗 API Examples**](./docs/API_EXAMPLES.md) | Real-world API usage & integration | Frontend developers |
| [**⚠️ Error Codes**](./docs/ERROR_CODES.md) | Complete error reference | All developers |
| [**🧪 Testing Strategy**](./docs/TESTING_STRATEGY.md) | Testing philosophy & implementation | All developers |

## 🏗️ **Architecture Overview**

```mermaid
graph TB
    subgraph "Client Applications"
        FE[Frontend App]
        MOBILE[Mobile App]
    end
    
    subgraph "API Gateway"
        SECURITY[Security Middleware]
        CORS[CORS Handler]
        RATE[Rate Limiting]
        AUTH[Authentication]
    end
    
    subgraph "Applications"
        BACKEND[tourii-backend<br/>Main API Server]
        ONCHAIN[tourii-onchain<br/>Web3 Service]
    end
    
    subgraph "Core Library"
        DOMAIN[Domain Layer<br/>Business Logic]
        INFRA[Infrastructure Layer<br/>Data Access]
        PROVIDER[Providers<br/>External Services]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL<br/>Primary Database)]
        REDIS[(Redis<br/>Cache & Sessions)]
        S3[Cloudflare R2<br/>File Storage]
    end
    
    subgraph "External APIs"
        GOOGLE[Google Maps API]
        WEATHER[Weather API]
        BLOCKCHAIN[Vara Network<br/>Blockchain]
    end
    
    FE --> SECURITY
    MOBILE --> SECURITY
    SECURITY --> CORS
    CORS --> RATE
    RATE --> AUTH
    AUTH --> BACKEND
    AUTH --> ONCHAIN
    
    BACKEND --> DOMAIN
    ONCHAIN --> DOMAIN
    DOMAIN --> INFRA
    INFRA --> PROVIDER
    
    PROVIDER --> PG
    PROVIDER --> REDIS
    PROVIDER --> S3
    PROVIDER --> GOOGLE
    PROVIDER --> WEATHER
    PROVIDER --> BLOCKCHAIN
```

### **🎯 Core Features**

- **🔐 Multi-Provider Authentication**: Discord, Google, Twitter, Web3 wallets
- **📚 Interactive Storytelling**: Chapter-based narratives with progress tracking
- **🗺️ Smart Route Planning**: AI-powered tourist route optimization with cost-optimized Google Places API
- **🎮 Gamified Quests**: Location-based challenges with rewards
- **🎫 Digital Passport NFTs**: Blockchain-verified travel credentials
- **⚡ Real-time Features**: WebSocket-based live interactions
- **🌍 Weather Integration**: Location-aware weather data
- **📊 Advanced Analytics**: User behavior and content performance metrics

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
pnpm run prisma:migrate:dev
pnpm run prisma:db:execute
pnpm start:dev
```

---

## 🔐 Environment Variables

```env
# Core App
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/tourii

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
# AWS S3 / R2
AWS_REGION=auto
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_ENDPOINT_DEV=http://localhost:9000
R2_BUCKET=tourii-dev
R2_PUBLIC_DOMAIN=https://cdn.tourii.xyz
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

## 📋 API Reference

The Tourii Backend provides two main API services:

### 🎯 Main API Service (`/`)
**Base URL**: `http://localhost:3000`

All endpoints require these headers:
- `x-api-key`: API key for authentication
- `accept-version`: API version (e.g., 1.0.0)

#### 🔧 Health & System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health-check` | API health status |

#### 👤 User & Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | User signup with social/wallet auth |
| `POST` | `/login` | User login |
| `POST` | `/user` | Create new user |
| `GET` | `/user/me` | Get current user profile |
| `GET` | `/user/sensitive-info` | Get user sensitive information |

#### 📚 Stories & Chapters

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/stories/create-saga` | Create story saga |
| `POST` | `/stories/create-chapter/:storyId` | Create story chapter |
| `POST` | `/stories/update-saga` | Update story saga |
| `POST` | `/stories/update-chapter` | Update story chapter |
| `GET` | `/stories/sagas` | Get all story sagas |
| `GET` | `/stories/sagas/:storyId/chapters` | Get chapters by story ID |
| `POST` | `/stories/chapters/:chapterId/progress` | Track chapter reading progress |
| `DELETE` | `/stories/:storyId` | Delete story saga |
| `DELETE` | `/stories/chapters/:chapterId` | Delete story chapter |

#### 🗺️ Routes & Tourist Spots

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/routes/create-model-route` | Create model route |
| `POST` | `/routes/create-tourist-spot/:modelRouteId` | Create tourist spot |
| `POST` | `/routes/update-model-route` | Update model route |
| `POST` | `/routes/update-tourist-spot` | Update tourist spot |
| `GET` | `/routes` | Get all model routes |
| `GET` | `/routes/:id` | Get model route by ID |
| `GET` | `/routes/tourist-spots/:storyChapterId` | Get tourist spots by chapter |
| `GET` | `/location-info` | Get location info with Google Places |
| `DELETE` | `/routes/:modelRouteId` | Delete model route |
| `DELETE` | `/routes/tourist-spot/:touristSpotId` | Delete tourist spot |

#### 🎯 Quests & Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/quests` | Get quests with pagination & filters |
| `GET` | `/quests/:questId` | Get quest by ID |
| `GET` | `/quests/tourist-spot/:touristSpotId` | Get quests by tourist spot |
| `POST` | `/quests/create-quest` | Create new quest |
| `POST` | `/quests/create-task/:questId` | Create quest task |
| `POST` | `/quests/update-quest` | Update quest |
| `POST` | `/quests/update-task` | Update quest task |
| `POST` | `/quests/tasks/:taskId/photo-upload` | Upload task photo |
| `DELETE` | `/quests/:questId` | Delete quest |
| `DELETE` | `/quests/tasks/:taskId` | Delete quest task |

#### 👥 Group Quests

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/quests/:questId/group/members` | Get group members |
| `POST` | `/quests/:questId/group/start` | Start group quest |

#### 📱 Moments & Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/moments` | Get latest traveler moments |

#### 🏠 Homepage

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v2/homepage/highlights` | Get homepage highlights |

### ⛓️ Blockchain API Service (`/`) 
**Base URL**: `http://localhost:3001` (tourii-onchain service)

#### 🔧 Health & System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health-check` | API health status |

#### 🔐 Keyring Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/keyring/address` | Get user keyring address |
| `POST` | `/keyring/login` | Login user with keyring |
| `POST` | `/keyring/register` | Register new user |
| `POST` | `/keyring/logout` | Logout user |

#### ⛓️ Blockchain Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/send-green` | Send green transaction |
| `POST` | `/send-yellow` | Send yellow transaction |
| `POST` | `/send-red` | Send red transaction |
| `GET` | `/read-state` | Read blockchain state |

### 📊 Query Parameters

#### Quest Filtering (`/quests`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `isPremium`: Filter by premium status
- `isUnlocked`: Filter by unlocked status
- `questType`: Filter by quest type (SOLO, GROUP, etc.)
- `userId`: User ID for personalized results

#### Location Search (`/location-info`)
- `query`: Place name or search query (required)
- `latitude`: Latitude for location bias
- `longitude`: Longitude for location bias
- `address`: Address for enhanced search accuracy

#### Moments (`/moments`)
- `page`: Page number
- `limit`: Items per page
- `momentType`: Filter by moment type

### 🔒 Authentication

Most endpoints require authentication via:
1. **API Key**: `x-api-key` header
2. **Version**: `accept-version` header
3. **User Context**: `x-user-id` header (temporary, will be replaced with JWT)

### 📝 Response Formats

All API responses follow consistent formatting:
- **Success**: JSON objects/arrays with relevant data
- **Error**: Standardized error objects with `code`, `message`, and `type` fields
- **Pagination**: Includes `total`, `page`, `limit`, and `data` arrays

### 🔍 API Documentation

Interactive API documentation is available at:
- **Swagger UI**: `http://localhost:3000/api`
- **OpenAPI Spec**: `etc/openapi/openapi.json`
- **Generated Types**: `etc/openapi/openapi.d.ts`

---

## 🧬 Database Schema Highlights

**🔐 User & Auth**

- `user`, `user_info`, `user_achievement`
- Supports social + wallet login

**🗺️ Story & Travel**

- `story`, `story_saga`, `tourist_spot`, `model_route`
- Media-rich storytelling tied to GPS coordinates

**🎯 Quest & Tasks**

- `quest`, `quest_task`, `user_task_log`, `user_travel_log`
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
- Secrets via GitHub Encrypted Secrets or Doppler

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
