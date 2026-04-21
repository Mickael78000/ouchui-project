import { useCallback } from 'react';
import { useReadContracts, useAccount } from 'wagmi';
import { type Address, formatUnits, parseUnits } from 'viem';
import { erc4626Abi, mockUsdcAbi, getAddresses } from '../../../shared/config/contracts';

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

  // Ensure userAddress is typed as Address when used
  const safeUserAddress = userAddress ?? ZERO_ADDR;

  const { data, isLoading: vaultLoading, isError: vaultError, refetch: refetchVault } = useReadContracts({
    contracts: [
      // ERC4626 vault state
      {
        address: vaultAddress,
        abi: erc4626Abi as any,
        functionName: 'totalAssets',
      },
      {
        address: vaultAddress,
        abi: erc4626Abi as any,
        functionName: 'totalSupply',
      },
      {
        address: vaultAddress,
        abi: erc4626Abi as any,
        functionName: 'balanceOf',
        args: [safeUserAddress as any],
      },
      {
        address: vaultAddress,
        abi: erc4626Abi as any,
        functionName: 'asset',
      },
      // Allowance - will be read separately after getting asset address
      // Preview functions (if amount provided)
      ...(parsedAmount > 0n
        ? [
            {
              address: vaultAddress,
              abi: erc4626Abi as any,
              functionName: 'previewDeposit',
              args: [parsedAmount],
            },
            {
              address: vaultAddress,
              abi: erc4626Abi as any,
              functionName: 'previewRedeem',
              args: [parsedAmount],
            },
            {
              address: vaultAddress,
              abi: erc4626Abi as any,
              functionName: 'previewWithdraw',
              args: [parsedAmount],
            },
            {
              address: vaultAddress,
              abi: erc4626Abi as any,
              functionName: 'convertToShares',
              args: [parsedAmount],
            },
            {
              address: vaultAddress,
              abi: erc4626Abi as any,
              functionName: 'convertToAssets',
              args: [parsedAmount],
            },
          ]
        : []),
    ],
    query: {
      enabled,
    },
  });

  const assetAddress = data?.[3]?.result as Address | undefined;
  const resolvedAsset = assetAddress ?? addresses?.mockUsdc ?? ZERO_ADDR;

  const { data: userTokenData, refetch: refetchUser } = useReadContracts({
    contracts: [
      {
        address: resolvedAsset,
        abi: mockUsdcAbi as any,
        functionName: 'balanceOf',
        args: [safeUserAddress as any],
      },
      {
        address: resolvedAsset,
        abi: mockUsdcAbi as any,
        functionName: 'allowance',
        args: [safeUserAddress as any, vaultAddress],
      },
    ],
    query: { enabled: enabled && resolvedAsset !== ZERO_ADDR },
  });

  const refetch = useCallback(() => {
    refetchVault();
    refetchUser();
  }, [refetchVault, refetchUser]);

  // Extract data with proper fallbacks
  const result = data?.map((item) => item.result) ?? [];

  const [
    totalAssets,
    totalSupply,
    userShareBalance,
    _asset,
    previewDeposit,
    previewRedeem,
    previewWithdraw,
    convertToShares,
    convertToAssets,
  ] = result;

  return {
    totalAssets: (totalAssets as bigint) ?? 0n,
    totalSupply: (totalSupply as bigint) ?? 0n,
    userUsdcBalance: (userTokenData?.[0]?.result as bigint) ?? 0n,
    userShareBalance: (userShareBalance as bigint) ?? 0n,
    allowance: (userTokenData?.[1]?.result as bigint) ?? 0n,
    previewDeposit: (previewDeposit as bigint) ?? 0n,
    previewRedeem: (previewRedeem as bigint) ?? 0n,
    previewWithdraw: (previewWithdraw as bigint) ?? 0n,
    convertToShares: (convertToShares as bigint) ?? 0n,
    convertToAssets: (convertToAssets as bigint) ?? 0n,
    assetAddress: assetAddress as Address | undefined,
    isLoading: vaultLoading,
    isError: vaultError,
    refetch,
  };
}

/** Format a bigint amount for display with proper decimal handling. */
export function fmt(amount: bigint): string {
  if (amount === 0n) return '0,0000';
  const str = formatUnits(amount, DECIMALS);
  // Ensure 4 decimal places
  const withDecimals = str.includes('.') ? str : `${str}.0000`;
  const parts = withDecimals.split('.');
  const integerPart = parts[0];
  let decimalPart = parts[1] || '0000';
  
  // Pad or truncate to exactly 4 decimal places
  decimalPart = decimalPart.padEnd(4, '0').slice(0, 4);
  
  // Add thousands separator (space) to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  return `${formattedInteger},${decimalPart}`;
}
