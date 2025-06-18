# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build & Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start:dev                    # Start all apps
pnpm start:dev:tourii-backend     # Start backend only
pnpm start:dev:tourii-onchain     # Start onchain service only

# Build for production
pnpm build                        # Build all apps
pnpm build:tourii-backend         # Build backend only
pnpm build:tourii-onchain         # Build onchain service only
pnpm start:prod                   # Run production build
```

### Testing

```bash
# Run tests
pnpm test                         # Run all unit tests
pnpm test:watch                   # Run tests in watch mode
pnpm test:cov                     # Run tests with coverage
pnpm test:e2e:app                 # Run e2e tests

# Security testing (platform-specific)
bash tourii-backend/test/security-test.sh    # Linux/Mac
.\tourii-backend\test\security-test.ps1      # Windows PowerShell
```

### Code Quality

```bash
# Format code
pnpm format                       # Format all code
pnpm format:prettier              # Format YAML/MD files
pnpm format:biome                 # Format JS/TS files

# Lint
pnpm lint                         # Run linter
pnpm check                        # Run biome check with autofix
```

### Database Operations

```bash
# Prisma database commands
pnpm prisma:migrate:dev           # Run migrations (dev)
pnpm prisma:migrate:test          # Run migrations (test)
pnpm prisma:db:execute            # Execute SQL scripts (moment view)
pnpm prisma:studio                # Open Prisma Studio

# Database seeding (new modular system)
npx prisma db seed                # Traditional full seeding
npx tsx prisma/seed-new.ts        # New modular seeding (recommended)
npx tsx prisma/seed-new.ts --users-only     # Seed only users
npx tsx prisma/seed-new.ts --stories-only   # Seed only stories/content
npx tsx prisma/seed-new.ts --clean          # Clean everything first
```

### Documentation

```bash
# Update OpenAPI documentation
pnpm update:openapi               # Regenerate OpenAPI spec and types
pnpm docs:api                     # Build API documentation HTML
```

## High-Level Architecture

### Monorepo Structure

This is a NestJS monorepo with two main applications:

- **tourii-backend**: Main API server handling authentication, stories, quests, and user management
- **tourii-onchain**: Blockchain integration service for NFT operations and Web3 interactions

### Domain-Driven Design

The architecture follows Domain-Driven Design principles with clear separation:

- **Domain Layer** (`libs/core/src/domain/`): Core business entities and repository interfaces
- **Infrastructure Layer** (`libs/core/src/infrastructure/`): Implementations of repositories (API, DB, blockchain)
- **Application Layer** (`apps/*/src/service/`): Business logic and use cases
- **Interface Layer** (`apps/*/src/controller/`): HTTP controllers and DTOs

### Repository Pattern

All data access is abstracted through repository interfaces:

- Repository interfaces are defined in the domain layer
- Implementations are injected via dependency injection tokens (e.g., `USER_REPOSITORY_TOKEN`)
- This allows easy swapping of implementations (DB, API, mock) for testing

### Context System

The application uses a custom context system (`TouriiBackendContextProvider`) to maintain request-scoped data:

- Request ID tracking for distributed tracing
- User authentication state
- Request metadata

### Middleware Stack

Security and API middleware are applied in order:

1. **SecurityMiddleware**: CORS, security headers, rate limiting
2. **TouriiBackendApiMiddleware**: Logging, context initialization, error handling

### Error Handling

Centralized error handling with custom exception types:

- `TouriiBackendAppException`: Application-specific errors
- `AppError`: Base error class with error codes
- Global error interceptor formats responses consistently

### Authentication & Authorization

Multi-provider authentication system:

- Social login (Discord, Google, Twitter)
- Web3 wallet signature verification (EIP-191)
- JWT with refresh token rotation
- Role-based access control

### Blockchain Integration

- **Gear.js**: For Vara Network blockchain interactions
- **Sails.js**: Smart contract interface framework
- **Ethers.js**: For EVM-compatible operations
- Digital Passport NFT minting on user registration

### Caching Strategy

Redis-based caching for:

- API responses (weather, location data)
- User sessions
- Rate limiting data
- Configurable TTL per cache type

### Testing Philosophy

- Unit tests for all repository implementations
- Integration tests for API endpoints
- Mock implementations for external services
- Test database with migrations for realistic testing

## Important Guidelines from Cursor Rules

1. **Always consult documentation**: Before implementing, read:

   - `docs/SYSTEM_ARCHITECTURE.md`: Complete architecture and core features
   - `docs/SECURITY.md`: Security best practices and critical fixes
   - `docs/API_EXAMPLES.md`: Real-world API usage and integration patterns
   - `docs/DATABASE.md`: Database setup and operations guide
   - `docs/SEEDING_GUIDE.md`: New modular database seeding system
   - `docs/ERROR_CODES.md`: Complete error code reference
   - `docs/DEVELOPMENT_SETUP.md`: Quick 5-minute onboarding guide
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

For new team members, the documentation provides fast-track onboarding:

1. **Quick Start**: `docs/DEVELOPMENT_SETUP.md` (5-minute setup)
2. **API Examples**: `docs/API_EXAMPLES.md` (real workflows with curl commands)
3. **Error Debugging**: `docs/ERROR_CODES.md` (all 28+ error codes with solutions)
4. **Database Operations**: `docs/DATABASE.md` (migrations, seeding, troubleshooting)

## 💰 Recent Cost Optimization Achievements

### Google Places API Cost Reduction (June 2025)

Successfully implemented **hybrid cost-optimization strategy** for Google Places API:

- **85-90% cost reduction**: From $2.80-$3.50 to $0.12-$0.28 per 4 locations
- **API call reduction**: From 56 Places + 15 Geocoding to ~4 Text Search calls
- **Hybrid reliability**: New Places API with automatic fallback to legacy API
- **Implementation files**: `geo-info-repository-api.ts` and `location-info-repository-api.ts`

### Security & Architecture Improvements

- **Fixed 5 critical security vulnerabilities** and consolidated documentation in `docs/SECURITY.md`
- **Streamlined documentation structure** from 11 to 8 main docs (36% reduction)
- Created comprehensive **system architecture documentation** in `docs/SYSTEM_ARCHITECTURE.md`
- Established **testing strategy guidelines** in `docs/TESTING_STRATEGY.md`
- **Consolidated overlapping content** and improved documentation navigation

---

_Last Updated: June 18, 2025_
