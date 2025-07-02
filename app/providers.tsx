"use client"

import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmcmgf2gb0084l50mm6zmhck2"}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#ff007a",
          logo: "https://uniswap.org/favicon.ico",
        },
        loginMethods: ["wallet"],
        embeddedWallets: {
          createOnLogin: "off",
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
