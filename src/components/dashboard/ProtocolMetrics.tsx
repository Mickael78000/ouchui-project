import { type Address } from 'viem';
import { useVaultData, fmt } from '../../hooks/useVaultData';
import { MetricCard } from '../ui/MetricCard';

interface ProtocolMetricsProps {
  vaultTAddress: Address;
  vaultDAddress: Address;
}

export function ProtocolMetrics({ vaultTAddress, vaultDAddress }: ProtocolMetricsProps) {
  const vaultT = useVaultData(vaultTAddress, '');
  const vaultD = useVaultData(vaultDAddress, '');

  const totalTvl = vaultT.totalAssets + vaultD.totalAssets;
  const totalShares = vaultT.totalSupply + vaultD.totalSupply;
  const loading = vaultT.isLoading || vaultD.isLoading;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total Value Locked"
        value={fmt(totalTvl)}
        unit="USDC"
        detail="Combined across all vaults"
        loading={loading}
      />
      <MetricCard
        label="Total Shares Issued"
        value={fmt(totalShares)}
        unit="shares"
        detail="All vault tranches"
        loading={loading}
      />
      <MetricCard
        label="T-Bills Exposure"
        value="—"
        unit=""
        detail="Not yet connected"
        loading={false}
      />
      <MetricCard
        label="Lending Utilization"
        value="—"
        unit=""
        detail="Not yet connected"
        loading={false}
      />
      <MetricCard
        label="NAV per Token"
        value="—"
        unit=""
        detail="Requires oracle integration"
        loading={false}
      />
      <MetricCard
        label="Estimated Yield"
        value="—"
        unit=""
        detail="Requires strategy deployment"
        loading={false}
      />
      <MetricCard
        label="Available Liquidity"
        value={fmt(totalTvl)}
        unit="USDC"
        detail="Current vault reserves"
        loading={loading}
      />
      <MetricCard
        label="Deployed Capital"
        value="—"
        unit=""
        detail="Awaiting operational deployment"
        loading={false}
      />
    </div>
  );
}
