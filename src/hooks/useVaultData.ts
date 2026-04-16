import { useCallback } from 'react';
import { useReadContracts, useAccount } from 'wagmi';
import { type Address, formatUnits, parseUnits } from 'viem';
import { erc4626Abi, mockUsdcAbi, getAddresses } from '../config/contracts';

const DECIMALS = 6;
const ZERO_ADDR = '0x0000000000000000000000000000000000000000' as const;

export interface VaultData {
  totalAssets: bigint;
  totalSupply: bigint;
  userUsdcBalance: bigint;
  userShareBalance: bigint;
  allowance: bigint;
  previewDeposit: bigint;
  previewRedeem: bigint;
  previewWithdraw: bigint;
  convertToShares: bigint;
  convertToAssets: bigint;
  assetAddress: Address | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useVaultData(
  vaultAddress: Address,
  previewAmount: string
): VaultData {
  const { address: userAddress, chainId } = useAccount();
  const addresses = chainId ? getAddresses(chainId) : undefined;

  const parsedAmount = (() => {
    try {
      const n = parseFloat(previewAmount);
      if (!previewAmount || isNaN(n) || n <= 0) return 0n;
      return parseUnits(previewAmount, DECIMALS);
    } catch {
      return 0n;
    }
  })();

  const enabled =
    !!userAddress &&
    !!addresses &&
    vaultAddress !== ZERO_ADDR;

  const { data, isLoading: vaultLoading, isError: vaultError, refetch: refetchVault } = useReadContracts({
    contracts: [
      {
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'totalAssets',
      },
      {
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'totalSupply',
      },
      {
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'balanceOf',
        args: [userAddress!],
      },
      {
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'asset',
      },
      {
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'previewDeposit',
        args: [parsedAmount],
      },
      {
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'previewRedeem',
        args: [parsedAmount],
      },
      {
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'previewWithdraw',
        args: [parsedAmount],
      },
      {
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'convertToShares',
        args: [parsedAmount],
      },
      {
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'convertToAssets',
        args: [parsedAmount],
      },
    ],
    query: { enabled },
  });

  const assetAddress = data?.[3]?.result as Address | undefined;
  const resolvedAsset = assetAddress ?? addresses?.mockUsdc ?? ZERO_ADDR;

  const { data: userTokenData, refetch: refetchUser } = useReadContracts({
    contracts: [
      {
        address: resolvedAsset,
        abi: mockUsdcAbi,
        functionName: 'balanceOf',
        args: [userAddress!],
      },
      {
        address: resolvedAsset,
        abi: mockUsdcAbi,
        functionName: 'allowance',
        args: [userAddress!, vaultAddress],
      },
    ],
    query: { enabled: enabled && resolvedAsset !== ZERO_ADDR },
  });

  const refetch = useCallback(() => {
    refetchVault();
    refetchUser();
  }, [refetchVault, refetchUser]);

  return {
    totalAssets: (data?.[0]?.result as bigint | undefined) ?? 0n,
    totalSupply: (data?.[1]?.result as bigint | undefined) ?? 0n,
    userShareBalance: (data?.[2]?.result as bigint | undefined) ?? 0n,
    assetAddress,
    previewDeposit: (data?.[4]?.result as bigint | undefined) ?? 0n,
    previewRedeem: (data?.[5]?.result as bigint | undefined) ?? 0n,
    previewWithdraw: (data?.[6]?.result as bigint | undefined) ?? 0n,
    convertToShares: (data?.[7]?.result as bigint | undefined) ?? 0n,
    convertToAssets: (data?.[8]?.result as bigint | undefined) ?? 0n,
    userUsdcBalance: (userTokenData?.[0]?.result as bigint | undefined) ?? 0n,
    allowance: (userTokenData?.[1]?.result as bigint | undefined) ?? 0n,
    isLoading: vaultLoading,
    isError: vaultError,
    refetch,
  };
}

export function fmt(value: bigint, decimals = DECIMALS, digits = 4): string {
  return parseFloat(formatUnits(value, decimals)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}
