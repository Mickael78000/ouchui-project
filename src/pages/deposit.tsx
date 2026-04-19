import { useState } from 'react';
import type { NextPage } from 'next';
import { type Address } from 'viem';
import { useChainId } from 'wagmi';
import { AppShell } from '../shared/layout/AppShell';
import { SectionHeader } from '../shared/ui/SectionHeader';
import { StatusMessage } from '../shared/ui/StatusMessage';
import { NetworkGuard } from '../shared/ui/NetworkGuard';
import { VaultSelector, type VaultOption } from '../features/vaults/components/VaultSelector';
import { DepositPanel } from '../features/vaults/components/DepositPanel';
import { WithdrawPanel } from '../features/vaults/components/WithdrawPanel';
import { MetricCard } from '../shared/ui/MetricCard';
import { useVaultData, fmt } from '../features/vaults/hooks/useVaultData';
import { getAddresses } from '../shared/config/contracts';

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
    <AppShell title="Dépôt / Retrait — OUCHUI" description="Gérez vos positions de vault">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <SectionHeader
          title="Dépôt / Retrait"
          subtitle="Gérez vos dépôts USDC et vos positions de shares de vault"
        />

        {/* KYC Notice */}
        <StatusMessage variant="warning">
          <strong>Exigence KYC :</strong> La vérification d'identité est obligatoire avant de
          déposer des fonds. Cela garantit la conformité réglementaire et sécurise l'accès au
          protocole. Veuillez vous assurer que votre adresse de portefeuille est sur la liste blanche avant de continuer.
        </StatusMessage>

        <NetworkGuard>
          {/* Vault Selector */}
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              Sélectionner le Vault
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
              Votre Position — {selectedLabel}
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
