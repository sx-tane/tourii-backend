# Code Quality Issues - Digital Passport & Wallet Integration

## 📊 Quality Assessment Overview

**Overall Code Quality**: 🟡 **NEEDS IMPROVEMENT**

While the implementation follows good architectural patterns, several code quality issues prevent production deployment and may cause build failures or runtime errors.

## 🚨 Critical Issues (Build Blockers)

### 1. TypeScript Type Errors

#### Environment Variable Access Patterns
**Files**: Multiple files in Google Wallet integration
```typescript
// INCORRECT (causes TypeScript errors)
const keyPath = process.env.GOOGLE_WALLET_KEY_PATH || 'default';

// CORRECT (TypeScript safe)
const keyPath = process.env['GOOGLE_WALLET_KEY_PATH'] || 'default';
```

#### Missing Type Declarations
**File**: Contract test files
- **Issue**: Hardhat modules missing type declarations
- **Impact**: TypeScript compilation failures
- **Fix**: Add `@types/hardhat` or type declaration files

### 2. Linting Errors (5 Auto-fixable)

#### File: `checkins-fetch-request.model.ts` (Lines 35, 43)
```typescript
// INCORRECT (ESLint error)
if (isNaN(this.pageSize)) {
    this.pageSize = 10;
}

// CORRECT (Biome/ESLint compliant)
if (Number.isNaN(this.pageSize)) {
    this.pageSize = 10;
}
```

#### File: `passport-verification.controller.ts`
```typescript
// INCORRECT (unused imports)
import { Query, ApiQuery } from '@nestjs/swagger';

// CORRECT (remove unused imports)
import { Controller, Get, Param } from '@nestjs/common';
```

#### File: `story-create-request-builder.ts`
```typescript
// INCORRECT (placeholder comment)
// biome-ignore lint/complexity/noBannedTypes: <explanation>

// CORRECT (proper explanation)
// biome-ignore lint/complexity/noBannedTypes: Legacy type required for backward compatibility
```

#### File: `passport-verification.service.ts`
```typescript
// INCORRECT (unused imports and variables)
import { QrCodePayload, TouriiBackendAppErrorType } from '@app/core/...';
const token = extractTokenFromQr(qrCode); // unused variable

// CORRECT (remove unused code)
// Remove unused imports and variables
```

## ⚠️ Code Quality Concerns

### 1. Test Coverage: 0%

**Missing Test Files**:
- No unit tests for `WalletPassRepositoryImpl`
- No integration tests for wallet controllers
- No test coverage for Google Wallet integration
- No mock implementations for external services

**Recommended Test Structure**:
```
libs/core/src/infrastructure/passport/
├── __tests__/
│   ├── wallet-pass.repository-impl.spec.ts
│   ├── google-wallet.repository-api.spec.ts
│   └── passport-verification.service.spec.ts
└── __mocks__/
    ├── apple-wallet.mock.ts
    └── google-wallet.mock.ts
```

### 2. Error Handling Inconsistencies

#### Generic Error Usage
```typescript
// CURRENT (less specific)
throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);

// RECOMMENDED (wallet-specific errors)
throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_WALLET_CERT_MISSING);
throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_APPLE_PASS_GENERATION_FAILED);
```

#### Missing Error Codes
The system needs wallet-specific error codes:
- `E_TB_WALLET_CERT_MISSING`
- `E_TB_APPLE_PASS_GENERATION_FAILED`
- `E_TB_GOOGLE_WALLET_API_ERROR`
- `E_TB_WALLET_PASS_EXPIRED`

### 3. Code Duplication and Structure

#### Mock Data Duplication
**Issue**: Similar mock objects in multiple methods
**Files**: `wallet-pass.repository-impl.ts:37-81, 115-237`
**Solution**: Extract mock data to separate factory class

#### Magic Numbers and Strings
```typescript
// CURRENT (magic numbers)
expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
const qrToken = this.jwtRepository.generateQrToken(tokenId, 168); // 168 hours

// RECOMMENDED (constants)
const PASS_EXPIRY_DAYS = 7;
const QR_TOKEN_EXPIRY_HOURS = 168;
```

## 🛠️ Quick Fix Commands

### Auto-fix Linting Issues
```bash
# Fix all auto-fixable linting errors
pnpm check

# Alternative: run biome directly
pnpm exec biome lint . --apply
```

### Fix TypeScript Type Errors
```bash
# Check type errors without building
pnpm exec tsc --noEmit

# Check specific project
pnpm exec tsc --noEmit --project tsconfig.json
```

### Commit Uncommitted Files
```bash
# Check git status
git status

# Add Google Wallet files
git add libs/core/src/infrastructure/passport/google-wallet.repository-api.ts
git add libs/core/src/infrastructure/passport/google-wallet.service.ts

# Commit with descriptive message
git commit -m "feat: add Google Wallet integration files"
```

## 📈 Code Quality Improvement Plan

### Phase 1: Critical Fixes (30 minutes)
```bash
# 1. Fix linting errors
pnpm check

# 2. Fix TypeScript errors
# Manual fix required for environment variable access patterns

# 3. Commit files
git add -A && git commit -m "fix: resolve linting and type errors"
```

### Phase 2: Test Coverage (4-6 hours)
1. **Unit Tests**: Write tests for all repository methods
2. **Integration Tests**: Test controller endpoints
3. **Mock Services**: Create mock implementations for external APIs
4. **Error Testing**: Test all error scenarios

### Phase 3: Code Structure (2-3 hours)
1. **Extract Constants**: Move magic numbers to configuration
2. **Create Factories**: Extract mock data to factory classes
3. **Add Error Codes**: Create wallet-specific error types
4. **Improve Naming**: Use more descriptive variable names

### Phase 4: Documentation (1 hour)
1. **Code Comments**: Add JSDoc comments to public methods
2. **README Updates**: Document new dependencies and setup
3. **API Examples**: Add wallet integration examples to docs

## 🎯 Code Quality Metrics

### Current State
- **Test Coverage**: 0%
- **Linting Errors**: 5
- **TypeScript Errors**: 8+
- **Code Duplication**: High (mock data)
- **Documentation**: Minimal

### Target State
- **Test Coverage**: >80%
- **Linting Errors**: 0
- **TypeScript Errors**: 0
- **Code Duplication**: Low
- **Documentation**: Comprehensive

## ✅ Quality Checklist

### Immediate Actions
- [ ] Run `pnpm check` to fix linting errors
- [ ] Fix TypeScript type errors
- [ ] Commit uncommitted files
- [ ] Remove unused imports and variables

### Short-term Improvements
- [ ] Add comprehensive unit tests
- [ ] Create wallet-specific error codes
- [ ] Extract constants and magic numbers
- [ ] Add proper JSDoc documentation

### Long-term Quality
- [ ] Implement integration tests
- [ ] Add code coverage reporting
- [ ] Set up pre-commit hooks
- [ ] Configure stricter linting rules

## 🚀 Recommended Tools

### Development Tools
```bash
# Code formatting
pnpm add -D prettier @biomejs/biome

# Testing
pnpm add -D jest @nestjs/testing supertest

# Type checking
pnpm add -D typescript @types/node

# Pre-commit hooks
pnpm add -D husky lint-staged
```

### VS Code Extensions
- ESLint
- Prettier
- TypeScript Importer
- Jest Runner
- Code Coverage Gutters

---

*Code Quality Review: June 24, 2025*  
*Next Review: After Phase 1 completion*