# 📝 Tourii Backend Guidelines

This document outlines the development guidelines and architecture for the Tourii backend system, a Web3-integrated tourism platform.

## 🎯 Core Features

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
   - User interactions
   - Achievement sharing
   - Friend system

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

## 🏗 Architecture Overview

### Technology Stack

- **Framework**: NestJS (Progressive Node.js framework)
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for session and data caching
- **Blockchain**: 
  - EVM-compatible chains
  - Web3.js/Ethers.js for blockchain interaction
  - Hardhat for smart contract development
  - OpenZeppelin for contract standards
  - IPFS/Pinata for metadata storage
- **Storage**: 
  - IPFS for decentralized storage
  - S3 for media assets
- **Authentication**: 
  - JWT for sessions
  - OAuth2 for social login
  - Web3 wallet integration (MetaMask, WalletConnect)
- **Testing**: Jest for unit and integration testing
- **Documentation**: Swagger/OpenAPI
- **Code Quality**: Biome for linting and formatting
- **APIs & Integration**:
  - RESTful APIs
  - WebSocket for real-time features
  - External APIs (Weather, Maps)
  - Blockchain RPC providers

### Project Structure

```
tourii-backend/
├── apps/
│   ├── tourii-backend/       # Main API application
│   └── tourii-onchain/       # Blockchain integration application
├── libs/
│   └── core/                 # Shared core functionality
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── docs/              # Database documentation
├── contracts/              # Smart contracts
│   ├── digital-passport/   # Passport NFT contracts
│   │   ├── interfaces/    # Contract interfaces
│   │   └── implementations/ # Contract implementations
│   ├── tourii-log/        # User activity logging
│   └── perks/             # Reward perk contracts
```

## 🔧 Core Services

### 1. Authentication Service

- [ ] Multi-provider authentication
  - Discord integration
  - Twitter integration
  - Google integration
  - Web3 wallet integration
- [ ] JWT token management
- [ ] Session handling
- [ ] Role-based access control
- [ ] Rate limiting implementation

### 2. Story Service

- [ ] Story saga management
  - CRUD operations for sagas
  - Media asset handling
  - Location mapping
- [ ] Chapter content delivery
  - Content versioning
  - Progress tracking
  - Media streaming
- [ ] Route management
  - Tourist spot mapping
  - Route recommendations
  - Location-based features

### 3. Quest Service

- [ ] Quest management
  - Quest creation and validation
  - Task configuration
  - Reward distribution
- [ ] Task validation
  - Location verification
  - Photo upload validation
  - Text response processing
  - Group activity tracking
  - Social sharing validation
- [ ] Progress tracking
  - User progress monitoring
  - Achievement triggers
  - Points calculation

### 4. Blockchain Service

- [ ] Digital passport management
  - Minting operations
  - Ownership verification
  - Transfer handling
- [ ] NFT management
  - Catalog maintenance
  - Metadata handling
  - Trading operations
- [ ] Transaction processing
  - Gas management
  - Contract interactions
  - Error handling

### 5. User Service

- [ ] Profile management
  - User data handling
  - Preferences storage
  - Activity tracking
- [ ] Achievement system
  - Progress tracking
  - Reward distribution
  - Level progression
- [ ] Points system
  - Magatama points calculation
  - Transaction history
  - Balance management

### 6. Social Service
- [ ] Memory wall management
  - Post creation
  - Media handling
  - User interactions
- [ ] Friend system
  - Friend requests
  - User connections
  - Activity sharing
- [ ] Achievement sharing
  - Social posts
  - Quest completions
  - Rewards showcase

### 7. Shop Service
- [ ] Point system
- [ ] NFT marketplace
- [ ] Perk management
- [ ] Transaction processing

### 8. Admin Service
- [ ] Content management
- [ ] User management
- [ ] Analytics dashboard
- [ ] System configuration

## 🔒 Security Guidelines

### 1. Authentication & Authorization

- Implement JWT with secure signing
- Use role-based access control
- Enable multi-factor authentication
- Regular token rotation
- Web3 signature verification

### 2. Data Protection

- Enable Row-Level Security (RLS)
- Implement data encryption
- Regular security audits
- Input validation and sanitization
- GDPR compliance

### 3. API Security

- Rate limiting on all endpoints
- Request validation
- CORS configuration
- API key management
- DDoS protection

### 4. Blockchain Security

- Secure key management
- Transaction signing
- Contract verification
- Gas optimization
- Multi-sig implementations

## 📝 Development Standards

### Code Organization

- Follow NestJS module structure
- Implement clean architecture principles
- Use dependency injection
- Maintain separation of concerns
- Domain-driven design

### Testing Requirements

- Unit tests for all services
- Integration tests for API endpoints
- Blockchain interaction tests
- Performance testing
- Smart contract testing

### Documentation

- Swagger/OpenAPI documentation
- Code comments and JSDoc
- Database schema documentation
- API endpoint documentation
- Smart contract documentation

### Error Handling

- Standardized error responses
- Logging and monitoring
- Error tracking
- Recovery procedures
- Blockchain transaction error handling

## 🔄 Development Workflow

### Version Control

- Branch naming: `feature/service-name`
- PR template with checklist
- Code review requirements
- Merge strategy
- Semantic versioning

### CI/CD Pipeline

- Automated testing
- Code quality checks
- Security scanning
- Deployment automation
- Contract verification

### Monitoring

- Performance metrics
- Error tracking
- User activity monitoring
- System health checks
- Blockchain event monitoring

## 📈 Progress Tracking

Track updates via:

1. Status indicators
2. Completion dates
3. PR/commit links
4. Blocker notes
5. Team review feedback

---

Last Updated: [Current Date]
