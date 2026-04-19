import { useState, useCallback, useEffect } from 'react';
import { type Address, parseUnits } from 'viem';
import { useChainId } from 'wagmi';
import { useVaultData, fmt } from '../hooks/useVaultData';
import { useVaultActions, parseActionError } from '../hooks/useVaultActions';
import { getAddresses } from '../../../shared/config/contracts';
import { AmountInput } from '../../../shared/ui/AmountInput';
import { TransactionFeedback } from './TransactionFeedback';

const DECIMALS = 6;

interface DepositPanelProps {
  vaultAddress: Address;
  vaultName: string;
}

export function DepositPanel({ vaultAddress, vaultName }: DepositPanelProps) {
  const chainId = useChainId();
  const addresses = getAddresses(chainId);

  const [amount, setAmount] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const {
    userUsdcBalance,
    allowance,
    previewDeposit,
    isLoading,
    refetch,
  } = useVaultData(vaultAddress, amount);

  const actions = useVaultActions();
  const resolvedAsset = addresses?.mockUsdc;

  // Parse amount safely
  const parsedAmount = (() => {
    try {
      const n = parseFloat(amount);
      if (!amount || isNaN(n) || n <= 0) return 0n;
      return parseUnits(amount, DECIMALS);
    } catch {
      return 0n;
    }
  })();

  const needsApproval = parsedAmount > 0n && allowance < parsedAmount;
  const exceedsBalance = parsedAmount > 0n && parsedAmount > userUsdcBalance;

  // Auto-dismiss confirmed state after 8s so it doesn't block the next action
  useEffect(() => {
    if (actions.status !== 'confirmed') return;
    const t = setTimeout(() => actions.reset(), 8000);
    return () => clearTimeout(t);
  }, [actions.status, actions.reset, actions]);

  // Inline validation hint
  const inputHint = (() => {
    if (!amount || parsedAmount === 0n) return undefined;
    if (exceedsBalance) return 'Amount exceeds your USDC balance.';
    if (needsApproval) return 'Approve this amount before depositing.';
    return undefined;
  })();

  const handleAction = useCallback(
    async (label: string, fn: () => Promise<void>) => {
      setActionError(null);
      setLastAction(label);
      actions.reset();
      try {
        await fn();
        refetch();
      } catch (e: unknown) {
        setActionError(parseActionError(e));
      }
    },
    [actions, refetch]
  );

  const canApprove = parsedAmount > 0n && needsApproval && !exceedsBalance && !actions.isPending && !!resolvedAsset;
  const canDeposit = parsedAmount > 0n && !needsApproval && !exceedsBalance && !actions.isPending;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-white">Déposer USDC</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Déposez USDC dans {vaultName} et recevez des shares de vault
        </p>
      </div>

      {/* Balance & Allowance */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">USDC Disponibles</span>
          <span className="text-white font-mono">
            {isLoading ? '…' : `${fmt(userUsdcBalance)} USDC`}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Approuvé pour ce vault</span>
          <span className="text-white font-mono">
            {isLoading ? '…' : `${fmt(allowance)} USDC`}
          </span>
        </div>
      </div>

      {/* Amount Input */}
      <AmountInput
        value={amount}
        onChange={setAmount}
        label="Montant du Dépôt"
        unit="USDC"
        maxValue={userUsdcBalance}
        decimals={DECIMALS}
        disabled={actions.isPending}
        hint={inputHint}
        hintError={!!exceedsBalance}
      />

      {/* Preview */}
      {parsedAmount > 0n && !exceedsBalance && (
        <div className="flex items-center justify-between text-sm rounded-lg bg-gray-800/50 px-3 py-2">
          <span className="text-gray-400">Vous recevrez (est.)</span>
          <span className="text-white font-mono">{fmt(previewDeposit)} shares</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {needsApproval && !exceedsBalance && (
          <button
            onClick={() =>
              handleAction('Approve', () =>
                actions.approve(resolvedAsset!, vaultAddress, amount)
              )
            }
            disabled={!canApprove}
            className="flex-1 rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-200 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {actions.isPending && lastAction === 'Approve' ? 'Approbation…' : `Approuver ${amount || '0'} USDC`}
          </button>
        )}
        <button
          onClick={() =>
            handleAction('Deposit', () => actions.deposit(vaultAddress, amount))
          }
          disabled={!canDeposit}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {actions.isPending && lastAction === 'Deposit' ? 'Dépôt…' : 'Déposer'}
        </button>
      </div>

      {/* Transaction Feedback */}
      <TransactionFeedback
        status={actions.status}
        txHash={actions.txHash}
        actionError={actionError}
        lastAction={lastAction}
        chainId={chainId}
      />

      {/* Disclaimer */}
      <p className="text-xs text-gray-600 leading-relaxed">
        Deposits are subject to smart contract risk. Ensure you have reviewed
        the vault strategy before proceeding. Past performance does not guarantee
        future results.
      </p>
    </div>
  );
}
