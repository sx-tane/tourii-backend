# Vara Network Implementation Guide

This guide covers the specific implementation requirements for deploying Tourii smart contracts on Vara Network using the Gear Protocol.

## 🔧 Why Vara Network is Different

Vara Network is a Polkadot parachain that uses the **Gear Protocol**, which requires:

- **Rust** programming language instead of Solidity
- **WebAssembly (WASM)** compilation target
- **Actor model** for contract execution
- **Different deployment process** using Gear.js

## 🚀 Getting Started with Gear Protocol

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Add WebAssembly target
rustup target add wasm32-unknown-unknown

# Install Gear CLI
cargo install --git https://github.com/gear-tech/gear-cli.git gear-cli
```

### Project Setup

```bash
# Create new Gear project
cargo new --lib tourii-contracts-vara
cd tourii-contracts-vara

# Initialize Gear project structure
gear-cli new --name tourii-contracts
```

## 📁 Project Structure

```
tourii-contracts-vara/
├── Cargo.toml
├── src/
│   ├── lib.rs              # Main contract logic
│   ├── digital_passport.rs # Digital passport implementation
│   ├── perk.rs            # Perk NFT implementation
│   └── travel_log.rs      # Travel log implementation
├── io/
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs         # Input/Output types
├── state/
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs         # State management
└── build.rs               # Build script
```

## 🔨 Contract Implementation

### Cargo.toml Configuration

```toml
[package]
name = "tourii-contracts"
version = "0.1.0"
edition = "2021"

[dependencies]
gstd = { git = "https://github.com/gear-tech/gear.git", features = ["debug"] }
gtest = { git = "https://github.com/gear-tech/gear.git" }
gear-wasm-builder = { git = "https://github.com/gear-tech/gear.git" }
codec = { package = "parity-scale-codec", version = "3", default-features = false }
scale-info = { version = "2", default-features = false }

[build-dependencies]
gear-wasm-builder = { git = "https://github.com/gear-tech/gear.git" }

[dev-dependencies]
gtest = { git = "https://github.com/gear-tech/gear.git" }
```

### Digital Passport Contract (src/digital_passport.rs)

```rust
use gstd::{msg, prelude::*, ActorId, MessageId};
use codec::{Decode, Encode};
use scale_info::TypeInfo;

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct DigitalPassport {
    pub id: u64,
    pub owner: ActorId,
    pub metadata_uri: String,
    pub passport_type: PassportType,
    pub level: PassportLevel,
    pub perks_collected: u32,
    pub travel_distance: u64,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum PassportType {
    Bonjin,
    Amatsukami,
    Kunitsukami,
    Yokai,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum PassportLevel {
    EClass,
    DClass,
    CClass,
    BClass,
    AClass,
    SClass,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum PassportAction {
    Mint { to: ActorId, metadata_uri: String },
    UpdateMetadata { token_id: u64, new_uri: String },
    Transfer { from: ActorId, to: ActorId, token_id: u64 },
    GetOwner { token_id: u64 },
    GetMetadata { token_id: u64 },
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum PassportEvent {
    PassportMinted { to: ActorId, token_id: u64 },
    MetadataUpdated { token_id: u64, new_uri: String },
    Transfer { from: ActorId, to: ActorId, token_id: u64 },
}

static mut PASSPORT_STATE: Option<PassportState> = None;

#[derive(Debug, Default, Clone, Encode, Decode, TypeInfo)]
pub struct PassportState {
    pub next_token_id: u64,
    pub max_supply: u64,
    pub passports: BTreeMap<u64, DigitalPassport>,
    pub owner_passports: BTreeMap<ActorId, u64>,
    pub admin: ActorId,
}

impl PassportState {
    pub fn mint_passport(&mut self, to: ActorId, metadata_uri: String) -> Result<u64, &'static str> {
        if self.next_token_id >= self.max_supply {
            return Err("Max supply reached");
        }

        if self.owner_passports.contains_key(&to) {
            return Err("Address already has a passport");
        }

        let token_id = self.next_token_id;
        let passport = DigitalPassport {
            id: token_id,
            owner: to,
            metadata_uri,
            passport_type: PassportType::Bonjin,
            level: PassportLevel::EClass,
            perks_collected: 0,
            travel_distance: 0,
        };

        self.passports.insert(token_id, passport);
        self.owner_passports.insert(to, token_id);
        self.next_token_id += 1;

        Ok(token_id)
    }

    pub fn update_metadata(&mut self, token_id: u64, new_uri: String) -> Result<(), &'static str> {
        let passport = self.passports.get_mut(&token_id)
            .ok_or("Token does not exist")?;

        passport.metadata_uri = new_uri;
        Ok(())
    }

    pub fn get_passport(&self, token_id: u64) -> Option<&DigitalPassport> {
        self.passports.get(&token_id)
    }
}

#[no_mangle]
extern "C" fn handle() {
    let action: PassportAction = msg::load().expect("Could not load action");
    let state = unsafe { PASSPORT_STATE.get_or_insert_with(Default::default) };

    match action {
        PassportAction::Mint { to, metadata_uri } => {
            // Only admin can mint
            if msg::source() != state.admin {
                panic!("Only admin can mint");
            }

            match state.mint_passport(to, metadata_uri) {
                Ok(token_id) => {
                    msg::reply(PassportEvent::PassportMinted { to, token_id }, 0)
                        .expect("Error during replying");
                }
                Err(error) => {
                    panic!("{}", error);
                }
            }
        }

        PassportAction::UpdateMetadata { token_id, new_uri } => {
            // Only admin can update metadata
            if msg::source() != state.admin {
                panic!("Only admin can update metadata");
            }

            match state.update_metadata(token_id, new_uri.clone()) {
                Ok(()) => {
                    msg::reply(PassportEvent::MetadataUpdated { token_id, new_uri }, 0)
                        .expect("Error during replying");
                }
                Err(error) => {
                    panic!("{}", error);
                }
            }
        }

        PassportAction::GetOwner { token_id } => {
            if let Some(passport) = state.get_passport(token_id) {
                msg::reply(passport.owner, 0).expect("Error during replying");
            } else {
                panic!("Token does not exist");
            }
        }

        PassportAction::GetMetadata { token_id } => {
            if let Some(passport) = state.get_passport(token_id) {
                msg::reply(passport.metadata_uri.clone(), 0).expect("Error during replying");
            } else {
                panic!("Token does not exist");
            }
        }

        // Additional actions...
        _ => {}
    }
}

#[no_mangle]
extern "C" fn init() {
    let init_config: InitConfig = msg::load().expect("Could not load init config");

    let state = PassportState {
        next_token_id: 0,
        max_supply: init_config.max_supply,
        passports: BTreeMap::new(),
        owner_passports: BTreeMap::new(),
        admin: msg::source(),
    };

    unsafe { PASSPORT_STATE = Some(state) };
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct InitConfig {
    pub max_supply: u64,
}
```

### Build Script (build.rs)

```rust
use gear_wasm_builder::WasmBuilder;

fn main() {
    WasmBuilder::new()
        .with_wasm_path("target/wasm32-unknown-unknown/release/")
        .build();
}
```

## 🚀 Deployment Process

### 1. Build the Contract

```bash
# Build the contract
cargo build --release --target=wasm32-unknown-unknown

# The compiled WASM will be in target/wasm32-unknown-unknown/release/
```

### 2. Upload to Vara Network

#### Using Gear.js (JavaScript/TypeScript)

```javascript
import { GearApi, GearKeyring } from '@gear-js/api';
import { readFileSync } from 'fs';

async function deployContract() {
  // Connect to Vara Network
  const api = await GearApi.create({
    providerAddress: 'wss://rpc.vara-network.io', // Vara Network RPC
  });

  // Create keyring for deployment
  const keyring = await GearKeyring.fromSuri('//Alice'); // Use your seed phrase

  // Read compiled WASM
  const wasm = readFileSync(
    'target/wasm32-unknown-unknown/release/tourii_contracts.wasm',
  );

  // Read metadata
  const metadata = readFileSync(
    'target/wasm32-unknown-unknown/release/tourii_contracts.meta.wasm',
  );

  // Deploy contract
  const program = {
    id: '0x...', // Program ID will be generated
    source: msg.source,
    payload: { max_supply: 100000 }, // Init config
  };

  const tx = api.program.submit({
    code: wasm,
    gasLimit: 10_000_000,
    value: 0,
    initPayload: program.payload,
  });

  await tx.signAndSend(keyring, ({ status, events }) => {
    if (status.isFinalized) {
      console.log('Contract deployed successfully');
      // Extract program ID from events
    }
  });
}
```

#### Using Gear Idea (Web Interface)

1. Go to https://idea.gear-tech.io
2. Connect your wallet
3. Upload WASM file and metadata
4. Set initialization parameters
5. Deploy contract

### 3. Interact with Contract

```javascript
// Send message to contract
const message = {
  destination: contractId,
  payload: {
    Mint: {
      to: userAddress,
      metadata_uri: 'https://metadata.tourii.com/passport/1.json',
    },
  },
  gasLimit: 1_000_000,
  value: 0,
};

await api.message.submit(message, metadata);
```

## 🧪 Testing

### Unit Tests (src/lib.rs)

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use gtest::{Log, Program, System};

    #[test]
    fn test_mint_passport() {
        let system = System::new();
        system.init_logger();

        let program = Program::current(&system);

        let init_config = InitConfig { max_supply: 1000 };
        let res = program.send_bytes(2, init_config);
        assert!(!res.main_failed());

        // Test minting
        let mint_action = PassportAction::Mint {
            to: 3.into(),
            metadata_uri: "test_uri".to_string(),
        };

        let res = program.send_bytes(2, mint_action);
        assert!(!res.main_failed());

        // Verify event was emitted
        let log = Log::builder().dest(2).payload(PassportEvent::PassportMinted {
            to: 3.into(),
            token_id: 0,
        });
        assert!(res.contains(&log));
    }
}
```

### Run Tests

```bash
cargo test
```

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] Install Rust and Gear toolchain
- [ ] Implement all contract functionality
- [ ] Write comprehensive tests
- [ ] Build contract successfully
- [ ] Test on local Gear node

### Deployment

- [ ] Fund deployment account with VARA tokens
- [ ] Deploy to Vara testnet first
- [ ] Verify contract functionality
- [ ] Deploy to Vara mainnet
- [ ] Update database with contract addresses

### Post-Deployment

- [ ] Set up contract interaction scripts
- [ ] Implement backend integration
- [ ] Monitor contract events
- [ ] Set up upgrade mechanism if needed

## 🔗 Integration with Backend

### Database Updates

```sql
-- Add Vara Network contracts
INSERT INTO onchain_item_catalog (
    item_type,
    blockchain_type,
    contract_address,
    metadata_url,
    max_supply
) VALUES
('DIGITAL_PASSPORT', 'VARA', '0x...', 'https://metadata.tourii.com/passport/', 100000),
('PERK', 'VARA', '0x...', 'https://metadata.tourii.com/perk/', 10000);
```

### Backend Service Integration

```typescript
// tourii-onchain service integration
import { GearApi } from '@gear-js/api';

export class VaraContractService {
  private api: GearApi;

  async mintDigitalPassport(userAddress: string, metadataUri: string) {
    const message = {
      destination: this.passportContractId,
      payload: {
        Mint: { to: userAddress, metadata_uri: metadataUri },
      },
      gasLimit: 1_000_000,
      value: 0,
    };

    return await this.api.message.submit(message, this.metadata);
  }
}
```

## 📚 Resources

- [Gear Protocol Documentation](https://docs.gear.rs/)
- [Vara Network Official Site](https://vara-network.io/)
- [Gear.js API Documentation](https://github.com/gear-tech/gear-js)
- [Gear Idea Development Environment](https://idea.gear-tech.io/)
- [Example Contracts](https://github.com/gear-tech/gear/tree/master/examples)

## 🔍 Key Differences from EVM

| Aspect      | EVM (Soneium/SKALE) | Vara Network (Gear)               |
| ----------- | ------------------- | --------------------------------- |
| Language    | Solidity            | Rust                              |
| Compilation | Bytecode            | WebAssembly                       |
| Execution   | Stack-based         | Actor Model                       |
| State       | Storage slots       | Persistent memory                 |
| Gas         | Gas units           | Gas units (different calculation) |
| Deployment  | Contract creation   | Program upload                    |
| Interaction | Function calls      | Message passing                   |

---

This guide provides the foundation for implementing Tourii contracts on Vara Network. The Rust implementation follows similar patterns to the Solidity contracts but leverages Gear Protocol's unique features.
