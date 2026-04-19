import { type Address } from 'viem';
import { useReadContract, useChainId } from 'wagmi';
import { useVaultData, fmt } from '../../../hooks/useVaultData';
import { MetricCard } from '../../../shared/ui/MetricCard';
import { vaultMockYieldAbi } from '../../../shared/contracts/VaultMockYieldAbi';
import { getAddresses } from '../../../shared/config/contracts';

interface ProtocolMetricsProps {
  vaultTAddress: Address;
  vaultDAddress: Address;
}

export function ProtocolMetrics({ vaultTAddress, vaultDAddress }: ProtocolMetricsProps) {
  const chainId = useChainId();
  const addresses = getAddresses(chainId);
  const vaultMockYieldAddress = addresses?.vaultMockYield;
  const vaultT = useVaultData(vaultTAddress, '');
  const vaultD = useVaultData(vaultDAddress, '');

  // Read yield rate from VaultMockYield contract
  const { data: yieldRateBps, isLoading: yieldLoading } = useReadContract({
    address: vaultMockYieldAddress,
    abi: vaultMockYieldAbi,
    functionName: 'mockRateBps',
  });

  const totalTvl = vaultT.totalAssets + vaultD.totalAssets;
  const totalShares = vaultT.totalSupply + vaultD.totalSupply;
  const loading = vaultT.isLoading || vaultD.isLoading || yieldLoading;

  // Format yield rate from BPS to percentage
  const formatYieldRate = (bps: bigint) => {
    const percentage = Number(bps) / 100; // Convert BPS to percentage (100 BPS = 1%)
    return percentage.toFixed(2);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Valeur Totale Bloquée"
        value={fmt(totalTvl)}
        unit="USDC"
        detail="Combiné sur tous les vaults"
        loading={loading}
      />
      <MetricCard
        label="Total des Shares Émis"
        value={fmt(totalShares)}
        unit="shares"
        detail="Toutes les tranches de vault"
        loading={loading}
      />
      <MetricCard
        label="Exposition T-Bills"
        value={fmt(totalTvl)}
        unit="USDC"
        detail="Tous les actifs des vaults"
        loading={loading}
      />
      <MetricCard
        label="Taux de Rendement"
        value={yieldRateBps ? formatYieldRate(yieldRateBps) : "—"}
        unit="%"
        detail="Rendement annuel en pourcentage"
        loading={yieldLoading}
      />
          </div>
  );
}
