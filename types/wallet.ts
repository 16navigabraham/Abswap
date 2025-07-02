export interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logoURI: string
}

export interface WalletUser {
  id: string
  email?: string
  walletAddress?: string
  isAuthenticated: boolean
}

export interface SwapDetails {
  fromToken: Token
  toToken: Token
  fromAmount: string
  toAmount: string
  userAddress: string
  network: string
  timestamp: string
}
