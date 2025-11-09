import { type Address, formatUnits } from 'viem'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ''
const BASE_SEPOLIA_RPC = `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`

export interface TokenBalance {
  contractAddress: Address
  tokenBalance: string
  tokenBalanceFormatted: string
  name?: string
  symbol?: string
  decimals?: number
  logo?: string
}

export interface NativeBalance {
  balance: string
  balanceFormatted: string
}

/**
 * Alchemy Service for fetching wallet balances on Base Sepolia
 */
export class AlchemyService {
  private apiKey: string
  private rpcUrl: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || ALCHEMY_API_KEY
    this.rpcUrl = `https://base-sepolia.g.alchemy.com/v2/${this.apiKey}`

    if (!this.apiKey) {
      console.warn('⚠️ Alchemy API key not set. Using public RPC (rate limited)')
    }
  }

  /**
   * Get ETH balance for an address
   */
  async getETHBalance(address: Address): Promise<NativeBalance> {
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBalance',
          params: [address, 'latest'],
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      const balance = BigInt(data.result)
      const balanceFormatted = formatUnits(balance, 18)

      console.log('💰 ETH Balance:', {
        address,
        balance: balance.toString(),
        balanceFormatted,
      })

      return {
        balance: balance.toString(),
        balanceFormatted,
      }
    } catch (error) {
      console.error('❌ Error fetching ETH balance:', error)
      throw error
    }
  }

  /**
   * Get ERC20 token balance for an address
   */
  async getTokenBalance(walletAddress: Address, tokenAddress: Address): Promise<string> {
    try {
      // ERC20 balanceOf function signature
      const balanceOfSignature = '0x70a08231' // keccak256("balanceOf(address)")
      const paddedAddress = walletAddress.slice(2).padStart(64, '0')

      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [
            {
              to: tokenAddress,
              data: `${balanceOfSignature}${paddedAddress}`,
            },
            'latest',
          ],
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      const balance = BigInt(data.result)

      console.log('🪙 Token Balance:', {
        walletAddress,
        tokenAddress,
        balance: balance.toString(),
      })

      return balance.toString()
    } catch (error) {
      console.error('❌ Error fetching token balance:', error)
      return '0'
    }
  }

  /**
   * Get all token balances for an address using Alchemy's getTokenBalances
   */
  async getAllTokenBalances(address: Address, tokenAddresses?: Address[]): Promise<TokenBalance[]> {
    try {
      const params: any[] = [address]

      // If specific tokens provided, add them; otherwise get all
      if (tokenAddresses && tokenAddresses.length > 0) {
        params.push(tokenAddresses)
      } else {
        params.push('erc20') // Get all ERC20 tokens
      }

      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getTokenBalances',
          params,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      const balances: TokenBalance[] = data.result.tokenBalances
        .filter((token: any) => BigInt(token.tokenBalance) > BigInt(0))
        .map((token: any) => {
          const balance = BigInt(token.tokenBalance)
          const decimals = 18 // Default to 18, should fetch from token metadata
          const formatted = formatUnits(balance, decimals)

          return {
            contractAddress: token.contractAddress as Address,
            tokenBalance: balance.toString(),
            tokenBalanceFormatted: formatted,
            decimals,
          }
        })

      console.log('📊 All Token Balances:', {
        address,
        count: balances.length,
        balances,
      })

      return balances
    } catch (error) {
      console.error('❌ Error fetching all token balances:', error)
      return []
    }
  }

  /**
   * Get token metadata (name, symbol, decimals)
   */
  async getTokenMetadata(tokenAddress: Address): Promise<{
    name?: string
    symbol?: string
    decimals?: number
    logo?: string
  }> {
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getTokenMetadata',
          params: [tokenAddress],
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      console.log('ℹ️ Token Metadata:', {
        tokenAddress,
        metadata: data.result,
      })

      return {
        name: data.result.name,
        symbol: data.result.symbol,
        decimals: data.result.decimals,
        logo: data.result.logo,
      }
    } catch (error) {
      console.error('❌ Error fetching token metadata:', error)
      return {}
    }
  }

  /**
   * Get formatted token balance with metadata
   */
  async getTokenBalanceWithMetadata(
    walletAddress: Address,
    tokenAddress: Address,
  ): Promise<{
    balance: string
    balanceFormatted: string
    name?: string
    symbol?: string
    decimals?: number
  }> {
    try {
      const [balanceStr, metadata] = await Promise.all([
        this.getTokenBalance(walletAddress, tokenAddress),
        this.getTokenMetadata(tokenAddress),
      ])

      const balance = BigInt(balanceStr)
      const decimals = metadata.decimals || 18
      const balanceFormatted = formatUnits(balance, decimals)

      return {
        balance: balance.toString(),
        balanceFormatted,
        ...metadata,
      }
    } catch (error) {
      console.error('❌ Error fetching token balance with metadata:', error)
      throw error
    }
  }

  /**
   * Get transaction count (nonce) for an address
   */
  async getTransactionCount(address: Address): Promise<number> {
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getTransactionCount',
          params: [address, 'latest'],
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      const count = parseInt(data.result, 16)
      console.log('🔢 Transaction Count:', { address, count })

      return count
    } catch (error) {
      console.error('❌ Error fetching transaction count:', error)
      return 0
    }
  }

  /**
   * Get current gas price
   */
  async getGasPrice(): Promise<string> {
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_gasPrice',
          params: [],
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      const gasPrice = BigInt(data.result)
      const gasPriceGwei = formatUnits(gasPrice, 9) // Convert to Gwei

      console.log('⛽ Gas Price:', {
        wei: gasPrice.toString(),
        gwei: gasPriceGwei,
      })

      return gasPriceGwei
    } catch (error) {
      console.error('❌ Error fetching gas price:', error)
      return '0'
    }
  }
}

// Export singleton instance
export const alchemyService = new AlchemyService()

/**
 * Helper function to format balance for display
 */
export function formatBalance(balance: string | bigint, decimals: number = 18, maxDecimals: number = 6): string {
  const balanceFormatted = typeof balance === 'string' ? formatUnits(BigInt(balance), decimals) : formatUnits(balance, decimals)
  const num = parseFloat(balanceFormatted)
  
  if (num === 0) return '0'
  if (num < 0.000001) return '< 0.000001'
  
  return num.toFixed(maxDecimals).replace(/\.?0+$/, '')
}
