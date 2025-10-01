"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function PinataKeyInput() {
  const [jwt, setJwt] = useState("")
  const [saved, setSaved] = useState(false)
  const { toast } = useToast()

  // Load saved JWT from localStorage on component mount
  useEffect(() => {
    const savedJwt = localStorage.getItem("pinata-jwt")
    if (savedJwt) {
      setJwt(savedJwt)
      setSaved(true)
    }
  }, [])

  const handleSave = () => {
    if (!jwt.trim()) {
      toast({ title: "Please enter a valid JWT token", variant: "destructive" })
      return
    }

    // Basic JWT format validation (should start with eyJ)
    if (!jwt.startsWith("eyJ")) {
      toast({ title: "Invalid JWT format", description: "JWT should start with 'eyJ'", variant: "destructive" })
      return
    }

    localStorage.setItem("pinata-jwt", jwt)
    setSaved(true)
    toast({ title: "JWT saved successfully", description: "Your Pinata JWT has been saved locally" })
  }

  const handleClear = () => {
    localStorage.removeItem("pinata-jwt")
    setJwt("")
    setSaved(false)
    toast({ title: "JWT cleared", description: "Your saved JWT has been removed" })
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="pinata-jwt">Pinata JWT Token</Label>
        <Input
          id="pinata-jwt"
          type="password"
          placeholder="Enter your Pinata JWT token"
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Your JWT is stored locally in your browser and never sent to our servers.
          Get your JWT from{" "}
          <a
            href="https://app.pinata.cloud/developers/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Pinata Dashboard
          </a>
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!jwt.trim()}>
          {saved ? "Update JWT" : "Save JWT"}
        </Button>
        {saved && (
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
