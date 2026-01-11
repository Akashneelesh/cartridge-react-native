# UAT Issues: Phase 3 Plan 2

**Tested:** 2026-01-12
**Source:** .planning/phases/03-wallet-connection/03-02-SUMMARY.md
**Tester:** User via /gsd:verify-work

## Open Issues

### UAT-001: Cartridge session callback shows blank page instead of redirecting to app

**Discovered:** 2026-01-12
**Phase/Plan:** 03-02
**Severity:** Blocker
**Feature:** Wallet connection / session authorization
**Description:** After successfully logging in on Cartridge's session page (x.cartridge.gg/session), the page shows blank instead of redirecting back to the Expo app. The only way to return to the app is clicking Cancel, which results in "Connection cancelled" or "No address returned" error.
**Expected:** After login on Cartridge, should automatically redirect to `exp://192.168.1.50:8081/--/session` with session data
**Actual:** Cartridge page goes blank after login, no redirect occurs
**Repro:**
1. Launch app
2. Press "Connect Wallet" button
3. Opens Cartridge session URL: `https://x.cartridge.gg/session?public_key=...&redirect_uri=exp%3A%2F%2F192.168.1.50%3A8081%2F--%2Fsession&policies=...`
4. Log in successfully on Cartridge
5. Page goes blank instead of redirecting
6. Only way back is clicking Cancel

**Console logs:**
```
[2026-01-11T20:27:55.353Z] INFO: Using default public node url, please provide nodeUrl in provider options!
LOG  Starting session authorization...
LOG  Generated public key: 0x607e95eb1303ac5bd140344a01f39ed679b7edc74c3706ea8544ac251ed7dc4
LOG  Opening session URL: https://x.cartridge.gg/session?public_key=0x607e95eb1303ac5bd140344a01f39ed679b7edc74c3706ea8544ac251ed7dc4&redirect_uri=exp%3A%2F%2F192.168.1.50%3A8081%2F--%2Fsession&policies=%5B%7B%22method%22%3A%22increase_counter%22%7D%2C%7B%22method%22%3A%22decrease_counter%22%7D%5D&rpc_url=https%3A%2F%2Fapi.cartridge.gg%2Fx%2Fstarknet%2Fsepolia
LOG  Redirect URI: exp://192.168.1.50:8081/--/session
```

**Notes:**
- User reports this was working previously
- The redirect_uri uses Expo's deep link format (`exp://...`)
- Issue may be on Cartridge's side not handling the exp:// protocol redirect
- Or Expo's deep link handling has changed

## Resolved Issues

[None yet]

---

*Phase: 03-wallet-connection*
*Plan: 02*
*Tested: 2026-01-12*
