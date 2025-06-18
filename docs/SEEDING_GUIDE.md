# 🌱 Database Seeding Guide

This guide covers the new modular seeding system that makes database seeding fast, flexible, and maintainable.

---

## 🚀 Quick Start

### Run Everything (Recommended)

```bash
# Seed complete database with all test data
npx prisma db seed
# or
npx tsx prisma/seed-new.ts
```

### Partial Seeding (New!)

```bash
# Just users
npx tsx prisma/seed-new.ts --users-only

# Just stories and content
npx tsx prisma/seed-new.ts --stories-only

# Clean everything first, then seed
npx tsx prisma/seed-new.ts --clean
```

---

## 🎯 What Gets Created

### 👤 **Test Users** (3 users)

| Username | Email            | Role  | Level              | Points | Premium |
| -------- | ---------------- | ----- | ------------------ | ------ | ------- |
| `alice`  | alice@tourii.dev | USER  | BONJIN             | 150    | No      |
| `bob`    | bob@tourii.dev   | USER  | E_CLASS_AMATSUKAMI | 650    | No      |
| `admin`  | admin@tourii.dev | ADMIN | C_CLASS_AMATSUKAMI | 2500   | Yes     |

### 📚 **Stories** (3 stories)

- **Prologue**: Tutorial and welcome content
- **Tokyo Urban Adventure**: Shibuya + Tokyo Station
- **Kyoto Cultural Heritage**: Traditional locations

### 🎯 **Sample Content**

- **2 Tourist Spots** per story
- **2 Quests** per tourist spot (Photo + Quiz)
- **User achievements** and activity logs
- **Discord roles** and assignments

### ⛓️ **NFT Catalog**

- Digital Passport NFT template
- Adventure Log NFT template
- Discount Voucher Perk template

---

## 🔧 Customization

### Adding New Test Users

Edit `USER_TEMPLATES` in `prisma/seed-new.ts`:

```typescript
const USER_TEMPLATES = {
  alice: {
    /* existing */
  },
  bob: {
    /* existing */
  },
  admin: {
    /* existing */
  },

  // Add your new user
  developer: {
    username: 'developer',
    email: 'dev@tourii.dev',
    discord_id: 'discord_dev_999',
    role: UserRoleType.USER,
    is_premium: true,
    level: LevelType.BONJIN,
    magatama_points: 500,
  },
};
```

Then seed with your new user:

```bash
npx tsx prisma/seed-new.ts --users-only --clean
```

### Adding New Stories

Edit `STORY_TEMPLATES`:

```typescript
const STORY_TEMPLATES = {
  // existing stories...

  osaka: {
    saga_name: 'Osaka Food Adventure',
    saga_desc: 'Discover the culinary heart of Japan',
    location: 'Osaka, Japan',
    order: 4,
    is_prologue: false,
    background_media: 'https://cdn.tourii.app/images/osaka_bg.jpg',
  },
};
```

### Configuration Options

Modify `SEED_CONFIG` to control what gets created:

```typescript
const SEED_CONFIG = {
  users: {
    testPassword: 'your_hashed_password',
    defaultUsers: ['alice', 'bob', 'admin', 'developer'], // Add custom users
  },
  stories: {
    createSampleContent: true, // Set false to skip tourist spots/quests
    includeRealLocations: true, // Set false for fake data
  },
  discord: {
    createRoles: true, // Set false to skip Discord integration
    assignToUsers: true, // Set false to skip role assignments
  },
};
```

---

## 🧹 Database Cleanup

### Clean Everything

```bash
npx tsx prisma/seed-new.ts --clean
```

### Clean Specific Parts

```typescript
// In your own script
import { DatabaseCleaner } from './prisma/seed-new';

await DatabaseCleaner.cleanUsers(); // Remove only users
await DatabaseCleaner.cleanStories(); // Remove only stories
await DatabaseCleaner.cleanAll(); // Remove everything
```

---

## 🆚 Old vs New Seeding

### ❌ Old Way (Pain Points)

```bash
# One massive 763-line file
# Hard to modify
# No partial seeding
# Everything breaks if one thing fails
# No clean organization

npx prisma db seed  # Only option
```

### ✅ New Way (Modular & Flexible)

```bash
# Organized into logical modules
# Easy to customize
# Partial seeding support
# Graceful error handling
# Template-based approach

npx tsx prisma/seed-new.ts --users-only     # Just users
npx tsx prisma/seed-new.ts --stories-only   # Just stories
npx tsx prisma/seed-new.ts --clean          # Clean first
```

---

## 🔧 Development Workflows

### Daily Development

```bash
# Quick reset with fresh users
npx tsx prisma/seed-new.ts --users-only --clean

# Add new story content without touching users
npx tsx prisma/seed-new.ts --stories-only --clean
```

### Testing Different Scenarios

```bash
# Scenario 1: Fresh database
npx tsx prisma/seed-new.ts --clean

# Scenario 2: Just need test users
npx tsx prisma/seed-new.ts --users-only

# Scenario 3: Testing story flow
npx tsx prisma/seed-new.ts --stories-only
```

### Team Onboarding

```bash
# New team member gets complete setup
npx prisma migrate dev
npx prisma db seed
```

---

## 🐛 Troubleshooting

### "Module not found" Error

```bash
# Install tsx for TypeScript execution
npm install -g tsx
# or use pnpm
pnpm add -g tsx
```

### Seeding Fails Partially

```bash
# Clean and retry
npx tsx prisma/seed-new.ts --clean

# Check specific error in terminal
# Each module shows progress and errors clearly
```

### Want to Reset Just One Part

```bash
# Reset users only
npx tsx -e "
import { DatabaseCleaner, UserSeeder } from './prisma/seed-new.ts';
await DatabaseCleaner.cleanUsers();
await UserSeeder.seedUsers(['alice', 'bob']);
"
```

### Customize for Your Environment

```bash
# Copy and modify
cp prisma/seed-new.ts prisma/seed-custom.ts
# Edit templates in seed-custom.ts
npx tsx prisma/seed-custom.ts
```

---

## 📦 Migration from Old Seed

### Step 1: Test New Seeding

```bash
# Backup current data
npx prisma db seed  # Run old seed once more

# Test new seeding
npx tsx prisma/seed-new.ts --clean
```

### Step 2: Update package.json (Optional)

```json
{
  "prisma": {
    "seed": "tsx prisma/seed-simple.ts"
  }
}
```

### Step 3: Replace Old File

```bash
# Backup old seed
mv prisma/seed.ts prisma/seed-old.ts

# Use new simple seed as default
mv prisma/seed-simple.ts prisma/seed.ts
```

---

## 🎯 Benefits Summary

### 🚀 **Faster Development**

- Seed only what you need
- No waiting for full database recreation
- Quick iterations on specific features

### 🔧 **Easier Maintenance**

- Clear separation of concerns
- Template-based approach
- Easy to add new users/stories

### 🧪 **Better Testing**

- Multiple test scenarios
- Isolated seeding for specific features
- Consistent test data

### 👥 **Team Friendly**

- Self-documenting code
- Clear error messages
- Modular approach everyone can understand

---

_Last Updated: June 18, 2025_
