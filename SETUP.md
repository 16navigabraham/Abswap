# Abswap - Uniswap Clone with Reown AppKit

## ✅ Privy Removal Complete

All Privy SDK references have been successfully removed from the project. The application now uses **Reown AppKit** (formerly WalletConnect) for wallet connection.

## 🚀 Quick Start

### 1. Install Dependencies (Already Done)
```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
```

**Get your Project ID:**
1. Visit https://cloud.reown.com
2. Create a free account
3. Create a new project
4. Copy your Project ID
5. Paste it in `.env.local`

### 3. Run the Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 What Was Changed

### Removed
- ❌ `@privy-io/react-auth` package
- ❌ All Privy imports and hooks
- ❌ Privy provider configuration
- ❌ All references to Privy in code comments

### Added
- ✅ `@reown/appkit@^1.8.13`
- ✅ `@reown/appkit-adapter-wagmi@^1.8.13`
- ✅ Updated `wagmi` to v2.19.2
- ✅ Updated `viem` to v2.38.6
- ✅ Updated `typescript` to v5.9.3

### Created New Files
- `lib/reown-config.ts` - Reown AppKit configuration
- `.env.example` - Environment variable template
- `MIGRATION_SUMMARY.md` - Detailed migration documentation
- `SETUP.md` - This file

### Modified Files
- `app/providers.tsx` - Replaced Privy with Reown AppKit providers
- `app/page.tsx` - Using SwapInterface component
- `components/swap-modal.tsx` - Using wagmi hooks instead of Privy
- `components/swap-interface.tsx` - Updated logging and footer text
- `lib/wallet-service.ts` - Removed Privy reference in comment

## 🔧 Technology Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS + shadcn/ui
- **Wallet Connection**: Reown AppKit (WalletConnect)
- **Ethereum Library**: wagmi v2 + viem v2
- **Network**: Sepolia Testnet

## 🌐 Supported Wallets

With Reown AppKit, you get support for 300+ wallets including:

- MetaMask
- WalletConnect
- Coinbase Wallet
- Trust Wallet  
- Rainbow Wallet
- Ledger
- Trezor
- And many more...

## 📱 Features

- ✅ Modern wallet connection with Reown AppKit
- ✅ Token swapping interface (UI only - demo)
- ✅ Support for multiple ERC-20 tokens on Sepolia
- ✅ Beautiful gradient UI with shadcn components
- ✅ Responsive design
- ✅ Dark/Light theme support (via next-themes)

## 🔍 Project Structure

```
Abswap/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page with SwapInterface
│   ├── providers.tsx       # Reown AppKit & Wagmi providers
│   └── globals.css         # Global styles
├── components/
│   ├── swap-interface.tsx  # Main swap interface component
│   ├── swap-modal.tsx      # Alternative swap modal
│   ├── token-selector.tsx  # Token selection dropdown
│   ├── wallet-connection.tsx # Wallet connection UI
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── reown-config.ts     # Reown AppKit configuration
│   ├── tokens.ts           # Token definitions
│   ├── utils.ts            # Utility functions
│   └── wagmi-config.ts     # Wagmi configuration
├── data/
│   └── tokens.ts           # Token data
├── types/
│   └── wallet.ts           # TypeScript types
├── .env.local              # Environment variables (create this!)
└── .env.example            # Environment template
```

## 🎯 Next Steps

1. **Get your Reown Project ID** from https://cloud.reown.com
2. **Add it to `.env.local`**
3. **Run the app** with `pnpm dev`
4. **Connect your wallet** and test the swap interface

## 📚 Documentation

- [Reown AppKit Docs](https://docs.reown.com/appkit/overview)
- [Wagmi Docs](https://wagmi.sh/)
- [Viem Docs](https://viem.sh/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🐛 Troubleshooting

### "Invalid Project ID" Error
Make sure you've:
1. Created an account at https://cloud.reown.com
2. Created a project
3. Copied the Project ID correctly
4. Added it to `.env.local`
5. Restarted the dev server

### Wallet Not Connecting
- Make sure you have MetaMask or another Web3 wallet installed
- Check that you're on the correct network (Sepolia Testnet)
- Clear browser cache and try again

### Build Errors
```bash
# Clean install
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

## 🎨 Customization

### Add More Networks
Edit `lib/reown-config.ts`:
```typescript
import { mainnet, arbitrum } from 'wagmi/chains'

const chains = [sepolia, mainnet, arbitrum] as const
```

### Add More Tokens
Edit `data/tokens.ts` or `lib/tokens.ts`:
```typescript
export const SEPOLIA_TOKENS: Token[] = [
  // Add your token here
]
```

### Change Theme Colors
Edit `tailwind.config.ts` and `app/globals.css`.

## 📄 License

This is a demo project for educational purposes.

---

**Need help?** Check the [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) for more details about the migration from Privy to Reown AppKit.
