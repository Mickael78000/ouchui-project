import type { NextPage } from 'next';
import { useChainId } from 'wagmi';
import { AppShell } from '../shared/layout/AppShell';
import { SectionHeader } from '../shared/ui/SectionHeader';
import { NetworkGuard } from '../shared/ui/NetworkGuard';
import { ProtocolMetrics } from '../features/dashboard/components/ProtocolMetrics';
import { VaultSummaryCard } from '../features/dashboard/components/VaultSummaryCard';
import { StrategyCards } from '../features/dashboard/components/StrategyCards';
import { getAddresses } from '../shared/config/contracts';

const ZERO_ADDR = '0x0000000000000000000000000000000000000000' as const;

const Dashboard: NextPage = () => {
  const chainId = useChainId();
  const addresses = getAddresses(chainId);

  const vaultT = addresses?.vaultT ?? ZERO_ADDR;
  const vaultD = addresses?.vaultD ?? ZERO_ADDR;

  return (
    <AppShell title="Dashboard — OUCHUI" description="Métriques du protocole et dashboard investisseur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        <SectionHeader
          title="Dashboard du Protocole"
          subtitle="Métriques en temps réel du protocole, décomposition de l'exposition et aperçu des positions"
        />

        <NetworkGuard>
          {/* Protocol-Wide Metrics */}
          <section className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              Métriques du Protocole
            </h3>
            <ProtocolMetrics vaultTAddress={vaultT} vaultDAddress={vaultD} />
          </section>

          {/* Position Summary */}
          <section className="mt-10 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              Positions Vault
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VaultSummaryCard name="OUCHUI-T · Tranche T" vaultAddress={vaultT} />
              <VaultSummaryCard name="OUCHUI-D · Tranche D" vaultAddress={vaultD} />
            </div>
          </section>

          {/* Strategy & Exposure */}
          <section className="mt-10 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              Allocation Stratégique & Exposition
            </h3>
            <StrategyCards />
          </section>

          {/* On-Chain Indicators */}
          <section className="mt-10 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              Indicateurs On-Chain
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Statut du Contrat Vault
                </p>
                <p className="text-sm text-emerald-400 font-medium">Déployé</p>
                <p className="text-xs text-gray-500 mt-1">Conforme ERC-4626 · Sepolia</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Intégration Oracle
                </p>
                <p className="text-sm text-yellow-400 font-medium">En Attente</p>
                <p className="text-xs text-gray-500 mt-1">Flux NAV pas encore connecté</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Module T-Bills
                </p>
                <p className="text-sm text-yellow-400 font-medium">En Attente</p>
                <p className="text-xs text-gray-500 mt-1">Intégration T-Bills tokenisés planifiée</p>
              </div>
            </div>
          </section>
        </NetworkGuard>
      </div>
    </AppShell>
  );
};

export default Dashboard;
