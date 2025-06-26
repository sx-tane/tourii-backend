# 📚 **Documentation Index & Navigation Guide**
## **Complete Reference for All Tourii Backend Documentation**

> **Quick finder for all documentation in the tourii-backend project - organized by role, task, and urgency level**

---

## 🚀 **Quick Start Navigation**

### **🔥 URGENT - Get Running in 5 Minutes**

| Task | Document | Time | Quick Command |
|------|----------|------|---------------|
| **Start Development** | [README.md](README.md) | 5 min | See README.md setup section |
| **Test API Instantly** | [API Examples](docs/API_EXAMPLES.md) | 2 min | `curl http://localhost:4000/health-check -H "x-api-key: dev-key"` |
| **Debug Error** | [Error Codes](docs/ERROR_CODES.md) | 1 min | Find your E_TB_xxx code |

### **⚡ HIGH PRIORITY - First Week Reading**

| Priority | Document | Purpose | Time | When to Read |
|----------|----------|---------|------|-------------|
| **🔥 CRITICAL** | [README.md](README.md) | Project overview & quick start | 10 min | **Hour 1** |
| **🔥 CRITICAL** | [CLAUDE.md](CLAUDE.md) | Complete developer guide | 15 min | **Hour 1** |
| **⚡ HIGH** | [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | Technical architecture deep dive | 15 min | **Day 1** |
| **⚡ HIGH** | [API Examples](docs/API_EXAMPLES.md) | Real-world usage patterns | 10 min | **Day 1** |
| **⚡ HIGH** | [Security Guide](docs/SECURITY.md) | Production security practices | 8 min | **Day 2** |

---

## 👥 **Navigation by Role**

### **🎯 New Developer (First Week)**
```
📚 Essential Reading Path:
├── 1. README.md (project overview)
├── 2. README.md setup section (get running)
├── 3. docs/API_EXAMPLES.md (try the API)
├── 4. docs/SYSTEM_ARCHITECTURE.md (understand structure)
├── 5. docs/ERROR_CODES.md (debug issues)
└── 6. CLAUDE.md (complete reference)

💡 Setup Commands: See README.md for complete setup guide
```

### **🔧 Backend Developer**
```
📚 Core Documentation:
├── docs/SYSTEM_ARCHITECTURE.md (architecture patterns)
├── docs/DATABASE.md (database operations)
├── docs/SEEDING_GUIDE.md (test data management)
├── docs/TESTING_STRATEGY.md (testing philosophy)
├── docs/SECURITY.md (security best practices)
└── docs/ERROR_CODES.md (error reference)

🔗 Related Files:
├── prisma/schema.prisma (database schema)
├── prisma/docs/ (auto-generated DB docs)
└── libs/core/src/domain/ (domain layer)
```

### **📱 Frontend/Mobile Developer**
```
📚 API Integration Focus:
├── docs/API_EXAMPLES.md (real usage examples)
├── docs/ERROR_CODES.md (error handling)
├── etc/openapi/ (API specifications)
└── docs/wallet-integration/ (wallet features)

🔗 API Documentation:
├── http://localhost:4000/api (Swagger UI)
├── etc/openapi/openapi.json (OpenAPI spec)
└── etc/http/ (test requests)
```

### **⛓️ Web3/Blockchain Developer**
```
📚 Blockchain Integration:
├── docs/web3/ (smart contract docs)
├── docs/user/Tourii Passport NFT metadata delivery.md
├── apps/tourii-onchain/ (blockchain service)
└── libs/core/src/domain/vara/ (blockchain domain)

🔗 Implementation Files:
├── libs/core/src/infrastructure/blockchain/
└── libs/core/src/domain/passport/
```

### **🎮 Game/Quest Developer**
```
📚 Quest System Deep Dive:
├── docs/quest/ (group quest mechanics)
├── docs/SYSTEM_ARCHITECTURE.md#quest-system
├── docs/API_EXAMPLES.md#quest-system
└── docs/DATABASE.md#gaming-system

🔗 Quest Implementation:
├── libs/core/src/domain/game/
├── apps/tourii-backend/src/controller/quest/
└── etc/http/quest-request/
```

### **👑 Admin/Operations**
```
📚 Management & Operations:
├── docs/SECURITY.md (security checklist)
├── docs/ERROR_CODES.md (troubleshooting)
├── docs/DATABASE.md (backup & recovery)
├── docs/TESTING_STRATEGY.md (QA processes)
└── docs/wallet-integration/PRODUCTION_CHECKLIST.md

🔗 Admin Tools:
├── etc/http/user-request/ (admin API examples)
├── docs/wallet-integration/DEPLOYMENT_REQUIREMENTS.md
└── prisma/docs/ (database monitoring)
```

---

## 📋 **Navigation by Task**

### **🚀 Getting Started Tasks**

| I Want To... | Primary Document | Supporting Docs | Quick Commands |
|--------------|------------------|-----------------|----------------|
| **Set up development environment** | [README.md](README.md) | [CLAUDE.md](CLAUDE.md) | See README.md setup section |
| **Understand the project** | [README.md](README.md) | [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | Open README.md |
| **Make my first API call** | [API Examples](docs/API_EXAMPLES.md) | [Error Codes](docs/ERROR_CODES.md) | `curl http://localhost:4000/health-check -H "x-api-key: dev-key"` |
| **Test wallet integration** | [API Examples](docs/API_EXAMPLES.md#digital-wallet-integration) | [CLAUDE.md](CLAUDE.md) | `curl wallet endpoints` |

### **🏗️ Development Tasks**

| I Want To... | Primary Document | Supporting Docs | Implementation Files |
|--------------|------------------|-----------------|---------------------|
| **Add new API endpoint** | [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | [API Examples](docs/API_EXAMPLES.md) | `apps/tourii-backend/src/controller/` |
| **Modify database schema** | [Database Guide](docs/DATABASE.md) | [Seeding Guide](docs/SEEDING_GUIDE.md) | `prisma/schema.prisma` |
| **Write tests** | [Testing Strategy](docs/TESTING_STRATEGY.md) | [README.md](README.md) | `*.spec.ts files` |
| **Add quest task type** | [Quest System Guide](docs/quest/) | [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | `libs/core/src/domain/game/` |
| **Integrate external API** | [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | [Security Guide](docs/SECURITY.md) | `libs/core/src/infrastructure/api/` |

### **🔧 Troubleshooting Tasks**

| I'm Having Issues With... | Primary Document | Quick Fix Section | Emergency Commands |
|---------------------------|------------------|-------------------|-------------------|
| **API returning errors** | [Error Codes](docs/ERROR_CODES.md) | Search for error code | Check headers & API key |
| **Database connection** | [README.md](README.md) | Database section | `docker-compose restart` |
| **Tests failing** | [Testing Strategy](docs/TESTING_STRATEGY.md) | Test debugging | `pnpm test -- --verbose` |
| **Environment setup** | [README.md](README.md) | Environment section | Check .env variables |
| **Wallet integration** | [API Examples](docs/API_EXAMPLES.md) | Wallet section | Check certificates |

### **🔒 Security & Production Tasks**

| I Need To... | Primary Document | Security Focus | Production Checklist |
|--------------|------------------|----------------|---------------------|
| **Prepare for production** | [Security Guide](docs/SECURITY.md) | All sections | [Production Checklist](docs/wallet-integration/PRODUCTION_CHECKLIST.md) |
| **Fix security vulnerability** | [Security Guide](docs/SECURITY.md) | Vulnerability section | [Security Audit](docs/wallet-integration/SECURITY_AUDIT.md) |
| **Set up monitoring** | [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | Monitoring section | Error tracking setup |
| **Configure wallet certificates** | [README.md](README.md) | Wallet security | Certificate management |

---

## 📁 **Complete File Structure with Navigation**

### **📂 Root Level Documentation**

```
📦 tourii-backend/
├── 📋 README.md                     # 🔥 CRITICAL - Project overview & quick start
├── 📝 CLAUDE.md                     # 🔥 CRITICAL - Complete developer guide  
├── 📚 DOCUMENTATION_INDEX.md        # 📍 YOU ARE HERE - Navigation guide
├── 📄 .env.example                  # Environment template
└── 📄 package.json                  # Scripts reference
```

### **📂 Essential Documentation (docs/)**

```
📁 docs/
├── 🚀 Setup in README.md             # ⚡ Get running in 5 minutes
├── 🏗️ SYSTEM_ARCHITECTURE.md        # ⚡ Complete technical architecture
├── 🔗 API_EXAMPLES.md               # ⚡ Real-world usage patterns
├── 🔒 SECURITY.md                   # ⚡ Production security guide
├── 🗃️ DATABASE.md                   # 📖 Database operations & schema
├── 🧪 TESTING_STRATEGY.md           # 📖 Testing philosophy & examples
├── ⚠️ ERROR_CODES.md                # 📖 Complete error reference
└── 🌱 SEEDING_GUIDE.md              # 📖 Database seeding guide
```

### **📂 Feature-Specific Documentation**

```
📁 docs/
├── 📁 quest/                        # 🎮 Quest system mechanics
│   └── Tourii Group Quest System - Complete Guide.md
├── 📁 user/                         # 👤 User & passport features  
│   └── Tourii Passport NFT metadata delivery.md
├── 📁 wallet-integration/           # 📱 Wallet integration guides
│   ├── CODE_QUALITY_ISSUES.md
│   ├── DEPLOYMENT_REQUIREMENTS.md  
│   ├── PRODUCTION_CHECKLIST.md     # 🔥 CRITICAL for production
│   └── SECURITY_AUDIT.md           # 🔒 Security review
└── 📁 web3/                         # ⛓️ Blockchain integration
    └── Tourii Smart Contract.md
```

### **📂 Implementation & Configuration**

```
📁 prisma/                           # 🗃️ Database
├── schema.prisma                    # Database schema definition
├── seed-new.ts                      # 🌱 Modular seeding system  
└── 📁 docs/                         # Auto-generated documentation
    ├── tourii-db-docs.md
    └── tourii-er-diagram.md

📁 etc/                              # 🔧 Configuration & tools
├── 📁 docker/                       # Local database setup
├── 📁 openapi/                      # 📊 API documentation
│   ├── openapi.json                 # OpenAPI specification
│   └── openapi.d.ts                 # Generated TypeScript types
└── 📁 http/                         # 🧪 API test requests
    ├── 📁 user-request/              # Admin API examples
    ├── 📁 quest-request/             # Quest API examples  
    └── Various .http files           # Ready-to-use API tests
```

---

## 🎯 **Quick Reference by Use Case**

### **🆘 Emergency/Critical Issues**

| Emergency Scenario | Immediate Action | Document | Quick Command |
|--------------------|------------------|----------|---------------|
| **API is down** | Check health endpoint | [Error Codes](docs/ERROR_CODES.md) | `curl health-check` |
| **Database corrupted** | Restore from backup | [Database Guide](docs/DATABASE.md) | `pnpm prisma:migrate:reset` |
| **Security breach** | Follow incident response | [Security Guide](docs/SECURITY.md) | Check security checklist |
| **Production deploy fails** | Check deployment checklist | [Production Checklist](docs/wallet-integration/PRODUCTION_CHECKLIST.md) | Verify environment |
| **Tests suddenly failing** | Check recent changes | [Testing Strategy](docs/TESTING_STRATEGY.md) | `pnpm test -- --verbose` |

### **📈 Feature Development Workflows**

| Feature Type | Primary Docs | Implementation Path | Testing Approach |
|--------------|-------------|-------------------|------------------|
| **New API Endpoint** | [System Architecture](docs/SYSTEM_ARCHITECTURE.md) + [API Examples](docs/API_EXAMPLES.md) | Controller → Service → Repository | [Testing Strategy](docs/TESTING_STRATEGY.md) |
| **Quest Task Type** | [Quest Guide](docs/quest/) + [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | Domain → Infrastructure → Controller | Unit + Integration tests |
| **Wallet Integration** | [API Examples](docs/API_EXAMPLES.md) + [README.md](README.md) | Repository → Service → Controller | Mock + Real wallet tests |
| **Database Changes** | [Database Guide](docs/DATABASE.md) + [Seeding Guide](docs/SEEDING_GUIDE.md) | Schema → Migration → Seeding → Code | Repository tests |

### **🔍 Information Lookup**

| I Need Information About... | Primary Source | Quick Reference | Deep Dive |
|-----------------------------|----------------|-----------------|-----------|
| **Error Code E_TB_xxx** | [Error Codes](docs/ERROR_CODES.md) | Search error code | Solution & examples |
| **API Endpoint Usage** | [API Examples](docs/API_EXAMPLES.md) | Find endpoint example | Swagger UI |
| **Database Schema** | [Database Guide](docs/DATABASE.md) | Schema overview | `prisma/docs/` |
| **Security Requirements** | [Security Guide](docs/SECURITY.md) | Security checklist | Security best practices |
| **Testing Patterns** | [Testing Strategy](docs/TESTING_STRATEGY.md) | Test examples | Implementation files |

---

## 🏷️ **Documentation Tags & Labels**

### **Priority Levels**
- 🔥 **CRITICAL** - Must read for all developers
- ⚡ **HIGH** - Important for productive development  
- 📖 **MEDIUM** - Useful reference material
- 📘 **REFERENCE** - Lookup when needed

### **Role Tags**
- 👥 **All Developers** - Everyone should read
- 🔧 **Backend** - Server-side development
- 📱 **Frontend** - API integration & UI
- ⛓️ **Web3** - Blockchain development
- 🎮 **Game** - Quest & task systems
- 👑 **Admin** - Operations & management

### **Task Categories**
- 🚀 **Setup** - Getting started
- 🏗️ **Development** - Building features
- 🔧 **Troubleshooting** - Fixing issues
- 🔒 **Security** - Production safety
- 🧪 **Testing** - Quality assurance
- 📊 **Monitoring** - Operations

---

## 📞 **Getting Help - Decision Tree**

### **Start Here: What Type of Help Do You Need?**

```
❓ What's Your Situation?
├── 🆘 EMERGENCY: System is broken
│   ├── Check [Error Codes](docs/ERROR_CODES.md) for your error
│   ├── Follow [Security Guide](docs/SECURITY.md) incident response
│   └── Use [README.md](README.md) troubleshooting
│
├── 🚀 NEW: I'm a new developer  
│   ├── Start with [README.md](README.md) (10 min)
│   ├── Follow [README.md](README.md) setup (5 min)
│   ├── Try [API Examples](docs/API_EXAMPLES.md) (10 min)
│   └── Read [CLAUDE.md](CLAUDE.md) sections as needed
│
├── 🔧 DEVELOPMENT: I'm building something
│   ├── Feature development → [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
│   ├── API integration → [API Examples](docs/API_EXAMPLES.md)
│   ├── Database changes → [Database Guide](docs/DATABASE.md)
│   ├── Testing → [Testing Strategy](docs/TESTING_STRATEGY.md)
│   └── Security → [Security Guide](docs/SECURITY.md)
│
├── 🐛 DEBUGGING: Something isn't working
│   ├── API errors → [Error Codes](docs/ERROR_CODES.md) 
│   ├── Environment issues → [README.md](README.md)
│   ├── Database problems → [Database Guide](docs/DATABASE.md)
│   └── Test failures → [Testing Strategy](docs/TESTING_STRATEGY.md)
│
└── 📚 LEARNING: I want to understand the system
    ├── Architecture → [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
    ├── Examples → [API Examples](docs/API_EXAMPLES.md)
    ├── Security → [Security Guide](docs/SECURITY.md)  
    └── Advanced features → Feature-specific docs in docs/
```

---

## ✅ **Documentation Health Check**

### **Verify Your Setup Is Complete**

Run this checklist to ensure you have access to all documentation:

```bash
# ✅ Core documentation exists
ls README.md CLAUDE.md DOCUMENTATION_INDEX.md

# ✅ Essential docs folder  
ls README.md docs/SYSTEM_ARCHITECTURE.md docs/API_EXAMPLES.md

# ✅ Configuration files accessible
ls .env.example package.json prisma/schema.prisma

# ✅ API documentation available
ls etc/openapi/openapi.json
curl http://localhost:4000/api  # Swagger UI

# ✅ Test examples ready
ls etc/http/*.http

# ✅ Database docs generated  
ls prisma/docs/tourii-db-docs.md
```

### **Quick Validation Commands**

```bash
# Test core functionality based on documentation
curl http://localhost:4000/health-check -H "x-api-key: dev-key" -H "accept-version: 1.0.0"
curl http://localhost:4000/api/passport/alice/wallet/google -H "x-api-key: dev-key" -H "accept-version: 1.0.0"
pnpm test --maxWorkers=1
npx tsx prisma/seed-new.ts --help
```

---

**🎯 This documentation index is your central hub for navigating the tourii-backend project. Bookmark this page and use it whenever you need to find specific information quickly!**

_Last Updated: June 26, 2025_