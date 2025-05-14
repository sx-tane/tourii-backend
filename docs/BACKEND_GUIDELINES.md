# 📝 Tourii Backend Guidelines

This document outlines the development guidelines and architecture for the Tourii backend system, a Web3-integrated tourism platform.

---

## 🌟 Core Features

1. **Authentication & Web3**
   - Social auth (Discord, Twitter, Google)
   - Web3 wallet integration
   - NFT-based digital passport system
   - JWT session management

2. **Story & Tourism**
   - Story saga management
   - Chapter progression system
   - Location-based content delivery
   - Media asset management (video/image)

3. **Quest & Gamification**
   - Online/offline quest management
   - Multi-type task validation
   - Progress tracking
   - Reward distribution

4. **Digital Assets**
   - EVM-compatible NFT minting
   - Digital passport management
   - Reward perks as NFTs
   - Blockchain transaction handling

5. **Location & Routes**
   - Model route management
   - Location check-in system
   - Weather API integration
   - Geographic data handling

6. **Social Features**
   - Memory wall
   - Achievement sharing

7. **Shop & Rewards**
   - Point system management
   - NFT reward shop
   - Perk redemption
   - Transaction history

8. **Admin Panel**
   - Content management
   - User management
   - Analytics dashboard
   - System configuration

---

## 🏗️ Architecture Overview

### Technology Stack

| Layer         | Tech                                      |
| ------------- | ----------------------------------------- |
| Framework     | NestJS                                    |
| Database      | PostgreSQL + Prisma ORM                   |
| Caching       | Redis                                     |
| Blockchain    | Smart Contract Dev (`contracts/` dir): Hardhat, Ethers.js/viem, OpenZeppelin <br> NestJS App Integration: Gear.js, Sails.js, Ethers.js/viem |
| Storage       | IPFS (NFT metadata)                       |
| Auth          | JWT, OAuth2, Signature login (EVM)        |
| Testing       | Jest                                      |
| Docs          | Swagger / OpenAPI                         |
| Format / Lint | Biome                                     |

### Project Structure

```
tourii-backend/
├── apps/
│   ├── tourii-backend/       # Main API application
│   └── tourii-onchain/       # Blockchain integration app
├── libs/
│   └── core/                 # Shared core functionality
├── prisma/
│   ├── schema.prisma         # DB schema
│   ├── migrations/           # Migrations
│   └── docs/                 # Schema docs
├── contracts/                # Hardhat project for Solidity smart contracts
│   ├── contracts/            # Actual .sol contract source files (e.g., digital-passport, tourii-log, perks)
│   ├── ignition/             # Hardhat Ignition deployment scripts
│   ├── test/                 # Contract tests
│   ├── hardhat.config.ts     # Hardhat configuration
│   └── package.json          # Dependencies for contract development (e.g., OpenZeppelin)
```

---

## 🔧 Core Services

### 1. Authentication
- Multi-provider (Discord, Google, Twitter)
- Web3 wallet signature login
- JWT token and refresh
- Role-based permissions
- Rate limiting support

### 2. Story System
- CRUD for sagas, chapters
- Location and route linking
- Asset upload (images/videos)
- Chapter progression recording

### 3. Quest System
- Create/edit quests and sub-tasks
- Task types: GPS, QR, photo, text, group
- Quest start, complete, validate endpoints
- Reward logic: points, NFTs, passport stamps

### 4. Blockchain
- Mint: digital passport, log NFT, perk NFTs
- Asset ownership lookup
- Metadata sync with IPFS
- Transaction status polling

### 5. User System
- User profile and logs (travel, quest, story)
- Points balance, level, rewards
- Perk redemption + wallet export history

### 6. Social & Memory Wall
- Post logs (auto-recorded)
- Public feed and detail fetch
- Commenting, liking (future extension)

### 7. Check-In System
- Submit GPS/QR verification
- Timeline and badge unlocks
- Fraud check (distance/time rules)

### 8. Shop
- NFT marketplace (perks)
- Magatama point deduction
- Inventory: status tracking (used/active/expired)
- Burn-on-redeem logic

### 9. Admin
- Quest/story/route/user/perk CRUD
- Upload NFT metadata
- View analytics and logs
- Social content pushing

---

## 🔒 Security Practices

- RLS on all user-bound tables
- Secure JWT storage + token rotation
- CAPTCHA for signup/login
- Request validation on all APIs
- Session + action logging
- WAF + rate limit middleware

---

## 🖊️ Dev Workflow & Standards

- NestJS modular design
- Prisma DB types auto-generated
- `feature/x` branches → PR → squash merge
- Unit & integration tests (Jest)
- Swagger docs for API
- GitHub Actions CI for test + lint + build

---

_Last Updated: May 8, 2025_