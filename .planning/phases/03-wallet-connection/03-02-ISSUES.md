# UAT Issues: Phase 3 Plan 2

**Tested:** 2026-01-12
**Source:** .planning/phases/03-wallet-connection/03-02-SUMMARY.md
**Tester:** User via /gsd:verify-work

## Open Issues

[None]

## Resolved Issues

### UAT-001: Cartridge session callback shows blank page instead of redirecting to app

**Discovered:** 2026-01-12
**Resolved:** 2026-01-12
**Phase/Plan:** 03-02
**Severity:** Blocker
**Feature:** Wallet connection / session authorization
**Resolution:** Reverted to commit `848817b` (pre-Phase 4 state). Phase 4 implementation introduced a regression that broke wallet callbacks. Exact breaking change not isolated, but revert confirmed working.
**Fix Commit:** e514f66

**Original Description:** After successfully logging in on Cartridge's session page (x.cartridge.gg/session), the page shows blank instead of redirecting back to the Expo app. The only way to return to the app is clicking Cancel, which results in "Connection cancelled" or "No address returned" error.

---

*Phase: 03-wallet-connection*
*Plan: 02*
*Tested: 2026-01-12*
