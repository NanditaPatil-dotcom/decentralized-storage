import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file")
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: "Missing file" }, { status: 400 })
    }

    // Get Pinata credentials from environment
    const apiKey = process.env.PINATA_API_KEY
    const apiSecret = process.env.PINATA_API_SECRET
    const jwt = process.env.PINATA_JWT

    if (!apiKey || !apiSecret) {
      return NextResponse.json({
        message: "Pinata API credentials not configured. Please set PINATA_API_KEY and PINATA_API_SECRET in your .env file."
      }, { status: 500 })
    }

    // Upload to Pinata using JWT (recommended) or API key/secret
    const uploadForm = new FormData()
    uploadForm.append("file", file, (file as File).name)

    let authHeader = ""
    let endpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS"

    if (jwt) {
      // Use JWT authentication (recommended)
      authHeader = `Bearer ${jwt}`
      endpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    } else {
      // Fallback to API key/secret (deprecated but still works)
      authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
      endpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    }

    console.log('Uploading to Pinata...', { hasJwt: !!jwt, hasApiKey: !!apiKey })

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: uploadForm,
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Pinata upload error:', res.status, errorText)

      if (res.status === 401) {
        return NextResponse.json({
          message: "Pinata authentication failed. Please check your API credentials in the .env file.",
          details: errorText
        }, { status: 401 })
      }

      return NextResponse.json({
        message: `Pinata upload failed (${res.status}): ${errorText}`
      }, { status: 502 })
    }

    const data = await res.json()
    console.log('Pinata response:', data)

    // Pinata returns the IPFS hash in the IpfsHash field
    const cid = data?.IpfsHash
    if (!cid) {
      return NextResponse.json({
        message: "CID not found in Pinata response",
        response: data
      }, { status: 502 })
    }

    return NextResponse.json({ cid })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({
      message: err?.message || "Unexpected error during upload",
      error: err.toString()
    }, { status: 500 })
  }
}
