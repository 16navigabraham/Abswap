"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TOKENS, type Token } from "@/lib/tokens"

interface TokenSelectorProps {
  selectedToken: Token
  onTokenSelect: (token: Token) => void
  otherToken?: Token
}

export function TokenSelector({ selectedToken, onTokenSelect, otherToken }: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const filteredTokens = TOKENS.filter((token) => {
    const matchesSearch =
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())

    const isNotOtherToken = token.address !== otherToken?.address

    return matchesSearch && isNotOtherToken
  })

  const popularTokens = filteredTokens.filter((token) => token.isPopular)
  const otherTokens = filteredTokens.filter((token) => !token.isPopular)

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token)
    setIsOpen(false)
    setSearchQuery("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-gray-50 border-gray-200 hover:bg-gray-100">
          <img
            src={selectedToken.logoURI || "/placeholder.svg"}
            alt={selectedToken.symbol}
            className="w-6 h-6 rounded-full"
          />
          <span className="font-semibold">{selectedToken.symbol}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search name or paste address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {popularTokens.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Popular tokens</h3>
            <div className="space-y-1">
              {popularTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleTokenSelect(token)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <img src={token.logoURI || "/placeholder.svg"} alt={token.symbol} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-sm text-gray-500">0</span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">{token.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {otherTokens.length > 0 && (
          <div>
            {popularTokens.length > 0 && <div className="border-t my-4" />}
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {otherTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleTokenSelect(token)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <img src={token.logoURI || "/placeholder.svg"} alt={token.symbol} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-sm text-gray-500">0</span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">{token.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredTokens.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No tokens found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
