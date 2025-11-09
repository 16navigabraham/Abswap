# Uniswap Contract Integration - Sepolia Testnet

## 🎯 Overview

This project is now configured with **Uniswap V2 and V3** contract addresses for Sepolia testnet. You can perform real token swaps on the Sepolia testnet.

## 📋 Contract Addresses

### Uniswap V2 (Sepolia)
- **Factory**: `0x7E0987E5b3a30e3f2828572Bb659A548460a3003`
- **Router**: `0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008`
- **WETH**: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`

### Uniswap V3 (Sepolia)
- **Factory**: `0x0227628f3F023bb0B980b67D528571c95c6DaC1c`
- **SwapRouter**: `0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E`
- **Quoter V2**: `0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3`
- **NFT Position Manager**: `0x1238536071E1c677A632429e3655c799b22cDA52`

### Token Addresses (Sepolia)
- **WETH**: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`
- **USDC**: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`
- **DAI**: `0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357`
- **USDT**: `0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0`
- **WBTC**: `0x29f2D40B0605204364af54EC677bD022dA425d03`

## 📁 File Structure

```
lib/
├── uniswap-contracts.ts   # Contract addresses and ABIs
├── swap-service.ts        # Swap logic and utilities
├── tokens.ts              # Token definitions
└── reown-config.ts        # Wagmi configuration

hooks/
└── use-swap.ts            # React hook for swaps
```

## 🚀 Quick Start

### 1. Get Sepolia ETH

You need Sepolia testnet ETH to pay for gas fees:

1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Or [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
3. Enter your wallet address
4. Receive test ETH (usually 0.5 ETH)

### 2. Get Test Tokens

To swap tokens, you need to get test tokens:

#### Option A: Use Faucets
- Some tokens have faucets where you can get free test tokens

#### Option B: Wrap ETH to WETH
```typescript
// WETH is wrapped ETH - you can wrap your Sepolia ETH
// Visit: https://sepolia.etherscan.io/address/0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14#writeContract
// Use the "deposit" function and send ETH
```

#### Option C: Use Uniswap to Swap
Once you have ETH or WETH, you can swap for other tokens on Uniswap Sepolia

### 3. Connect Your Wallet

```typescript
import { useSwap } from "@/hooks/use-swap"
import { useAccount } from "wagmi"

function SwapComponent() {
  const { address, isConnected } = useAccount()
  const { getQuote, executeSwap, quote } = useSwap()
  
  // ... rest of your component
}
```

## 💡 Usage Examples

### Get a Swap Quote

```typescript
import { useSwap } from "@/hooks/use-swap"
import { UNISWAP_CONTRACTS } from "@/lib/uniswap-contracts"

const { getQuote, quote } = useSwap()

// Get quote for swapping 1 WETH to USDC
await getQuote({
  tokenIn: UNISWAP_CONTRACTS.TOKENS.WETH,
  tokenOut: UNISWAP_CONTRACTS.TOKENS.USDC,
  amountIn: "1.0",
  version: "v2", // or "v3"
  slippageTolerance: 0.5, // 0.5%
})

console.log("Expected output:", quote?.amountOut)
```

### Execute a Swap

```typescript
import { useSwap } from "@/hooks/use-swap"

const { executeSwap, txHash, txUrl } = useSwap()

// Execute swap
await executeSwap({
  tokenIn: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // WETH
  tokenOut: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", // USDC
  amountIn: "0.1",
  version: "v2",
  slippageTolerance: 0.5,
  deadline: 20, // 20 minutes
})

if (txHash) {
  console.log("Transaction hash:", txHash)
  console.log("View on Etherscan:", txUrl)
}
```

### Approve Token

Before swapping ERC-20 tokens, you need to approve the Uniswap router:

```typescript
import { useSwap } from "@/hooks/use-swap"

const { approveToken, txHash } = useSwap()

// Approve WETH for swapping
await approveToken(
  "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // WETH address
  "1000000000000000000000" // Amount (1000 WETH with 18 decimals)
)

console.log("Approval tx:", txHash)
```

## 🔧 Configuration

### Uniswap Version

You can choose between Uniswap V2 and V3:

```typescript
// Use V2 (simpler, 0.3% fee)
await executeSwap({
  // ...
  version: "v2"
})

// Use V3 (more efficient, multiple fee tiers)
await executeSwap({
  // ...
  version: "v3",
  feeTier: 3000, // 0.30% (can be 100, 500, 3000, or 10000)
})
```

### Fee Tiers (V3 Only)

```typescript
import { V3_FEE_TIERS } from "@/lib/uniswap-contracts"

const feeTiers = {
  LOWEST: 100,   // 0.01% - for very stable pairs
  LOW: 500,      // 0.05% - for stable pairs
  MEDIUM: 3000,  // 0.30% - most common
  HIGH: 10000,   // 1.00% - for exotic pairs
}
```

### Slippage Tolerance

```typescript
// Set slippage tolerance (in percentage)
const slippageTolerance = 0.5  // 0.5%
const slippageTolerance = 1.0  // 1.0%
const slippageTolerance = 5.0  // 5.0% (for volatile tokens)
```

## 🎨 Integration with UI

### Update Swap Interface

The swap interface already uses the service, but here's how to enhance it:

```typescript
"use client"

import { useSwap } from "@/hooks/use-swap"
import { SEPOLIA_TOKENS } from "@/lib/tokens"

export function EnhancedSwapInterface() {
  const { getQuote, executeSwap, quote, isLoading, error } = useSwap()
  const [fromToken, setFromToken] = useState(SEPOLIA_TOKENS[0])
  const [toToken, setToToken] = useState(SEPOLIA_TOKENS[1])
  const [amount, setAmount] = useState("")

  // Get quote when amount changes
  useEffect(() => {
    if (amount && Number(amount) > 0) {
      getQuote({
        tokenIn: fromToken.address as `0x${string}`,
        tokenOut: toToken.address as `0x${string}`,
        amountIn: amount,
        version: "v2",
      })
    }
  }, [amount, fromToken, toToken])

  const handleSwap = async () => {
    await executeSwap({
      tokenIn: fromToken.address as `0x${string}`,
      tokenOut: toToken.address as `0x${string}`,
      amountIn: amount,
      version: "v2",
      slippageTolerance: 0.5,
    })
  }

  return (
    <div>
      <input 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.0"
      />
      
      {quote && (
        <div>
          Expected output: {quote.amountOut} {toToken.symbol}
        </div>
      )}

      <button onClick={handleSwap} disabled={isLoading}>
        {isLoading ? "Swapping..." : "Swap"}
      </button>

      {error && <div>Error: {error}</div>}
    </div>
  )
}
```

## 🔍 Verification

### Check Transactions on Etherscan

All transactions can be viewed on Sepolia Etherscan:
- Base URL: https://sepolia.etherscan.io
- Transaction: `https://sepolia.etherscan.io/tx/{txHash}`
- Address: `https://sepolia.etherscan.io/address/{address}`
- Token: `https://sepolia.etherscan.io/token/{tokenAddress}`

### Verify Contract Addresses

You can verify all contract addresses on Etherscan:

1. **Uniswap V2 Router**: https://sepolia.etherscan.io/address/0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008
2. **Uniswap V3 Router**: https://sepolia.etherscan.io/address/0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E
3. **WETH**: https://sepolia.etherscan.io/address/0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14

## 🐛 Troubleshooting

### "Insufficient Allowance" Error
- You need to approve the token first before swapping
- Use the `approveToken` function

### "Insufficient Balance" Error
- Make sure you have enough tokens in your wallet
- Check your balance on Sepolia Etherscan

### "Transaction Failed" Error
- Check if you have enough ETH for gas fees
- Increase slippage tolerance if swapping volatile tokens
- Try a smaller amount

### "Network Error"
- Make sure you're connected to Sepolia testnet
- Check your RPC connection in Reown config

## 📊 Gas Estimation

Typical gas costs on Sepolia:

| Operation | Gas Limit | Estimated Cost (ETH) |
|-----------|-----------|---------------------|
| Token Approval | ~50,000 | ~0.0005 ETH |
| V2 Swap | ~150,000 | ~0.0015 ETH |
| V3 Swap | ~180,000 | ~0.0018 ETH |

*Note: Sepolia gas prices are usually very low*

## 🔐 Security Notes

### For Production

When moving to mainnet, remember to:

1. **Update Contract Addresses** - Use mainnet addresses
2. **Add Slippage Protection** - Prevent MEV attacks
3. **Add Transaction Deadline** - Prevent stale transactions
4. **Check Price Impact** - Warn users of large price impacts
5. **Verify Tokens** - Use token lists to prevent scams
6. **Add Gas Estimation** - Show estimated costs
7. **Add Transaction Confirmation** - Double-check before execution

### Best Practices

```typescript
// ✅ Good
const slippage = 0.5 // 0.5%
const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes

// ❌ Bad
const slippage = 50 // 50% is too high!
const deadline = 9999999999 // No deadline protection
```

## 🚀 Next Steps

1. **Test with Small Amounts** - Start with small swaps (0.01 ETH)
2. **Monitor Gas Costs** - Check transaction costs on Etherscan
3. **Add Error Handling** - Improve user experience with better error messages
4. **Add Transaction History** - Track user's swap history
5. **Add Price Charts** - Show token price history
6. **Add Liquidity Features** - Allow users to add/remove liquidity

## 📚 Resources

- [Uniswap V2 Docs](https://docs.uniswap.org/contracts/v2/overview)
- [Uniswap V3 Docs](https://docs.uniswap.org/contracts/v3/overview)
- [Sepolia Etherscan](https://sepolia.etherscan.io)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)

## 💬 Support

Need help? Check:
- The `lib/uniswap-contracts.ts` file for all addresses
- The `lib/swap-service.ts` file for swap logic
- The `hooks/use-swap.ts` file for React integration

---

**Ready to swap!** 🎉 Start with small amounts on Sepolia testnet to test the integration.
