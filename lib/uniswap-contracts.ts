/**
 * Uniswap Contract Addresses for Sepolia Testnet
 * Chain ID: 11155111
 */

export const UNISWAP_CONTRACTS = {
  // Uniswap V2 Contracts on Sepolia
  V2: {
    FACTORY: '0x7E0987E5b3a30e3f2828572Bb659A548460a3003' as const,
    ROUTER: '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008' as const,
    WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14' as const,
  },

  // Uniswap V3 Contracts on Sepolia
  V3: {
    FACTORY: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c' as const,
    ROUTER: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E' as const,
    SWAP_ROUTER_02: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E' as const,
    QUOTER: '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3' as const,
    QUOTER_V2: '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3' as const,
    NFT_POSITION_MANAGER: '0x1238536071E1c677A632429e3655c799b22cDA52' as const,
    WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14' as const,
  },

  // Token Addresses on Sepolia
  TOKENS: {
    WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14' as const,
    USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8' as const, // USDC on Sepolia
    DAI: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357' as const, // DAI on Sepolia
    USDT: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0' as const, // USDT on Sepolia
    WBTC: '0x29f2D40B0605204364af54EC677bD022dA425d03' as const, // WBTC on Sepolia
  },

  // Multicall Contract
  MULTICALL3: '0xcA11bde05977b3631167028862bE2a173976CA11' as const,
} as const

// Uniswap V2 Router ABI (essential functions)
export const UNISWAP_V2_ROUTER_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
      { internalType: 'address[]', name: 'path', type: 'address[]' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'swapExactTokensForTokens',
    outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
      { internalType: 'address[]', name: 'path', type: 'address[]' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'swapExactETHForTokens',
    outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
      { internalType: 'address[]', name: 'path', type: 'address[]' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'swapExactTokensForETH',
    outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'address[]', name: 'path', type: 'address[]' },
    ],
    name: 'getAmountsIn',
    outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'address[]', name: 'path', type: 'address[]' },
    ],
    name: 'getAmountsOut',
    outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Uniswap V3 SwapRouter ABI (essential functions)
export const UNISWAP_V3_ROUTER_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'uint24', name: 'fee', type: 'uint24' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOutMinimum', type: 'uint256' },
          { internalType: 'uint160', name: 'sqrtPriceLimitX96', type: 'uint160' },
        ],
        internalType: 'struct ISwapRouter.ExactInputSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'exactInputSingle',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes', name: 'path', type: 'bytes' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOutMinimum', type: 'uint256' },
        ],
        internalType: 'struct ISwapRouter.ExactInputParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'exactInput',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// Uniswap V3 Quoter ABI
export const UNISWAP_V3_QUOTER_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'tokenIn', type: 'address' },
      { internalType: 'address', name: 'tokenOut', type: 'address' },
      { internalType: 'uint24', name: 'fee', type: 'uint24' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint160', name: 'sqrtPriceLimitX96', type: 'uint160' },
    ],
    name: 'quoteExactInputSingle',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'path', type: 'bytes' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
    ],
    name: 'quoteExactInput',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// ERC20 Token ABI (essential functions)
export const ERC20_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Uniswap V3 Fee Tiers
export const V3_FEE_TIERS = {
  LOWEST: 100, // 0.01%
  LOW: 500, // 0.05%
  MEDIUM: 3000, // 0.30%
  HIGH: 10000, // 1.00%
} as const

// Chain Information
export const SEPOLIA_CHAIN_INFO = {
  chainId: 11155111,
  name: 'Sepolia',
  rpcUrl: 'https://sepolia.infura.io/v3/',
  blockExplorer: 'https://sepolia.etherscan.io',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
} as const

/**
 * Get the Uniswap V2 Router contract address
 */
export const getUniswapV2Router = () => UNISWAP_CONTRACTS.V2.ROUTER

/**
 * Get the Uniswap V3 SwapRouter contract address
 */
export const getUniswapV3Router = () => UNISWAP_CONTRACTS.V3.SWAP_ROUTER_02

/**
 * Get WETH contract address
 */
export const getWETHAddress = () => UNISWAP_CONTRACTS.TOKENS.WETH

/**
 * Build a transaction URL for Sepolia Etherscan
 */
export const buildTxUrl = (txHash: string) => {
  return `${SEPOLIA_CHAIN_INFO.blockExplorer}/tx/${txHash}`
}

/**
 * Build an address URL for Sepolia Etherscan
 */
export const buildAddressUrl = (address: string) => {
  return `${SEPOLIA_CHAIN_INFO.blockExplorer}/address/${address}`
}

/**
 * Build a token URL for Sepolia Etherscan
 */
export const buildTokenUrl = (tokenAddress: string) => {
  return `${SEPOLIA_CHAIN_INFO.blockExplorer}/token/${tokenAddress}`
}
