# NFT (ERC-721) Live Indexer and Historical Backfill for EVM Chains

This is a tool for indexing NFTs on EVM chains.

## Features
- Live Tracker that subscribes to ownership changes and updates the index
- Historical backfill script that indexes all NFTs from a given block
- Bootstrapped with `pnpm`

## Usage
- `pnpm install`
- Check out package.json for available scripts

## Supported Chains
- All EVM chains as long as you have the JSON RPC URL

## Supported NFTs
- ERC-721

## Useful package
`npx typeorm-model-generator --help`

Sample usage to easily sync entities with db: 
`npx typeorm-model-generator -h <host IP> -d <db name> -p <port> -u <username> -x <password> -e postgres -o ./ --index true --generateConstructor --noConfig`
