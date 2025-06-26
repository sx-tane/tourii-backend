# CLAUDE.md
## **Complete Developer Guide for Claude Code & Future Developers**

This file provides comprehensive guidance for Claude Code (claude.ai/code) and serves as the ultimate reference for future developers working with the tourii-backend codebase.

---

## 📋 **Quick Navigation for New Developers**

### **⚡ First 30 Minutes - Essential Reading Order**

1. **🚀 [Quick Setup](#common-development-commands)** (5 min) - Get running immediately
2. **🏗️ [Architecture Overview](#high-level-architecture)** (10 min) - Understand the system
3. **📱 [Test API Features](#wallet-integration-testing)** (5 min) - Try the wallet features
4. **📚 [Documentation Links](#team-onboarding-resources)** (10 min) - Know where to find help

### **🎯 Core Concepts Summary**

- **What**: Location-based tourism platform with Web3 integration
- **Architecture**: NestJS monorepo with Domain-Driven Design
- **Key Features**: Interactive stories, gamified quests, digital wallet passes, blockchain NFTs
- **Recent Achievement**: 85-90% Google Places API cost reduction + comprehensive wallet integration
- **Security Status**: Production-ready with zero critical vulnerabilities

---

## Development Commands

> **Note**: For complete setup and development commands, see [README.md](README.md#-development-workflow) - the canonical reference for all build, test, and deployment commands.

## Architecture Reference

> **📖 Complete Architecture Details**: All architectural information has been consolidated into [System Architecture Guide](docs/SYSTEM_ARCHITECTURE.md) - the single source of truth for technical architecture, patterns, and design decisions.

## Important Guidelines from Cursor Rules

1. **Always consult documentation**: Before implementing, read:

   - `docs/SYSTEM_ARCHITECTURE.md`: Complete architecture and core features
   - `docs/SECURITY.md`: Security best practices and critical fixes
   - `docs/API_EXAMPLES.md`: Real-world API usage and integration patterns
   - `docs/DATABASE.md`: Database setup and operations guide
   - `docs/SEEDING_GUIDE.md`: New modular database seeding system
   - `docs/ERROR_CODES.md`: Complete error code reference
   - `README.md`: Quick 5-minute setup guide
   - `docs/TESTING_STRATEGY.md`: Testing philosophy and implementation

2. **Four-step development process**:

   - System Design Mode: Plan architecture before coding
   - Assumption Check: List and verify assumptions
   - Validation Loop: Self-review for potential issues
   - Execution Mode: Implement with modular, well-commented code

3. **Database considerations**:

   - Always use Prisma for database operations
   - Apply Row-Level Security (RLS) for user data
   - Use transactions for multi-step operations
   - Consider performance implications of queries

4. **API design principles**:
   - RESTful endpoints with consistent naming
   - Comprehensive OpenAPI documentation
   - Request/response validation with Zod
   - Proper HTTP status codes and error messages

## Database & Seeding System

### New Modular Seeding (Recommended)

The repository now includes a modern, modular seeding system:

- **Full seeding**: `npx tsx prisma/seed-new.ts`
- **Partial seeding**: `--users-only`, `--stories-only`, `--clean` flags
- **Template-based**: Easy customization via JSON templates
- **Organized**: Clean separation of system data, users, stories, and activities

### Seeding Guide

- See `docs/SEEDING_GUIDE.md` for complete documentation
- Use `docs/DATABASE.md` for database setup and migration instructions
- Default creates 3 test users: alice, bob, admin with different roles and levels

### Database Documentation

- Auto-generated schema docs: `prisma/docs/tourii-db-docs.md`
- Entity relationship diagram: `prisma/docs/tourii-er-diagram.md`
- Complete with field descriptions, relationships, and usage examples

## Team Onboarding Resources

### **🚀 New Developer Fast-Track Guide**

#### **First Day Setup (30 minutes total)**

```bash
# 1. Essential Environment Setup (5 min)
git clone [repo-url] && cd tourii-backend && pnpm install
cd etc/docker && docker-compose up db test_db -d
cp .env.example .env  # Edit with your API keys

# 2. Database & Data Setup (10 min)
pnpm prisma:migrate:dev && pnpm prisma:db:execute
npx tsx prisma/seed-new.ts  # Creates alice, bob, admin test users

# 3. Start Development Server (5 min)
pnpm start:dev:tourii-backend  # API at http://localhost:4000

# 4. Test Key Features (10 min)
curl "http://localhost:4000/api/passport/alice/wallet/apple" \
  -H "accept-version: 1.0.0" -H "x-api-key: dev-key"
```

#### **📚 Essential Documentation Reading Order**

| Priority | Document | Time | Purpose | When to Read |
|----------|----------|------|---------|-------------|
| **🔥 CRITICAL** | [README.md](README.md) | 5 min | Get system running | Day 1, Hour 1 |
| **🔥 CRITICAL** | [API Examples](docs/API_EXAMPLES.md) | 10 min | Real-world usage patterns | Day 1, Hour 1 |
| **⚡ HIGH** | [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | 15 min | Understand the system | Day 1, Hour 2 |
| **⚡ HIGH** | [Error Codes](docs/ERROR_CODES.md) | 5 min | Debug common issues | When stuck |
| **📖 MEDIUM** | [Database Guide](docs/DATABASE.md) | 10 min | Database operations | When working with data |
| **📖 MEDIUM** | [Security Guide](docs/SECURITY.md) | 8 min | Security best practices | Before production work |
| **📖 MEDIUM** | [Testing Strategy](docs/TESTING_STRATEGY.md) | 10 min | Testing philosophy | When writing tests |
| **📘 REFERENCE** | [Seeding Guide](docs/SEEDING_GUIDE.md) | 5 min | Database test data | When need test data |

#### **🎯 First Week Learning Path**

**Day 1: Environment & Basic Understanding**
- ✅ Complete setup and run first API call
- ✅ Read System Architecture overview
- ✅ Test wallet integration features
- ✅ Review API Examples for common patterns

**Day 2-3: Core Development Skills**
- ✅ Write your first test following Testing Strategy
- ✅ Make your first API change and test it
- ✅ Understand the database schema via Database Guide
- ✅ Practice using the error codes reference

**Day 4-5: Advanced Features**
- ✅ Implement a simple quest task
- ✅ Try wallet pass generation
- ✅ Review security practices
- ✅ Understand the blockchain integration

#### **🛠️ Development Environment Verification**

Run this checklist to verify your setup:

```bash
# ✅ Services Running
curl http://localhost:4000/health-check \
  -H "x-api-key: dev-key" -H "accept-version: 1.0.0"
# Expected: "OK"

# ✅ Database Connected
pnpm prisma:studio  # Should open at http://localhost:5555

# ✅ Test Data Available
curl http://localhost:4000/user/me \
  -H "x-api-key: dev-key" -H "accept-version: 1.0.0" -H "x-user-id: alice"
# Expected: User profile data

# ✅ Wallet Integration Working
curl http://localhost:4000/api/passport/alice/wallet/google \
  -H "x-api-key: dev-key" -H "accept-version: 1.0.0"
# Expected: Google wallet pass data

# ✅ Tests Pass
pnpm test
# Expected: All tests passing
```

#### **🚨 Common First-Day Issues & Solutions**

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Port conflicts** | "Port 7442 already in use" | `lsof -i :7442` then kill process, or change docker port |
| **Missing API keys** | "E_TB_010: API key required" | Add `x-api-key: dev-key` header to all requests |
| **Database connection** | "Connection refused" | Restart docker: `cd etc/docker && docker-compose restart` |
| **Prisma generate fails** | "Cannot find module @prisma/client" | Run `npx prisma generate` |
| **Biome not found** | "Command not found: biome" | Use `pnpm exec biome` or `npx biome` |
| **Mock data missing** | "User not found" | Run `npx tsx prisma/seed-new.ts` |

#### **📞 Getting Help**

- **🐛 Bug in code**: Check [Error Codes](docs/ERROR_CODES.md) first
- **🏗️ Architecture questions**: See [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- **🔧 Setup issues**: Follow [README.md](README.md) troubleshooting
- **📱 Wallet features**: Review [API Examples](docs/API_EXAMPLES.md) wallet section
- **🗃️ Database problems**: Use [Database Guide](docs/DATABASE.md) troubleshooting
- **🔒 Security questions**: Consult [Security Guide](docs/SECURITY.md)

### **🎓 Advanced Developer Resources**

For experienced developers diving deeper:

1. **Quest System**: `docs/quest/` - Advanced group quest mechanics and task management
2. **Wallet Integration**: `docs/wallet-integration/` - Production deployment guides for Apple/Google
3. **Blockchain Integration**: `docs/web3/` - Smart contract interactions and NFT systems
4. **Admin API**: `etc/http/user-request/` - Comprehensive admin API test examples

## 💰 Recent Cost Optimization Achievements

### Google Places API Cost Reduction (June 2025)

Successfully implemented **hybrid cost-optimization strategy** for Google Places API:

- **85-90% cost reduction**: From $2.80-$3.50 to $0.12-$0.28 per 4 locations
- **API call reduction**: From 56 Places + 15 Geocoding to ~4 Text Search calls
- **Hybrid reliability**: New Places API with automatic fallback to legacy API
- **Implementation files**: `geo-info-repository-api.ts` and `location-info-repository-api.ts`

### Enhanced Task Management System (June 2025)

Implemented comprehensive task management and quest system improvements:

- **QR Code Scanning**: Secure QR code verification for location-based tasks with robust validation
- **Social Media Integration**: Multi-platform social sharing task completion with verification
- **Photo Upload System**: Enhanced R2 integration with improved file validation and metadata handling
- **Task Response Validation**: Comprehensive system for text answers, multiple choice, and media uploads
- **Group Quest Coordination**: Advanced multi-user quest system with role-based task distribution
- **Analytics Integration**: Real-time engagement metrics and popular quest tracking

### Security & Architecture Improvements

- **Fixed 5 critical security vulnerabilities** and consolidated documentation in `docs/SECURITY.md`
- **Streamlined documentation structure** from 11 to 8 main docs (36% reduction)
- Created comprehensive **system architecture documentation** in `docs/SYSTEM_ARCHITECTURE.md`
- Established **testing strategy guidelines** in `docs/TESTING_STRATEGY.md`
- **Consolidated overlapping content** and improved documentation navigation

### API Documentation Synchronization (June 2025)

- **Fixed missing x-user-id header annotations**: Resolved 6 endpoints with mismatched OpenAPI documentation
- **Admin endpoints corrected**: All admin endpoints now properly document required x-user-id header
- **User endpoints updated**: Fixed `/user/me`, `/user/sensitive-info`, and `/checkins` endpoints
- **DTO implementation**: Created VerifySubmissionRequestDto for admin submission verification endpoint
- **OpenAPI spec accuracy**: Ensures API consumers receive correct header requirements and body schemas in documentation

### Enhanced Error Handling & Task Management (June 2025)

- **Comprehensive Error Handling**: Replaced all generic `throw new Error()` patterns with `TouriiBackendAppException`
- **R2 Storage Error Types**: Added 5 new error codes (E_TB_035-039) for Cloudflare R2 storage configuration and operation failures
- **Authentication Security Errors**: Added 2 new error codes (E_TB_040-041) for JWT and encryption configuration requirements
- **JWT & Token Validation**: Added 3 new error codes (E_TB_045-047) for QR token structure and validation failures
- **Task Management Enhancement**: Added LOCAL_INTERACTION task type support in admin pending submissions and verification APIs
- **Complete Error Documentation**: Updated ERROR_CODES.md with 30+ error codes, solutions, and debugging examples
- **Testing Coverage**: Added comprehensive test suites for R2 storage error handling and local interaction task submissions
- **Test Database Isolation**: Created separate test environment (.env.test) with port 7443 to protect development data
- **Consistent API Responses**: Added `estimatedReviewTime` field to all manual verification task submissions for user expectation management

### Digital Passport & Wallet Integration System (June 2025)

- **Apple Wallet Integration**: Complete .pkpass generation with certificate handling and QR verification
- **Google Wallet Integration**: Service account-based pass generation with JWT authentication and real Google API
- **Unified Wallet API**: 8+ new endpoints for cross-platform wallet pass generation and management
- **QR Token Architecture**: Two-tier expiration system (24h for PDF security, 2 years for wallet convenience)
- **Enhanced Mock Testing**: 6+ user personas (alice, bob, charlie, etc.) with diverse attributes for comprehensive testing
- **Domain Type Architecture**: Centralized `GooglePassObject` interface following DDD principles
- **Certificate Security**: Secure handling of Apple Wallet certificates and Google service account keys
- **Verification Analytics**: Real-time verification statistics for individual tokens and global metrics
- **Production-Ready Setup**: Complete documentation and configuration guides for both wallet platforms

### Code Quality & Architecture Improvements (June 2025)

- **Exception Standardization**: Systematic replacement of generic HTTP exceptions with application-specific errors
- **Logging Optimization**: Removed 10+ unnecessary success logs, preserved essential error and operational logging
- **Architecture Compliance**: Enhanced DDD compliance with proper domain layer interfaces
- **Type Safety**: Improved TypeScript usage with centralized interface definitions
- **Validation Pipeline**: Enhanced request validation with consistent error responses across all services

### Advanced Development Workflows

#### Wallet Integration Setup

**Apple Wallet Setup:**
1. Get Apple Developer Account (Required for production)
2. Create Pass Type ID in Apple Developer Portal
3. Generate Certificate and convert to .p12 format
4. Configure Environment Variables:
   ```bash
   APPLE_WALLET_CERT_PATH=path/to/apple-cert.p12
   APPLE_WALLET_CERT_PASSWORD=your-secure-password
   ```

**Google Wallet Setup:**
1. Create Google Cloud Project and enable Google Wallet API
2. Create Service Account with "Wallet Objects Admin" role
3. Download JSON key file
4. Configure Environment Variables:
   ```bash
   GOOGLE_WALLET_ISSUER_ID=your-google-wallet-issuer-id
   GOOGLE_WALLET_CLASS_ID=tourii-passport
   GOOGLE_WALLET_KEY_PATH=path/to/service-account-key.json
   ```

**Security Setup:**
```bash
chmod 600 path/to/service-account-key.json
chmod 600 path/to/apple-cert.p12
echo "*.p12" >> .gitignore
echo "*service-account*.json" >> .gitignore
```

#### Development Workflow

**Daily Startup:**
```bash
cd etc/docker && docker-compose start
pnpm start:dev
pnpm start:dev:tourii-onchain  # If needed
```

**Making Changes:**
```bash
git checkout -b feature/your-feature-name
pnpm lint && pnpm test && pnpm format
git add . && git commit -m "Add your feature"
git push origin feature/your-feature-name
```

**Database Changes:**
```bash
# Modify prisma/schema.prisma, then:
npx prisma migrate dev --name your_migration_name
npx prisma migrate deploy  # For production
```

#### Common Issues & Fixes

**Port 7442 already in use:**
```bash
lsof -i :7442  # Check what's using the port
# Kill process or edit etc/docker/docker-compose.yml: "7443:5432"
```

**Database connection failed:**
```bash
cd etc/docker && docker-compose down && docker-compose up -d
# Wait 10 seconds then retry
```

**Prisma generate failed:**
```bash
npx prisma generate
# If still fails: rm -rf node_modules && pnpm install
```

**Module not found:**
```bash
pnpm store prune && rm -rf node_modules && pnpm install
```

#### IDE Setup Recommendations

**VS Code Extensions:**
- Prisma - Database schema support
- TypeScript Importer - Auto imports
- Biome - Linting & formatting
- REST Client - Test API endpoints from `etc/http/`

**VS Code Settings:**
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome"
}
```

#### Mock Testing System

Available Mock Token IDs for wallet testing:
- `123` - Japanese Test User (E級 天津神)
- `456` - Advanced User (S級 国津神) 
- `789` - Beginner (F級 地神)
- `alice` - Explorer (A級 山神)
- `bob` - Tech Enthusiast (B級 水神)
- `charlie` - Adventurer (C級 火神)

**No authentication required** for testing these mock personas!

---

_Last Updated: June 26, 2025_
