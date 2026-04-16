import { useState, useCallback } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { type Address, parseUnits, maxUint256 } from 'viem';
import { erc4626Abi, mockUsdcAbi } from '../config/contracts';

const DECIMALS = 6;

function parseAmount(amount: string): bigint {
  const n = parseFloat(amount);
  if (!amount || isNaN(n) || n <= 0) throw new Error('Invalid amount');
  return parseUnits(amount, DECIMALS);
}

/** Extract a human-readable reason from a contract revert or wallet error. */
export function parseActionError(e: unknown): string {
  if (!(e instanceof Error)) return String(e);
  const msg = e.message;

  // User rejected in wallet
  if (msg.includes('User rejected') || msg.includes('user rejected'))
    return 'Transaction rejected by user.';

  // Try to extract a revert reason string
  const revertMatch = msg.match(/reason:\s*"?([^"]+)"?/i)
    ?? msg.match(/reverted with reason string '([^']+)'/i)
    ?? msg.match(/execution reverted:\s*(.+?)(?:\n|$)/i);
  if (revertMatch?.[1]) return `Contract reverted: ${revertMatch[1].trim()}`;

  // Insufficient funds
  if (msg.includes('insufficient funds'))
    return 'Insufficient funds for gas.';

  // Generic but bounded
  return msg.length > 250 ? msg.slice(0, 250) + '…' : msg;
}

export type TxStatus = 'idle' | 'signing' | 'confirming' | 'confirmed' | 'error';

export interface VaultActionsState {
  status: TxStatus;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  txHash: `0x${string}` | undefined;
  approve: (assetAddress: Address, vaultAddress: Address, amount?: string) => Promise<void>;
  deposit: (vaultAddress: Address, amount: string) => Promise<void>;
  mint: (vaultAddress: Address, amount: string) => Promise<void>;
  withdraw: (vaultAddress: Address, amount: string) => Promise<void>;
  redeem: (vaultAddress: Address, amount: string) => Promise<void>;
  reset: () => void;
}

export function useVaultActions(): VaultActionsState {
  const { address: userAddress } = useAccount();
  const config = useConfig();

  const [status, setStatus] = useState<TxStatus>('idle');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const reset = useCallback(() => {
    setStatus('idle');
    setTxHash(undefined);
  }, []);

  /** Send a write transaction and wait for on-chain receipt before resolving. */
  const sendAndWait = useCallback(
    async (params: Parameters<typeof writeContract>[1]) => {
      setStatus('signing');
      setTxHash(undefined);

      try {
        const hash = await writeContract(config, params);
        setTxHash(hash);
        setStatus('confirming');

        await waitForTransactionReceipt(config, { hash, confirmations: 1 });
        setStatus('confirmed');
      } catch (e) {
        setStatus('error');
        throw e;
      }
    },
    [config]
  );

  const approve = useCallback(
    async (assetAddress: Address, vaultAddress: Address, amount?: string) => {
      const allowance = amount ? parseAmount(amount) : maxUint256;
      await sendAndWait({
        address: assetAddress,
        abi: mockUsdcAbi,
        functionName: 'approve',
        args: [vaultAddress, allowance],
      });
    },
    [sendAndWait]
  );

  const deposit = useCallback(
    async (vaultAddress: Address, amount: string) => {
      if (!userAddress) throw new Error('Wallet not connected');
      const assets = parseAmount(amount);
      await sendAndWait({
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'deposit',
        args: [assets, userAddress],
      });
    },
    [userAddress, sendAndWait]
  );

  const mint = useCallback(
    async (vaultAddress: Address, amount: string) => {
      if (!userAddress) throw new Error('Wallet not connected');
      const shares = parseAmount(amount);
      await sendAndWait({
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'mint',
        args: [shares, userAddress],
      });
    },
    [userAddress, sendAndWait]
  );

  const withdraw = useCallback(
    async (vaultAddress: Address, amount: string) => {
      if (!userAddress) throw new Error('Wallet not connected');
      const assets = parseAmount(amount);
      await sendAndWait({
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'withdraw',
        args: [assets, userAddress, userAddress],
      });
    },
    [userAddress, sendAndWait]
  );

  const redeem = useCallback(
    async (vaultAddress: Address, amount: string) => {
      if (!userAddress) throw new Error('Wallet not connected');
      const shares = parseAmount(amount);
      await sendAndWait({
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: 'redeem',
        args: [shares, userAddress, userAddress],
      });
    },
    [userAddress, sendAndWait]
  );

  return {
    status,
    isPending: status === 'signing' || status === 'confirming',
    isSuccess: status === 'confirmed',
    isError: status === 'error',
    txHash,
    approve,
    deposit,
    mint,
    withdraw,
    redeem,
    reset,
  };
}
