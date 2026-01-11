# PRD: Starknet Counter React Native App

## Introduction

A React Native mobile application (iOS) built with Expo that demonstrates Starknet blockchain integration. The app connects to an existing deployed Cairo smart contract on Starknet to read and modify a counter value. Users can view the current counter value without authentication, but must connect their Cartridge wallet to perform increment/decrement operations. This serves as a learning/demo project showcasing Starknet + React Native integration patterns.

## Goals

- Demonstrate Starknet blockchain integration in a React Native/Expo environment
- Provide a simple, intuitive interface for interacting with an on-chain counter contract
- Implement Cartridge wallet connection flow for transaction signing
- Show proper transaction lifecycle feedback (pending → confirmed)
- Create a reference implementation for future Starknet mobile dApps

## User Stories

### US-001: Project Setup with Expo
**Description:** As a developer, I need the Expo project scaffolded with necessary dependencies so I can build the Starknet-integrated app.

**Acceptance Criteria:**
- [ ] Initialize Expo project with TypeScript template
- [ ] Install starknet.js library for Starknet interactions
- [ ] Install Cartridge wallet SDK/connector
- [ ] Configure app.json for iOS build
- [ ] Project runs on iOS simulator without errors
- [ ] npm run typecheck passes (or equivalent Expo type check)

---

### US-002: Display Counter Value (Read-Only)
**Description:** As a user, I want to see the current counter value when I open the app so I can view the on-chain state without connecting a wallet.

**Acceptance Criteria:**
- [ ] App fetches counter value from deployed Starknet contract on launch
- [ ] Counter value displays prominently in the center of the screen
- [ ] Loading state shown while fetching (spinner or skeleton)
- [ ] Error state shown if contract read fails (with retry option)
- [ ] No wallet connection required to view counter
- [ ] Verify in iOS simulator

---

### US-003: Manual Refresh Counter
**Description:** As a user, I want to manually refresh the counter value so I can see the latest on-chain state.

**Acceptance Criteria:**
- [ ] Refresh button visible near the counter display
- [ ] Tapping refresh fetches latest value from contract
- [ ] Button shows loading state while fetching
- [ ] Counter updates after successful fetch
- [ ] Error toast if refresh fails
- [ ] Verify in iOS simulator

---

### US-004: Cartridge Wallet Connection
**Description:** As a user, I want to connect my Cartridge wallet so I can sign transactions to modify the counter.

**Acceptance Criteria:**
- [ ] "Connect Wallet" button visible when wallet not connected
- [ ] Tapping button initiates Cartridge wallet connection flow
- [ ] Successful connection shows connected wallet address (truncated)
- [ ] Connection state persists during app session
- [ ] Disconnect option available after connecting
- [ ] Verify in iOS simulator with Cartridge wallet

---

### US-005: Increment Counter
**Description:** As a user, I want to increment the counter so I can increase the on-chain value.

**Acceptance Criteria:**
- [ ] "Increment (+)" button visible on main screen
- [ ] If wallet not connected, tapping prompts wallet connection first
- [ ] If wallet connected, tapping initiates `increase_counter(1)` transaction
- [ ] Transaction sent to Starknet via Cartridge wallet signing
- [ ] Counter value updates after transaction confirms
- [ ] Verify transaction executes correctly on Starknet Sepolia

---

### US-006: Decrement Counter
**Description:** As a user, I want to decrement the counter so I can decrease the on-chain value.

**Acceptance Criteria:**
- [ ] "Decrement (-)" button visible on main screen
- [ ] If wallet not connected, tapping prompts wallet connection first
- [ ] If wallet connected, tapping initiates `decrease_counter(1)` transaction
- [ ] Transaction sent to Starknet via Cartridge wallet signing
- [ ] Counter value updates after transaction confirms
- [ ] Verify transaction executes correctly on Starknet Sepolia

---

### US-007: Transaction Status Feedback
**Description:** As a user, I want to see detailed transaction status so I know whether my action succeeded.

**Acceptance Criteria:**
- [ ] Modal or overlay appears when transaction is initiated
- [ ] Shows "Pending" state with spinner while awaiting confirmation
- [ ] Shows "Confirmed" state with checkmark on success
- [ ] Shows "Failed" state with error message on failure
- [ ] Displays transaction hash (truncated, tappable)
- [ ] Tapping transaction hash opens Voyager explorer (sepolia.voyager.online) in browser
- [ ] Dismiss button to close status modal
- [ ] Verify in iOS simulator

---

### US-008: Error Handling
**Description:** As a user, I want clear error messages so I understand what went wrong and can take action.

**Acceptance Criteria:**
- [ ] Network errors show "Connection failed" with retry option
- [ ] Wallet rejection shows "Transaction cancelled by user"
- [ ] Contract errors show relevant error message from chain
- [ ] All errors are dismissible
- [ ] App remains usable after errors (doesn't crash or freeze)
- [ ] Verify error states in iOS simulator

## Functional Requirements

- **FR-1:** Initialize Expo project targeting iOS with TypeScript support
- **FR-2:** Configure starknet.js provider to connect to Starknet Sepolia testnet
- **FR-3:** Read counter value from contract using `get_counter()` view function
- **FR-4:** Display counter value centered on screen with large, readable font
- **FR-5:** Implement manual refresh button that re-fetches counter value
- **FR-6:** Integrate Cartridge Controller SDK for wallet connection
- **FR-7:** Show truncated wallet address (e.g., `0x1234...abcd`) when connected
- **FR-8:** Prompt wallet connection when user taps increment/decrement without connected wallet
- **FR-9:** Execute `increase_counter(1)` function on contract via signed transaction
- **FR-10:** Execute `decrease_counter(1)` function on contract via signed transaction
- **FR-11:** Display transaction status modal with states: pending, confirmed, failed
- **FR-12:** Show transaction hash with link to Voyager explorer (sepolia.voyager.online)
- **FR-13:** Auto-refresh counter value after transaction confirms
- **FR-14:** Handle and display errors gracefully without crashing

## Non-Goals

- Android support (iOS only for this version)
- Expo web support
- Deploying or modifying the Cairo smart contract (using existing deployed contract)
- Persistent wallet connection across app restarts (session-only)
- Multiple wallet provider support (Cartridge only)
- Transaction history or activity log
- Push notifications for transaction status
- Internationalization/localization
- Dark mode or theming
- Analytics or telemetry

## Design Considerations

- **Layout:** Single-screen app with counter prominently displayed
- **Counter Display:** Large numeric font, centered, easy to read
- **Buttons:** 
  - Increment (+) and Decrement (-) buttons flanking the counter
  - Refresh button near counter (icon-based)
  - Connect Wallet button in header or below counter
- **Colors:**
  - Primary action buttons: Starknet brand colors or neutral
  - Increment: Consider green accent
  - Decrement: Consider red accent
  - Transaction pending: Yellow/orange
  - Transaction confirmed: Green
  - Transaction failed: Red
- **Transaction Modal:** Overlay modal with status icon, message, and transaction hash

## Technical Considerations

- **Expo SDK:** Use latest stable Expo SDK compatible with starknet.js
- **starknet.js:** Use for provider setup, contract interaction, and transaction handling
- **Cartridge Controller:** Use `@cartridge/controller` SDK for React Native (confirmed compatible)
- **Network:** Starknet Sepolia testnet
- **Polyfills:** React Native may need crypto polyfills for starknet.js (e.g., `react-native-get-random-values`)
- **Explorer:** Voyager (https://sepolia.voyager.online/)

### Contract Details

- **Contract Address:** `0x075410d36a0690670137c3d15c01fcfa2ce094a4d0791dc769ef18c1c423a7f8`
- **Network:** Starknet Sepolia

### Contract ABI

```json
[
  {
    "type": "impl",
    "name": "TestSession",
    "interface_name": "counter_starknetjs::ITestSession"
  },
  {
    "type": "interface",
    "name": "counter_starknetjs::ITestSession",
    "items": [
      {
        "type": "function",
        "name": "increase_counter",
        "inputs": [
          {
            "name": "value",
            "type": "core::integer::u128"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "decrease_counter",
        "inputs": [
          {
            "name": "value",
            "type": "core::integer::u128"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_counter",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u128"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "event",
    "name": "counter_starknetjs::test_session::Event",
    "kind": "enum",
    "variants": []
  }
]
```

### Function Usage

| Action | Function Call | Notes |
|--------|---------------|-------|
| Read counter | `get_counter()` → `u128` | View function, no wallet needed |
| Increment | `increase_counter(1)` | Pass fixed value of `1` |
| Decrement | `decrease_counter(1)` | Pass fixed value of `1` |

## Success Metrics

- App successfully reads counter value from Starknet contract on launch
- Users can connect Cartridge wallet within 3 taps
- Increment/decrement transactions execute successfully on testnet
- Transaction confirmation displays within expected Starknet block time
- No crashes during normal operation flow
- Serves as clear reference for Starknet + React Native integration

## Open Questions

All initial questions have been resolved:

- ✅ Contract address: `0x075410d36a0690670137c3d15c01fcfa2ce094a4d0791dc769ef18c1c423a7f8` on Sepolia
- ✅ ABI: Provided and documented above
- ✅ Cartridge SDK: Confirmed compatible with React Native
- ✅ Deep linking: Not required
- ✅ Counter bounds: Not a focus area for this project
- ✅ Explorer: Voyager (sepolia.voyager.online)
- ✅ Increment/decrement value: Fixed at 1 (simple +/- buttons)