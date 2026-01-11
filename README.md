# Starknet Counter App

A React Native app demonstrating Cartridge wallet integration with session-based transaction execution on Starknet Sepolia.

## Prerequisites

- **Node.js 20+** (required for Metro bundler)
- **Xcode 15+** (for iOS development)
- **CocoaPods** (`sudo gem install cocoapods`)

Check your Node version:
```bash
node --version  # Should be v20.x or higher
```

If using nvm:
```bash
nvm install 20
nvm use 20
```

## Installation

1. **Clone and install dependencies:**
   ```bash
   cd counter_app
   npm install
   ```

2. **Generate native projects and configure iOS:**
   ```bash
   npm run prebuild
   ```
   This runs `expo prebuild` and automatically adds the Controller native module to the Podfile.

3. **Install iOS pods:**
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

**iOS Simulator:**
```bash
npm run ios
```

Or start the bundler separately:
```bash
npm start
# Then press 'i' to open iOS simulator
```

## Usage

1. **Connect Wallet** - Tap "Connect Wallet" to authenticate with Cartridge
2. **Authorize Session** - Approve the session in the Cartridge browser popup
3. **Interact** - Use +/- buttons to increment/decrement the counter
4. **Transactions** - Each button press executes a transaction on Starknet Sepolia

## Project Structure

```
counter_app/
├── App.tsx                      # Main app component with UI
├── modules/controller/          # Cartridge Controller native module
│   ├── Controller.xcframework/  # Prebuilt Rust library
│   ├── src/index.tsx           # SessionAccount exports
│   └── Controller.podspec      # iOS pod spec
├── src/
│   ├── config/
│   │   ├── constants.ts        # Contract address, RPC URL
│   │   ├── starknet.ts         # Read-only contract functions
│   │   └── wallet.ts           # Wallet connection helpers
│   ├── hooks/
│   │   ├── useSessionManager.ts # Session lifecycle management
│   │   └── useWallet.ts        # Basic wallet hook
│   └── types/
│       └── counter.ts          # Contract ABI
├── scripts/
│   └── postprebuild.js         # Injects Controller pod after prebuild
└── react-native.config.js      # Native module linking config
```

## How It Works

1. **Session Creation**: The app generates a session keypair and requests authorization from Cartridge
2. **Session Storage**: Approved sessions are stored locally for persistence
3. **Transaction Execution**: Uses `SessionAccount.executeFromOutside()` (SNIP-9) for gasless transactions
4. **Counter Contract**: Interacts with a deployed counter contract on Starknet Sepolia

## Configuration

The contract and RPC settings are in `src/config/constants.ts`:

```typescript
export const RPC_URL = 'https://api.cartridge.gg/x/starknet/sepolia';
export const CONTRACT_ADDRESS = '0x075410d36a0690670137c3d15c01fcfa2ce094a4d0791dc769ef18c1c423a7f8';
```

## Troubleshooting

**"Controller could not be found" error:**
```bash
npm run prebuild:clean
cd ios && pod install && cd ..
npm run ios
```

**Metro bundler crashes with `toReversed` error:**
Ensure you're using Node.js 20+:
```bash
nvm use 20
npm start
```

**Disk space issues during build:**
Clear Xcode derived data:
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

## Tech Stack

- **Expo SDK ** - React Native framework
- **React Native ** - Mobile UI
- **starknet.js** - Starknet interactions
- **uniffi-bindgen-react-native** - Rust FFI bindings
- **Cartridge Controller** - Session-based wallet integration
