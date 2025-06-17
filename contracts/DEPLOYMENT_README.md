# Tourii Smart Contracts Deployment Guide

This guide covers the deployment of Tourii's smart contracts across multiple blockchain networks: Soneium, SKALE Network, and Vara Network.

## 🏗️ Contract Overview

### 1. TouriiDigitalPassport.sol
- **Type**: Dynamic ERC721 NFT (dNFT)
- **Purpose**: User identity and progression tracking
- **Features**:
  - One passport per address
  - Updatable metadata for progression tracking
  - Role-based access control (MINTER_ROLE, UPDATER_ROLE)
  - Pausable functionality
  - Max supply control

### 2. TouriiPerk.sol  
- **Type**: Burnable ERC721 NFT collections
- **Purpose**: Location-based rewards and achievements (Goshuin NFTs)
- **Features**:
  - Customizable collection name and symbol
  - Burnable functionality for redemption
  - Perk category classification
  - Redeemable perks tracking
  - Role-based access control

### 3. TouriiLog.sol
- **Type**: Standard ERC721 NFT for milestones
- **Purpose**: Record significant travel achievements
- **Features**:
  - Category-based milestone tracking
  - User log aggregation
  - Transfer tracking for ownership history

## 🌐 Supported Networks

### Soneium (Sony Blockchain)
- **Testnet**: Chain ID 1946
- **Mainnet**: Chain ID 1868
- **Type**: EVM-compatible
- **Gas Token**: ETH

### SKALE Network (Europa Hub)
- **Testnet**: Chain ID 476158412
- **Mainnet**: Chain ID 2046399126
- **Type**: EVM-compatible, Zero Gas Fees
- **Benefits**: No transaction fees for users

### Vara Network ⚠️
- **Chain ID**: 4741444
- **Type**: Polkadot Parachain (Gear Protocol)
- **Language**: Rust-based smart contracts
- **Status**: Requires separate implementation

> **Important**: Vara Network uses Gear Protocol and requires Rust-based smart contracts instead of Solidity. The current EVM contracts are compatible with Soneium and SKALE only. For Vara Network deployment, contracts need to be rewritten in Rust using the Gear Protocol framework.

## 🚀 Quick Start

### Prerequisites
1. Node.js (v18+)
2. npm/yarn/pnpm
3. Git

### Installation
```bash
# Navigate to contracts directory
cd contracts

# Install dependencies
npm install
# or
pnpm install

# Copy environment template
cp .env.example .env

# Edit .env with your private key and RPC URLs
nano .env
```

## 🔧 Environment Setup

### Required Environment Variables
```bash
# Private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Network RPC URLs
SONEIUM_TESTNET_RPC_URL=https://rpc.testnet.soneium.org
SONEIUM_MAINNET_RPC_URL=https://rpc.soneium.org
SKALE_TESTNET_RPC_URL=https://testnet.skalenodes.com/v1/juicy-low-small-testnet
SKALE_MAINNET_RPC_URL=https://mainnet.skalenodes.com/v1/elated-tan-skat

# API Keys for verification
SONEIUM_API_KEY=your_soneium_api_key
SKALE_API_KEY=your_skale_api_key
```

### Wallet Setup
1. Create a new wallet for deployment
2. Fund it with native tokens:
   - **Soneium**: ETH
   - **SKALE**: ETH (for deployment only, transactions are free)
3. Never commit your private key to version control

## 📋 Deployment Commands

### Compile Contracts
```bash
npm run compile
```

### Deploy to Testnet (Recommended First)
```bash
# Soneium Testnet
npm run deploy:soneium-testnet

# SKALE Testnet  
npm run deploy:skale-testnet
```

### Deploy to Mainnet
```bash
# Soneium Mainnet
npm run deploy:soneium-mainnet

# SKALE Mainnet
npm run deploy:skale-mainnet
```

### Deploy Individual Perk Collections
```bash
# Deploy a new perk collection
npx hardhat run scripts/deploy-perk-collection.ts --network soneiumTestnet -- "Harajiri Falls Collection" "HARAJIRI" "waterfalls" 1000

# Parameters:
# 1. Collection Name
# 2. Collection Symbol  
# 3. Category (optional)
# 4. Max Supply (optional, 0 = unlimited)
```

## 🔍 Contract Verification

After deployment, verify contracts on block explorers:

```bash
# Soneium
npm run verify:soneium-testnet <contract_address> [constructor_args]
npm run verify:soneium-mainnet <contract_address> [constructor_args]

# SKALE
npm run verify:skale-testnet <contract_address> [constructor_args]
npm run verify:skale-mainnet <contract_address> [constructor_args]
```

### Example Verification Commands
```bash
# Digital Passport (no constructor args)
npx hardhat verify --network soneiumTestnet 0x1234...5678

# Perk Collection (with constructor args)
npx hardhat verify --network soneiumTestnet 0x1234...5678 "Tourii Goshuin Collection" "GOSHUIN"
```

## 📊 Deployment Tracking

Deployment information is automatically saved to `deployments/<network>-<chainId>.json`:

```json
{
  "network": "soneiumTestnet",
  "chainId": 1946,
  "deployer": "0x...",
  "contracts": {
    "TouriiDigitalPassport": "0x...",
    "TouriiPerk": "0x...",
    "TouriiLog": "0x..."
  },
  "perkCollections": {
    "goshuin": {
      "name": "Tourii Goshuin Collection",
      "symbol": "GOSHUIN",
      "address": "0x...",
      "category": "travel",
      "maxSupply": 0
    }
  },
  "deploymentTimestamp": "2024-...",
  "blockNumber": 12345
}
```

## 🎯 Post-Deployment Setup

### 1. Role Management
Grant appropriate roles for production:

```javascript
// Grant MINTER_ROLE to backend service
await digitalPassport.grantRole(MINTER_ROLE, backendServiceAddress);

// Grant UPDATER_ROLE for metadata updates  
await digitalPassport.grantRole(UPDATER_ROLE, metadataServiceAddress);
```

### 2. Configure Max Supply
```javascript
// Set reasonable limits
await digitalPassport.setMaxSupply(100000); // 100k passports max
await perkCollection.setMaxSupply(10000);   // 10k perks per collection
```

### 3. Update Database
Add contract addresses to your database `onchain_item_catalog` table:

```sql
INSERT INTO onchain_item_catalog (
  item_type, 
  blockchain_type, 
  contract_address, 
  metadata_url, 
  max_supply
) VALUES 
('DIGITAL_PASSPORT', 'SONEIUM', '0x...', 'https://metadata.tourii.com/passport/', 100000),
('PERK', 'SONEIUM', '0x...', 'https://metadata.tourii.com/perk/', 10000);
```

## 🔒 Security Best Practices

### Access Control
- Use role-based permissions instead of single owner
- Grant minimal required permissions
- Use multi-sig wallets for mainnet ownership
- Regularly audit role assignments

### Deployment Security
- Use separate wallets for deployment vs. operational use
- Verify all contract addresses before database updates
- Test on testnets before mainnet deployment
- Keep private keys secure and never commit them

### Monitoring
- Set up contract event monitoring
- Monitor for unusual minting patterns
- Track gas usage and optimization opportunities
- Monitor role grant/revoke events

## 🔄 Upgrade Strategy

These contracts are **not upgradeable** by design for security. For updates:

1. Deploy new contract versions
2. Migrate data if necessary
3. Update frontend to point to new contracts
4. Deprecate old contracts gracefully

## 🐛 Troubleshooting

### Common Issues

#### "Insufficient funds for gas"
- Ensure wallet has enough native tokens
- Check gas price settings in hardhat.config.ts

#### "Contract already verified"
- Verification was successful previously
- Use the existing verified contract

#### "Network not supported"
- Check network configuration in hardhat.config.ts
- Verify RPC URL is accessible

#### "Private key invalid"
- Ensure private key is correct format (without 0x prefix)
- Check .env file is properly loaded

### Gas Optimization
```bash
# Check contract sizes
npm run size

# Generate gas report
REPORT_GAS=true npm test
```

## 📚 Integration Examples

### Minting Digital Passport
```javascript
// Backend service mints passport for new user
const tx = await digitalPassport.mint(
  userAddress,
  "https://metadata.tourii.com/passport/123.json"
);
await tx.wait();
```

### Updating Passport Metadata
```javascript
// Update user's progression
const tx = await digitalPassport.updateMetadataURI(
  tokenId,
  "https://metadata.tourii.com/passport/123-updated.json"
);
await tx.wait();
```

### Minting Perk
```javascript
// Award perk for completing quest
const tx = await perkCollection.mint(
  userAddress,
  "https://metadata.tourii.com/perk/harajiri-falls.json"
);
await tx.wait();
```

## 🌟 Vara Network Implementation

For Vara Network deployment, you'll need:

### 1. Gear Protocol Setup
```bash
# Install Gear CLI
cargo install --git https://github.com/gear-tech/gear-cli.git gear-cli

# Create new Gear project
cargo new --lib tourii-contracts
cd tourii-contracts
```

### 2. Rust Contract Structure
```rust
// Cargo.toml
[dependencies]
gear-wasm-builder = { git = "https://github.com/gear-tech/gear.git" }
gstd = { git = "https://github.com/gear-tech/gear.git" }
gmeta = { git = "https://github.com/gear-tech/gear.git" }
gtest = { git = "https://github.com/gear-tech/gear.git" }
```

### 3. Contract Implementation
The contracts would need to be rewritten in Rust following Gear Protocol patterns for:
- Digital Passport (dNFT)
- Perk Collections (Burnable NFTs)
- Travel Logs (Standard NFTs)

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Verify network configurations
3. Test on testnets first
4. Ensure proper environment setup

---

**⚠️ Important**: Always test on testnets before mainnet deployment. Keep private keys secure and never commit them to version control.