# 🔗 Tourii Smart Contracts

This document provides a comprehensive overview of the core smart contracts used in the Tourii ecosystem, including their functionality, deployment patterns, and integration with the backend system.

---

## Contracts

### 1. `TouriiDigitalPassport` (digital-passport/tourii-digital-passport.sol)

- **Type:** ERC721 Non-Fungible Token
- **Inherits:** `ERC721`, `Ownable`
- **Symbol:** TOURII
- **Functionality:** Represents a user's digital identity within the Tourii platform.
- **Metadata:** Dynamic. The token URI points to metadata stored off-chain (e.g., S3) and **can be updated** by the contract owner. This allows the passport details to evolve.
- **Minting:** Controlled by the contract owner (`onlyOwner`). Emits `PassportMinted` event.
- **Burning:** Not burnable by default (standard ERC721 behavior).
- **Key Features:**
  - `mint(address to, string memory uri)`: Creates a new passport NFT.
  - `updateMetadataURI(uint256 tokenId, string memory newURI)`: Allows the owner to change the metadata link for a specific passport. Emits `MetadataURIUpdated` event.
  - `tokenURI(uint256 tokenId)`: Returns the current metadata URI. Requires token to exist.

### 2. `TouriiLog` (tourii-log/tourii-log.sol)

- **Type:** ERC721 Non-Fungible Token
- **Inherits:** `ERC721URIStorage`, `Ownable`
- **Symbol:** TOURIILOG
- **Functionality:** Records significant user actions or milestones as immutable NFTs.
- **Metadata:** Static. The token URI points to metadata stored off-chain, typically on decentralized storage like IPFS, and **cannot be changed** after minting. Uses `ERC721URIStorage` for standard handling.
- **Minting:** Controlled by the contract owner (`onlyOwner`). Emits `LogMinted` event.
- **Burning:** Not burnable by default (standard ERC721 behavior).
- **Key Features:**
  - `mint(address to, string memory uri)`: Creates a new log entry NFT.
  - `tokenURI(uint256 tokenId)`: Returns the metadata URI (set at minting).

### 3. `TouriiPerk` (perks/tourii-perk.sol)

- **Type:** ERC721 Non-Fungible Token (Burnable)
- **Inherits:** `ERC721Burnable`, `ERC721URIStorage`, `Ownable`
- **Symbol:** TOURIIPERK
- **Functionality:** Represents rewards or perks awarded to users. These are intended to be redeemed (burned) by the user.
- **Metadata:** Static. The token URI points to metadata stored off-chain (e.g., IPFS) and **cannot be changed** after minting. Uses `ERC721URIStorage` for standard handling.
- **Minting:** Controlled by the contract owner (`onlyOwner`). Emits `PerkMinted` event.
- **Burning:** Burnable by the **token holder** (or an address approved by the holder) via the `burn(uint256 tokenId)` function inherited from `ERC721Burnable`. This signifies redemption of the perk.
- **Key Features:**
  - `mint(address to, string memory uri)`: Creates a new perk NFT.
  - `burn(uint256 tokenId)`: Allows the owner of the NFT to destroy it.
  - `tokenURI(uint256 tokenId)`: Returns the metadata URI (set at minting).

## 🔐 Access Control

All contracts utilize OpenZeppelin's `Ownable` pattern for secure administrative control:

### Owner Privileges
- **Minting Rights**: Only the contract owner can mint new tokens
- **Metadata Updates**: Digital Passport metadata can be updated by owner only
- **Administrative Functions**: Pausing, upgrading, and other critical operations

### Security Features
- **Multi-signature wallets** recommended for production owner accounts
- **Timelock contracts** for delayed execution of critical operations
- **Role-based access** for different operational functions

## 🚀 Deployment & Integration

### Backend Integration Points

| Contract                | Backend Service   | Integration Method       |
| ----------------------- | ----------------- | ------------------------ |
| `TouriiDigitalPassport` | User Registration | Auto-mint on signup      |
| `TouriiLog`             | Quest Completion  | Event-triggered minting  |
| `TouriiPerk`            | Reward System     | Point redemption minting |

### Contract Addresses

**Testnet (Sepolia)**:
- TouriiDigitalPassport: `0x...` (to be deployed)
- TouriiLog: `0x...` (to be deployed)  
- TouriiPerk: `0x...` (to be deployed)

**Mainnet**:
- TouriiDigitalPassport: `0x...` (to be deployed)
- TouriiLog: `0x...` (to be deployed)
- TouriiPerk: `0x...` (to be deployed)

## 📊 Gas Optimization

| Operation                | Estimated Gas | Notes             |
| ------------------------ | ------------- | ----------------- |
| Mint Digital Passport    | ~80,000       | One-time per user |
| Mint Travel Log          | ~70,000       | Per achievement   |
| Mint Perk                | ~75,000       | Per reward        |
| Burn Perk                | ~30,000       | Redemption action |
| Update Passport Metadata | ~45,000       | User progression  |

## 🔄 Metadata Standards

All contracts follow ERC721 metadata standards with Tourii-specific extensions:

### Digital Passport Metadata
```json
{
  "name": "Tourii Passport #123",
  "description": "Digital identity for Tourii traveler",
  "image": "https://cdn.tourii.xyz/passport/123.png",
  "attributes": [
    {"trait_type": "Level", "value": "E_CLASS_AMATSUKAMI"},
    {"trait_type": "Total Distance", "value": 1250.5},
    {"trait_type": "Quests Completed", "value": 15},
    {"trait_type": "Region", "value": "Kanto"}
  ]
}
```

### Travel Log Metadata
```json
{
  "name": "Tokyo Adventure Complete",
  "description": "Completed the Tokyo city quest",
  "image": "https://cdn.tourii.xyz/logs/tokyo-123.png",
  "attributes": [
    {"trait_type": "Quest Type", "value": "SOLO"},
    {"trait_type": "Location", "value": "Tokyo, Japan"},
    {"trait_type": "Completion Date", "value": "2024-03-20"},
    {"trait_type": "Points Earned", "value": 500}
  ]
}
```

## 📚 Related Documentation

- [Contract Development Setup](../../contracts/README.md)
- [NFT Metadata Delivery Guide](../user/Tourii%20Passport%20NFT%20metadata%20delivery.md)
- [Backend Integration Guide](../BACKEND_FRONTEND_INTEGRATION.md)
- [Security Guidelines](../SECURITY_GUIDELINES.md)

---

*Last Updated: June 16, 2025*
