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

    // This mapping acts like a database or a ledger.
    // It maps an address (the user) to a uint256 (unsigned integer for the balance).
    mapping(address => uint256) public balances;

    // Event logs to help you track what is happening on the blockchain
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    // 1. DEPOSIT FUNCTION
    // The 'payable' keyword allows this function to accept Ether.
    function deposit() public payable {
        // Require that the user sent more than 0 Ether
        require(msg.value > 0, "Deposit amount must be greater than 0");

        // msg.sender is the address of the person calling the function.
        // msg.value is the amount of Ether (in Wei) sent with the transaction.
        balances[msg.sender] += msg.value;

        // Emit an event for the frontend or logs
        emit Deposit(msg.sender, msg.value);
    }

    // 2. WITHDRAW FUNCTION
    // Allows the user to take money out of their specific account.
    function withdraw(uint256 amount) public {
        // Check if the user has enough money to withdraw
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // CRITICAL: Update the balance BEFORE sending money to prevent re-entrancy attacks
        balances[msg.sender] -= amount;

        // Send the Ether back to the user
        // We use 'call' as it is the currently recommended method for sending Ether
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawal(msg.sender, amount);
    }

    // 3. CHECK BALANCE FUNCTION
    // A view function to see how much money the caller has in the bank.
    function getMyBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
    
    // 4. CHECK CONTRACT TOTAL BALANCE
    // A view function to see how much money is in the bank contract in total.
    function getBankBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
