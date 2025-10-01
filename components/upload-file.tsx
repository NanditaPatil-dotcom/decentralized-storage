"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract"
import { ethers } from "ethers"

declare global {
  interface Window {
    ethereum?: any
  }
}

type Props = {
  userAddress: string | null
}

export function UploadFile({ userAddress }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [txPending, setTxPending] = useState(false)
  const { toast } = useToast()

  async function handleUpload() {
    if (!userAddress) {
      toast({ title: "Connect your wallet first", variant: "destructive" })
      return
    }
    if (!file) {
      toast({ title: "No file selected", variant: "destructive" })
      return
    }
    try {
      setUploading(true)
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message || "Upload failed")
      }
      const data = (await res.json()) as { cid: string }
      const cid = data.cid
      toast({ title: "Uploaded to IPFS", description: cid })

      if (!window.ethereum) {
        throw new Error("MetaMask not available")
      }
      if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        throw new Error("Contract address not configured")
      }
      setTxPending(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tx = await contract.uploadFile(cid)
      await tx.wait()
      toast({ title: "Saved on-chain", description: `CID stored for ${userAddress}` })
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Something went wrong", variant: "destructive" })
    } finally {
      setUploading(false)
      setTxPending(false)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="file">Choose a file</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={uploading || txPending}
        />
      </div>
      <Button onClick={handleUpload} disabled={!file || uploading || txPending}>
        {uploading ? "Uploading to IPFS…" : txPending ? "Saving to blockchain…" : "Upload & Save"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Files are uploaded to IPFS via Pinata. The returned CID is written to the smart contract for your address.
      </p>
    </div>
  )
}
