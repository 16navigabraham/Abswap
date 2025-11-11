"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Settings, Loader2 } from "lucide-react"
import { useAppKit } from "@reown/appkit/react"
import { useAccount, useDisconnect } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenSelector } from "@/components/token-selector"
import { TOKENS, type Token } from "@/lib/tokens"
import { useAlchemyBalance } from "@/hooks/use-alchemy-balance"
import { useToast } from "@/hooks/use-toast"

export default function SwapPage() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { ethBalanceFormatted, isLoadingETH } = useAlchemyBalance()
  const { toast } = useToast()

  const [fromToken, setFromToken] = useState<Token>(TOKENS[0])
  const [toToken, setToToken] = useState<Token>(TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)

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

  // Use the provider directly to send an eth_sendTransaction request which will prompt the user's wallet to sign.
  const handleSwap = async () => {
    if (!isConnected || !address) return

    if (!fromAmount || Number(fromAmount) <= 0) {
      alert("Enter a valid amount to swap")
      return
    }

    setIsSwapping(true)

  try {
      const ethProvider = (window as any).ethereum
      if (!ethProvider || typeof ethProvider.request !== "function") {
        alert("No injected wallet found (MetaMask, Coinbase Wallet). Please install or connect one.")
        return
      }

      // Convert amount (ETH) to hex wei
      const wei = parseEther(fromAmount) // returns bigint
      const valueHex = `0x${wei.toString(16)}`

      const params = [{
        from: address,
        to: address, // sending to self on testnet to trigger signature safely
        value: valueHex,
      }]

      const result = await ethProvider.request({ method: "eth_sendTransaction", params })

      // result is the transaction hash
      console.log("✅ Transaction submitted: ", result)
      // show toast with link to Base Sepolia explorer
      const explorerUrl = `https://sepolia.basescan.org/tx/${result}`
      toast({
        title: "Transaction submitted",
        description: (
          <a href={explorerUrl} target="_blank" rel="noreferrer" className="underline">
            View on Base Sepolia Explorer
          </a>
        ),
        open: true,
      })

      // Reset amounts
      setFromAmount("")
      setToAmount("")
    } catch (error) {
      console.error("❌ Swap failed:", error)
      alert("Swap failed. Please check your wallet and try again.")
    } finally {
      setIsSwapping(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Swap</CardTitle>
            <div className="flex items-center gap-2">
              {/* Wallet Connection Button */}
              {isConnected && address ? (
                <Button
                  onClick={() => open()}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                >
                  <span className="text-xs font-medium">{formatAddress(address)}</span>
                </Button>
              ) : (
                <Button
                  onClick={() => open()}
                  variant="outline"
                  size="sm"
                  className="border-pink-300 text-pink-600 hover:bg-pink-50"
                >
                  Connect
                </Button>
              )}
              
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Network & Balance Info */}
          {isConnected && address && (
            <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Wallet</span>
                  <span className="text-sm font-medium text-gray-900">{formatAddress(address)}</span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-xs text-gray-500">Balance</span>
                  <span className="text-sm font-semibold text-pink-600">
                    {isLoadingETH ? "..." : ethBalanceFormatted || "0"} ETH
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-pink-200/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Network: Base Sepolia</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-medium">Connected</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-1">
          {/* From Token */}
          <div className="p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">From</span>
              <span className="text-sm text-gray-500">
                Balance: {isConnected ? (isLoadingETH ? "..." : ethBalanceFormatted || "0") : "0"}
              </span>
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
            {!isConnected ? (
              <Button
                onClick={() => open()}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 text-lg rounded-2xl"
              >
                Connect Wallet
              </Button>
            ) : !fromAmount || Number.parseFloat(fromAmount) <= 0 ? (
              <Button disabled className="w-full py-4 text-lg bg-gray-200 text-gray-400 cursor-not-allowed rounded-2xl">
                Enter an amount
              </Button>
            ) : (
              <Button 
                onClick={handleSwap}
                disabled={isSwapping}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 text-lg rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
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
          {fromAmount && toAmount && isConnected && (
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