"use client"

import { useState, useCallback } from "react"
import { type Address } from "viem"
import { useAccount } from "wagmi"
import { uniswapSwapService, type SwapParams, type SwapQuote } from "@/lib/swap-service"
import { UNISWAP_CONTRACTS } from "@/lib/uniswap-contracts"

export interface UseSwapReturn {
  // State
  isLoading: boolean
  error: string | null
  quote: SwapQuote | null
  txHash: string | null
  txUrl: string | null

  // Actions
  getQuote: (params: Omit<SwapParams, "userAddress">) => Promise<void>
  executeSwap: (params: Omit<SwapParams, "userAddress">) => Promise<void>
  approveToken: (tokenAddress: Address, amount: string) => Promise<void>
  reset: () => void
}

/**
 * Hook for handling Uniswap swaps
 */
export function useSwap(): UseSwapReturn {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quote, setQuote] = useState<SwapQuote | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txUrl, setTxUrl] = useState<string | null>(null)

  /**
   * Get a quote for a swap
   */
  const getQuote = useCallback(async (params: Omit<SwapParams, "userAddress">) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("📊 Getting swap quote...", params)
      const swapQuote = await uniswapSwapService.getSwapQuote(params)
      setQuote(swapQuote)
      console.log("✅ Quote received:", swapQuote)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get quote"
      setError(errorMessage)
      console.error("❌ Quote error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Execute a swap
   */
  const executeSwap = useCallback(
    async (params: Omit<SwapParams, "userAddress">) => {
      if (!address) {
        setError("Wallet not connected")
        return
      }

      setIsLoading(true)
      setError(null)
      setTxHash(null)
      setTxUrl(null)

      try {
        console.log("🔄 Executing swap...", params)

        // Check if approval is needed (for non-ETH tokens)
        const isNativeETH = params.tokenIn === "0x0000000000000000000000000000000000000000"

        if (!isNativeETH) {
          const routerAddress = uniswapSwapService.getRouterAddress(params.version)
          const needsApproval = await uniswapSwapService.checkApproval(
            params.tokenIn as Address,
            address,
            routerAddress,
          )

          if (needsApproval) {
            console.log("⚠️ Token approval required")
            setError("Token approval required. Please approve the token first.")
            setIsLoading(false)
            return
          }
        }

        // Execute the swap
        const result = await uniswapSwapService.executeSwap(params, address)
        setTxHash(result.txHash)
        setTxUrl(result.txUrl)
        console.log("✅ Swap executed:", result)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Swap failed"
        setError(errorMessage)
        console.error("❌ Swap error:", err)
      } finally {
        setIsLoading(false)
      }
    },
    [address],
  )

  /**
   * Approve token spending
   */
  const approveToken = useCallback(
    async (tokenAddress: Address, amount: string) => {
      if (!address) {
        setError("Wallet not connected")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        console.log("✍️ Approving token...", { tokenAddress, amount })
        const routerAddress = UNISWAP_CONTRACTS.V2.ROUTER // or V3
        const result = await uniswapSwapService.approveToken(tokenAddress, routerAddress, amount)
        setTxHash(result.txHash)
        setTxUrl(result.txUrl)
        console.log("✅ Token approved:", result)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Approval failed"
        setError(errorMessage)
        console.error("❌ Approval error:", err)
      } finally {
        setIsLoading(false)
      }
    },
    [address],
  )

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setError(null)
    setQuote(null)
    setTxHash(null)
    setTxUrl(null)
  }, [])

  return {
    isLoading,
    error,
    quote,
    txHash,
    txUrl,
    getQuote,
    executeSwap,
    approveToken,
    reset,
  }
}

/**
 * Hook for getting token balances
 */
export function useTokenBalance(tokenAddress: Address | null) {
  const { address } = useAccount()
  const [balance, setBalance] = useState<string>("0")
  const [isLoading, setIsLoading] = useState(false)

  const fetchBalance = useCallback(async () => {
    if (!address || !tokenAddress) return

    setIsLoading(true)
    try {
      // In production, use wagmi's readContract to get balance
      // For demo, return mock balance
      setBalance("2.5847")
    } catch (err) {
      console.error("Error fetching balance:", err)
      setBalance("0")
    } finally {
      setIsLoading(false)
    }
  }, [address, tokenAddress])

  return { balance, isLoading, fetchBalance }
}
