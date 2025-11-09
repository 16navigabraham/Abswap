# 🚀 Base Sepolia + Alchemy Integration Complete!

## ✅ What's Been Set Up

Your Abswap project is now configured to use **Base Sepolia testnet** with **Alchemy** for fetching real-time wallet balances!

## 📦 New Files Created

1. **`lib/alchemy-service.ts`** - Alchemy API integration
   - Get ETH balance
   - Get ERC20 token balances
   - Get token metadata (name, symbol, decimals, logo)
   - Get all token balances for a wallet
   - Get transaction count
   - Get current gas price

2. **`hooks/use-alchemy-balance.ts`** - React hooks for balances
   - `useAlchemyBalance()` - Main hook for fetching balances
   - `useTokenBalance()` - Hook for specific token balance
   - Auto-refresh on wallet connection
   - Loading states and error handling

## 🔧 Updated Files

1. **`lib/wagmi-config.ts`**
   - Changed from Ethereum Sepolia to **Base Sepolia**
   - Added Alchemy RPC configuration
   - Chain ID: **84532**

2. **`lib/tokens.ts`**
   - Updated to Base Sepolia token addresses
   - WETH: `0x4200000000000000000000000000000000000006`
   - USDC: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

3. **`lib/uniswap-contracts.ts`**
   - Updated to Base Sepolia Uniswap V3 contracts
   - SwapRouter: `0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4`
   - Quoter: `0xC5290058841028F1614F3A6F0F5816cAd0df5E27`
   - Factory: `0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24`

4. **`.env.local`** and **`.env.example`**
   - Added `NEXT_PUBLIC_ALCHEMY_API_KEY` placeholder

## 🔑 Get Your Alchemy API Key

### Step 1: Create Alchemy Account
1. Visit https://dashboard.alchemy.com/
2. Sign up for a free account
3. Click "Create New App"

### Step 2: Configure Your App
- **Chain**: Base
- **Network**: Base Sepolia (testnet)
- **Name**: Abswap (or any name you like)

### Step 3: Get Your API Key
1. Click on your app
2. Click "API Keys" tab
3. Copy the API Key
4. Add it to your `.env.local` file:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_api_key_here
```

## 💻 Usage Examples

### Get ETH Balance

```typescript
import { useAlchemyBalance } from "@/hooks/use-alchemy-balance"

function MyComponent() {
  const { ethBalanceFormatted, isLoadingETH } = useAlchemyBalance()

  return (
    <div>
      {isLoadingETH ? "Loading..." : `Balance: ${ethBalanceFormatted} ETH`}
    </div>
  )
}
```

### Get Token Balance

```typescript
import { useTokenBalance } from "@/hooks/use-alchemy-balance"

function TokenBalanceComponent() {
  const tokenAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // USDC
  const { balanceFormatted, metadata, isLoading } = useTokenBalance(tokenAddress)

  return (
    <div>
      {isLoading ? "Loading..." : `${balanceFormatted} ${metadata.symbol}`}
    </div>
  )
}
```

### Get All Token Balances

```typescript
import { useAlchemyBalance } from "@/hooks/use-alchemy-balance"

function AllBalances() {
  const { tokenBalances, refreshTokenBalances } = useAlchemyBalance()

  useEffect(() => {
    refreshTokenBalances() // Fetch all tokens
  }, [])

  return (
    <div>
      {tokenBalances.map((token) => (
        <div key={token.contractAddress}>
          {token.symbol}: {token.tokenBalanceFormatted}
        </div>
      ))}
    </div>
  )
}
```

### Direct Alchemy Service Usage

```typescript
import { alchemyService } from "@/lib/alchemy-service"

// Get ETH balance
const balance = await alchemyService.getETHBalance("0x...")
console.log("ETH Balance:", balance.balanceFormatted)

// Get token balance
const tokenBalance = await alchemyService.getTokenBalance(
  "0x...", // wallet address
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // USDC token
)

// Get token metadata
const metadata = await alchemyService.getTokenMetadata(
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
)
console.log("Token:", metadata.name, metadata.symbol, metadata.decimals)

// Get all token balances
const allBalances = await alchemyService.getAllTokenBalances("0x...")

// Get gas price
const gasPrice = await alchemyService.getGasPrice()
console.log("Gas Price:", gasPrice, "Gwei")
```

## 🌐 Base Sepolia Network Info

- **Chain ID**: 84532
- **RPC URL**: `https://sepolia.base.org`
- **Block Explorer**: https://sepolia.basescan.org
- **Alchemy RPC**: `https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

## 🪙 Get Test Tokens

### 1. Get Base Sepolia ETH

Visit Base Sepolia faucets:
- **Official Base Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- **Alchemy Faucet**: https://www.alchemy.com/faucets/base-sepolia
- **QuickNode Faucet**: https://faucet.quicknode.com/base/sepolia

### 2. Bridge from Ethereum Sepolia

If you have Ethereum Sepolia ETH:
1. Visit https://bridge.base.org/deposit
2. Connect wallet and switch to Sepolia
3. Bridge ETH to Base Sepolia

### 3. Wrap ETH to WETH

WETH Contract: `0x4200000000000000000000000000000000000006`

Visit on Basescan and use the `deposit` function:
https://sepolia.basescan.org/address/0x4200000000000000000000000000000000000006#writeContract

## 🚀 Testing

### 1. Start the App

```bash
pnpm dev
```

### 2. Connect Your Wallet

- Make sure MetaMask is set to **Base Sepolia** network
- Click "Connect Wallet"
- Approve the connection

### 3. Check Console

Open browser console (F12) to see:
- ✅ Alchemy API calls
- ✅ ETH balance fetched
- ✅ Token balances
- ✅ Transaction logs

## 📊 Alchemy Features Available

### Balance Queries
- ✅ `getETHBalance()` - Get ETH balance
- ✅ `getTokenBalance()` - Get ERC20 token balance  
- ✅ `getAllTokenBalances()` - Get all token balances
- ✅ `getTokenBalanceWithMetadata()` - Balance + metadata

### Token Information
- ✅ `getTokenMetadata()` - Name, symbol, decimals, logo

### Network Information
- ✅ `getTransactionCount()` - Get nonce
- ✅ `getGasPrice()` - Current gas price

## 🎯 Integration with Swap Interface

To integrate with your swap interface:

```typescript
"use client"

import { useAlchemyBalance, useTokenBalance } from "@/hooks/use-alchemy-balance"
import { SEPOLIA_TOKENS } from "@/lib/tokens"

export function SwapInterface() {
  const { ethBalanceFormatted } = useAlchemyBalance()
  const { balanceFormatted: usdcBalance } = useTokenBalance(
    "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // USDC
  )

  return (
    <div>
      {/* Show real balances */}
      <div>ETH Balance: {ethBalanceFormatted}</div>
      <div>USDC Balance: {usdcBalance}</div>
    </div>
  )
}
```

## 🔍 Verification

### Check Your Balances on Basescan

- **Your Wallet**: https://sepolia.basescan.org/address/YOUR_ADDRESS
- **WETH**: https://sepolia.basescan.org/address/0x4200000000000000000000000000000000000006
- **USDC**: https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e

### Alchemy Dashboard

Monitor your API usage:
- Visit https://dashboard.alchemy.com/
- Click on your app
- View requests, response times, and more

## 📈 Alchemy Free Tier

- **Requests**: 300M compute units/month
- **Rate Limit**: 330 requests/second
- **WebSockets**: Included
- **Archive Data**: 3 months
- **More than enough for development and testing!**

## 🎨 UI Components

The balance data integrates seamlessly with your existing components:

```typescript
// In your swap interface
const { ethBalanceFormatted, refreshETHBalance } = useAlchemyBalance()

// Display in UI
<span>Balance: {ethBalanceFormatted} ETH</span>

// Refresh after swap
await refreshETHBalance()
```

## 🐛 Troubleshooting

### "API key not set" warning
Add your Alchemy API key to `.env.local`:
```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key_here
```

### "Failed to fetch balance" error
- Check your Alchemy API key is correct
- Verify you're connected to Base Sepolia
- Check Alchemy dashboard for rate limits

### Wrong network
- Make sure MetaMask is on Base Sepolia (Chain ID: 84532)
- Add Base Sepolia network manually if needed

### No balance showing
- Make sure you have test ETH on Base Sepolia
- Try refreshing: `refreshETHBalance()`
- Check wallet address in console logs

## 🔐 Security Notes

- ✅ API keys are public (it's a read-only key)
- ✅ Rate limiting handled by Alchemy
- ✅ No private keys exposed
- ✅ All requests are client-side

## 📚 Resources

- [Alchemy Docs](https://docs.alchemy.com/)
- [Base Sepolia Docs](https://docs.base.org/guides/using-base-testnet/)
- [Basescan](https://sepolia.basescan.org/)
- [Base Bridge](https://bridge.base.org/)
- [Base Faucet](https://www.alchemy.com/faucets/base-sepolia)

## ✨ What's Next?

1. **Add your Alchemy API key** to `.env.local`
2. **Get Base Sepolia ETH** from faucet
3. **Connect your wallet** in the app
4. **See real-time balances** fetched via Alchemy
5. **Test token swaps** on Base Sepolia

---

**Ready to use Base Sepolia with Alchemy! 🚀**

Your balances will be fetched in real-time from the blockchain via Alchemy's infrastructure!
