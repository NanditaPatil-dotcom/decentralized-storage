# Decentralized File Storage DApp (Polygon Amoy)

A React + Next.js DApp that uploads files to IPFS via NFT.Storage and stores their CIDs on-chain using a Solidity contract deployed to Polygon Amoy (80002).

## Tech

- Next.js (App Router), Tailwind + shadcn/ui
- ethers.js + MetaMask
- IPFS via NFT.Storage (server-side API key usage)
- Solidity contract for user => CID[] mapping
- Optional deploy script with ethers + solc (no Hardhat required)

## Environment Variables (Project Settings → Environment Variables)

- NFT_STORAGE_API_KEY: your NFT.Storage API key (server only)
- NEXT_PUBLIC_CONTRACT_ADDRESS: deployed contract address on Amoy
- (for deploy script) PRIVATE_KEY: your MetaMask private key (test wallet)
- (for deploy script) ALCHEMY_RPC_URL: e.g. https://polygon-amoy.g.alchemy.com/v2/XXXX

## Deploy the Contract

Option A (in v0): Run the provided script.
- Open /scripts/deploy-contract.js in the Scripts panel and run it after setting PRIVATE_KEY and ALCHEMY_RPC_URL.
- Copy the printed address and set NEXT_PUBLIC_CONTRACT_ADDRESS.

Option B (Hardhat locally):
- Initialize Hardhat, add the contract from contracts/decentralized-storage.sol, and deploy to Amoy with your Alchemy RPC + PRIVATE_KEY.
- Set NEXT_PUBLIC_CONTRACT_ADDRESS to the deployed address.

## Usage

1. Set NFT_STORAGE_API_KEY and NEXT_PUBLIC_CONTRACT_ADDRESS in Project Settings.
2. Publish or open Preview.
3. Click "Connect Wallet" (MetaMask), ensure network is Polygon Amoy.
4. Choose a file and click "Upload & Save":
   - File is uploaded to NFT.Storage (server route protects your API key)
   - CID is saved to the contract via uploadFile(cid)
5. Your files list reads CIDs on-chain and provides "View" links via ipfs.io/ipfs/<CID>.

## Smart Contract ABI
Embedded in lib/contract.ts to enable frontend reads/writes.
