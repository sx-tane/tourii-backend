# Tourii Smart Contracts

This document provides an overview of the core smart contracts used in the Tourii ecosystem.

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

## Access Control

All contracts utilize OpenZeppelin's `Ownable` pattern. Minting (`mint`) and specific administrative functions (like `updateMetadataURI` in `TouriiDigitalPassport`) are restricted to the contract owner address set during deployment.
