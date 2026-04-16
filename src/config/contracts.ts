import { type Address } from 'viem';
import { mockUsdcAbi } from '../contracts/MockUsdcAbi';
import { erc4626Abi } from '../contracts/ERC4626Abi';

export type ContractAddresses = {
  mockUsdc: Address;
  vaultT: Address;
  vaultD: Address;
  vaultMockYield: Address;
};

const addressesByChain: Record<number, ContractAddresses> = {
  11155111: {
    mockUsdc: '0x1DbA4d24ED6f691D2658D87EEe3D1e4Aff2867f6' as Address,
    vaultT: '0xde917990251927855D050D02B973a5e7eE3D3E2f' as Address,
    vaultD: '0x2515b8b5121C5C55Df77028E6729D0a9bC871cA2' as Address,
    vaultMockYield: '0x49362cf0a1Bc54801Ded60Fda5be2BCAefC03eb6' as Address,
  },
  31337: {
    mockUsdc: '0x9CAD4C0E7feF1C566d619aFAb3F89CA0aA88c526' as Address,
    vaultT: '0x3D4638846b1CEBA4c1D2bBA81b11827b6974D56D' as Address,
    vaultD: '0xB245AA1289604DF4522a5e7E271E10823415A139' as Address,
    vaultMockYield: '0x0000000000000000000000000000000000000000' as Address,
  },
};

export function getAddresses(chainId: number): ContractAddresses | undefined {
  return addressesByChain[chainId];
}

export { mockUsdcAbi, erc4626Abi };
