#!/bin/bash

echo "🧪 Testing Social Share Repository Implementation"
echo "================================================"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🔬 Running original user-task-log repository tests..."
pnpm test libs/core/src/infrastructure/datasource/user-task-log.repository-db.spec.ts

echo ""
echo "🔬 Running new social share repository tests..."
pnpm test libs/core/src/infrastructure/datasource/user-task-log-social-share.repository-db.spec.ts

echo ""
echo "✅ All tests completed!"
echo ""
echo "📋 Test files created:"
echo "  - libs/core/src/infrastructure/datasource/user-task-log-social-share.repository-db.spec.ts"
echo "  - Extended existing user-task-log.repository-db.spec.ts with social share tests"
echo ""
echo "🔧 Implementation files modified:"
echo "  - libs/core/src/domain/game/quest/user-task-log.repository.ts"
echo "  - libs/core/src/infrastructure/datasource/user-task-log.repository-db.ts"
echo "  - libs/core/src/infrastructure/mapper/user.mapper.ts"