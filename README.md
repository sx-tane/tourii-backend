# Tourii Backend

<p align="center">
  <a href="https://github.com/your-organization/tourii-backend" target="blank"><img src="https://yourapp.com/logo.png" width="200" alt="Tourii Logo" /></a>
</p>

<p align="center">Tourii Backend - A powerful and scalable backend system for tourism and travel experiences</p>

## Description

Tourii is a comprehensive platform that connects travelers with immersive, story-driven travel experiences. This repository contains the backend services that power the Tourii application, built on the NestJS framework with Prisma ORM for database interactions and blockchain integration via the Vara Network or Camino Network.

The system enables users to explore tourist spots through story-driven routes, complete quests, earn rewards, and interact with blockchain assets through a gamified experience.

## Features

- **Story-Driven Tourism**: Create and manage tourism routes with connected story sagas
- **Tourist Spot Management**: Maintain a database of tourist spots with detailed information, coordinates, and media assets
- **Gamification System**: Quest management with tasks, rewards, and progression tracking
- **Blockchain Integration**: On-chain item management via Vara Network integration
- **User Management**: Authentication, profiles, and user journey tracking
- **RESTful API**: Comprehensive API endpoints for frontend and mobile clients

## Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Blockchain Integration**:
  - **Gear JS**: Used for deploying contracts and low-level interactions with the Vara Network
  - **Sails JS**: Higher-level blockchain interactions, handling vouchers, gas reservations, and token management
- **Testing**: Jest for unit and integration testing
- **Documentation**: Swagger/OpenAPI via NestJS Swagger module
- **Code Quality**: Biome for linting and formatting, CSpell for spell checking

## Project Structure

The project follows a monorepo structure with multiple applications:

```
tourii-backend/
├── apps/
│   ├── tourii-backend/       # Main API application
│   └── tourii-onchain/       # Blockchain integration application
├── libs/
│   └── core/                 # Shared core functionality
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── docs/                 # Database documentation
├── etc/
│   └── openapi/              # OpenAPI specifications
```

## Getting Started

### Prerequisites

- Node.js 20.18.0
- PNPM 9.15.5
- PostgreSQL database
- Vara Network access (for blockchain features)

### Installation

```bash
# Install dependencies
$ pnpm install
```

### Database Setup

```bash
# Generate Prisma client
$ pnpm prisma:generate

# Run database migrations
$ pnpm prisma:migrate:dev

# Seed the database with initial data
$ pnpm prisma:db:seed
```

## Development

### Running the Application

```bash
# Development mode
$ pnpm start:dev

# Development mode for specific application
$ pnpm start:dev:tourii-backend
$ pnpm start:dev:tourii-onchain

# Debug mode
$ pnpm start:debug

# Production mode
$ pnpm start:prod
```

### Testing

```bash
# Unit tests
$ pnpm test

# E2E tests
$ pnpm test:e2e

# Test coverage
$ pnpm test:cov
```

### Code Quality

```bash
# Format code
$ pnpm format

# Lint code
$ pnpm lint

# Format with Biome
$ pnpm format:biome

# Check spelling
$ pnpm cspell
```

## Database Schema

The database schema is designed around several interconnected domains that together create a comprehensive platform for story-driven tourism experiences, gamification elements, and blockchain integration. Each entity is carefully designed to support the unique blend of physical exploration and digital engagement that defines the Tourii platform.

Check Here: [Tourii Database Docs](prisma\docs\tourii-db-docs.md)

### Users & Authentication Entities
- **User**: Core user entity with authentication methods (Discord, Twitter, Google), profile information, and platform connections
- **User Info**: Extended profile details including passport information, level progression, and in-game currency balances
- **User Achievements**: Records of milestones and accomplishments earned by users
- **User Onchain Items**: Blockchain items owned by users including digital passports, NFTs, and travel perks
- **User Logs**: Various activity logs tracking story progress, quest completion, travel history, and item claims

### Story & Tourism Entities
- **Story Saga**: Overarching narrative collections that organize routes and stories, with cover media and geographic context
- **Story**: Individual chapters or narrative segments within a saga, containing rich media content (text, images, videos) tied to physical locations
- **Model Route**: Predefined travel routes connecting multiple tourist spots, including recommendations for activities and experiences
- **Tourist Spot**: Physical locations with detailed information, geographic coordinates, visit recommendations, and media assets

### Gamification Entities
- **Quest**: Challenges for users to complete at tourist spots, including reward structures, point values, and completion requirements
- **Quest Task**: Individual tasks within a quest, supporting various interaction types (visit locations, answer questions, upload photos)
- **Magatama Points**: In-game currency earned through activities, quest completion, and community participation

### Blockchain Entities
- **Onchain Item Catalog**: Master registry of all blockchain assets including NFTs, digital passports, and travel perks
- **User Onchain Items**: User-specific blockchain assets with transaction records, status tracking, and metadata
- **Level Requirements**: Progression system defining thresholds for level advancement based on points, collectibles, and achievements

### Integration & Community Entities
- **Discord Activity Log**: Records user engagement within the Discord community
- **Discord Roles**: Maps Discord roles to users and tracks role-based rewards
- **User Invite Log**: Tracks user referrals and associated rewards

The database implements consistent patterns across all entities:
- Soft deletion for data retention
- Created/updated timestamps and user tracking
- Request ID for tracing
- Standardized ID formats with timestamp components
- Rich JSON structures for flexible data storage

This schema enables the seamless integration of storytelling, real-world exploration, and digital rewards that makes the Tourii experience unique.

## API Documentation

API documentation is available via Swagger UI when running the application locally:

```
http://localhost:3000/api
```

## Deployment

The application is configured for easy deployment with environment-specific settings.

```bash
# Build the application
$ pnpm build

# Run in production mode
$ pnpm start:prod
```

For AWS deployment, the application can be deployed using NestJS Mau or your preferred cloud deployment service.

## Blockchain Integration

### Gear JS
Primarily used for deploying contracts, managing keys, sending messages, and other low-level interactions with the Vara Network.

### Sails JS
Focuses on higher-level application logic for blockchain interactions, helping with tasks like managing vouchers, handling gas reservations, and automatically renewing contracts or tokens.

## License

Tourii Backend is [MIT licensed](LICENSE).

## Contact

For more information, please contact the Tourii development team.
