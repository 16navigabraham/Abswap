"use client"

// Mock wallet service that simulates Privy functionality
export interface WalletUser {
  id: string
  email?: string
  walletAddress?: string
  isAuthenticated: boolean
}

class WalletService {
  private user: WalletUser | null = null
  private listeners: Array<(user: WalletUser | null) => void> = []

  subscribe(callback: (user: WalletUser | null) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.user))
  }

  async login(): Promise<void> {
    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    this.user = {
      id: `user_${Date.now()}`,
      email: "user@example.com",
      walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      isAuthenticated: true,
    }

    this.notify()
  }

  async logout(): Promise<void> {
    this.user = null
    this.notify()
  }

  getUser(): WalletUser | null {
    return this.user
  }

  isAuthenticated(): boolean {
    return this.user?.isAuthenticated ?? false
  }
}

export const walletService = new WalletService()
