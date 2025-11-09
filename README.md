# Abswap - Uniswap Clone

A decentralized exchange (DEX) interface clone built with Next.js, TypeScript, and Reown AppKit for wallet connectivity.

## Features

- 🔄 Token swapping interface
- 💼 Multi-wallet support via Reown AppKit (WalletConnect, MetaMask, Coinbase Wallet, etc.)
- 🌐 Sepolia testnet support
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- ⚡ Built with Next.js 15 and React 19

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Abswap
```

2. Install dependencies:
```bash
pnpm install
```

3. Get your Reown Project ID:
   - Visit [cloud.reown.com](https://cloud.reown.com)
   - Create a new project
   - Copy your Project ID

4. Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Wallet Connection

This project uses **Reown AppKit** (formerly WalletConnect Web3Modal) for wallet connectivity. It supports:

- MetaMask
- WalletConnect-compatible wallets
- Coinbase Wallet
- Injected wallets
- And many more!

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Wallet Integration**: Reown AppKit
- **Blockchain Interaction**: Wagmi + Viem
- **State Management**: TanStack Query

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main swap interface
│   ├── layout.tsx         # Root layout
│   └── providers.tsx      # App providers (Wagmi, QueryClient)
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── swap-interface.tsx
│   ├── token-selector.tsx
│   └── wallet-connection.tsx
├── lib/                  # Utility functions and configs
│   ├── wagmi-config.ts  # Wagmi and AppKit configuration
│   ├── tokens.ts        # Token definitions
│   └── utils.ts         # Helper functions
├── data/                # Data files
│   └── tokens.ts        # Token list
└── types/               # TypeScript type definitions
    └── wallet.ts
```

## Configuration

### Wagmi Configuration (`lib/wagmi-config.ts`)

The Wagmi configuration includes:
- Network setup (Sepolia testnet, Mainnet)
- Reown AppKit initialization
- Storage configuration
- Metadata for your app

### Supported Networks

Currently configured networks:
- Ethereum Sepolia Testnet
- Ethereum Mainnet

You can add more networks by editing `lib/wagmi-config.ts`.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Environment Variables

- `NEXT_PUBLIC_REOWN_PROJECT_ID` - Your Reown project ID (required)

## Resources

- [Reown AppKit Documentation](https://docs.reown.com/appkit/overview)
- [Wagmi Documentation](https://wagmi.sh)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
