"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { useToast } from "@/hooks/use-toast"
import PixelBlast from "@/components/PixelBlast"
import CardNav from "@/components/card-nav"

export default function HomePage() {
  const [address, setAddress] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleWalletConnected = (addr: string) => {
    setAddress(addr)
    localStorage.setItem('user-address', addr) // Store for dashboard access
    toast({ title: "Wallet connected", description: addr })

    // Redirect to dashboard immediately after wallet connection
    setIsAuthenticated(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const navItems = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", href: "/about", ariaLabel: "About Company" },
        { label: "Features", href: "/features", ariaLabel: "Our Features" }
      ]
    },
    {
      label: "Projects",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", href: "/projects", ariaLabel: "Featured Projects" },
        { label: "Case Studies", href: "/case-studies", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Email", href: "/contact", ariaLabel: "Email us" },
        { label: "Support", href: "/support", ariaLabel: "Support" }
      ]
    }
  ]

  if (isAuthenticated) {
    return (
      <main className="w-full h-full bg-background text-foreground relative overflow-hidden">
        {/* Animated Background - Full Screen */}
        <div className="fixed inset-0 w-full h-full z-0">
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#5931DD"
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
          color="#5931DD"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
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

      {/* Card Navigation */}
      <CardNav
        items={navItems}
        baseColor="#f8f9fa"
        menuColor="#333"
        buttonBgColor="#000"
        buttonTextColor="#fff"
        ease="power3.out"
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-8 py-12 mt-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-8" style={{ fontFamily: 'sans-serif', color: 'white' }}>
            Get your decentralized data<br />
            storage today!
          </h1>

          {/* Connect Wallet Button */}
          <div className="flex justify-center">
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
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Section - For Future Use */}
      <div
        id="next-section"
        className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-8 py-12 bg-gradient-to-b from-transparent to-gray-900/20"
      >
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Next Section
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            This section is prepared for future content. The "Get Started" button in the navigation will smoothly scroll down to this area.
          </p>
          <div className="mt-8 p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <p className="text-white/60">
              🚀 Ready for future features and content!
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
