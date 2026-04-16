import { useState } from 'react';
import type { NextPage } from 'next';
import { type Address } from 'viem';
import { useChainId } from 'wagmi';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatusMessage } from '../components/ui/StatusMessage';
import { NetworkGuard } from '../components/ui/NetworkGuard';
import { VaultSelector, type VaultOption } from '../components/investor/VaultSelector';
import { DepositPanel } from '../components/investor/DepositPanel';
import { WithdrawPanel } from '../components/investor/WithdrawPanel';
import { MetricCard } from '../components/ui/MetricCard';
import { useVaultData, fmt } from '../hooks/useVaultData';
import { getAddresses } from '../config/contracts';

const ZERO_ADDR = '0x0000000000000000000000000000000000000000' as const;

function PositionSummary({ vaultAddress, label }: { vaultAddress: Address; label: string }) {
  const { userUsdcBalance, userShareBalance, isLoading } = useVaultData(vaultAddress, '');
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard
        label={`${label} — Your USDC`}
        value={fmt(userUsdcBalance)}
        unit="USDC"
        loading={isLoading}
      />
      <MetricCard
        label={`${label} — Your Shares`}
        value={fmt(userShareBalance)}
        unit="shares"
        loading={isLoading}
      />
    </div>
  );
}

const Deposit: NextPage = () => {
  const chainId = useChainId();
  const addresses = getAddresses(chainId);

  const vaults: VaultOption[] = [
    { label: 'Tranche T', address: addresses?.vaultT ?? ZERO_ADDR },
    { label: 'Tranche D', address: addresses?.vaultD ?? ZERO_ADDR },
  ];

  const [selectedVault, setSelectedVault] = useState<Address>(vaults[0].address);

  const selectedLabel = vaults.find((v) => v.address === selectedVault)?.label ?? 'Vault';

  return (
    <AppShell title="Deposit / Withdraw — OUCHUI" description="Manage your vault positions">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <SectionHeader
          title="Deposit / Withdraw"
          subtitle="Manage your USDC deposits and vault share positions"
        />

        {/* KYC Notice */}
        <StatusMessage variant="warning">
          <strong>KYC Requirement:</strong> Identity verification is mandatory before
          depositing funds. This ensures regulatory compliance and secures access to the
          protocol. Please ensure your wallet address is whitelisted before proceeding.
        </StatusMessage>

        <NetworkGuard>
          {/* Vault Selector */}
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              Select Vault
            </p>
            <VaultSelector
              vaults={vaults}
              selected={selectedVault}
              onChange={setSelectedVault}
            />
          </section>

          {/* Position Summary */}
          <section className="mt-8 space-y-3">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              Your Position — {selectedLabel}
            </p>
            <PositionSummary vaultAddress={selectedVault} label={selectedLabel} />
          </section>

          {/* Deposit & Withdraw Panels */}
          <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DepositPanel
              vaultAddress={selectedVault}
              vaultName={selectedLabel}
            />
            <WithdrawPanel
              vaultAddress={selectedVault}
              vaultName={selectedLabel}
            />
          </section>

          {/* Compliance Notices */}
          <section className="mt-8 space-y-3">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              Compliance & Security
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatusMessage variant="info">
                <strong>Smart Contract Risk:</strong> All deposits interact directly
                with on-chain ERC-4626 vault contracts. There is no intermediary and no
                guarantee of principal. Review the contract source before depositing.
              </StatusMessage>
              <StatusMessage variant="info">
                <strong>Withdrawal Liquidity:</strong> Withdrawals are served from the
                vault&apos;s liquidity reserve. During periods of high capital deployment,
                withdrawal availability may be limited.
              </StatusMessage>
            </div>
          </section>
        </NetworkGuard>
      </div>
    </AppShell>
  );
};

export default Deposit;
