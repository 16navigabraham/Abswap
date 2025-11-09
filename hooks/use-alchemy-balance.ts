"use client"

import { useState, useEffect, useCallback } from "react"
import { type Address } from "viem"
import { useAccount } from "wagmi"
import { alchemyService, type TokenBalance, type NativeBalance } from "@/lib/alchemy-service"

export interface UseBalanceReturn {
  // ETH Balance
  ethBalance: string
  ethBalanceFormatted: string
  
  // Token Balances
  tokenBalances: TokenBalance[]
  
  // Loading states
  isLoadingETH: boolean
  isLoadingTokens: boolean
  
  // Errors
  error: string | null
  
  // Actions
  refreshETHBalance: () => Promise<void>
  refreshTokenBalances: (tokenAddresses?: Address[]) => Promise<void>
  getTokenBalance: (tokenAddress: Address) => Promise<string>
  refreshAll: () => Promise<void>
}

/**
 * Hook for fetching wallet balances using Alchemy
 */
export function useAlchemyBalance(): UseBalanceReturn {
  const { address, isConnected } = useAccount()
  
  const [ethBalance, setEthBalance] = useState<string>("0")
  const [ethBalanceFormatted, setEthBalanceFormatted] = useState<string>("0")
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [isLoadingETH, setIsLoadingETH] = useState(false)
  const [isLoadingTokens, setIsLoadingTokens] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch ETH balance
   */
  const refreshETHBalance = useCallback(async () => {
    if (!address || !isConnected) {
      setEthBalance("0")
      setEthBalanceFormatted("0")
      return
    }

    setIsLoadingETH(true)
    setError(null)

    try {
      const balance = await alchemyService.getETHBalance(address)
      setEthBalance(balance.balance)
      setEthBalanceFormatted(balance.balanceFormatted)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch ETH balance"
      setError(errorMessage)
      console.error("❌ ETH balance error:", err)
    } finally {
      setIsLoadingETH(false)
    }
  }, [address, isConnected])

  /**
   * Fetch token balances
   */
  const refreshTokenBalances = useCallback(
    async (tokenAddresses?: Address[]) => {
      if (!address || !isConnected) {
        setTokenBalances([])
        return
      }

      setIsLoadingTokens(true)
      setError(null)

      try {
        const balances = await alchemyService.getAllTokenBalances(address, tokenAddresses)
        
        // Fetch metadata for each token
        const balancesWithMetadata = await Promise.all(
          balances.map(async (balance) => {
            try {
              const metadata = await alchemyService.getTokenMetadata(balance.contractAddress)
              return {
                ...balance,
                ...metadata,
              }
            } catch (err) {
              console.error("Error fetching token metadata:", err)
              return balance
            }
          })
        )

        setTokenBalances(balancesWithMetadata)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch token balances"
        setError(errorMessage)
        console.error("❌ Token balances error:", err)
      } finally {
        setIsLoadingTokens(false)
      }
    },
    [address, isConnected]
  )

  /**
   * Get balance for a specific token
   */
  const getTokenBalance = useCallback(
    async (tokenAddress: Address): Promise<string> => {
      if (!address || !isConnected) return "0"

      try {
        return await alchemyService.getTokenBalance(address, tokenAddress)
      } catch (err) {
        console.error("❌ Token balance error:", err)
        return "0"
      }
    },
    [address, isConnected]
  )

  /**
   * Refresh all balances
   */
  const refreshAll = useCallback(async () => {
    await Promise.all([refreshETHBalance(), refreshTokenBalances()])
  }, [refreshETHBalance, refreshTokenBalances])

  // Auto-fetch balances when address changes
  useEffect(() => {
    if (address && isConnected) {
      refreshETHBalance()
      // Don't auto-fetch all tokens (can be expensive), only fetch on demand
    }
  }, [address, isConnected, refreshETHBalance])

  return {
    ethBalance,
    ethBalanceFormatted,
    tokenBalances,
    isLoadingETH,
    isLoadingTokens,
    error,
    refreshETHBalance,
    refreshTokenBalances,
    getTokenBalance,
    refreshAll,
  }
}

/**
 * Hook for fetching a specific token balance
 */
export function useTokenBalance(tokenAddress: Address | null) {
  const { address, isConnected } = useAccount()
  const [balance, setBalance] = useState<string>("0")
  const [balanceFormatted, setBalanceFormatted] = useState<string>("0")
  const [isLoading, setIsLoading] = useState(false)
  const [metadata, setMetadata] = useState<{
    name?: string
    symbol?: string
    decimals?: number
  }>({})

  const fetchBalance = useCallback(async () => {
    if (!address || !isConnected || !tokenAddress) {
      setBalance("0")
      setBalanceFormatted("0")
      return
    }

    setIsLoading(true)

    try {
      const result = await alchemyService.getTokenBalanceWithMetadata(address, tokenAddress)
      setBalance(result.balance)
      setBalanceFormatted(result.balanceFormatted)
      setMetadata({
        name: result.name,
        symbol: result.symbol,
        decimals: result.decimals,
      })
    } catch (err) {
      console.error("Error fetching token balance:", err)
      setBalance("0")
      setBalanceFormatted("0")
    } finally {
      setIsLoading(false)
    }
  }, [address, isConnected, tokenAddress])

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    balance,
    balanceFormatted,
    metadata,
    isLoading,
    refetch: fetchBalance,
  }
}
