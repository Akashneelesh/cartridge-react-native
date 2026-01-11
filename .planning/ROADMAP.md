# Roadmap: Starknet Counter App

## Overview

Build a React Native iOS app that demonstrates Starknet blockchain integration. Starting with Expo project setup and polyfills, we'll add read-only counter display, then Cartridge wallet connection, followed by write transactions, and finally polish with status modals and error handling.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** *(Complete 2026-01-11)* - Expo project setup with TypeScript, starknet.js, and crypto polyfills
- [x] **Phase 2: Counter Read** *(Complete 2026-01-11)* - Display counter value from contract (read-only, no wallet)
- [x] **Phase 3: Wallet Connection** *(Complete 2026-01-11)* - Cartridge wallet integration with address display
- [x] **Phase 4: Counter Write** *(Complete 2026-01-12)* - Increment/decrement transactions with wallet signing
- [x] **Phase 5: Polish** *(Complete 2026-01-12)* - Transaction status modal, explorer links, error handling

## Phase Details

### Phase 1: Foundation
**Goal**: Expo project scaffolded with TypeScript, starknet.js, Cartridge SDK, and all required polyfills working
**Depends on**: Nothing (first phase)
**Research**: Likely (new integration)
**Research topics**: starknet.js React Native/Expo compatibility, crypto polyfills (react-native-get-random-values), Cartridge SDK installation
**Plans**: TBD

Plans:
- [x] 01-01: Project scaffold and dependencies *(2026-01-11)*
- [x] 01-02: Polyfill configuration and verification *(2026-01-11)*

### Phase 2: Counter Read
**Goal**: Counter value displays on launch with loading/error states and manual refresh
**Depends on**: Phase 1
**Research**: Likely (external API)
**Research topics**: starknet.js RpcProvider setup for Sepolia, Contract class usage, get_counter() call pattern
**Plans**: TBD

Plans:
- [x] 02-01: Starknet provider, contract setup, and counter display UI *(2026-01-11)*

### Phase 3: Wallet Connection
**Goal**: Cartridge wallet connection flow with address display in UI
**Depends on**: Phase 2
**Research**: Likely (external SDK)
**Research topics**: @cartridge/controller React Native integration, Controller API, connection/disconnect flow
**Plans**: TBD

Plans:
- [x] 03-01: Cartridge controller integration *(2026-01-11)*
- [x] 03-02: Wallet UI (connect button, address display) *(2026-01-11)*

### Phase 4: Counter Write
**Goal**: Increment and decrement counter via signed transactions
**Depends on**: Phase 3
**Research**: Unlikely (builds on Phase 2-3 patterns)
**Plans**: 1

Plans:
- [x] 04-01: Transaction signing with increment/decrement buttons *(2026-01-12)*

### Phase 5: Polish
**Goal**: Transaction status modal, Voyager explorer links, graceful error handling throughout
**Depends on**: Phase 4
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

Plans:
- [x] 05-01: Transaction status modal *(2026-01-12)*
- [x] 05-02: Explorer links and final error handling *(2026-01-12)*

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete | 2026-01-11 |
| 2. Counter Read | 1/1 | Complete | 2026-01-11 |
| 3. Wallet Connection | 2/2 | Complete | 2026-01-11 |
| 4. Counter Write | 1/1 | Complete | 2026-01-12 |
| 5. Polish | 2/2 | Complete | 2026-01-12 |

**Milestone Status:** COMPLETE (8/8 plans)
