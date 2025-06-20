# 🚀 Development Setup Guide

This guide will get a new team member up and running with the Tourii backend in **under 30 minutes**.

---

## ⚡ Quick Start (5 minutes)

```bash
# 1. Clone and install
git clone [repo-url]
cd tourii-backend
pnpm install

# 2. Start databases (dev + test)
cd etc/docker && docker-compose up db test_db -d

# 3. Setup environment and database
cp .env.example .env
pnpm run prisma:migrate:dev
pnpm run prisma:db:execute

# 4. Generate Prisma client
pnpm exec prisma generate

# 5. Start development
pnpm start:dev:tourii-backend
```

**✅ Done!** API should be running at `http://localhost:4000`

### 🔧 Troubleshooting WSL/Linux Issues

If you encounter `biome` command not found:
```bash
# The biome CLI may not link properly in WSL
# Use npx or pnpm exec instead:
pnpm exec biome lint .
pnpm exec biome check --write .
```

---

## 📋 Prerequisites

Make sure you have these installed:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **pnpm** (`npm install -g pnpm`)
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/))

---

## 🔧 Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Essential Environment Variables

**Core App:**

```env
PORT=3000
NODE_ENV=development
```

**Database (auto-configured for Docker):**

```env
DATABASE_URL=postgresql://touriibackenddev:touriibackenddev@localhost:7442/tourii_backend
```

**Required API Keys:**

```env
# Get from OpenWeatherMap (free tier)
OPEN_WEATHER_API_KEY=your_key_here

# Get from Google Cloud Console
GOOGLE_MAPS_API_KEY=your_key_here
GOOGLE_PLACES_API_KEY=your_key_here

# Generate random strings
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRATION=15m
```

**Optional (for full functionality):**

```env
# Redis (use if available, otherwise caching is disabled)
REDIS_URL=redis://localhost:6379

# AWS S3/R2 (for file uploads)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
R2_BUCKET=tourii-dev

# Social Auth (get from respective platforms)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

---

## 🗃️ Database Setup

### 1. Start PostgreSQL (Docker)

```bash
cd etc/docker
docker-compose up -d

# Verify it's running
docker ps
```

### 2. Run Database Migrations

```bash
# Apply all migrations
pnpm run prisma:migrate:dev

# Execute additional SQL scripts (creates views)
pnpm run prisma:db:execute
```

### 3. (Optional) Seed Test Data

```bash
# Generate and insert sample data
npx prisma db seed
```

### 4. Explore Database

```bash
# Open Prisma Studio (visual database browser)
pnpm run prisma:studio
```

---

## 🧪 Verify Setup

### 1. Health Check

```bash
curl http://localhost:4000/health-check \
  -H "x-api-key: dev-key" \
  -H "accept-version: 1.0.0"

# Should return: "OK"
```

### 2. Run Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e:app
```

### 3. Check Code Quality

```bash
# Lint check
pnpm lint

# Format check
pnpm format
```

---

## 🔑 API Keys Setup Guide

### OpenWeatherMap API

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free account
3. Generate API key
4. Add to `.env` as `OPEN_WEATHER_API_KEY`

### Google Maps APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials → API Key
5. Add to `.env` as `GOOGLE_MAPS_API_KEY` and `GOOGLE_PLACES_API_KEY`

### JWT Secret

```bash
# Generate secure random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🐛 Common Issues & Fixes

### "Port 7442 already in use"

```bash
# Check what's using the port
lsof -i :7442

# Kill the process or change docker port
# Edit etc/docker/docker-compose.yml: "7443:5432"
```

### "Database connection failed"

```bash
# Restart Docker containers
cd etc/docker
docker-compose down && docker-compose up -d

# Wait 10 seconds then retry
```

### "Prisma generate failed"

```bash
# Regenerate Prisma client
npx prisma generate

# If still fails, delete and reinstall
rm -rf node_modules
pnpm install
```

### "Module not found"

```bash
# Clear pnpm cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

---

## 🛠️ Development Workflow

### Daily Startup

```bash
# Start database
cd etc/docker && docker-compose start

# Start development server
pnpm start:dev

# In another terminal, start onchain service (if needed)
pnpm start:dev:tourii-onchain
```

### Making Changes

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, then run quality checks
pnpm lint
pnpm test
pnpm format

# Commit and push
git add .
git commit -m "Add your feature"
git push origin feature/your-feature-name
```

### Database Changes

```bash
# Modify prisma/schema.prisma, then:
npx prisma migrate dev --name your_migration_name

# Apply to production later:
npx prisma migrate deploy
```

---

## 📁 Project Structure (Key Directories)

```
tourii-backend/
├── apps/
│   ├── tourii-backend/     # Main API service
│   └── tourii-onchain/     # Blockchain service
├── libs/core/              # Shared business logic
├── prisma/                 # Database schema & migrations
├── etc/
│   ├── docker/            # Local database setup
│   └── http/              # API testing requests
└── docs/                  # Documentation (you are here!)
```

---

## 🧑‍💻 IDE Setup Recommendations

### VS Code Extensions

- **Prisma** - Database schema support
- **TypeScript Importer** - Auto imports
- **Biome** - Linting & formatting
- **REST Client** - Test API endpoints from `etc/http/`

### Useful VS Code Settings

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome"
}
```

---

## 🚀 You're Ready!

Your development environment is now set up! Next steps:

1. **📖 Read**: [API Documentation](../README.md#-api-reference)
2. **🧪 Test**: Try the example requests in `etc/http/`
3. **🔍 Explore**: Use Prisma Studio to understand the data model
4. **💬 Ask**: Reach out to the team for any questions!

### Quick Reference Commands

```bash
# Start everything
pnpm start:dev

# Run tests
pnpm test

# Database tools
pnpm run prisma:studio
pnpm run prisma:migrate:dev

# Code quality
pnpm lint
pnpm format
```

---

## 🆘 Need Help?

- **Database Issues**: Check [Docker Setup Guide](../etc/docker/README.md)
- **API Testing**: See example requests in `etc/http/` folders
- **Architecture**: Read [System Architecture](./SYSTEM_ARCHITECTURE.md)
- **Security**: Review [Security Guide](./SECURITY.md)

---

_Last Updated: June 18, 2025_
