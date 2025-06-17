# 🗃️ Database Guide

This guide covers database setup, migrations, seeding, and common operations for the Tourii Backend PostgreSQL database.

---

## 📋 Quick Reference

### Essential Commands

```bash
# Database setup
pnpm run prisma:migrate:dev     # Run migrations
pnpm run prisma:db:execute      # Execute SQL scripts
npx prisma db seed              # Seed test data
pnpm run prisma:studio          # Open visual browser

# Development
npx prisma generate             # Generate Prisma client
npx prisma format               # Format schema file
npx prisma validate             # Validate schema
```

---

## 🚀 Initial Database Setup

### 1. Start PostgreSQL Container

```bash
cd etc/docker
docker-compose up -d

# Verify container is running
docker ps | grep postgres
```

### 2. Run Migrations

```bash
# Apply all pending migrations
pnpm run prisma:migrate:dev

# This will:
# 1. Create database if it doesn't exist
# 2. Apply all migration files from prisma/migrations/
# 3. Generate Prisma client
# 4. Create database schema
```

### 3. Execute Additional SQL Scripts

```bash
# Create views and additional database objects
pnpm run prisma:db:execute

# This runs: prisma/scripts/moment_view.sql
# Creates the memory_feed view for activity feeds
```

### 4. Seed Test Data

```bash
# Populate database with sample data (traditional way)
npx prisma db seed

# Or use the new modular seeding system (recommended)
npx tsx prisma/seed-new.ts

# Partial seeding options (new!)
npx tsx prisma/seed-new.ts --users-only      # Just users
npx tsx prisma/seed-new.ts --stories-only    # Just stories
npx tsx prisma/seed-new.ts --clean           # Clean first

# This will create:
# - 3 test users (alice, bob, admin)
# - Sample stories and chapters
# - Tourist spots and routes
# - Quests and tasks
# - Discord roles and relationships
```

> 💡 **New**: See the [Seeding Guide](./SEEDING_GUIDE.md) for advanced seeding options and customization.

---

## 📊 Database Schema Overview

### Core Entity Groups

#### 👤 User Management

```
user ← user_info
user ← user_achievement
user ← user_onchain_item
user ← user_item_claim_log
```

#### 🎮 Game Content

```
story ← story_chapter
model_route ← tourist_spot
quest ← quest_task
```

#### 📝 Activity Logging

```
user_story_log     # Story reading progress
user_task_log      # Quest completion logs
user_travel_log    # Location check-ins
```

#### 👥 Social Features

```
discord_roles ← discord_user_roles → user
discord_activity_log
discord_rewarded_roles
user_invite_log
```

#### ⛓️ Blockchain Integration

```
onchain_item_catalog
user_onchain_item
```

---

## 🔄 Migration Workflow

### Creating New Migrations

#### 1. Modify Schema

```bash
# Edit prisma/schema.prisma
# Add new models, fields, or relationships
```

#### 2. Generate Migration

```bash
# Create migration with descriptive name
npx prisma migrate dev --name add_user_preferences

# This will:
# 1. Generate SQL migration file
# 2. Apply migration to database
# 3. Update Prisma client
```

#### 3. Review Generated Files

```bash
# Check migration file in prisma/migrations/
cat prisma/migrations/20250116120000_add_user_preferences/migration.sql
```

### Migration Best Practices

#### Safe Migrations

```sql
-- ✅ Safe operations
ALTER TABLE "user" ADD COLUMN "timezone" TEXT;
ALTER TABLE "quest" ADD COLUMN "difficulty_level" INTEGER DEFAULT 1;
CREATE INDEX "idx_user_email" ON "user"("email");

-- ⚠️ Potentially unsafe operations (data loss)
ALTER TABLE "user" DROP COLUMN "old_field";
ALTER TABLE "quest" ALTER COLUMN "name" TYPE VARCHAR(50); -- truncation risk
```

#### Production Deployment

```bash
# Production migration (no prompts)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

---

## 🌱 Database Seeding

> 💡 **New Modular Seeding System**: We've replaced the old monolithic seed file with a flexible, modular system. See the [Seeding Guide](./SEEDING_GUIDE.md) for complete details.

### Quick Reference

#### Basic Seeding

```bash
# Traditional way (still works)
npx prisma db seed

# New modular way (recommended)
npx tsx prisma/seed-new.ts

# Partial seeding (new!)
npx tsx prisma/seed-new.ts --users-only
npx tsx prisma/seed-new.ts --stories-only
npx tsx prisma/seed-new.ts --clean
```

#### Test Users Created

```typescript
// alice@tourii.dev
- Level: BONJIN
- Magatama Points: 150
- Role: USER

// bob@tourii.dev
- Level: E_CLASS_AMATSUKAMI
- Magatama Points: 650
- Role: USER

// admin@tourii.dev
- Level: C_CLASS_AMATSUKAMI
- Magatama Points: 2500
- Role: ADMIN
```

#### Sample Content

- **Stories**: Prologue + Tokyo + Kyoto adventures
- **Tourist Spots**: Shibuya Crossing, Tokyo Station, etc.
- **Quests**: Photo challenges, Knowledge quizzes
- **Discord Roles**: User, Moderator, Admin

### Advanced Seeding

#### Reset and Reseed

```bash
# Traditional reset
npx prisma migrate reset --force
npx prisma db seed

# New modular reset
npx tsx prisma/seed-new.ts --clean
```

#### Custom Seeding Templates

```typescript
// Modify USER_TEMPLATES in prisma/seed-new.ts
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

  // Add your custom user
  tester: {
    username: 'tester',
    email: 'test@tourii.dev',
    role: UserRoleType.USER,
    level: LevelType.BONJIN,
    magatama_points: 1000,
    is_premium: true,
  },
};
```

#### Seeding for Different Scenarios

```bash
# Development: Full setup
npx tsx prisma/seed-new.ts

# Testing: Users only
npx tsx prisma/seed-new.ts --users-only

# Content testing: Stories only
npx tsx prisma/seed-new.ts --stories-only

# Fresh start: Clean then seed
npx tsx prisma/seed-new.ts --clean
```

---

## 🔍 Database Exploration

### Prisma Studio (Recommended)

```bash
# Open visual database browser
pnpm run prisma:studio

# Navigate to: http://localhost:5555
# Features:
# - Browse all tables and data
# - Edit records visually
# - Run queries
# - View relationships
```

### Command Line Access

```bash
# Connect to PostgreSQL directly
docker-compose exec db psql -U touriibackenddev -d tourii_backend

# Useful PostgreSQL commands
\dt          # List all tables
\d user      # Describe user table
\q           # Quit
```

### Common Queries

```sql
-- Check user count
SELECT COUNT(*) FROM "user";

-- View user levels
SELECT username, level, magatama_points
FROM "user" u
JOIN "user_info" ui ON u.user_id = ui.user_id;

-- Memory feed preview
SELECT * FROM memory_feed LIMIT 10;

-- Quest completion stats
SELECT quest_name, COUNT(*) as completions
FROM quest q
JOIN user_task_log utl ON q.quest_id = utl.quest_id
WHERE utl.status = 'COMPLETED'
GROUP BY quest_name;
```

---

## 📝 SQL Views & Custom Objects

### Memory Feed View

The application uses a custom SQL view for activity feeds:

```sql
-- Located in: prisma/scripts/moment_view.sql
CREATE VIEW memory_feed AS
SELECT
  user_id,
  'TRAVEL' AS type,
  tourist_spot_id AS related_id,
  travel_distance,
  ins_date_time AS created_at
FROM user_travel_log
UNION
SELECT
  user_id,
  'QUEST',
  quest_id,
  NULL,
  completed_at
FROM user_task_log
WHERE status = 'COMPLETED';
```

### Updating Views

```bash
# Drop and recreate views
pnpm prisma db execute --file ./prisma/scripts/drop_view.sql
pnpm prisma db execute --file ./prisma/scripts/moment_view.sql
```

---

## 🛠️ Database Maintenance

### Backup & Restore

#### Create Backup

```bash
# Full database backup
docker-compose exec db pg_dump -U touriibackenddev tourii_backend > backup_$(date +%Y%m%d).sql

# Schema only backup
docker-compose exec db pg_dump -U touriibackenddev --schema-only tourii_backend > schema_backup.sql

# Data only backup
docker-compose exec db pg_dump -U touriibackenddev --data-only tourii_backend > data_backup.sql
```

#### Restore Database

```bash
# Restore from backup
docker-compose exec -T db psql -U touriibackenddev tourii_backend < backup_20250116.sql

# Restore to new database
docker-compose exec db createdb -U touriibackenddev tourii_backup
docker-compose exec -T db psql -U touriibackenddev tourii_backup < backup_20250116.sql
```

### Performance Monitoring

```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check slow queries (if logging enabled)
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Active connections
SELECT
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query
FROM pg_stat_activity
WHERE state = 'active';
```

---

## 🐛 Troubleshooting

### Common Issues

#### "Database does not exist"

```bash
# Check if container is running
docker ps | grep postgres

# Restart container if needed
cd etc/docker && docker-compose restart

# Wait 10 seconds then retry
pnpm run prisma:migrate:dev
```

#### "Migration failed"

```bash
# Check migration status
npx prisma migrate status

# Reset migrations (DESTRUCTIVE)
npx prisma migrate reset

# Re-run migrations
pnpm run prisma:migrate:dev
```

#### "Prisma Client out of sync"

```bash
# Regenerate Prisma client
npx prisma generate

# If still fails, clear and reinstall
rm -rf node_modules/.prisma
pnpm install
npx prisma generate
```

#### Connection Issues

```bash
# Test database connection
docker-compose exec db psql -U touriibackenddev -d tourii_backend -c "SELECT 1;"

# Check environment variables
echo $DATABASE_URL

# Verify container logs
docker-compose logs db
```

### Data Validation

#### Check Data Integrity

```sql
-- Orphaned records
SELECT COUNT(*) FROM user_task_log utl
LEFT JOIN quest q ON utl.quest_id = q.quest_id
WHERE q.quest_id IS NULL;

-- Invalid foreign keys
SELECT COUNT(*) FROM story_chapter sc
LEFT JOIN story s ON sc.story_id = s.story_id
WHERE s.story_id IS NULL;
```

#### Clean Test Data

```bash
# Remove all seed data (keep schema)
npx prisma migrate reset --skip-seed

# Or manually clean specific tables
```

---

## 📚 Advanced Operations

### Schema Introspection

```bash
# Generate schema from existing database
npx prisma db pull

# Compare schemas
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script
```

### Custom Migrations

```sql
-- Manual migration file example
-- prisma/migrations/20250116_custom/migration.sql

-- Add computed column
ALTER TABLE "user_info"
ADD COLUMN "completion_rate" DECIMAL GENERATED ALWAYS AS (
  CASE
    WHEN total_quest_completed = 0 THEN 0
    ELSE (total_quest_completed::decimal / 100) * 100
  END
) STORED;

-- Create performance index
CREATE INDEX CONCURRENTLY "idx_user_task_log_status_completed"
ON "user_task_log"("status", "completed_at")
WHERE status = 'COMPLETED';
```

### Data Migration Scripts

```typescript
// scripts/migrate-data.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateUserData() {
  // Example: Update all user levels based on points
  const users = await prisma.user.findMany({
    include: { user_info: true },
  });

  for (const user of users) {
    if (user.user_info?.magatama_points >= 1000) {
      await prisma.user_info.update({
        where: { user_id: user.user_id },
        data: { level: 'E_CLASS_AMATSUKAMI' },
      });
    }
  }
}
```

---

## 🔗 Related Documentation

- [Development Setup](./DEVELOPMENT_SETUP.md) - Initial environment setup
- [Seeding Guide](./SEEDING_GUIDE.md) - Advanced seeding options and customization
- [API Examples](./API_EXAMPLES.md) - Database queries via API
- [Backend Guidelines](./BACKEND_GUIDELINES.md) - Architecture overview
- [Auto-generated DB Docs](../prisma/docs/tourii-db-docs.md) - Complete schema reference

---

_Last Updated: June 17, 2025_
