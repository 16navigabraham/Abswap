import { cookieStorage, createStorage } from "wagmi"
import { sepolia, mainnet } from "wagmi/chains"
import { createAppKit } from "@reown/appkit/react"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import type { AppKitNetwork } from "@reown/appkit/networks"

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || ""

if (!projectId) {
  throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not set")
}

// Create wagmiAdapter
export const networks = [sepolia, mainnet] as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
})

export const wagmiConfig = wagmiAdapter.wagmiConfig

// Set up metadata
const metadata = {
  name: "Abswap",
  description: "A Uniswap clone for swapping tokens",
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
