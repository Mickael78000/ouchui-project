import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { hardhat, sepolia } from './config/chains';

export const config = getDefaultConfig({
  appName: 'OUCHUI Vaults',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? 'dummy-project-id',
  chains: [sepolia, hardhat],
  transports: {
    [hardhat.id]: http(
      process.env.NEXT_PUBLIC_HARDHAT_RPC_URL ?? 'http://127.0.0.1:8545'
    ),
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ?? 'https://rpc.sepolia.org'
    ),
  },
  ssr: true,
});
