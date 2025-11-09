import { type Address, parseUnits, formatUnits } from 'viem'
import {
  UNISWAP_CONTRACTS,
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V3_ROUTER_ABI,
  UNISWAP_V3_QUOTER_ABI,
  ERC20_ABI,
  V3_FEE_TIERS,
  buildTxUrl,
} from './uniswap-contracts'

export interface SwapParams {
  tokenIn: Address
  tokenOut: Address
  amountIn: string
  slippageTolerance?: number // in percentage (e.g., 0.5 for 0.5%)
  deadline?: number // in minutes (default: 20)
  version?: 'v2' | 'v3' // Uniswap version
  feeTier?: number // V3 only: 100, 500, 3000, or 10000
}

export interface SwapQuote {
  amountOut: string
  amountOutMin: string
  path: Address[]
  priceImpact: number
  route: string
}

/**
 * Uniswap Swap Service
 * Handles token swaps on Sepolia testnet using Uniswap V2/V3
 */
export class UniswapSwapService {
  private readonly defaultSlippage = 0.5 // 0.5%
  private readonly defaultDeadline = 20 // 20 minutes

  /**
   * Get a quote for a swap (estimate output amount)
   */
  async getSwapQuote(params: SwapParams): Promise<SwapQuote> {
    const { tokenIn, tokenOut, amountIn, version = 'v2' } = params

    console.log('🔍 Getting swap quote:', {
      tokenIn,
      tokenOut,
      amountIn,
      version,
    })

    // For demo purposes, return a mock quote
    // In production, you would call the Uniswap contracts
    const mockAmountOut = amountIn // 1:1 ratio for demo
    const slippage = params.slippageTolerance || this.defaultSlippage
    const amountOutMin = this.calculateMinAmountOut(mockAmountOut, slippage)

    return {
      amountOut: mockAmountOut,
      amountOutMin,
      path: [tokenIn, tokenOut],
      priceImpact: 0.1, // Mock 0.1% price impact
      route: `${tokenIn} → ${tokenOut}`,
    }
  }

  /**
   * Execute a token swap
   * NOTE: This is a demo function. In production, you would use wagmi's writeContract
   */
  async executeSwap(params: SwapParams, userAddress: Address): Promise<{ txHash: string; txUrl: string }> {
    const { tokenIn, tokenOut, amountIn, version = 'v2', slippageTolerance, deadline } = params

    console.log('🔄 Executing swap:', {
      tokenIn,
      tokenOut,
      amountIn,
      userAddress,
      version,
    })

    // Get quote
    const quote = await this.getSwapQuote(params)

    // Calculate deadline (timestamp in seconds)
    const deadlineTimestamp = Math.floor(Date.now() / 1000) + (deadline || this.defaultDeadline) * 60

    // Build transaction parameters
    const txParams = this.buildSwapTransaction({
      version,
      tokenIn,
      tokenOut,
      amountIn,
      amountOutMin: quote.amountOutMin,
      recipient: userAddress,
      deadline: deadlineTimestamp,
      feeTier: params.feeTier || V3_FEE_TIERS.MEDIUM,
    })

    console.log('📝 Transaction parameters:', txParams)

    // Demo: Return a mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`

    console.log('✅ Swap executed:', {
      txHash: mockTxHash,
      quote,
    })

    return {
      txHash: mockTxHash as Address,
      txUrl: buildTxUrl(mockTxHash),
    }
  }

  /**
   * Build swap transaction parameters
   */
  private buildSwapTransaction(params: {
    version: 'v2' | 'v3'
    tokenIn: Address
    tokenOut: Address
    amountIn: string
    amountOutMin: string
    recipient: Address
    deadline: number
    feeTier: number
  }) {
    const { version, tokenIn, tokenOut, amountIn, amountOutMin, recipient, deadline, feeTier } = params

    if (version === 'v2') {
      return {
        address: UNISWAP_CONTRACTS.V2.ROUTER,
        abi: UNISWAP_V2_ROUTER_ABI,
        functionName: 'swapExactTokensForTokens',
        args: [
          parseUnits(amountIn, 18), // amountIn
          parseUnits(amountOutMin, 18), // amountOutMin
          [tokenIn, tokenOut], // path
          recipient, // to
          BigInt(deadline), // deadline
        ],
      }
    } else {
      // V3
      return {
        address: UNISWAP_CONTRACTS.V3.SWAP_ROUTER_02,
        abi: UNISWAP_V3_ROUTER_ABI,
        functionName: 'exactInputSingle',
        args: [
          {
            tokenIn,
            tokenOut,
            fee: feeTier,
            recipient,
            deadline: BigInt(deadline),
            amountIn: parseUnits(amountIn, 18),
            amountOutMinimum: parseUnits(amountOutMin, 18),
            sqrtPriceLimitX96: BigInt(0),
          },
        ],
      }
    }
  }

  /**
   * Calculate minimum amount out based on slippage tolerance
   */
  private calculateMinAmountOut(amountOut: string, slippageTolerance: number): string {
    const amount = parseFloat(amountOut)
    const minAmount = amount * (1 - slippageTolerance / 100)
    return minAmount.toString()
  }

  /**
   * Check if token approval is needed
   */
  async checkApproval(tokenAddress: Address, ownerAddress: Address, spenderAddress: Address): Promise<boolean> {
    console.log('🔍 Checking token approval:', {
      token: tokenAddress,
      owner: ownerAddress,
      spender: spenderAddress,
    })

    // In production, you would use wagmi's readContract to check allowance
    // For demo, return false (needs approval)
    return false
  }

  /**
   * Approve token spending
   */
  async approveToken(
    tokenAddress: Address,
    spenderAddress: Address,
    amount: string,
  ): Promise<{ txHash: string; txUrl: string }> {
    console.log('✍️ Approving token:', {
      token: tokenAddress,
      spender: spenderAddress,
      amount,
    })

    // Demo: Return a mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`

    console.log('✅ Token approved:', mockTxHash)

    return {
      txHash: mockTxHash as Address,
      txUrl: buildTxUrl(mockTxHash),
    }
  }

  /**
   * Get router address based on version
   */
  getRouterAddress(version: 'v2' | 'v3' = 'v2'): Address {
    return version === 'v2' ? UNISWAP_CONTRACTS.V2.ROUTER : UNISWAP_CONTRACTS.V3.SWAP_ROUTER_02
  }

  /**
   * Build swap path for multi-hop swaps
   */
  buildSwapPath(tokenIn: Address, tokenOut: Address, intermediateTokens: Address[] = []): Address[] {
    if (intermediateTokens.length === 0) {
      return [tokenIn, tokenOut]
    }
    return [tokenIn, ...intermediateTokens, tokenOut]
  }
}

// Export a singleton instance
export const uniswapSwapService = new UniswapSwapService()

/**
 * Helper function to format token amount for display
 */
export function formatTokenAmount(amount: string | bigint, decimals: number = 18): string {
  if (typeof amount === 'string') {
    return parseFloat(amount).toFixed(6)
  }
  return formatUnits(amount, decimals)
}

/**
 * Helper function to parse token amount from user input
 */
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  return parseUnits(amount, decimals)
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Get estimated gas cost in USD (mock)
 */
export function getEstimatedGasCost(gasLimit: bigint, gasPrice: bigint, ethPriceUSD: number = 2000): string {
  const gasCostInEth = Number(gasLimit * gasPrice) / 1e18
  const gasCostInUSD = gasCostInEth * ethPriceUSD
  return gasCostInUSD.toFixed(2)
}
