"use client"

import { useState, useEffect } from "react"
import { walletService, type WalletUser } from "@/lib/wallet-service"

export function useWallet() {
  const [user, setUser] = useState<WalletUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = walletService.subscribe(setUser)
    setUser(walletService.getUser())
    return unsubscribe
  }, [])

  const login = async () => {
    setIsLoading(true)
    try {
      await walletService.login()
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await walletService.logout()
  }

  return {
    user,
    isAuthenticated: walletService.isAuthenticated(),
    isLoading,
    login,
    logout,
  }
}
