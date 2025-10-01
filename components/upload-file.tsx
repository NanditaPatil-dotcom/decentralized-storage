"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract"
import { ethers } from "ethers"
import { hasEncryptedJWT } from "@/lib/jwt-crypto"

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
  const [cid, setCid] = useState<string | null>(null)
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

    // Get user's JWT from localStorage
    const userJwt = localStorage.getItem("pinata-jwt")
    if (!userJwt) {
      setShowPinataInput(true)
      toast({ title: "Pinata JWT required", description: "Please enter your Pinata JWT token first", variant: "destructive" })
      return
    }

    try {
      setUploading(true)
      const form = new FormData()
      form.append("file", file)
      form.append("jwt", userJwt)
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message || "Upload failed")
      }
      const data = (await res.json()) as { cid: string }
      const fileCid = data.cid
      setCid(fileCid)
      toast({ title: "Uploaded to IPFS", description: fileCid })

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
      const tx = await contract.uploadFile(fileCid)
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
      {cid && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium mb-2">File uploaded successfully!</p>
          <p className="text-xs text-muted-foreground mb-1">CID: {cid}</p>
          <a
            href={`https://gateway.pinata.cloud/ipfs/${cid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline"
          >
            View on IPFS Gateway
          </a>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Files are uploaded to IPFS via your Pinata account. The returned CID is written to the smart contract for your address.
      </p>
    </div>
  )
}
