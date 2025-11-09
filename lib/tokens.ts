export interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logoURI: string
  isPopular?: boolean
}

export const TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logoURI: "/placeholder.svg?height=32&width=32",
    isPopular: true,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    decimals: 18,
    logoURI: "/placeholder.svg?height=32&width=32",
    isPopular: true,
  },
]
// Uncomment and modify the following tokens as needed
//   {
//     symbol: "USDC",
//     name: "USD Coin",
//     address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
//     decimals: 6,
//     logoURI: "/placeholder.svg?height=32&width=32",
//     isPopular: true,
//   },
//   {
//     symbol: "USDT",
//     name: "Tether USD",
//     address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
//     decimals: 6,
//     logoURI: "/placeholder.svg?height=32&width=32",
//     isPopular: true,
//   },
//   {
//     symbol: "DAI",
//     name: "Dai Stablecoin",
//     address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
//     decimals: 18,
//     logoURI: "/placeholder.svg?height=32&width=32",
//     isPopular: true,
//   },
//   {
//     symbol: "WBTC",
//     name: "Wrapped Bitcoin",
//     address: "0x29f2D40B0605204364af54EC677bD022dA425d03",
//     decimals: 8,
//     logoURI: "/placeholder.svg?height=32&width=32",
//     isPopular: true,
//   },
//   {
//     symbol: "LINK",
//     name: "Chainlink",
//     address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
//     decimals: 18,
//     logoURI: "/placeholder.svg?height=32&width=32",
//     isPopular: true,
//   },
//   {
//     symbol: "UNI",
//     name: "Uniswap",
//     address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
//     decimals: 18,
//     logoURI: "/placeholder.svg?height=32&width=32",
//     isPopular: true,
//   },
//   {
//     symbol: "AAVE",
//     name: "Aave",
//     address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
//     decimals: 18,
//     logoURI: "/placeholder.svg?height=32&width=32",
//   },
//   {
//     symbol: "COMP",
//     name: "Compound",
//     address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
//     decimals: 18,
//     logoURI: "/placeholder.svg?height=32&width=32",
//   },
//   {
//     symbol: "MKR",
//     name: "Maker",
//     address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
//     decimals: 18,
//     logoURI: "/placeholder.svg?height=32&width=32",
//   },
//   {
//     symbol: "SNX",
//     name: "Synthetix",
//     address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
//     decimals: 18,
//     logoURI: "/placeholder.svg?height=32&width=32",
//   },
// ]

export const SEPOLIA_TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logoURI: "/placeholder.svg?height=32&width=32",
    isPopular: true,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    decimals: 18,
    logoURI: "/placeholder.svg?height=32&width=32",
    isPopular: true,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    decimals: 6,
    logoURI: "/placeholder.svg?height=32&width=32",
    isPopular: true,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
    decimals: 6,
    logoURI: "/placeholder.svg?height=32&width=32",
    isPopular: true,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
    decimals: 18,
    logoURI: "/placeholder.svg?height=32&width=32",
    isPopular: true,
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x29f2D40B0605204364af54EC677bD022dA425d03",
    decimals: 8,
    logoURI: "/placeholder.svg?height=32&width=32",
    isPopular: true,
  },
]
