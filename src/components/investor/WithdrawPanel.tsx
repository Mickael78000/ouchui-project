import { useState, useCallback, useEffect } from 'react';
import { type Address, parseUnits } from 'viem';
import { useChainId } from 'wagmi';
import { useVaultData, fmt } from '../../hooks/useVaultData';
import { useVaultActions, parseActionError } from '../../hooks/useVaultActions';
import { AmountInput } from '../ui/AmountInput';
import { TransactionFeedback } from './TransactionFeedback';

const DECIMALS = 6;

interface WithdrawPanelProps {
  vaultAddress: Address;
  vaultName: string;
}

export function WithdrawPanel({ vaultAddress, vaultName }: WithdrawPanelProps) {
  const chainId = useChainId();

  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'withdraw' | 'redeem'>('redeem');
  const [actionError, setActionError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const {
    userShareBalance,
    userUsdcBalance,
    totalAssets,
    previewRedeem,
    previewWithdraw,
    convertToAssets,
    isLoading,
    refetch,
  } = useVaultData(vaultAddress, amount);

  const actions = useVaultActions();

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

  // Validation: for withdraw mode, check against vault liquidity (totalAssets);
  // for redeem mode, check against user share balance
  const exceedsPosition =
    mode === 'redeem'
      ? parsedAmount > 0n && parsedAmount > userShareBalance
      : parsedAmount > 0n && parsedAmount > totalAssets;

  const exceedsShares =
    mode === 'redeem'
      ? parsedAmount > 0n && parsedAmount > userShareBalance
      : parsedAmount > 0n && previewWithdraw > userShareBalance;

  const hasZeroPosition = !isLoading && userShareBalance === 0n;

  // Auto-dismiss confirmed state
  useEffect(() => {
    if (actions.status !== 'confirmed') return;
    const t = setTimeout(() => actions.reset(), 8000);
    return () => clearTimeout(t);
  }, [actions.status, actions.reset, actions]);

  // Inline validation
  const inputHint = (() => {
    if (!amount || parsedAmount === 0n) return undefined;
    if (mode === 'redeem' && exceedsPosition) return 'Amount exceeds your available shares.';
    if (mode === 'withdraw' && exceedsPosition) return 'Amount exceeds available vault liquidity.';
    if (mode === 'withdraw' && exceedsShares) return 'Withdrawal would require more shares than you hold.';
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

  const canSubmit = parsedAmount > 0n && !exceedsPosition && !exceedsShares && !actions.isPending;

  // Max value for the input depends on mode
  const maxValue = mode === 'redeem' ? userShareBalance : totalAssets;

  // Value the user's shares are worth (for display)
  const sharesValueUsdc = convertToAssets;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-white">Withdraw / Redeem</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Withdraw USDC or redeem shares from {vaultName}
        </p>
      </div>

      {/* Balance Display */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Your Shares</span>
          <span className="text-white font-mono">
            {isLoading ? '…' : `${fmt(userShareBalance)} shares`}
          </span>
        </div>
        {!isLoading && userShareBalance > 0n && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Share value (est.)</span>
            <span className="text-white font-mono">
              {fmt(sharesValueUsdc)} USDC
            </span>
          </div>
        )}
      </div>

      {/* Zero position messaging */}
      {hasZeroPosition && (
        <p className="text-xs text-gray-500">
          You have no shares in this vault. Deposit USDC first to receive vault shares.
        </p>
      )}

      {!hasZeroPosition && (
        <>
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => { setMode('redeem'); setAmount(''); }}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                mode === 'redeem'
                  ? 'bg-gray-700 text-white'
                  : 'bg-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Redeem (by shares)
            </button>
            <button
              onClick={() => { setMode('withdraw'); setAmount(''); }}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                mode === 'withdraw'
                  ? 'bg-gray-700 text-white'
                  : 'bg-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Withdraw (by USDC amount)
            </button>
          </div>

          {/* Amount Input */}
          <AmountInput
            value={amount}
            onChange={setAmount}
            label={mode === 'withdraw' ? 'USDC Amount to Withdraw' : 'Shares to Redeem'}
            unit={mode === 'withdraw' ? 'USDC' : 'shares'}
            maxValue={maxValue}
            decimals={DECIMALS}
            disabled={actions.isPending}
            hint={inputHint}
            hintError={!!exceedsPosition || !!exceedsShares}
          />

          {/* Preview */}
          {parsedAmount > 0n && !exceedsPosition && !exceedsShares && (
            <div className="flex items-center justify-between text-sm rounded-lg bg-gray-800/50 px-3 py-2">
              <span className="text-gray-400">
                {mode === 'withdraw' ? 'Shares to burn (est.)' : 'USDC to receive (est.)'}
              </span>
              <span className="text-white font-mono">
                {mode === 'withdraw'
                  ? `${fmt(previewWithdraw)} shares`
                  : `${fmt(previewRedeem)} USDC`}
              </span>
            </div>
          )}

          {/* Action */}
          <button
            onClick={() => {
              if (mode === 'withdraw') {
                handleAction('Withdraw', () => actions.withdraw(vaultAddress, amount));
              } else {
                handleAction('Redeem', () => actions.redeem(vaultAddress, amount));
              }
            }}
            disabled={!canSubmit}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {actions.isPending
              ? `${mode === 'withdraw' ? 'Withdrawing' : 'Redeeming'}…`
              : mode === 'withdraw' ? 'Withdraw USDC' : 'Redeem Shares'}
          </button>
        </>
      )}

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
        Withdrawals are processed from the vault liquidity reserve.
        In periods of high utilization, partial withdrawals may apply.
      </p>
    </div>
  );
}
