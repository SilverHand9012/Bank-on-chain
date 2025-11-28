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