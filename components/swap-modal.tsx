"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Settings, Wallet } from "lucide-react"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenSelector } from "./token-selector"
import { SEPOLIA_TOKENS, type Token } from "@/lib/tokens"

export function SwapModal() {
  const { ready, authenticated, user, login, logout } = usePrivy()

  const [fromToken, setFromToken] = useState<Token>(SEPOLIA_TOKENS[0])
  const [toToken, setToToken] = useState<Token>(SEPOLIA_TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")

  // Auto-calculate to amount (1:1 ratio for demo)
  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      setToAmount(fromAmount)
    } else {
      setToAmount("")
    }
  }, [fromAmount])

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getUserWalletAddress = () => {
    if (!user) return null
    return user.wallet?.address || user.linkedAccounts?.find((account) => account.type === "wallet")?.address
  }

  const userWalletAddress = getUserWalletAddress()

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              Swap
            </CardTitle>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Wallet Connection */}
          <div className="mt-4">
            {!authenticated ? (
              <Button
                onClick={login}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-green-800">Connected</span>
                  <span className="text-xs text-green-600">
                    {userWalletAddress ? formatAddress(userWalletAddress) : "No wallet linked"}
                  </span>
                  {user?.email?.address && <span className="text-xs text-green-500">{user.email.address}</span>}
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="text-green-700 border-green-300 hover:bg-green-100 bg-transparent"
                >
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>From</span>
              <span>Balance: {authenticated ? "2.5847" : "0.00"}</span>
            </div>
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="border-0 bg-transparent text-2xl font-medium p-0 focus-visible:ring-0 placeholder:text-gray-400"
                />
              </div>
              <TokenSelector selectedToken={fromToken} onTokenSelect={setFromToken} otherToken={toToken} />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSwapTokens}
              variant="outline"
              size="icon"
              className="rounded-full bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-green-300 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>To</span>
              <span>Balance: {authenticated ? "1.2341" : "0.00"}</span>
            </div>
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  className="border-0 bg-transparent text-2xl font-medium p-0 focus-visible:ring-0 placeholder:text-gray-400"
                  readOnly
                />
              </div>
              <TokenSelector selectedToken={toToken} onTokenSelect={setToToken} otherToken={fromToken} />
            </div>
          </div>

          {/* Swap Action Button */}
          <div className="pt-4">
            {!authenticated ? (
              <Button
                onClick={login}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-6 text-lg"
              >
                Connect Wallet to Swap
              </Button>
            ) : !fromAmount || Number.parseFloat(fromAmount) <= 0 ? (
              <Button disabled className="w-full py-6 text-lg bg-gray-200 text-gray-500 cursor-not-allowed">
                Enter an amount
              </Button>
            ) : (
              <Button
                disabled
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-6 text-lg opacity-50 cursor-not-allowed"
              >
                Swap (Demo Only)
              </Button>
            )}
          </div>

          {/* Swap Details */}
          {fromAmount && toAmount && authenticated && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-green-800 space-y-1">
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span className="font-medium">
                    1 {fromToken.symbol} = 1 {toToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Network fee:</span>
                  <span>~$2.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="font-medium">Sepolia Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span>Slippage:</span>
                  <span>0.5%</span>
                </div>
              </div>
            </div>
          )}

          {/* Demo Notice */}
          <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
            Frontend Demo Only • No Actual Swapping
            <br />
            Powered by Privy • Sepolia Testnet
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
