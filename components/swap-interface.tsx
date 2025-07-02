"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Settings, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenSelector } from "./token-selector"
import { WalletConnection } from "./wallet-connection"
import { SEPOLIA_TOKENS } from "@/data/tokens"
import type { Token, WalletUser, SwapDetails } from "@/types/wallet"

export function SwapInterface() {
  // Wallet state
  const [user, setUser] = useState<WalletUser | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Swap state
  const [fromToken, setFromToken] = useState<Token>(SEPOLIA_TOKENS[0])
  const [toToken, setToToken] = useState<Token>(SEPOLIA_TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)

  // Auto-calculate to amount (1:1 ratio for demo)
  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      setToAmount(fromAmount)
    } else {
      setToAmount("")
    }
  }, [fromAmount])

  const handleConnect = async () => {
    setIsConnecting(true)

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockUser: WalletUser = {
      id: `user_${Date.now()}`,
      email: "user@example.com",
      walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      isAuthenticated: true,
    }

    setUser(mockUser)
    setIsConnecting(false)
  }

  const handleDisconnect = () => {
    setUser(null)
  }

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleSwap = async () => {
    if (!user?.isAuthenticated) return

    setIsSwapping(true)

    const swapDetails: SwapDetails = {
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      userAddress: user.walletAddress || "",
      network: "Sepolia Testnet",
      timestamp: new Date().toISOString(),
    }

    // Comprehensive logging
    console.log("🔄 UNISWAP SWAP TRANSACTION")
    console.log("=".repeat(50))
    console.log("📊 Swap Details:", {
      from: `${fromAmount} ${fromToken.symbol} (${fromToken.address})`,
      to: `${toAmount} ${toToken.symbol} (${toToken.address})`,
      rate: `1 ${fromToken.symbol} = 1 ${toToken.symbol}`,
    })

    console.log("👤 User Info:", {
      address: user.walletAddress,
      email: user.email,
      userId: user.id,
    })

    console.log("🌐 Network Info:", {
      network: "Sepolia Testnet",
      chainId: 11155111,
      rpcUrl: "https://sepolia.infura.io/v3/",
      blockExplorer: "https://sepolia.etherscan.io/",
    })

    console.log("💰 Transaction Estimates:", {
      gasLimit: "21000",
      gasPrice: "20 gwei",
      estimatedFee: "$2.50",
      slippage: "0.5%",
      deadline: "20 minutes",
    })

    console.log("🔗 Contract Addresses:", {
      ETH: "0x0000000000000000000000000000000000000000",
      WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      UniswapRouter: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    })

    console.log("⚙️ Privy Configuration:", {
      appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmcmgf2gb0084l50mm6zmhck2",
      environment: "development",
      embeddedWallets: true,
    })

    // Simulate transaction processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsSwapping(false)

    console.log("✅ Swap completed successfully!")
    alert(
      `🎉 Swap Successful!\n\n${fromAmount} ${fromToken.symbol} → ${toAmount} ${toToken.symbol}\n\nTransaction submitted to Sepolia testnet`,
    )
  }

  const isAuthenticated = user?.isAuthenticated || false

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

          <div className="mt-4">
            <WalletConnection
              user={user}
              isLoading={isConnecting}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>From</span>
              <span>Balance: {isAuthenticated ? "2.5847" : "0.00"}</span>
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

          {/* Swap Direction Button */}
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
              <span>Balance: {isAuthenticated ? "1.2341" : "0.00"}</span>
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

          {/* Swap Button */}
          <div className="pt-4">
            {!isAuthenticated ? (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-6 text-lg"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            ) : !fromAmount || Number.parseFloat(fromAmount) <= 0 ? (
              <Button disabled className="w-full py-6 text-lg bg-gray-200 text-gray-500 cursor-not-allowed">
                Enter an amount
              </Button>
            ) : (
              <Button
                onClick={handleSwap}
                disabled={isSwapping}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {isSwapping ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  `Swap ${fromToken.symbol} for ${toToken.symbol}`
                )}
              </Button>
            )}
          </div>

          {/* Transaction Details */}
          {fromAmount && toAmount && isAuthenticated && (
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

          {/* Footer */}
          {isAuthenticated && (
            <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
              Powered by Privy • Sepolia Testnet
              <br />
              App ID: {process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmcmgf2gb0084l50mm6zmhck2"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
