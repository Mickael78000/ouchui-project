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
    mockUsdc: '0x5561791E7Edb27640766A38f701757952Da1ddB5' as Address,
    vaultT: '0x66399b7361315720A52604d791a04DA4D652F45C' as Address,
    vaultD: '0xd6CC0227Fe2813049bf87203498Eb8971AB47965' as Address,
    vaultMockYield: '0x4eA6E1cBc40B13873e314db5148d85107c70F689' as Address,
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
