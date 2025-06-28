# 🌸 Tourii Backend
## **Production-Ready Tourism Platform with Blockchain Integration**

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Security](https://img.shields.io/badge/Security-Production_Ready-brightgreen?style=for-the-badge&logo=shield&logoColor=white)](./docs/SECURITY.md)

> **Enterprise-grade tourism platform** combining traditional travel experiences with Web3 technology, featuring industry-standard security, optimized performance, and cost-efficient Google Places API integration (85-90% cost reduction).

---

## 🚀 **Quick Start for New Developers**

### **⚡ 5-Minute Setup**

```bash
# 1. Clone & install
git clone [repo-url] && cd tourii-backend && pnpm install

# 2. Start databases
cd etc/docker && docker-compose up db test_db -d

# 3. Environment & database
cp .env.example .env && pnpm prisma:migrate:dev && pnpm prisma:db:execute

# 4. Seed test data & start
npx tsx prisma/seed-new.ts && pnpm start:dev:tourii-backend
```

**🎯 Ready!** API available at `http://localhost:4000` • Test wallet passes at `/api/passport/alice/wallet/apple`

---

## 📊 **Architecture Overview**

**🏗️ Modern NestJS Monorepo** with Domain-Driven Design
- **Two Services**: Main API (Port 4000) + Blockchain Service (Port 3001)  
- **Clean Architecture**: Domain → Infrastructure → Application → Interface layers
- **Production-Ready**: Redis caching, PostgreSQL, comprehensive security

> **📖 Complete Architecture Documentation**: See [System Architecture Guide](./docs/SYSTEM_ARCHITECTURE.md) for detailed technical architecture, patterns, and design decisions.

---

## 🎯 **Core Features & Capabilities**

### **🔐 Authentication & Security**
- **Multi-Provider Auth**: Discord, Google, Twitter, Web3 wallets
- **JWT Security**: Access/refresh tokens with rotation
- **Role-Based Access**: USER → MODERATOR → ADMIN hierarchy
- **Production Security**: All critical vulnerabilities resolved

### **📚 Interactive Storytelling**
- **Chapter-Based Narratives**: Rich media content tied to real locations
- **Progress Tracking**: Story completion status and rewards
- **Character Integration**: Story characters linked to quest narratives
- **Media Support**: Videos, PDFs, real-world imagery

### **🎮 Gamified Quest System**
- **7 Task Types**: Location visits, photo uploads, QR scanning, social sharing, text answers, multiple choice, group activities
- **Anti-Cheat Protection**: GPS tolerance, QR uniqueness, social verification
- **Reward System**: Magatama points, progression levels, achievement tracking
- **Group Coordination**: Multi-user quest collaboration

### **📱 Digital Passport & Wallet Integration**
- **Apple Wallet**: Native .pkpass generation with certificate handling
- **Google Wallet**: Production Google Pay integration with service accounts
- **Cross-Platform**: Unified API generating both wallet formats
- **QR Verification**: Dual-tier expiration (24h PDFs, 2-year wallet passes)
- **Mock Testing**: 6+ user personas for comprehensive development

### **🗺️ Smart Location Intelligence**
- **Cost-Optimized Google Places**: 85-90% API cost reduction with hybrid fallback
- **Weather Integration**: Location-aware climate data with caching
- **AI Route Discovery**: 3-step unified route recommendation (region → interests → routes)
- **Real-Time Verification**: GPS-based check-ins and location validation

### **🤖 AI-Powered Route Recommendation System**
- **3-Step User Flow**: Region selection → Interest discovery → Unified route results
- **Hybrid Results**: Combines existing curated routes with AI-generated recommendations
- **Smart Clustering**: Geographic proximity clustering with Haversine formula (1-200km radius)
- **OpenAI Integration**: GPT-4o-mini content generation with cost optimization
- **Regional Intelligence**: Dynamic hashtag filtering based on geographic regions
- **Performance Optimized**: Intelligent caching, rate limiting, and batch processing

### **⛓️ Blockchain Integration**
- **Digital Passport NFTs**: Travel credentials on Vara Network
- **Progressive Levels**: BONJIN → E_CLASS → D_CLASS → C_CLASS → B_CLASS → A_CLASS → S_CLASS
- **NFT Rewards**: Achievement tokens and travel perks
- **Smart Contracts**: Gear.js and Sails.js integration

### **👑 Advanced Admin Management**
- **User Analytics**: Comprehensive user metrics with filtering and search
- **Task Verification**: Manual approval system for photo/social submissions
- **Real-Time Monitoring**: Activity tracking and engagement analytics
- **Advanced Search**: Multi-field search across usernames, emails, social handles

---

## 📖 **Documentation Quick Navigation**

### **🚀 Getting Started**
| Document | Purpose | Time to Read | Target Audience |
|----------|---------|-------------|-----------------|
| [**🔧 Setup Guide**](README.md#-quick-start-for-new-developers) | 5-minute onboarding guide | 5 min | New developers |
| [**🔗 API Examples**](./docs/API_EXAMPLES.md) | Real-world usage patterns | 10 min | Frontend developers |
| [**🌱 Seeding Guide**](./docs/SEEDING_GUIDE.md) | Database setup & test data | 5 min | Backend developers |

### **🏗️ Architecture & Design**
| Document | Purpose | Time to Read | Target Audience |
|----------|---------|-------------|-----------------|
| [**🏗️ System Architecture**](./docs/SYSTEM_ARCHITECTURE.md) | Complete technical architecture | 15 min | All developers |
| [**🗃️ Database Guide**](./docs/DATABASE.md) | Database schema & operations | 10 min | Backend developers |
| [**🧪 Testing Strategy**](./docs/TESTING_STRATEGY.md) | Testing philosophy & examples | 10 min | All developers |

### **🔒 Security & Operations**
| Document | Purpose | Time to Read | Target Audience |
|----------|---------|-------------|-----------------|
| [**🔒 Security Guide**](./docs/SECURITY.md) | Security best practices | 8 min | All developers |
| [**⚠️ Error Codes**](./docs/ERROR_CODES.md) | Complete error reference | 5 min | All developers |

### **📱 Advanced Features**
| Document | Purpose | Time to Read | Target Audience |
|----------|---------|-------------|-----------------|
| [**🤖 AI Route Integration**](./FRONTEND_INTEGRATION_GUIDE.md) | Complete 3-step route discovery | 12 min | Frontend developers |
| [**Quest System Guide**](./docs/quest/Tourii%20Group%20Quest%20System%20-%20Complete%20Guide.md) | Group quest mechanics | 8 min | Game developers |
| [**Wallet Integration Docs**](./docs/wallet-integration/) | Apple/Google wallet setup | 10 min | Mobile developers |
| [**Passport NFT Guide**](./docs/user/Tourii%20Passport%20NFT%20metadata%20delivery.md) | Blockchain passport system | 8 min | Web3 developers |

---

## 🚧 **Development Workflow**

### **📋 Common Commands**

```bash
# 🎯 Development
pnpm start:dev                    # Start all services
pnpm start:dev:tourii-backend     # Main API only (Port 4000)
pnpm start:dev:tourii-onchain     # Blockchain service only (Port 3001)

# 🏗️ Build & Production
pnpm build                        # Build all applications
pnpm build:tourii-backend         # Build backend only
pnpm start:prod                   # Run production build

# 🧪 Testing
pnpm test                         # Unit tests (70% of test suite)
pnpm test:watch                   # Watch mode for TDD
pnpm test:cov                     # Coverage report (80% minimum)
pnpm test:e2e:app                 # End-to-end tests (10% of suite)
pnpm test:integration             # Integration tests (20% of suite)

# 🗃️ Database Operations
pnpm prisma:migrate:dev           # Apply migrations (dev DB - port 7442)
pnpm prisma:migrate:test          # Apply migrations (test DB - port 7443)
pnpm prisma:studio                # Database visual editor
npx tsx prisma/seed-new.ts        # Modular seeding (recommended)
npx tsx prisma/seed-new.ts --users-only     # Seed only users
npx tsx prisma/seed-new.ts --clean          # Clean & reseed

# 📝 Code Quality
pnpm format                       # Format all code (Biome + Prettier)
pnpm lint                         # Run linter with autofix
pnpm check                        # Biome check with corrections

# 📚 Documentation
pnpm update:openapi               # Regenerate API docs
pnpm docs:api                     # Build API documentation HTML

# 🔒 Security Testing
bash tourii-backend/test/security-test.sh    # Linux/Mac
.\tourii-backend\test\security-test.ps1      # Windows PowerShell
```

### **📱 Quick API Testing (Wallet Integration)**

```bash
# Apple Wallet Pass Generation
curl "http://localhost:4000/api/passport/alice/wallet/apple" \
  -H "accept-version: 1.0.0" \
  -H "x-api-key: dev-key"

# Google Wallet Pass Generation  
curl "http://localhost:4000/api/passport/bob/wallet/google" \
  -H "accept-version: 1.0.0" \
  -H "x-api-key: dev-key"

# Cross-Platform Generation
curl "http://localhost:4000/api/passport/charlie/wallet/both" \
  -H "accept-version: 1.0.0" \
  -H "x-api-key: dev-key"

# QR Code Verification Statistics
curl "http://localhost:4000/api/verify/stats/alice" \
  -H "accept-version: 1.0.0" \
  -H "x-api-key: dev-key"
```

### **🤖 AI Route Discovery (3-Step Flow)**

```bash
# Step 1: Get Available Regions (from existing routes)
curl "http://localhost:4000/routes" \
  -H "accept-version: 1.0.0" \
  -H "x-api-key: dev-key"
# Extract unique regions from response: ["Tokyo", "Osaka", "Kyoto", ...]

# Step 2: Get Regional Hashtags for Interest Selection
curl -X POST "http://localhost:4000/ai/routes/hashtags/available" \
  -H "accept-version: 1.0.0" \
  -H "x-api-key: dev-key" \
  -H "Content-Type: application/json" \
  -d '{"region": "Tokyo"}'
# Returns: {"topHashtags": [{"hashtag": "food", "count": 25}, ...]}

# Step 3: Get Unified Route Recommendations (Existing + AI Generated)
curl -X POST "http://localhost:4000/ai/routes/recommendations" \
  -H "accept-version: 1.0.0" \
  -H "x-api-key: dev-key" \
  -H "x-user-id: alice" \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": ["food", "anime"],
    "mode": "any",
    "region": "Tokyo",
    "proximityRadiusKm": 50,
    "maxRoutes": 3
  }'
# Returns: {"existingRoutes": [...], "generatedRoutes": [...], "summary": {...}}
```

---

## ⚙️ **Environment Configuration**

### **🔐 Required Security Variables**

```env
# 🔑 Authentication & Security (REQUIRED)
JWT_SECRET=<strong-random-64-char-string>     # openssl rand -base64 64
ENCRYPTION_KEY=<strong-random-32-char-string> # openssl rand -hex 32
API_KEYS=<comma-separated-api-keys>           # Strong random keys

# 🗺️ External APIs (Cost-Optimized)
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_PLACES_API_KEY=your_google_places_key  # New Places API for 85-90% savings
OPEN_WEATHER_API_KEY=your_weather_api_key

# 🤖 AI Route Recommendation (OPTIONAL)
OPENAI_API_KEY=your_openai_api_key              # For AI content generation
OPENAI_MODEL=gpt-4o-mini                        # Cost-effective model
THROTTLE_TTL=60000                              # Rate limiting window (1 min)
THROTTLE_LIMIT=10                               # Max requests per window

# 📱 Wallet Integration (NEW)
GOOGLE_WALLET_ISSUER_ID=your_google_wallet_issuer_id
GOOGLE_WALLET_CLASS_ID=tourii-passport
GOOGLE_WALLET_KEY_PATH=path/to/service-account-key.json
APPLE_WALLET_CERT_PATH=path/to/apple-cert.p12
APPLE_WALLET_CERT_PASSWORD=your_cert_password
WALLET_PASS_QR_TOKEN_EXPIRATION_HOURS=17520   # 2 years for wallet passes
PASSPORT_PDF_QR_TOKEN_EXPIRATION_HOURS=24     # 24h for PDF security

# ☁️ Storage & Infrastructure
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_BUCKET=tourii-production
R2_PUBLIC_DOMAIN=https://cdn.tourii.xyz
REDIS_URL=redis://localhost:6379

# ⛓️ Blockchain
PROVIDER_URL=https://rpc.vara.network
CONTRACT_ADDRESS=0x...
NFT_STORAGE_KEY=...
```

### **🚀 Database Setup**

```bash
# Development Database (Port 7442)
DATABASE_URL=postgresql://touriibackenddev:touriibackenddev@localhost:7442/tourii_backend

# Test Database (Port 7443) - Complete isolation
DATABASE_URL=postgresql://touriibackendtest:touriibackendtest@localhost:7443/tourii_backend_test
```

---

## 🎯 **API Reference**

### **🔑 Required Headers**
```bash
x-api-key: your-api-key           # API authentication
accept-version: 1.0.0             # API version
x-user-id: user-id                # User context (for user-specific endpoints)
Content-Type: application/json    # JSON requests
```

### **🎯 Core Endpoints**

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **System** | `/health-check` | GET | API health status |
| **Auth** | `/auth/signup` | POST | User registration |
| **User** | `/user/me` | GET | Current user profile |
| **Stories** | `/stories/sagas` | GET | Available story sagas |
| **Quests** | `/quests` | GET | Quest list with pagination |
| **Tasks** | `/tasks/{id}/qr-scan` | POST | QR code verification |
| **Location** | `/location-info` | GET | Google Places search |
| **AI Routes** | `/ai/routes/hashtags/available` | POST | Get regional hashtags |
| **AI Routes** | `/ai/routes/recommendations` | POST | Unified route discovery |
| **Admin** | `/admin/users` | GET | User management |
| **Wallets** | `/api/passport/{id}/wallet/apple` | GET | Apple Wallet pass |
| **Wallets** | `/api/passport/{id}/wallet/google` | GET | Google Wallet pass |
| **Verify** | `/api/verify/stats/{id}` | GET | QR verification stats |

### **📊 Interactive API Documentation**
- **Swagger UI**: `http://localhost:4000/api`
- **OpenAPI Spec**: `etc/openapi/openapi.json`
- **Generated Types**: `etc/openapi/openapi.d.ts`

---

## 🧬 **Database Schema Highlights**

### **👤 User Management**
```sql
user                    # Core user data with multi-provider auth
user_info              # Extended profile with game metrics & passport data
user_achievement       # Progress tracking and milestones
user_task_log          # Granular task completion tracking
user_travel_log        # GPS tracking and check-ins
```

### **📚 Content & Narrative**
```sql
story                  # Story sagas (e.g., "Bungo Ono", "Aomori")
story_chapter          # Individual narrative chapters with rich media
model_route            # Travel routes connecting locations
tourist_spot           # Real-world destinations with GPS coordinates
```

### **🎮 Gaming System**
```sql
quest                  # Location-based challenges
quest_task             # Individual tasks within quests (7 types supported)
level_requirement_master # Progression system requirements
onchain_item_catalog   # NFT and reward catalog
```

### **⛓️ Blockchain Integration**
```sql
user_onchain_item      # User-owned blockchain assets
digital_passport       # Travel credential system
passport_metadata      # NFT metadata for blockchain
```

---

## 🏆 **Recent Achievements (June 2025)**

### **💰 Cost Optimization**
- **85-90% Google Places API cost reduction** through hybrid optimization
- **API call reduction**: 56 Places + 15 Geocoding → ~4 Text Search calls
- **Performance maintained**: Response times improved with reliability

### **📱 Digital Passport & Wallet Integration**
- **Apple Wallet**: Complete .pkpass generation with certificate handling
- **Google Wallet**: Production-ready Google Pay integration with real API
- **Cross-Platform**: Unified API for both wallet formats
- **QR Verification**: Secure JWT-based tokens with dual expiration

### **🔐 Security Hardening**
- **Zero Critical Vulnerabilities**: All 5 critical security issues resolved
- **Type Safety**: Eliminated `any` types, proper TypeScript generics
- **Environment Security**: Required variables, no default fallbacks
- **Comprehensive Error Handling**: 30+ structured error codes

### **🎯 Enhanced Task Management**
- **QR Code Scanning**: Secure verification with robust validation
- **Social Media Integration**: Multi-platform sharing verification
- **Photo Upload System**: Enhanced R2 integration with validation
- **Local Interaction Tasks**: Cultural immersion experiences
- **Group Quest Coordination**: Advanced multi-user collaboration

### **⚡ Performance Optimization**
- **Database Performance**: 60-80% query speed improvement
- **N+1 Query Elimination**: Optimized authentication and data loading
- **Cache Strategy**: Granular invalidation, 85% cache hit rate improvement

### **🤖 AI Route Recommendation System (June 2025)**
- **3-Step User Flow**: Region selection → Interest discovery → Unified route results
- **Hybrid Intelligence**: Combines 150+ curated routes with AI-generated recommendations
- **Smart Clustering**: Geographic proximity algorithm with configurable 1-200km radius
- **Cost-Optimized AI**: GPT-4o-mini integration with intelligent caching and fallbacks
- **Regional Intelligence**: Dynamic hashtag filtering based on tourist spot data
- **Complete Frontend Guide**: React/Next.js components with TypeScript interfaces

### **📚 Documentation Excellence**
- **8 Comprehensive Docs**: Complete coverage of all system aspects
- **5-Minute Onboarding**: Quick start guide for new developers
- **Real-World Examples**: Practical API usage with curl commands
- **Complete Error Reference**: 30+ error codes with solutions
- **AI Route Integration Guide**: Complete frontend implementation examples

---

## 🛠️ **Tech Stack Details**

| Category | Technology | Purpose | Version |
|----------|------------|---------|---------|
| **Framework** | NestJS | TypeScript backend framework | 10.4.15+ |
| **Language** | TypeScript | Type-safe development | 5.0+ |
| **Database** | PostgreSQL + Prisma | Primary data storage with ORM | 14+ / 6.5.0+ |
| **Cache** | Redis | Session management and API caching | 7+ |
| **Blockchain** | Vara Network (Gear.js/Sails.js) | NFT minting and digital passports | Latest |
| **Storage** | CloudFlare R2 | Global CDN and file storage | Latest |
| **Authentication** | JWT + Passport.js | Multi-provider auth system | Latest |
| **Validation** | Zod + nestjs-zod | Runtime type validation | 3.25+ |
| **Testing** | Jest + Supertest | Comprehensive test coverage | Latest |
| **Code Quality** | Biome + Prettier | Linting and formatting | Latest |
| **Documentation** | OpenAPI/Swagger | API documentation | 3.0 |

---

## 🚀 **Ready to Start?**

### **👋 For New Team Members**
1. **Quick Setup**: Follow [README.md setup section](README.md#-quick-start-for-new-developers) (5 minutes)
2. **Understand Architecture**: Read [System Architecture](./docs/SYSTEM_ARCHITECTURE.md) (15 minutes)
3. **Try API Examples**: Use [API Examples](./docs/API_EXAMPLES.md) (10 minutes)
4. **Test Key Features**: Try wallet generation and AI route discovery using the examples above
5. **Explore AI Routes**: Use the 3-step flow to discover personalized travel recommendations

### **💬 Need Help?**
- **🔧 Development Issues**: Check [README.md setup section](README.md)
- **🏗️ Architecture Questions**: See [System Architecture](./docs/SYSTEM_ARCHITECTURE.md)
- **🔒 Security Guidance**: Review [Security Guide](./docs/SECURITY.md)
- **⚠️ Error Debugging**: Use [Error Codes Reference](./docs/ERROR_CODES.md)
- **📱 Wallet Integration**: Check [Wallet Integration Docs](./docs/wallet-integration/)

### **🎯 Key Success Metrics**
- **🔒 Security**: Production-ready with zero critical vulnerabilities
- **💰 Cost Efficiency**: 85-90% reduction in Google Places API costs
- **⚡ Performance**: 60-80% query speed improvement, <200ms response times
- **📱 Innovation**: First-class wallet integration with Apple & Google Pay
- **🧪 Quality**: 80%+ test coverage with comprehensive test strategy
- **📚 Documentation**: Complete coverage enabling 5-minute developer onboarding

---

**🎉 Welcome to the Tourii Backend - where traditional travel meets cutting-edge technology!**

_Last Updated: June 26, 2025_