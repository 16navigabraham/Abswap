import { cookieStorage, createStorage, http } from "wagmi"
import { baseSepolia } from "wagmi/chains"
import { createAppKit } from "@reown/appkit/react"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import type { AppKitNetwork } from "@reown/appkit/networks"

// Get project ID and Alchemy API key
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || ""
export const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ""

if (!projectId) {
  throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not set")
}

if (!alchemyApiKey) {
  console.warn("NEXT_PUBLIC_ALCHEMY_API_KEY is not set - using public RPC")
}

// Create wagmiAdapter with Base Sepolia
export const networks = [baseSepolia] as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [baseSepolia.id]: http(
      alchemyApiKey 
        ? `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
        : baseSepolia.rpcUrls.default.http[0]
    ),
  },
})

export const wagmiConfig = wagmiAdapter.wagmiConfig

// Set up metadata
const metadata = {
  name: "Abswap",
  description: "A Uniswap clone for swapping tokens on Base Sepolia",
  url: "https://abswap.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
}

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  features: {
    analytics: true,
  },
})
