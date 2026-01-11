# Phase 3: Wallet Connection - Discovery

## Research Summary

**Discovery Level:** 2 (Standard Research)
**Date:** 2026-01-12
**Focus:** @cartridge/controller React Native/Expo integration

## Key Findings

### 1. Cartridge Controller Architecture

The Cartridge Controller is primarily designed for **web applications** and uses an iframe-based architecture:

- Web: `ControllerConnector` + `@starknet-react/core` hooks
- Native apps: `SessionConnector` from `@cartridge/connector` (redirect-based flow)

**Important:** Controller relies on DOM APIs (iframe, window.postMessage) which aren't available in React Native.

### 2. React Native Options

| Approach | Complexity | Cartridge Support |
|----------|------------|-------------------|
| WebView-based auth | Medium | Partial - requires redirect handling |
| SessionConnector | High | Yes - designed for native apps |
| Direct Controller | Not possible | No - requires browser DOM |

### 3. Recommended Approach: WebView + Controller

For this demo app, use a **WebView modal** that:
1. Loads Cartridge's keychain page (`https://x.cartridge.gg`)
2. Handles authentication via web flow
3. Extracts account credentials via deep link or postMessage

**Alternative:** Use Controller directly with a managed Expo development client (Expo Go has limitations with custom native code).

### 4. Simpler Alternative: Mock/Direct Account

Given this is a **demo reference app**, consider:
- For MVP: Display a mock address or use a pre-generated session
- Full integration: WebView modal with deep link callback

### 5. @cartridge/controller API

```typescript
import Controller from "@cartridge/controller";

const controller = new Controller({
  // Session policies for pre-approved transactions
  policies: {
    contracts: {
      "0x075410...": {
        name: "Counter",
        methods: [
          { name: "increase_counter", entrypoint: "increase_counter" },
          { name: "decrease_counter", entrypoint: "decrease_counter" }
        ]
      }
    }
  },
  // Optional: Custom RPC (defaults to Cartridge's endpoint)
  // chains: { ... }
});

// Connect - returns account with .address and .execute()
const account = await controller.connect();
console.log(account.address);

// Disconnect
await controller.disconnect();

// Get username
const username = await controller.username();
```

### 6. Required Packages

Currently installed:
- `@cartridge/controller: ^0.12.1`

Need to install:
- `@cartridge/connector` (for SessionConnector, if using)
- `expo-web-browser` (for auth redirects)
- `expo-linking` (for deep link handling)

### 7. Integration Pattern for React Native

**Pattern 1: WebView Modal (Recommended for demo)**
```typescript
// Open Cartridge auth in WebView or system browser
await WebBrowser.openBrowserAsync('https://x.cartridge.gg/...');
// Handle deep link callback with session token
```

**Pattern 2: Controller + WebView Bridge**
- Create a thin web page that uses Controller
- Load in WebView
- Bridge messages between React Native and web

### 8. Constraints for This Demo

Given scope (reference app, not production):
- Use simplest working integration
- WebBrowser/Linking for auth flow
- Store session in React state (session-only, per requirements)
- Focus on demonstrating the connection flow

## Decision

**Approach:** Use `expo-web-browser` to open Cartridge Controller auth, handle deep link callback to receive session credentials.

**Rationale:**
- Works with Expo managed workflow
- No native code required
- Demonstrates real Cartridge integration
- Matches "session-only wallet connection" requirement

## Sources

- [Cartridge Controller Getting Started](https://docs.cartridge.gg/controller/getting-started)
- [Cartridge Controller Configuration](https://docs.cartridge.gg/controller/configuration)
- [Cartridge React Integration](https://docs.cartridge.gg/controller/examples/react)
- [Cartridge Telegram (Native) Integration](https://docs.cartridge.gg/controller/examples/telegram)
- [Starknet React Native SDK](https://github.com/keep-starknet-strange/starknet-react-native-sdk)
