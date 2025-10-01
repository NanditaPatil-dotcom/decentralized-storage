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
import PixelBlast from "@/components/PixelBlast"
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
      <main className="w-full h-full bg-background text-foreground relative overflow-hidden">
        {/* Animated Background - Full Screen */}
        <div className="fixed inset-0 w-full h-full z-0">
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#B19EEF"
            patternScale={3}
            patternDensity={1.2}
            pixelSizeJitter={0.5}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.6}
            edgeFade={0.25}
            transparent={false}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 min-h-dvh flex items-center justify-center">
          <Card className="w-full max-w-lg backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Accepted</h2>
                <p className="text-white/80 text-lg">
                Redirecting to the dashboard!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full h-full bg-background text-foreground relative overflow-hidden">
      {/* Animated Background - Full Screen */}
      <div className="fixed inset-0 w-full h-full z-0">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#B19EEF"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent={false}
        />
      </div>

      {/* Main Content */}
      <section className="w-full flex justify-between items-center min-h-[60vh] px-8 py-12">
        {/* Left Side - Title */}
        <div className="flex-1 max-w-2xl pr-8 mt-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg ml-10">
            Get your<br />
            decentralized data<br />
            storage today!
          </h1>
        </div>

        {/* Right Side - Main Card */}
        <div className="flex-1 max-w-xl flex justify-center mr-25 mt-12">
           <Card className="w-[550px] h-[530px] backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl mt-12">
            <CardContent className="space-y-8">
            {/* Wallet Connection */}
              <div className="text-center">
                <h3 className="font-bold text-xl text-white mb-3 flex items-center justify-center gap-2 mt-8">
                  Connect Your MetaMask Wallet
                </h3>

              {address ? (
                <div className="p-4 bg-white border rounded-lg">
                  <p className="text-sm text-black text-center font-medium">
                    Wallet Connected
                  </p>
                </div>
              ) : (
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4">
                  <WalletConnect
                    onConnected={handleWalletConnected}
                    onDisconnected={() => {
                      setAddress(null)
                      setShowJWTInput(false)
                    }}
                  />
                </div>
              )}
            </div>
             {/* JWT Configuration */}
             {address && (
                <div className="text-center">
                  <h3 className="font-bold text-xl text-white mb-3 flex items-center justify-center gap-2">
                    Configure Pinata JWT
                  </h3>

                {jwtConfigured ? (
                  <div className="p-4 bg-white border border-blue-300 rounded-lg">
                    <p className="text-sm text-black text-center font-medium">
                      Pinata JWT Configured
                    </p>
                  </div>
                ) : (
                    <PinataKeyInput />
                )}
              </div>
            )}

            {/* Enter Site Button */}
            {address && (
              <div className="pt-6 border-t border-white/10">
                <Button
                  onClick={handleEnterSite}
                  className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 px-8 rounded-xl text-lg shadow-lg border-2"
                  size="lg"
                  disabled={!jwtConfigured}
                >
                  {jwtConfigured ? "Entering the dashboard" : "Configure"}
                </Button>
              </div>
            )}

            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
