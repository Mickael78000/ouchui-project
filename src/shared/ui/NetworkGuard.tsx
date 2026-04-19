import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { getAddresses } from '../config/contracts';
import { StatusMessage } from './StatusMessage';

interface NetworkGuardProps {
  children: React.ReactNode;
  requireWallet?: boolean;
}

const SEPOLIA_ID = 11155111;

export function NetworkGuard({ children, requireWallet = true }: NetworkGuardProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const addresses = getAddresses(chainId);
  const { switchChain, isPending: isSwitching, isError: switchFailed } = useSwitchChain();

  if (requireWallet && !isConnected) {
    return (
      <StatusMessage variant="info">
        Connect your wallet using the button in the top navigation to continue.
      </StatusMessage>
    );
  }

  if (isConnected && !addresses) {
    return (
      <div className="space-y-3">
        <StatusMessage variant="warning">
          Your wallet is connected to an unsupported network.
          Switch to <strong>Sepolia</strong> to interact with OUCHUI vaults.
        </StatusMessage>
        <button
          onClick={() => switchChain({ chainId: SEPOLIA_ID })}
          disabled={isSwitching}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSwitching ? 'Switching…' : 'Switch to Sepolia'}
        </button>
        {switchFailed && (
          <StatusMessage variant="error">
            Could not switch automatically. Please switch to Sepolia manually in your wallet.
          </StatusMessage>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
