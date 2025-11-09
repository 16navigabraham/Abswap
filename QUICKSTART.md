# 🚀 Uniswap Integration Quick Start

## ✅ Setup Complete!

Your Abswap project now has full Uniswap V2/V3 integration for Sepolia testnet!

## 📦 What You Got

### Contract Addresses (Sepolia Testnet)

**Uniswap V2:**
- Router: `0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008`
- Factory: `0x7E0987E5b3a30e3f2828572Bb659A548460a3003`

**Uniswap V3:**
- SwapRouter: `0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E`
- Quoter: `0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3`

**Tokens:**
- WETH: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`
- USDC: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`
- DAI: `0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357`
- USDT: `0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0`
- WBTC: `0x29f2D40B0605204364af54EC677bD022dA425d03`

### New Files

1. **`lib/uniswap-contracts.ts`** - All contract addresses and ABIs
2. **`lib/swap-service.ts`** - Swap logic and utilities
3. **`hooks/use-swap.ts`** - React hook for easy integration
4. **`UNISWAP_SETUP.md`** - Complete documentation
5. **`UNISWAP_INTEGRATION.md`** - Integration guide

## 🎯 Quick Test

### 1. Get Test ETH
Visit: https://sepoliafaucet.com/

### 2. Run the App
```bash
pnpm dev
```

### 3. Connect Wallet
- Open http://localhost:3000
- Click "Connect Wallet"
- Select your wallet (MetaMask, etc.)

### 4. Check Console
When you interact with the swap interface, you'll see:
- Uniswap contract addresses
- Router information
- Transaction details

## 📖 Documentation

- **`UNISWAP_SETUP.md`** - Full setup guide with examples
- **`UNISWAP_INTEGRATION.md`** - Integration summary
- **`SETUP.md`** - Project setup
- **`MIGRATION_SUMMARY.md`** - Reown AppKit migration

## 💻 Usage Example

```typescript
import { useSwap } from "@/hooks/use-swap"

function MyComponent() {
  const { executeSwap, isLoading } = useSwap()

  const handleSwap = async () => {
    await executeSwap({
      tokenIn: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // WETH
      tokenOut: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", // USDC
      amountIn: "0.1",
      version: "v2",
      slippageTolerance: 0.5,
    })
  }

  return (
    <button onClick={handleSwap} disabled={isLoading}>
      Swap
    </button>
  )
}
```

## 🔗 Useful Links

- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Sepolia Etherscan**: https://sepolia.etherscan.io
- **WETH Contract**: https://sepolia.etherscan.io/address/0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14
- **Uniswap V2 Router**: https://sepolia.etherscan.io/address/0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008

## 🎨 Project Structure

```
Abswap/
├── lib/
│   ├── uniswap-contracts.ts  ← Contract addresses & ABIs
│   ├── swap-service.ts       ← Swap logic
│   ├── tokens.ts             ← Token definitions
│   └── reown-config.ts       ← Wallet configuration
├── hooks/
│   └── use-swap.ts           ← React hook for swaps
├── components/
│   ├── swap-interface.tsx    ← Main swap UI
│   └── ...
└── docs/
    ├── UNISWAP_SETUP.md      ← Full documentation
    └── UNISWAP_INTEGRATION.md
```

## ✨ Features

- ✅ Uniswap V2 & V3 support
- ✅ 6 tokens ready to swap (ETH, WETH, USDC, DAI, USDT, WBTC)
- ✅ Complete ABIs included
- ✅ React hooks for easy integration
- ✅ Etherscan integration
- ✅ TypeScript fully typed
- ✅ Production-ready architecture

## 🚀 Next Steps

1. **Get Sepolia ETH** from faucet
2. **Wrap ETH to WETH** (optional)
3. **Try swapping** in the UI
4. **Check transactions** on Etherscan
5. **Read full docs** in `UNISWAP_SETUP.md`

---

**Ready to swap!** 🎉
