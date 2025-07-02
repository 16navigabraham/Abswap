import type { Token } from "@/types/wallet"

export const SEPOLIA_TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logoURI: "/placeholder.svg?height=32&width=32",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    decimals: 18,
    logoURI: "/placeholder.svg?height=32&width=32",
  },
]
