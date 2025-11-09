# 🚀 Abswap - Quick Start Guide

## ✅ Setup Complete!

Your Abswap project is now fully configured with:
- ✅ **Base Sepolia testnet**
- ✅ **Alchemy API** for real-time balance fetching
- ✅ **Reown AppKit** for wallet connection
- ✅ **Uniswap V3** contracts

## 🔑 Required: Add Your API Keys

### 1. Alchemy API Key
```env
# In .env.local
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
```

Get it from: https://dashboard.alchemy.com/
- Create app → Chain: **Base**, Network: **Base Sepolia**
- Copy API Key

### 2. Reown Project ID (Already Set)
```env
NEXT_PUBLIC_REOWN_PROJECT_ID=c34ad8c7c4853eb5e0c5daf9694b8657
```

## 🚀 Run the App

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## 🪙 Get Test Tokens

1. **Get Base Sepolia ETH**
   - https://www.alchemy.com/faucets/base-sepolia
   - https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

2. **Add Base Sepolia to MetaMask**
   - Network Name: Base Sepolia
   - RPC URL: `https://sepolia.base.org`
   - Chain ID: 84532
   - Currency: ETH
   - Block Explorer: https://sepolia.basescan.org

## 💻 Usage

### Fetch Wallet Balance

```typescript
import { useAlchemyBalance } from "@/hooks/use-alchemy-balance"

const { ethBalanceFormatted } = useAlchemyBalance()
// Returns: "1.5" ETH
```

### Fetch Token Balance

```typescript
import { useTokenBalance } from "@/hooks/use-alchemy-balance"

const { balanceFormatted, metadata } = useTokenBalance(
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // USDC
)
// Returns: "100.5 USDC"
```

## 🌐 Network Info

- **Network**: Base Sepolia
- **Chain ID**: 84532
- **Block Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.alchemy.com/faucets/base-sepolia

## 📋 Contract Addresses

### Uniswap V3 (Base Sepolia)
- **SwapRouter**: `0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4`
- **Quoter**: `0xC5290058841028F1614F3A6F0F5816cAd0df5E27`

### Tokens
- **WETH**: `0x4200000000000000000000000000000000000006`
- **USDC**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

## 📚 Documentation

- **`BASE_SEPOLIA_SETUP.md`** - Complete Alchemy integration guide
- **`UNISWAP_SETUP.md`** - Uniswap contract details
- **`SETUP.md`** - Project setup
- **`MIGRATION_SUMMARY.md`** - Reown AppKit migration

## 🎯 Features

- ✅ Real-time balance fetching via Alchemy
- ✅ Wallet connection with Reown AppKit
- ✅ 300+ wallets supported (MetaMask, Coinbase, etc.)
- ✅ Base Sepolia testnet
- ✅ Uniswap V3 integration
- ✅ Token metadata (name, symbol, decimals, logo)
- ✅ Gas price tracking

## 🔧 Project Structure

```
lib/
├── alchemy-service.ts      ← Alchemy API integration
├── wagmi-config.ts         ← Base Sepolia + Alchemy RPC
├── tokens.ts               ← Base Sepolia tokens
└── uniswap-contracts.ts    ← Uniswap V3 contracts

hooks/
├── use-alchemy-balance.ts  ← Balance fetching hooks
└── use-swap.ts             ← Swap functionality
```

## ✨ What's Working

1. **Wallet Connection** - Connect with MetaMask, Coinbase, etc.
2. **Balance Fetching** - Real-time ETH and token balances
3. **Token Metadata** - Automatic token info fetching
4. **Gas Tracking** - Current gas price monitoring
5. **Uniswap Integration** - V3 contracts ready

---

**Ready to swap on Base Sepolia!** 🎉
