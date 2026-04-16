# OUCHUI Frontend Update

OUCHUI is a Next.js + React + TypeScript dApp for interacting with ERC-4626 vaults on Sepolia. It uses wagmi + viem for contract reads and writes, RainbowKit for wallet connection, and Tailwind CSS for styling. The current scope is an investor-facing testnet flow: connect a wallet, read vault data, approve MockUSDC, deposit into a vault, and manage share redemption and withdrawal UX. [web:20][web:183][cite:3]

The frontend is now substantially more reliable for Sepolia testing than the earlier prototype. The transaction lifecycle waits for on-chain receipts before refetching state, the amount-entry UX is hardened, impossible actions are disabled earlier, and wrong-network handling is explicit and recoverable. These changes make the app safer and clearer for testnet use, although it should not yet be described as production-ready. [web:76][web:121][web:143]

## Stack

- Next.js
- React
- TypeScript
- wagmi
- viem
- RainbowKit
- Tailwind CSS [web:20][web:170]

## Contract Context

The frontend is connected to three Sepolia contracts:

- MockUSDC — mock 6-decimal ERC-20 underlying asset used for testing
- VaultT — ERC-4626 vault
- VaultD — ERC-4626 vault [cite:3]

## What Changed

### Receipt-based writes

The transaction flow was upgraded so UI refreshes happen only after on-chain confirmation, not immediately after the wallet signs or the transaction hash is returned. This is the correct pattern for wagmi-based write flows because post-transaction reads should depend on receipt confirmation, not only submission state. [web:76][web:78]

`useVaultActions.ts` now exposes a clearer transaction lifecycle, with explicit states for idle, signing, confirming, confirmed, and error. This lets the UI distinguish wallet interaction from chain confirmation and avoids misleading success feedback before the transaction is actually mined. [web:76]

### Better read model

`useVaultData.ts` was expanded so user-facing reads and vault-facing reads refresh together. The hook now includes allowance reading for the deposit flow and uses named return fields instead of leaking fragile multicall index assumptions into UI components. Mapping multicall results into named fields is a cleaner integration pattern and makes later maintenance safer. [web:78][web:167]

### Correct ERC-4626 withdrawal preview

The withdraw flow now uses `previewWithdraw(assets)` for the estimated “shares to burn” view, which is the standards-aligned ERC-4626 preview for asset-based withdrawals at the current block. This is more correct than using a generic conversion helper for the same UI purpose. [web:75][web:94]

### Clearer transaction feedback

Transaction feedback now distinguishes:
- waiting for wallet signature,
- submitted and awaiting on-chain confirmation,
- confirmed on-chain. [web:76]

That wording is deliberately more precise because wallet approval and chain confirmation are not the same event. [web:76]

### Safer network behavior

Sepolia is now the primary chain in the wagmi configuration. Wrong-network states are no longer passive: the UI presents a “Switch to Sepolia” action and falls back to a clear manual-switch message if the automatic request fails. Automatic chain switching is helpful but not guaranteed across all wallets, so the manual fallback remains important. [web:121][web:143]

## UX Improvements

### Amount input hardening

A reusable `AmountInput` component was introduced for deposit and withdrawal actions. It uses a controlled text input with `inputMode="decimal"` rather than relying on browser number inputs, which improves numeric entry behavior for financial amounts and avoids browser-specific quirks such as spinners and scientific notation entry. [web:132][web:129]

The input sanitization preserves natural intermediate typing states such as `""`, `"."`, `"0."`, and trailing decimal zeros while still enforcing a single decimal point and a 6-decimal precision limit for the MockUSDC-based flow. This produces a more natural typing experience without relaxing amount safety. [web:142][cite:3]

### Max buttons and validation

Deposit and withdraw/redeem flows now support Max-button behavior and stronger inline validation. The UI prevents obviously invalid actions before submission, such as trying to deposit more USDC than the wallet holds or attempting to withdraw/redeem beyond the available position. Good dApp UX should block avoidable failures before they reach the chain whenever the app already has enough local information to know the action will fail. [web:116][web:127]

### Better empty and pending states

The withdraw panel now handles a zero-share state explicitly by telling the user they have no shares yet and should deposit first. Pending transaction states also use clearer action labels such as “Approving…”, “Depositing…”, “Redeeming…”, and “Withdrawing…”, making the interface more readable during transaction progress. [web:127]

Confirmed states no longer linger indefinitely. Success feedback is auto-cleared after a short delay so users can continue to the next action without stale confirmation banners dominating the panel. [web:127]

## RPC Reliability

The original public Sepolia RPC path was replaced with an Alchemy Sepolia endpoint via environment configuration. This is a practical stability improvement because public Sepolia endpoints are often rate-limited or unreliable, while a dedicated RPC provider gives more predictable frontend behavior during testing. [web:156][web:158]

## Verified Sepolia Flow

The approve and deposit path has been verified end-to-end on Sepolia:

1. MockUSDC was minted to the test wallet
2. The wallet connected through the frontend on Sepolia
3. Approval was granted for the target vault
4. A deposit was submitted and confirmed on-chain
5. Post-deposit balances were verified against on-chain contract reads [cite:3]

The verified post-deposit state showed:
- vault share balance updated as expected,
- vault `totalAssets()` reflected the deposit,
- wallet USDC balance decreased by the deposited amount. [cite:3]

## Current Status

This frontend should be considered a solid **Sepolia-ready investor flow iteration**, not a production-ready release. It now has a much more trustworthy transaction lifecycle and significantly better interaction safety, but important work remains before the product can be described as complete. [cite:3]

## Remaining Work

The following items remain out of scope or incomplete for now:

- full KYC enforcement at contract level
- NAV/oracle-backed valuation
- tokenized T-Bills integration
- lending/strategy integration
- broader automated testing coverage
- final production deployment hardening
- confirmation that the full withdraw/redeem path has been executed and verified end-to-end on Sepolia, if that has not yet been done [cite:3]

## Quick Start

```bash
pnpm install
pnpm dev
```

Make sure `.env.local` includes:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_SEPOLIA_RPC_URL`

Then open the app, connect a wallet, switch to Sepolia if needed, and test the deposit / withdraw flow with a small amount first. [web:20][web:183][web:156]

## Notes

Where ERC-4626 previews are used, the frontend now prefers the semantically correct preview functions for user-facing estimates. This improves clarity, but the UI should still be treated as a convenience layer over the contracts rather than a substitute for protocol-level guarantees. [web:75][web:94]