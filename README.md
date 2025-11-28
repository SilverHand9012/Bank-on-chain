# SimpleBank on Flare

A transparent, decentralized banking interface deployed on the Flare Coston2 testnet. This project enables users to securely deposit native tokens (C2FLR) into a smart contract and withdraw their personal balance at any time, serving as a foundational example of DeFi value transfer.

## Contract Address

* **Network:** Flare Coston2 Testnet
* **Contract Address:** `0x51B9272cF09DDFED0342f489573c632c902d4EF6`
* **Block Explorer:** [View on Coston2 Explorer](https://coston2-explorer.flare.network/address/0x51B9272cF09DDFED0342f489573c632c902d4EF6)

## Description

SimpleBank is a non-custodial financial application that operates without a central authority. Instead of relying on a traditional bank to update a private ledger, SimpleBank uses a Solidity smart contract on the Flare blockchain to manage funds.

Users connect their Web3 wallets to interact directly with the contract. When funds are deposited, they are held in the contract's public address, but the internal mapping logic ensures that only the original depositor can initiate a withdrawal for their specific amount.

## Features

* **Secure Deposits:** Users can deposit any amount of native FLR/C2FLR tokens. The contract automatically updates the user's on-chain balance state.
* **Personal Balance Tracking:** A `getMyBalance` function allows users to query their specific withdrawable amount, distinct from the total contract liquidity.
* **Partial & Full Withdrawals:** Users are not locked into fixed terms; they can withdraw specific amounts or their entire balance whenever they choose.
* **Bank Liquidity Monitoring:** The `getBankBalance` feature provides transparency by displaying the total value locked (TVL) within the smart contract.
* **Safety Checks:** The contract enforces strict checks to ensure users cannot withdraw more than they have deposited, preventing liquidity draining attacks.

## How It Solves

### The Problem
Traditional banking relies on **trust**. Users must trust institutions to hold their money, process transactions correctly, and remain solvent. Additionally, centralized ledgers are opaque; users cannot verify the bank's actual liquidity or the state of their funds without asking the bank itself.

### The Solution
SimpleBank solves these issues through **cryptographic guarantees**:

1.  **Trustlessness:** The logic is immutable and deployed on the blockchain. No admin can arbitrarily confiscate funds or alter balances.
2.  **Transparency:** Anyone can audit the contract code and view the total liquidity on the block explorer. The "bank's" solvency is mathematically verifiable in real-time.
3.  **Self-Custody:** While the funds are in the contract, the logic dictates that only the private key that signed the deposit transaction can sign the withdrawal transaction. You remain in control of your assets.

