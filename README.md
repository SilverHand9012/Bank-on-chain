# 🏦 SimpleBank Smart Contract

![Solidity](https://img.shields.io/badge/Language-Solidity-e6e6e6?logo=solidity&logoColor=black)
![Network](https://img.shields.io/badge/Network-Flare_Coston2-FF3666)
![Status](https://img.shields.io/badge/Status-Deployed-brightgreen)

## 📖 Project Description

**SimpleBank** is a beginner-friendly Solidity smart contract designed to demonstrate the core concepts of Decentralized Finance (DeFi). It functions like a digital piggy bank that lives on the blockchain.

Unlike a traditional bank, there is no bank manager or central database. Instead, this contract uses a **ledger (mapping)** to track exactly how much Ether (or Native Token) each specific wallet address has deposited. It demonstrates essential smart contract logic including `payable` functions, state variables, and secure Ether transfers.

---

## ⚙️ What it does

1.  **Accepts Deposits:** Users can send native tokens (ETH/C2FLR) to the contract. The contract records the sender's address and the amount in a secure ledger.
2.  **Stores Funds:** The funds are held safely inside the smart contract's address on the blockchain.
3.  **Tracks Balances:** It maintains an internal balance sheet so it knows exactly how much belongs to whom.
4.  **Process Withdrawals:** Users can withdraw their funds at any time. The contract checks their balance and, if sufficient, transfers the requested amount back to their wallet.

---

## ✨ Features

* **💰 Deposit Functionality:** Accepts payments and updates the user's specific balance.
* **💸 Secure Withdrawal:** Checks for sufficient funds and utilizes the `call` method (current security best practice) to return funds to the user.
* **🛡️ Re-entrancy Protection Pattern:** Updates the user's balance *before* sending funds to prevent malicious attacks.
* **📊 Transparency:** Events (`Deposit` and `Withdrawal`) are emitted to the blockchain logs for easy tracking by frontend applications.
* **🔍 View Functions:** Anyone can check their own balance or the total liquidity held by the bank.

---

## 🚀 Deployed Smart Contract

You can view the deployment transaction and interact with the contract on the Flare Coston2 Explorer:

🔗 * **Contract Address:** `0x51B9272cF09DDFED0342f489573c632c902d4EF6`
* **Block Explorer:** [View on Coston2 Explorer](https://coston2-explorer.flare.network/address/0x51B9272cF09DDFED0342f489573c632c902d4EF6)
<img width="1598" height="1062" alt="image" src="https://github.com/user-attachments/assets/592e2e84-67e7-410b-a0c6-95f935c6bdd2" />
# 🏦 SimpleBank Smart Contract


---

## 💻 The Contract Code

Below is the source code for the `SimpleBank` contract. It is heavily commented to help beginners understand every line.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleBank {

    // --- 1. DATA STORAGE ---
    // Think of a 'mapping' like an Excel spreadsheet or a database.
    // - The 'Key' is the address (the user's wallet/account number).
    // - The 'Value' is uint256 (unsigned integer), which stores their balance.
    // 'public' means anyone can read this ledger to see balances.
    mapping(address => uint256) public balances;

    // --- 2. EVENTS (RECEIPTS) ---
    // Events allow us to print a "receipt" to the blockchain log when something happens.
    // Frontend apps (like a website) listen for these to update the UI.
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    // --- 3. FUNCTIONS ---

    // DEPOSIT
    // The 'payable' keyword is special! It allows this function to accept real Ether.
    // Without 'payable', the contract would reject any money sent to it.
    function deposit() public payable {
        // 'require' is a security check. If the condition is false, the transaction fails
        // and any changes are undone (reverted).
        // Here: We check if the user actually sent some money (> 0).
        require(msg.value > 0, "Deposit amount must be greater than 0");

        // msg.sender = The address of the person calling this function.
        // msg.value  = The amount of Ether (in Wei) they sent.
        
        // Add the money to their specific balance in our ledger
        balances[msg.sender] += msg.value;

        // Print the receipt
        emit Deposit(msg.sender, msg.value);
    }

    // WITHDRAW
    // Allows the user to take money out of the contract.
    function withdraw(uint256 amount) public {
        // Check 1: Do they have enough money in the ledger?
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // CRITICAL STEP: We reduce their balance *before* sending the money.
        // This specific order protects the bank from "Re-entrancy attacks".
        balances[msg.sender] -= amount;

        // SENDING ETHER:
        // This looks complex, but it's the standard, safe way to send Ether in code.
        // It reads: "Call the sender's address and send this 'value' attached."
        (bool success, ) = msg.sender.call{value: amount}("");
        
        // Check 2: Did the transfer actually work?
        require(success, "Transfer failed");

        // Print the receipt
        emit Withdrawal(msg.sender, amount);
    }

    // CHECK MY BALANCE
    // 'view' means this function is free to run! 
    // It only READS data from the blockchain; it doesn't change anything.
    function getMyBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
    
    // CHECK BANK RESERVES
    // See how much total money is locked inside this smart contract.
    function getBankBalance() public view returns (uint256) {
        // 'address(this)' refers to the address of this smart contract itself.
        return address(this).balance;
    }
}
