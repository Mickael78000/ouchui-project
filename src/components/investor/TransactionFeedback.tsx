import type { TxStatus } from '../../hooks/useVaultActions';
import { StatusMessage } from '../ui/StatusMessage';

interface TransactionFeedbackProps {
  status: TxStatus;
  txHash: `0x${string}` | undefined;
  actionError: string | null;
  lastAction: string | null;
  chainId: number;
}

function shortenHash(hash: string) {
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`;
}

function explorerTxUrl(chainId: number, hash: string): string | null {
  if (chainId === 11155111) return `https://sepolia.etherscan.io/tx/${hash}`;
  return null;
}

export function TransactionFeedback({
  status,
  txHash,
  actionError,
  lastAction,
  chainId,
}: TransactionFeedbackProps) {
  if (status === 'signing') {
    return (
      <StatusMessage variant="pending">
        <span className="animate-pulse">
          Waiting for wallet signature{lastAction ? ` (${lastAction})` : ''}…
        </span>
      </StatusMessage>
    );
  }

  if (status === 'confirming' && txHash) {
    const url = explorerTxUrl(chainId, txHash);
    return (
      <StatusMessage variant="pending">
        <span className="animate-pulse">
          {lastAction ?? 'Transaction'} submitted — awaiting on-chain confirmation…
        </span>
        {url && (
          <>
            {' '}
            <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
              {shortenHash(txHash)}
            </a>
          </>
        )}
      </StatusMessage>
    );
  }

  if (status === 'confirmed' && txHash) {
    const url = explorerTxUrl(chainId, txHash);
    return (
      <StatusMessage variant="success">
        {lastAction && <strong>{lastAction}</strong>} confirmed on-chain.{' '}
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
            {shortenHash(txHash)}
          </a>
        ) : (
          <span className="font-mono text-xs">{shortenHash(txHash)}</span>
        )}
      </StatusMessage>
    );
  }

  if (actionError) {
    return (
      <StatusMessage variant="error">
        <span className="break-all">{actionError}</span>
      </StatusMessage>
    );
  }

  return null;
}
