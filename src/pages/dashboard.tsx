import type { NextPage } from 'next';
import { useChainId } from 'wagmi';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/ui/SectionHeader';
import { NetworkGuard } from '../components/ui/NetworkGuard';
import { ProtocolMetrics } from '../components/dashboard/ProtocolMetrics';
import { VaultSummaryCard } from '../components/dashboard/VaultSummaryCard';
import { StrategyCards } from '../components/dashboard/StrategyCards';
import { getAddresses } from '../config/contracts';

const ZERO_ADDR = '0x0000000000000000000000000000000000000000' as const;

const Dashboard: NextPage = () => {
  const chainId = useChainId();
  const addresses = getAddresses(chainId);

  const vaultT = addresses?.vaultT ?? ZERO_ADDR;
  const vaultD = addresses?.vaultD ?? ZERO_ADDR;

  return (
    <AppShell title="Dashboard — OUCHUI" description="Protocol metrics and investor dashboard">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        <SectionHeader
          title="Protocol Dashboard"
          subtitle="Real-time protocol metrics, exposure breakdown, and position overview"
        />

        <NetworkGuard>
          {/* Protocol-Wide Metrics */}
          <section className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              Protocol Metrics
            </h3>
            <ProtocolMetrics vaultTAddress={vaultT} vaultDAddress={vaultD} />
          </section>

          {/* Position Summary */}
          <section className="mt-10 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              Vault Positions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VaultSummaryCard name="OUCHUI-T · Tranche T" vaultAddress={vaultT} />
              <VaultSummaryCard name="OUCHUI-D · Tranche D" vaultAddress={vaultD} />
            </div>
          </section>

          {/* Strategy & Exposure */}
          <section className="mt-10 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              Strategy Allocation & Exposure
            </h3>
            <StrategyCards />
          </section>

          {/* On-Chain Indicators */}
          <section className="mt-10 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              On-Chain Indicators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Vault Contract Status
                </p>
                <p className="text-sm text-emerald-400 font-medium">Deployed</p>
                <p className="text-xs text-gray-500 mt-1">ERC-4626 compliant · Sepolia</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Oracle Integration
                </p>
                <p className="text-sm text-yellow-400 font-medium">Pending</p>
                <p className="text-xs text-gray-500 mt-1">NAV feed not yet connected</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  T-Bills Module
                </p>
                <p className="text-sm text-yellow-400 font-medium">Pending</p>
                <p className="text-xs text-gray-500 mt-1">Tokenized T-Bill integration planned</p>
              </div>
            </div>
          </section>
        </NetworkGuard>
      </div>
    </AppShell>
  );
};

export default Dashboard;
