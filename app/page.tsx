"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WalletConnect } from "@/components/wallet-connect"
import { PinataKeyInput } from "@/components/pinata-key-input"
import { useToast } from "@/hooks/use-toast"
import { hasEncryptedJWT } from "@/lib/jwt-crypto"

export default function HomePage() {
  const [address, setAddress] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showJWTInput, setShowJWTInput] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [jwtConfigured, setJwtConfigured] = useState(false)

  // Listen for JWT configuration changes
  useEffect(() => {
    const checkJWT = () => {
      const hasJWT = hasEncryptedJWT()
      setJwtConfigured(hasJWT)
    }

    // Check immediately
    checkJWT()

    // Set up interval to check for changes (since PinataKeyInput saves to localStorage)
    const interval = setInterval(checkJWT, 500)

    return () => clearInterval(interval)
  }, [])

  const handleWalletConnected = (addr: string) => {
    setAddress(addr)
    localStorage.setItem('user-address', addr) // Store for dashboard access
    toast({ title: "Wallet connected", description: addr })

    // Check if JWT is also configured
    if (hasEncryptedJWT()) {
      setIsAuthenticated(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } else {
      setShowJWTInput(true)
    }
  }

  const handleJWTConfigured = () => {
    setJwtConfigured(true)
    if (address) {
      setIsAuthenticated(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    }
  }

  const handleEnterSite = () => {
    if (address && jwtConfigured) {
      setIsAuthenticated(true)
      router.push("/dashboard")
    } else if (!address) {
      toast({
        title: "Wallet required",
        description: "Please connect your MetaMask wallet first",
        variant: "destructive"
      })
    } else if (!jwtConfigured) {
      toast({
        title: "JWT required",
        description: "Please configure your Pinata JWT token first",
        variant: "destructive"
      })
    }
  }

  if (isAuthenticated) {
    return (
      <main className="min-h-dvh bg-background text-foreground flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600">Access Granted!</h2>
              <p className="text-muted-foreground">
                Redirecting to your dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <header className="w-full border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">Decentralized File Storage</h1>
          <p className="text-center text-muted-foreground mt-2">
            Securely upload files to IPFS using your own Pinata account
          </p>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-center">Welcome to Decentralized Storage</CardTitle>
            <p className="text-center text-muted-foreground">
              Connect your wallet and configure your Pinata JWT to get started
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wallet Connection */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Step 1: Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your MetaMask wallet to interact with the blockchain
                </p>
              </div>

              {address ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800 text-center">
                    ✅ Wallet Connected: {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                </div>
              ) : (
                <WalletConnect
                  onConnected={handleWalletConnected}
                  onDisconnected={() => {
                    setAddress(null)
                    setShowJWTInput(false)
                  }}
                />
              )}
            </div>

            {/* JWT Configuration */}
            {address && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Step 2: Configure Pinata JWT</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter your Pinata JWT token to upload files to IPFS
                  </p>
                </div>

                {jwtConfigured ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800 text-center">
                      ✅ Pinata JWT Configured
                    </p>
                  </div>
                ) : (
                  <PinataKeyInput />
                )}
              </div>
            )}

            {/* Enter Site Button */}
            {address && (
              <div className="pt-4 border-t">
                <Button
                  onClick={handleEnterSite}
                  className="w-full"
                  size="lg"
                  disabled={!jwtConfigured}
                >
                  {jwtConfigured ? "Enter Dashboard" : "Configure JWT First"}
                </Button>
                {jwtConfigured && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Ready to upload files to IPFS and save to blockchain
                  </p>
                )}
              </div>
            )}

            {/* Information */}
            <div className="pt-4 border-t space-y-2">
              <div className="text-sm space-y-1">
                <p className="font-medium">What you need:</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• MetaMask wallet connected to Polygon Amoy</li>
                  <li>• Pinata account with JWT token</li>
                  <li>• POL tokens for gas fees</li>
                </ul>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>
                  <strong>Privacy:</strong> Your JWT is encrypted locally and never stored on our servers.
                  Files are uploaded to your Pinata account, not ours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
