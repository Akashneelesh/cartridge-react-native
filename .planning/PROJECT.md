# Starknet Counter App

## What This Is

A React Native mobile app (iOS) built with Expo that demonstrates Starknet blockchain integration. The app connects to an existing deployed Cairo smart contract on Starknet Sepolia to read and modify a counter value, with Cartridge wallet integration for transaction signing. This serves as a reference implementation for Starknet + React Native integration patterns.

## Core Value

A working, functional reference app that demonstrates how to integrate Starknet blockchain interactions with React Native/Expo and Cartridge wallet.

## Requirements

### Validated

- ✓ Expo project scaffolded with TypeScript, starknet.js, and Cartridge SDK — v1.0
- ✓ Counter value displays on launch (read-only, no wallet required) — v1.0
- ✓ Loading and error states for counter fetching — v1.0
- ✓ Manual refresh button to re-fetch counter value — v1.0
- ✓ Cartridge wallet connection flow with address display — v1.0
- ✓ Increment counter (+1) via signed transaction — v1.0
- ✓ Decrement counter (-1) via signed transaction — v1.0
- ✓ Transaction status modal (pending → confirmed → failed states) — v1.0
- ✓ Transaction hash display with Voyager explorer link — v1.0
- ✓ Graceful error handling throughout — v1.0

### Active

(None — v1.0 MVP complete)

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
| iOS only | Scope reduction for reference app | ✓ Good |
| Cartridge wallet only | Confirmed React Native compatible | ✓ Good |
| Session-based auth over @cartridge/controller | Web SDK incompatible with RN, uses browser-only APIs | ✓ Good |
| react-native-get-random-values for polyfills | Simpler than react-native-quick-crypto, no native compilation | ✓ Good |
| starknet.js v9 API syntax | Object parameters for Contract and Account constructors | ✓ Good |
| Unicode symbols for modal icons | Avoids external icon library dependency | ✓ Good |
| Fixed increment/decrement of 1 | Simpler UI (just +/- buttons) | ✓ Good |

## Current State

**Version:** v1.0 MVP (shipped 2026-01-12)

**Tech Stack:**
- Expo SDK 54 with TypeScript
- starknet.js v9 for provider and contract interactions
- Session-based Cartridge wallet authentication
- React Native 0.81.5 with Metro bundler

**Codebase:** 1,237 lines of TypeScript across 86 files

**Status:** Reference app complete — demonstrates Starknet + React Native + Cartridge integration patterns

---
*Last updated: 2026-01-12 after v1.0 milestone*
