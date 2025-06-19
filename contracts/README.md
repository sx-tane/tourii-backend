# 🔗 Tourii Smart Contracts

This directory contains the Solidity smart contracts for the Tourii ecosystem, built with Hardhat. These contracts power the NFT-based digital passport system, travel logs, and reward perks.

## 📁 Contract Structure

```
contracts/
├── digital-passport/
│   └── tourii-digital-passport.sol    # ERC721 - User identity NFTs
├── tourii-log/
│   └── tourii-log.sol                 # ERC721 - Immutable travel logs
├── perks/
│   └── tourii-perk.sol                # ERC721Burnable - Redeemable rewards
└── Lock.sol                           # Example contract (can be removed)
```

## 🎯 Core Contracts

### 1. TouriiDigitalPassport

- **Type**: ERC721 NFT
- **Symbol**: TOURII
- **Purpose**: Digital identity for Tourii users
- **Features**:
  - Mutable metadata (passport can evolve)
  - Owner-controlled minting
  - Metadata URI updates

### 2. TouriiLog

- **Type**: ERC721 NFT
- **Symbol**: TOURIILOG
- **Purpose**: Immutable records of user achievements
- **Features**:
  - Static metadata (permanent records)
  - IPFS storage for decentralization
  - Owner-controlled minting

### 3. TouriiPerk

- **Type**: ERC721Burnable NFT
- **Symbol**: TOURIIPERK
- **Purpose**: Redeemable rewards and benefits
- **Features**:
  - Burnable by token holder (redemption)
  - Static metadata
  - Owner-controlled minting

## 🛠️ Development Commands

### Setup

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile
```

### Testing

```bash
# Run all tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/TouriiDigitalPassport.test.ts
```

### Local Development

```bash
# Start local Hardhat node
npx hardhat node

# Deploy to local network
npx hardhat ignition deploy ./ignition/modules/TouriiContracts.ts --network localhost
```

### Deployment

```bash
# Deploy to testnet (e.g., Sepolia)
npx hardhat ignition deploy ./ignition/modules/TouriiContracts.ts --network sepolia

# Deploy to mainnet
npx hardhat ignition deploy ./ignition/modules/TouriiContracts.ts --network mainnet
```

## 📋 Contract Verification

After deployment, verify contracts on Etherscan:

```bash
# Verify TouriiDigitalPassport
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "TouriiPassport" "TOURII"

# Verify TouriiLog
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "TouriiLog" "TOURIILOG"

# Verify TouriiPerk
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "TouriiPerk" "TOURIIPERK"
```

## 🔐 Security Considerations

- All contracts use OpenZeppelin's battle-tested implementations
- Owner-only minting prevents unauthorized token creation
- Digital Passport metadata can be updated for user progression
- Travel Logs use immutable metadata for permanent records
- Perks are burnable for one-time redemption mechanics

## 🌐 Network Configuration

Supported networks (configured in `hardhat.config.ts`):

- **Localhost**: For development testing
- **Sepolia**: Ethereum testnet
- **Mainnet**: Ethereum mainnet
- **Polygon**: For lower gas costs
- **Vara Network**: Custom blockchain integration

## 📚 Documentation

For detailed contract specifications, see:

- [Smart Contract Documentation](../docs/web3/Tourii%20Smart%20Contract.md)
- [NFT Metadata Guide](../docs/user/Tourii%20Passport%20NFT%20metadata%20delivery.md)

## 🧪 Testing Framework

Tests are written using:

- **Hardhat**: Development environment
- **Ethers.js**: Ethereum library
- **Chai**: Assertion library
- **Waffle**: Testing utilities

## 🚀 Integration

These contracts integrate with the Tourii backend through:

- **Gear.js**: For Vara Network interactions
- **Sails.js**: Smart contract interface framework
- **Ethers.js**: For EVM-compatible operations
- **IPFS**: For decentralized metadata storage

---

For backend integration details, see the main [README](../README.md) and [Backend Guidelines](../docs/BACKEND_GUIDELINES.md).
