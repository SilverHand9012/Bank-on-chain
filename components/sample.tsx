"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useBankContract } from "@/hooks/useContract"

const SampleIntegration = () => {
  const { isConnected } = useAccount()
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  
  const { data, actions, state } = useBankContract()

  const handleDeposit = async () => {
    if (!depositAmount) return
    try {
      await actions.deposit(depositAmount)
      setDepositAmount("")
    } catch (err) {
      console.error("Deposit Error:", err)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount) return
    try {
      await actions.withdraw(withdrawAmount)
      setWithdrawAmount("")
    } catch (err) {
      console.error("Withdraw Error:", err)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Simple Bank</h2>
          <p className="text-muted-foreground">Please connect your wallet to access banking services.</p>
        </div>
      </div>
    )
  }

  const canDeposit = !!depositAmount && Number(depositAmount) > 0
  const canWithdraw = !!withdrawAmount && Number(withdrawAmount) > 0 && Number(withdrawAmount) <= Number(data.myBalance)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Simple Bank</h1>
          <p className="text-muted-foreground text-sm mt-1">Decentralized Savings & Withdrawals</p>
        </div>

        {/* Balance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Total Bank Liquidity</p>
            <p className="text-3xl font-bold text-primary">{data.bankBalance} <span className="text-sm font-normal text-foreground">FLR</span></p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Your Personal Balance</p>
            <p className="text-3xl font-bold text-green-600">{data.myBalance} <span className="text-sm font-normal text-foreground">FLR</span></p>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Deposit Section */}
          <div className="space-y-4 p-5 border border-border rounded-xl bg-card/50">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"/> Deposit Funds
            </h3>
            <input
              type="number"
              placeholder="0.00"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <button
              onClick={handleDeposit}
              disabled={state.isLoading || !canDeposit}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {state.isLoading && state.isPending ? "Processing..." : "Deposit FLR"}
            </button>
          </div>

          {/* Withdraw Section */}
          <div className="space-y-4 p-5 border border-border rounded-xl bg-card/50">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"/> Withdraw Funds
            </h3>
            <input
              type="number"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <button
              onClick={handleWithdraw}
              disabled={state.isLoading || !canWithdraw}
              className="w-full px-4 py-2 bg-secondary text-secondary-foreground border border-input rounded-lg font-medium hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {state.isLoading && state.isPending ? "Processing..." : "Withdraw FLR"}
            </button>
          </div>
        </div>

        {/* Transaction Status */}
        {state.hash && (
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Transaction Details</p>
            <p className="text-xs font-mono text-foreground break-all mb-2">{state.hash}</p>
            <div className="flex items-center gap-2">
              {state.isConfirming && <span className="text-sm text-yellow-600 animate-pulse">Waiting for confirmation...</span>}
              {state.isConfirmed && <span className="text-sm text-green-600 font-medium">Transaction confirmed successfully!</span>}
            </div>
          </div>
        )}

        {state.error && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">Error: {state.error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SampleIntegration