"use client"
import { Wallet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WalletUser } from "@/types/wallet"

interface WalletConnectionProps {
  user: WalletUser | null
  isLoading: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletConnection({ user, isLoading, onConnect, onDisconnect }: WalletConnectionProps) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!user?.isAuthenticated) {
    return (
      <Button
        onClick={onConnect}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </>
        )}
      </Button>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-green-800">Connected</span>
        <span className="text-xs text-green-600">
          {user.walletAddress ? formatAddress(user.walletAddress) : "No wallet"}
        </span>
        {user.email && <span className="text-xs text-green-500">{user.email}</span>}
      </div>
      <Button
        onClick={onDisconnect}
        variant="outline"
        size="sm"
        className="text-green-700 border-green-300 hover:bg-green-100 bg-transparent"
      >
        Disconnect
      </Button>
    </div>
  )
}
