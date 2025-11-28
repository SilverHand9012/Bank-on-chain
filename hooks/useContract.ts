"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, formatEther } from "viem"
import { contractABI, contractAddress } from "@/lib/contract"

export interface ContractData {
  bankBalance: string
  myBalance: string
}

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
}

export interface ContractActions {
  deposit: (amount: string) => Promise<void>
  withdraw: (amount: string) => Promise<void>
}

export const useBankContract = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  // Read: Get Total Bank Balance
  const { data: bankBalance, refetch: refetchBankBalance } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getBankBalance",
  })

  // Read: Get User's Personal Balance
  const { data: myBalance, refetch: refetchMyBalance } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getMyBalance",
    account: address,
    query: {
      enabled: !!address,
    },
  })

  const { writeContractAsync, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isConfirmed) {
      refetchBankBalance()
      refetchMyBalance()
    }
  }, [isConfirmed, refetchBankBalance, refetchMyBalance])

  const deposit = async (amount: string) => {
    if (!amount) return

    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "deposit",
        value: parseEther(amount),
      })
    } catch (err) {
      console.error("Error depositing:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const withdraw = async (amount: string) => {
    if (!amount) return

    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "withdraw",
        args: [parseEther(amount)],
      })
    } catch (err) {
      console.error("Error withdrawing:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const data: ContractData = {
    bankBalance: bankBalance ? formatEther(bankBalance as bigint) : "0",
    myBalance: myBalance ? formatEther(myBalance as bigint) : "0",
  }

  const actions: ContractActions = {
    deposit,
    withdraw,
  }

  const state: ContractState = {
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }

  return {
    data,
    actions,
    state,
  }
}