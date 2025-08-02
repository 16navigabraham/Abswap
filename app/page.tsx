"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Settings } from "lucide-react"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenSelector } from "@/components/token-selector"
import { TOKENS, type Token } from "@/lib/tokens"

export default function SwapPage() {
  const { ready, authenticated, user, login, logout } = usePrivy()

  const [fromToken, setFromToken] = useState<Token>(TOKENS[0])
  const [toToken, setToToken] = useState<Token>(TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")

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
    
    // Check if user has a wallet property with address
    if (user.wallet?.address) {
      return user.wallet.address
    }
    
    // Check linked accounts for wallet type
    const walletAccount = user.linkedAccounts?.find((account: any) => account.type === "wallet")
    if (walletAccount && 'address' in walletAccount) {
      return walletAccount.address
    }
    
    return null
  }

  const userWalletAddress = getUserWalletAddress()

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Swap</CardTitle>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* {!authenticated && (
            <div className="mt-4">
              <Button
                onClick={login}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl py-3"
              >
                Connect Wallet
              </Button>
            </div>
          )} */}

          {authenticated && userWalletAddress && (
            <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">{formatAddress(userWalletAddress)}</span>
              <Button onClick={logout} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 text-xs">
                Disconnect
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-1">
          {/* From Token */}
          <div className="p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">From</span>
              <span className="text-sm text-gray-500">Balance: 0</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="border-0 bg-transparent text-3xl font-medium p-0 focus-visible:ring-0 placeholder:text-gray-300"
                />
              </div>
              <TokenSelector selectedToken={fromToken} onTokenSelect={setFromToken} otherToken={toToken} />
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <Button
              onClick={handleSwapTokens}
              variant="outline"
              size="icon"
              className="rounded-xl bg-white border-4 border-gray-50 hover:bg-gray-50 shadow-sm"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">To</span>
              <span className="text-sm text-gray-500">Balance: 0</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="0"
                  value={toAmount}
                  className="border-0 bg-transparent text-3xl font-medium p-0 focus-visible:ring-0 placeholder:text-gray-300"
                  readOnly
                />
              </div>
              <TokenSelector selectedToken={toToken} onTokenSelect={setToToken} otherToken={fromToken} />
            </div>
          </div>

          {/* Swap Button */}
          <div className="pt-4">
            {!authenticated ? (
              <Button
                onClick={login}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 text-lg rounded-2xl"
              >
                Connect Wallet
              </Button>
            ) : !fromAmount || Number.parseFloat(fromAmount) <= 0 ? (
              <Button disabled className="w-full py-4 text-lg bg-gray-200 text-gray-400 cursor-not-allowed rounded-2xl">
                Enter an amount
              </Button>
            ) : (
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 text-lg rounded-2xl">
                Swap
              </Button>
            )}
          </div>

          {/* Transaction Details */}
          {fromAmount && toAmount && authenticated && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Rate</span>
                  <span>
                    1 {fromToken.symbol} = 1 {toToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Network cost</span>
                  <span>$1.50</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}