# 📝 Tourii Backend Guidelines

This document outlines the development guidelines and architecture for the Tourii backend system.

## 🏗 Architecture Overview

### Technology Stack

- **Framework**: NestJS (Progressive Node.js framework)
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain Integration**:
  - Vara Network (Digital passports and NFTs)
  - Camino Network (Travel perks and rewards)
- **Authentication**: Multi-provider (Discord, Twitter, Google)
- **Testing**: Jest for unit and integration testing
- **Documentation**: Swagger/OpenAPI
- **Code Quality**: Biome for linting and formatting

### Project Structure

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

## 🗂 Core Services

### 1. Authentication Service

- [ ] Multi-provider authentication
  - Discord integration
  - Twitter integration
  - Google integration
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
- [ ] Exchange system
  - User to exchange and redeem item

### 6. Shop WIP

### 7. Admin Panel WIP

## 🔒 Security Guidelines

### 1. Authentication & Authorization

- Implement JWT with secure signing
- Use role-based access control
- Enable multi-factor authentication
- Regular token rotation

### 2. Data Protection

- Enable Row-Level Security (RLS)
- Implement data encryption
- Regular security audits
- Input validation and sanitization

### 3. API Security

- Rate limiting on all endpoints
- Request validation
- CORS configuration
- API key management

### 4. Blockchain Security

- Secure key management
- Transaction signing
- Contract verification
- Gas optimization

## 📝 Development Standards

### Code Organization

- Follow NestJS module structure
- Implement clean architecture principles
- Use dependency injection
- Maintain separation of concerns

### Testing Requirements

- Unit tests for all services
- Integration tests for API endpoints
- Blockchain interaction tests
- Performance testing

### Documentation

- Swagger/OpenAPI documentation
- Code comments and JSDoc
- Database schema documentation
- API endpoint documentation

### Error Handling

- Standardized error responses
- Logging and monitoring
- Error tracking
- Recovery procedures

## 🔄 Development Workflow

### Version Control

- Branch naming: `feature/service-name`
- PR template with checklist
- Code review requirements
- Merge strategy

### CI/CD Pipeline

- Automated testing
- Code quality checks
- Security scanning
- Deployment automation

### Monitoring

- Performance metrics
- Error tracking
- User activity monitoring
- System health checks

## 📈 Progress Tracking

Track updates via:

1. Status indicators
2. Completion dates
3. PR/commit links
4. Blocker notes
5. Team review feedback

---

Last Updated: [Current Date]
