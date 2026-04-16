import { defineChain } from 'viem';
import { sepolia } from 'wagmi/chains';

export const hardhat = defineChain({
  id: 31337,
  name: 'Hardhat',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_HARDHAT_RPC_URL ?? 'http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'None', url: '' },
  },
  testnet: true,
});

export { sepolia };

export const supportedChains = [hardhat, sepolia] as const;
