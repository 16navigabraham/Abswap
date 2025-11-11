"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Settings, Loader2 } from "lucide-react"
import { useAppKit } from "@reown/appkit/react"
import { useAccount, useDisconnect } from "wagmi"
import { parseEther, encodeFunctionData, parseUnits, formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenSelector } from "@/components/token-selector"
import { TOKENS, type Token } from "@/lib/tokens"
import { useAlchemyBalance } from "@/hooks/use-alchemy-balance"
import { useToast } from "@/hooks/use-toast"
import { usePublicClient, useWalletClient } from "wagmi"
import type { Address } from "viem"
import {
  UNISWAP_V3_QUOTER_ABI,
  UNISWAP_V3_ROUTER_ABI,
  UNISWAP_CONTRACTS,
  getUniswapV3Router,
  getWETHAddress,
  V3_FEE_TIERS,
  buildTxUrl,
  ERC20_ABI,
} from "@/lib/uniswap-contracts"

export default function SwapPage() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { ethBalanceFormatted, isLoadingETH } = useAlchemyBalance()
  const { toast } = useToast()
  const publicClient = usePublicClient()
  const walletClient = useWalletClient()

  const [fromToken, setFromToken] = useState<Token>(TOKENS[0])
  const [toToken, setToToken] = useState<Token>(TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [confirmations, setConfirmations] = useState<number>(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [preparedQuote, setPreparedQuote] = useState<bigint | null>(null)
  const [preparedGas, setPreparedGas] = useState<bigint | null>(null)
  const [preparedGasCostWei, setPreparedGasCostWei] = useState<bigint | null>(null)
  const [preparedGasUsd, setPreparedGasUsd] = useState<number | null>(null)
  const [slippagePct, setSlippagePct] = useState<number>(0.5)
  const [selectedFee, setSelectedFee] = useState<number>(V3_FEE_TIERS.MEDIUM)

  // Poll for transaction confirmations (prefer publicClient if available)
  useEffect(() => {
    if (!txHash) return
    const interval = setInterval(async () => {
      try {
        if (publicClient) {
          const receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` })
          if (receipt && receipt.blockNumber) {
            const latestBlock = await publicClient.getBlockNumber()
            const confs = Number(BigInt(latestBlock) - BigInt(receipt.blockNumber) + BigInt(1))
            setConfirmations(confs)
            if (confs >= 1) clearInterval(interval)
            return
          }
        }

        const ethProvider = (window as any).ethereum
        if (!ethProvider || typeof ethProvider.request !== "function") return
        const receipt = await ethProvider.request({ method: "eth_getTransactionReceipt", params: [txHash] })
        if (receipt && receipt.blockNumber) {
          const block = await ethProvider.request({ method: "eth_blockNumber" })
          const blockNum = BigInt(block)
          const txBlock = BigInt(receipt.blockNumber)
          const confs = Number(blockNum - txBlock) + 1
          setConfirmations(confs)
          if (confs >= 1) clearInterval(interval)
        }
      } catch (e) {
        // ignore
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [txHash, publicClient])

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

  const formatBigint = (value: bigint | null, decimals = 18, precision = 6) => {
    if (value === null) return "—"
    try {
      return Number(parseFloat(formatUnits(value, decimals))).toFixed(precision).replace(/\.0+$/, "")
    } catch (e) {
      return String(value)
    }
  }

  // Prepare swap: quote and gas estimate, then open confirm modal
  const prepareSwap = async () => {
    if (!isConnected || !address) return

    if (!fromAmount || Number(fromAmount) <= 0) {
      toast({ title: "Invalid amount", description: "Enter a valid amount to swap", open: true })
      return
    }

    setIsSwapping(true)

    try {
      const ethProvider = (window as any).ethereum
      if (!ethProvider || typeof ethProvider.request !== "function") {
        toast({ title: "No wallet", description: "No injected wallet found (MetaMask, Coinbase Wallet). Please install or connect one.", open: true })
        return
      }

      // amountIn as bigint according to token decimals
      const isNative = fromToken.address === "0x0000000000000000000000000000000000000000"
      const amountIn = isNative
        ? parseEther(fromAmount)
        : parseUnits(fromAmount, fromToken.decimals)

      // Setup quoter info
  const fee = selectedFee
      const weth = getWETHAddress()
      const tokenInAddress = isNative ? weth : (fromToken.address as `0x${string}`)
      const tokenOut = toToken.address as `0x${string}`
      const quoterAddress = UNISWAP_CONTRACTS.V3.QUOTER

      if (!quoterAddress) {
        toast({ title: "Network misconfigured", description: "Quoter contract not configured for this network", open: true })
        setIsSwapping(false)
        return
      }

      const router = getUniswapV3Router()

      if (!publicClient || !walletClient?.data) {
        toast({ title: "Client missing", description: "Wallet or provider client not available. Make sure your wallet is connected.", open: true })
        setIsSwapping(false)
        return
      }

      const wallet = walletClient.data

      // If tokenIn is ERC20, ensure allowance to router using publicClient
      if (!isNative) {
        const allowanceCall = await publicClient.readContract({
          address: fromToken.address as Address,
          abi: ERC20_ABI as any,
          functionName: "allowance",
          args: [address as Address, router as Address],
        })
        const allowance = BigInt(allowanceCall as any)
        if (allowance < amountIn) {
          // send approve via walletClient
          const approveTxHash = await wallet.writeContract({
            address: fromToken.address as Address,
            abi: ERC20_ABI as any,
            functionName: "approve",
            args: [router as Address, amountIn],
          })

          toast({
            title: "Approval submitted",
            description: (
              <div>
                <a href={buildTxUrl(String(approveTxHash))} target="_blank" rel="noreferrer" className="underline mr-2">
                  View approval
                </a>
                <button onClick={() => navigator.clipboard.writeText(String(approveTxHash))} className="ml-2 underline">
                  Copy TX
                </button>
              </div>
            ),
            open: true,
          })

          // wait for approval confirmation using publicClient
          let approved = false
          for (let i = 0; i < 40; i++) {
            // eslint-disable-next-line no-await-in-loop
            const receipt = await publicClient.getTransactionReceipt({ hash: approveTxHash as `0x${string}` })
            if (receipt && receipt.blockNumber) {
              approved = true
              break
            }
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 3000))
          }

          if (!approved) {
            toast({ title: "Approval timeout", description: "Approval not confirmed in time. Please check wallet and try again.", open: true })
            setIsSwapping(false)
            return
          }
        }
      }

      // Build quoter calldata for quoting amountOut
      // Check whether a V3 pool exists for this token pair and fee before calling the quoter
      try {
        const poolAddr = await publicClient.readContract({
          address: UNISWAP_CONTRACTS.V3.FACTORY as Address,
          abi: [
            {
              inputs: [
                { internalType: 'address', name: 'tokenA', type: 'address' },
                { internalType: 'address', name: 'tokenB', type: 'address' },
                { internalType: 'uint24', name: 'fee', type: 'uint24' },
              ],
              name: 'getPool',
              outputs: [{ internalType: 'address', name: 'pool', type: 'address' }],
              stateMutability: 'view',
              type: 'function',
            },
          ],
          functionName: 'getPool',
          args: [tokenInAddress as Address, tokenOut as Address, fee],
        })

        const pool = String(poolAddr)
        if (!pool || pool === '0x0000000000000000000000000000000000000000') {
          toast({ title: 'No pool found', description: `No Uniswap V3 pool found for ${fromToken.symbol}/${toToken.symbol} at the selected fee. Try a different fee or token pair.`, open: true })
          setIsSwapping(false)
          return
        }
      } catch (e) {
        // If factory check fails, continue to quoter but surface a friendly message on failure
      }

      const quoterCalldata = encodeFunctionData({
        abi: UNISWAP_V3_QUOTER_ABI,
        functionName: "quoteExactInputSingle",
        args: [tokenInAddress as `0x${string}`, tokenOut, fee, amountIn, BigInt(0)],
      })

      let quotedOut: bigint
      try {
        const quoteRes = await publicClient.call({
          to: quoterAddress as Address,
          data: quoterCalldata as `0x${string}`,
        })
        quotedOut = BigInt(quoteRes as any)
      } catch (e: any) {
        console.error('Quoter call failed', e)
        toast({ title: 'Quote failed', description: 'Failed to get a quote from Uniswap Quoter. This likely means no pool exists for the selected pair/fee, or the pool is uninitialized.', open: true })
        setIsSwapping(false)
        return
      }
      const slippageBps = BigInt(Math.round(slippagePct * 100))
      const amountOutMinimum = (quotedOut * (BigInt(10000) - slippageBps)) / BigInt(10000)

      // Build exactInputSingle params (needed for calldata before gas estimate)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 10)
      const exactInputParams = {
        tokenIn: tokenInAddress as `0x${string}`,
        tokenOut,
        fee: fee,
        recipient: address as `0x${string}`,
        deadline,
        amountIn,
        amountOutMinimum,
        sqrtPriceLimitX96: BigInt(0),
      }

      const routerCalldata = encodeFunctionData({
        abi: UNISWAP_V3_ROUTER_ABI,
        functionName: "exactInputSingle",
        args: [exactInputParams],
      })

      // estimate gas using publicClient.estimateGas if available
      let gasEstimate: bigint | null = null
      let gasCostWei: bigint | null = null
      let gasUsd: number | null = null
      if (publicClient) {
        try {
          const estimated = await publicClient.estimateGas({
            to: router as Address,
            data: routerCalldata as `0x${string}`,
            value: isNative ? amountIn : BigInt(0),
          })
          gasEstimate = BigInt(estimated as any)

          try {
            const gasPrice = await publicClient.getGasPrice()
            const gp = BigInt(gasPrice as any)
            gasCostWei = gasEstimate * gp
            setPreparedGasCostWei(gasCostWei)

            // Try to fetch ETH price in USD (CoinGecko) — graceful fallback on failure
            try {
              const res = await fetch(
                "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
              )
              if (res.ok) {
                const json = await res.json()
                const ethUsd = json?.ethereum?.usd
                if (typeof ethUsd === "number") {
                  gasUsd = Number(formatUnits(gasCostWei, 18)) * ethUsd
                  setPreparedGasUsd(gasUsd)
                }
              }
            } catch (e) {
              // ignore price fetch errors
            }
          } catch (e) {
            // ignore gas price failures
          }
        } catch (e) {
          // ignore gas estimate failures
          gasEstimate = null
        }
      }

  setPreparedQuote(quotedOut)
  setPreparedGas(gasEstimate)
      setShowConfirmModal(true)

      setIsSwapping(false)
      return
    } catch (error) {
      console.error("❌ Swap failed:", error)
      toast({ title: "Prepare failed", description: "Swap preparation failed. Check console for details.", open: true })
    } finally {
      setIsSwapping(false)
    }
  }

  // Execute swap after user confirms in modal
  const handleSwap = async () => {
    setShowConfirmModal(false)
    // reuse existing logic: perform approval and swap using walletClient
    // call prepareSwap internals by invoking same code path but with confirmation
    // For brevity, call prepareSwap then send the swap (we'll trigger wallet flow by calling writeContract)
    setIsSwapping(true)
    try {
      // Now actually perform swap: build exactInputParams and call wallet.writeContract
      // The prepareSwap stored necessary values (preparedQuote/preparedGas) in state for the modal; here we re-run minimal steps to execute the swap.
      const isNative = fromToken.address === "0x0000000000000000000000000000000000000000"
      const amountIn = isNative ? parseEther(fromAmount) : parseUnits(fromAmount, fromToken.decimals)
      const fee = selectedFee
      const weth = getWETHAddress()
      const tokenInAddress = isNative ? weth : (fromToken.address as `0x${string}`)
      const tokenOut = toToken.address as `0x${string}`
      const router = getUniswapV3Router()
      const publicClientLocal = publicClient
      if (!publicClientLocal || !walletClient?.data) throw new Error("Clients not available")
      const wallet = walletClient.data

      // handle approval if needed
      if (!isNative) {
        const allowanceCall = await publicClientLocal.readContract({
          address: fromToken.address as Address,
          abi: ERC20_ABI as any,
          functionName: "allowance",
          args: [address as Address, router as Address],
        })
        const allowance = BigInt(allowanceCall as any)
        if (allowance < amountIn) {
          await wallet.writeContract({
            address: fromToken.address as Address,
            abi: ERC20_ABI as any,
            functionName: "approve",
            args: [router as Address, amountIn],
          })
        }
      }

      const quoterCalldata = encodeFunctionData({
        abi: UNISWAP_V3_QUOTER_ABI,
        functionName: "quoteExactInputSingle",
        args: [tokenInAddress as `0x${string}`, tokenOut, fee, amountIn, BigInt(0)],
      })
      const quoteRes = await publicClientLocal.call({ to: UNISWAP_CONTRACTS.V3.QUOTER as Address, data: quoterCalldata as `0x${string}` })
      const quotedOut = BigInt(quoteRes as any)
      const slippageBps = BigInt(Math.round(slippagePct * 100))
      const amountOutMinimum = (quotedOut * (BigInt(10000) - slippageBps)) / BigInt(10000)

      const exactInputParams = {
        tokenIn: tokenInAddress as `0x${string}`,
        tokenOut,
        fee: fee,
        recipient: address as `0x${string}`,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 10),
        amountIn,
        amountOutMinimum,
        sqrtPriceLimitX96: BigInt(0),
      }

      const swapTx = await wallet.writeContract({
        address: router as Address,
        abi: UNISWAP_V3_ROUTER_ABI as any,
        functionName: "exactInputSingle",
        args: [exactInputParams as any],
        value: isNative ? amountIn : BigInt(0),
      })

      setTxHash(String(swapTx))
      setConfirmations(0)
      toast({ title: "Swap submitted", description: String(swapTx), open: true })
    } catch (e) {
      console.error(e)
      toast({ title: "Swap failed", description: "Swap failed during execution. Check console for details.", open: true })
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
                onClick={prepareSwap}
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

          {/* Inline Transaction Status Panel */}
          {txHash && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Transaction</span>
                  <a href={buildTxUrl(txHash)} target="_blank" rel="noreferrer" className="text-sm font-medium underline">
                    {txHash}
                  </a>
                </div>
                <div className="text-sm text-gray-600">
                  {confirmations > 0 ? `${confirmations} confirmation${confirmations > 1 ? 's' : ''}` : 'Pending'}
                </div>
              </div>
            </div>
          )}

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

          {/* Confirm Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Confirm Swap</h3>
                <div className="text-sm text-gray-700 space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Amount In</div>
                    <div className="font-medium">{fromAmount} {fromToken.symbol}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Estimated Out</div>
                    <div className="font-medium">{preparedQuote ? formatBigint(preparedQuote, toToken.decimals, 6) : "..."} {toToken.symbol}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Gas Estimate</div>
                    <div className="font-medium">
                      {preparedGas ? `${formatBigint(preparedGas, 0, 0)} gas` : "—"}
                      {preparedGasCostWei ? (
                        <span className="ml-2 text-sm text-gray-500">(~{formatBigint(preparedGasCostWei, 18, 6)} ETH{preparedGasUsd ? ` / $${preparedGasUsd.toFixed(4)}` : ""})</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <label className="text-xs text-gray-500">Slippage</label>
                    <Input disabled={isSwapping} type="number" value={slippagePct} onChange={(e) => setSlippagePct(Number(e.target.value))} className="w-24" />
                    <label className="text-xs text-gray-500">Fee</label>
                    <select disabled={isSwapping} aria-label="Fee tier" value={selectedFee} onChange={(e) => setSelectedFee(Number(e.target.value))} className="ml-2">
                      <option value={V3_FEE_TIERS.LOW}>0.05%</option>
                      <option value={V3_FEE_TIERS.MEDIUM}>0.3%</option>
                      <option value={V3_FEE_TIERS.HIGH}>1%</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setShowConfirmModal(false)} disabled={isSwapping}>Cancel</Button>
                  <Button onClick={handleSwap} className="bg-pink-500 text-white" disabled={isSwapping}>
                    {isSwapping ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm & Send"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}