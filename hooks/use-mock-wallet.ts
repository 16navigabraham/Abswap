"use client"

import { useState, useCallback } from "react"

interface MockUser {
  id: string
  email?: string
  walletAddress?: string
  isAuthenticated: boolean
}

export function useMockWallet() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async () => {
    setIsLoading(true)

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockUser: MockUser = {
      id: `user_${Date.now()}`,
      email: "user@example.com",
      walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      isAuthenticated: true,
    }

    setUser(mockUser)
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return {
    user,
    authenticated: user?.isAuthenticated || false,
    ready: true,
    login,
    logout,
    isLoading,
  }
}
