# Starknet Counter App

## What This Is

A React Native mobile app (iOS) built with Expo that demonstrates Starknet blockchain integration. The app connects to an existing deployed Cairo smart contract on Starknet Sepolia to read and modify a counter value, with Cartridge wallet integration for transaction signing. This serves as a reference implementation for Starknet + React Native integration patterns.

## Core Value

A working, functional reference app that demonstrates how to integrate Starknet blockchain interactions with React Native/Expo and Cartridge wallet.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Expo project scaffolded with TypeScript, starknet.js, and Cartridge SDK
- [ ] Counter value displays on launch (read-only, no wallet required)
- [ ] Loading and error states for counter fetching
- [ ] Manual refresh button to re-fetch counter value
- [ ] Cartridge wallet connection flow with address display
- [ ] Increment counter (+1) via signed transaction
- [ ] Decrement counter (-1) via signed transaction
- [ ] Transaction status modal (pending → confirmed → failed states)
- [ ] Transaction hash display with Voyager explorer link
- [ ] Graceful error handling throughout

### Out of Scope

- Android support — iOS only for this version
- Expo web support — mobile native focus
- Smart contract deployment/modification — using existing deployed contract
- Persistent wallet connection — session-only, no persistence across restarts
- Multiple wallet providers — Cartridge only
- Transaction history/activity log — not needed for demo
- Push notifications — not required
- Internationalization/localization — English only
- Dark mode/theming — single theme
- Analytics/telemetry — not needed

## Context

**Project Type:** Greenfield React Native/Expo iOS app

**Technical Stack:**
- Expo SDK (latest stable)
- TypeScript
- starknet.js for provider and contract interactions
- @cartridge/controller SDK for wallet connection
- Starknet Sepolia testnet

**Contract Details:**
- Address: `0x075410d36a0690670137c3d15c01fcfa2ce094a4d0791dc769ef18c1c423a7f8`
- Network: Starknet Sepolia
- Functions:
  - `get_counter()` → u128 (view, no wallet)
  - `increase_counter(1)` (external, requires wallet)
  - `decrease_counter(1)` (external, requires wallet)

**Explorer:** Voyager (https://sepolia.voyager.online/)

**Polyfills:** May need crypto polyfills for starknet.js (e.g., `react-native-get-random-values`)

**UI Pattern:** Single-screen app with counter prominently centered, increment/decrement buttons flanking, wallet connection in header or below counter.

## Constraints

- **Platform**: iOS only — no Android or web support
- **Wallet**: Cartridge Controller SDK only — no other wallet providers
- **Network**: Starknet Sepolia testnet — not mainnet
- **Contract**: Existing deployed contract — no deployment or modification

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| iOS only | Scope reduction for reference app | — Pending |
| Cartridge wallet only | Confirmed React Native compatible | — Pending |
| Session-only wallet connection | Simplifies implementation | — Pending |
| Fixed increment/decrement of 1 | Simpler UI (just +/- buttons) | — Pending |

---
*Last updated: 2026-01-11 after initialization*
