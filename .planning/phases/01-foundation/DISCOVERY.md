# Phase 1: Foundation - Discovery

## Research Summary

**Discovery Level:** Level 1 (Quick Verification)
**Date:** 2026-01-11

## Findings

### Expo + TypeScript Setup
- Use `npx create-expo-app@latest` with TypeScript template
- Expo SDK latest stable (52.x as of Jan 2026)
- Requires custom dev client (not Expo Go) for native modules

### starknet.js Integration
- Latest stable: v9.3.0
- Requires crypto polyfills for React Native
- No official React Native guide - community patterns apply

### Cartridge Controller
- Latest: v0.12.1
- Designed for web React primarily
- Native app support via SessionConnector (separate flow)
- Required packages: `@cartridge/controller`, `starknet`
- Compatibility note: works with starknet ^8.1.2 per docs, but v9.x should work

### Crypto Polyfills Required
Based on Web3/blockchain React Native patterns:

1. **react-native-get-random-values** - Polyfills `crypto.getRandomValues()`
   - Must be imported FIRST in entry point
   - Required for UUID generation, crypto operations

2. **Metro config** - Resolve crypto to polyfill:
   ```javascript
   config.resolver.extraNodeModules.crypto = require.resolve(
     "react-native-get-random-values"
   );
   ```

3. **Alternative (faster):** `react-native-quick-crypto` for native C++ crypto
   - Better performance but more complex setup
   - Recommended for production, but polyfill is fine for demo

4. **expo-crypto** - Can supplement if needed

### Key Patterns

**Entry point order matters:**
```javascript
import 'react-native-get-random-values'; // MUST be first
// Then other imports
```

**Metro config for Expo:**
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.extraNodeModules = {
  crypto: require.resolve('react-native-get-random-values'),
};
module.exports = config;
```

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Use `react-native-get-random-values` | Simpler than quick-crypto for demo app, well-tested |
| Pin starknet.js to ^9.x | Latest stable, should be compatible |
| Use @cartridge/controller ^0.12.x | Latest, standard web integration first |
| Custom dev client required | Expo Go doesn't support native polyfills properly |

## Risks Identified

1. **Cartridge Controller mobile support** - Primarily web-focused. May need SessionConnector for native flow. Test web flow first.
2. **Polyfill completeness** - starknet.js may need additional polyfills beyond getRandomValues. Will verify during implementation.

## Implementation Approach

**Plan 01-01: Project Scaffold**
- Create Expo project with TypeScript
- Install core dependencies (starknet.js, @cartridge/controller)
- Basic App.tsx shell

**Plan 01-02: Polyfill Configuration**
- Install and configure react-native-get-random-values
- Create/update metro.config.js
- Update entry point with polyfill import
- Create dev client build
- Verify starknet.js imports without crashing

## Sources

- [Cartridge Controller Getting Started](https://docs.cartridge.gg/controller/getting-started)
- [Cartridge React Integration](https://docs.cartridge.gg/controller/examples/react)
- [react-native-get-random-values](https://www.npmjs.com/package/react-native-get-random-values)
- [Solana Mobile Polyfill Guide](https://docs.solanamobile.com/react-native/polyfill-guides/spl-token)
- [Expo Crypto](https://docs.expo.dev/versions/latest/sdk/crypto/)
