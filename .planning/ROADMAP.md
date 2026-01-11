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
- [ ] **Phase 2: Counter Read** - Display counter value from contract (read-only, no wallet)
- [ ] **Phase 3: Wallet Connection** - Cartridge wallet integration with address display
- [ ] **Phase 4: Counter Write** - Increment/decrement transactions with wallet signing
- [ ] **Phase 5: Polish** - Transaction status modal, explorer links, error handling

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
- [ ] 02-01: Starknet provider and contract setup
- [ ] 02-02: Counter display UI with states

### Phase 3: Wallet Connection
**Goal**: Cartridge wallet connection flow with address display in UI
**Depends on**: Phase 2
**Research**: Likely (external SDK)
**Research topics**: @cartridge/controller React Native integration, Controller API, connection/disconnect flow
**Plans**: TBD

Plans:
- [ ] 03-01: Cartridge controller integration
- [ ] 03-02: Wallet UI (connect button, address display)

### Phase 4: Counter Write
**Goal**: Increment and decrement counter via signed transactions
**Depends on**: Phase 3
**Research**: Unlikely (builds on Phase 2-3 patterns)
**Plans**: TBD

Plans:
- [ ] 04-01: Transaction signing and execution
- [ ] 04-02: Increment/decrement buttons with feedback

### Phase 5: Polish
**Goal**: Transaction status modal, Voyager explorer links, graceful error handling throughout
**Depends on**: Phase 4
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

Plans:
- [ ] 05-01: Transaction status modal
- [ ] 05-02: Explorer links and final error handling

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete | 2026-01-11 |
| 2. Counter Read | 0/2 | Not started | - |
| 3. Wallet Connection | 0/2 | Not started | - |
| 4. Counter Write | 0/2 | Not started | - |
| 5. Polish | 0/2 | Not started | - |
