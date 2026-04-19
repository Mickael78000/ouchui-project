import { type Address } from 'viem';
import { useVaultData, fmt } from '../../../hooks/useVaultData';
import { MetricCard } from '../../../shared/ui/MetricCard';

interface VaultSummaryCardProps {
  name: string;
  vaultAddress: Address;
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function VaultSummaryCard({ name, vaultAddress }: VaultSummaryCardProps) {
  const { totalAssets, totalSupply, userShareBalance, userUsdcBalance, isLoading } =
    useVaultData(vaultAddress, '');

  const isZeroAddress = vaultAddress === '0x0000000000000000000000000000000000000000';

  if (isZeroAddress) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
        <h3 className="text-sm font-semibold text-white mb-2">{name}</h3>
        <p className="text-xs text-gray-500">Contract address not configured for this network.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{name}</h3>
        <span className="text-xs text-gray-500 font-mono" title={vaultAddress}>
          {shortenAddress(vaultAddress)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Actifs Totaux"
          value={fmt(totalAssets)}
          unit="USDC"
          loading={isLoading}
        />
        <MetricCard
          label="Supply Total"
          value={fmt(totalSupply)}
          unit="shares"
          loading={isLoading}
        />
        <MetricCard
          label="Vos USDC"
          value={fmt(userUsdcBalance)}
          unit="USDC"
          loading={isLoading}
        />
        <MetricCard
          label="Vos Shares"
          value={fmt(userShareBalance)}
          unit="shares"
          loading={isLoading}
        />
      </div>
    </div>
  );
}
