"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { WalletConnect } from "@/components/wallet-connect"
import { UploadFile } from "@/components/upload-file"
import { FileList } from "@/components/file-list"
import { useToast } from "@/hooks/use-toast"

export default function Page() {
  const [address, setAddress] = useState<string | null>(null)
  const { toast } = useToast()

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="w-full border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-pretty">Decentralized File Storage</h1>
          <WalletConnect
            onConnected={(addr) => {
              setAddress(addr)
              toast({ title: "Wallet connected", description: addr })
            }}
            onDisconnected={() => {
              setAddress(null)
              toast({ title: "Wallet disconnected" })
            }}
          />
        </div>
      </header>

      <section className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Upload a File to IPFS</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadFile userAddress={address} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Your Files</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Files are uploaded to IPFS via Pinata. The resulting CID is saved on-chain under your address.
            </p>
            <Separator className="my-4" />
            <FileList userAddress={address} />
          </CardContent>
        </Card>
      </section>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground">
        </div>
      </footer>
    </main>
  )
}
