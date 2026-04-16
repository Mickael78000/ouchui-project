import type { NextPage } from 'next';
import Link from 'next/link';
import { AppShell } from '../components/layout/AppShell';
import { FeatureCard } from '../components/ui/FeatureCard';
import { SectionHeader } from '../components/ui/SectionHeader';

const investorFeatures = [
  {
    title: 'KYC & Security',
    description:
      'Mandatory identity verification before any deposit, securing access to the protocol and ensuring regulatory compliance.',
  },
  {
    title: 'Token Issuance',
    description:
      'Automatic issuance of OUCHUI tokens (ERC-20) in exact proportion to your USDC deposit, serving as on-chain proof of participation.',
  },
  {
    title: 'Real-Time NAV',
    description:
      'Live Net Asset Value (NAV) tracking for your tokens, providing precise visibility into the current value of your position.',
  },
  {
    title: 'Smart Contract Lending',
    description:
      'Lend your funds through secured smart contracts to earn transparent, verifiable yield.',
  },
  {
    title: 'On-Chain Indicators',
    description:
      'Access a financial dashboard with TVL, liquidity, exposure, and yield metrics to evaluate the health of your investment.',
  },
  {
    title: 'Liquidity & Withdrawals',
    description:
      'Retrieve your USDC at any time through an optimized liquidity reserve, enabling unrestricted exits.',
  },
  {
    title: 'T-Bills Optimization',
    description:
      'Idle capital is automatically invested in tokenized T-Bills, generating continuous and secured yield.',
  },
  {
    title: 'Collateralization',
    description:
      'T-Bills serve as collateral for borrowing USDC, enabling lending loops to amplify returns.',
  },
  {
    title: 'Strategy Transparency',
    description:
      'Clear visualization of the DeFi strategy, explaining the origin of yields and the protection mechanisms in place.',
  },
];

const Home: NextPage = () => {
  return (
    <AppShell
      title="OUCHUI — Healthcare Infrastructure Financing"
      description="Real-time medical equipment tracking financed through DeFi infrastructure"
    >
      {/* Hero */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <p className="text-indigo-400 text-sm font-medium tracking-wide uppercase mb-3">
            Healthcare Infrastructure · DeFi Financing
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
            Real-time medical equipment tracking, financed through institutional-grade DeFi
          </h1>
          <p className="mt-6 text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            OUCHUI provides hospitals with a fully managed, real-time equipment
            localization service — accessible from any smartphone — while offering
            institutional investors transparent, on-chain yield through ERC-4626 vaults.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              View Dashboard
            </Link>
            <Link
              href="/deposit"
              className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-200 hover:bg-gray-800 hover:border-gray-600 transition-colors"
            >
              Deposit / Withdraw
            </Link>
          </div>
        </div>
      </section>

      {/* Healthcare Operations Layer */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader
            title="Healthcare Operations"
            subtitle="The operational foundation powering real-world impact"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-300 leading-relaxed">
            <div className="space-y-4">
              <p>
                OUCHUI delivers a real-time localization service for medical
                equipment inside healthcare facilities. The solution is
                smartphone-accessible and complemented by a management dashboard
                to optimize internal logistics and asset utilization.
              </p>
              <p>
                Hospitals operate under tight investment constraints. OUCHUI
                addresses this by offering a fully turnkey service billed as a
                monthly subscription (OPEX), requiring no changes to existing IT
                infrastructure. All contract and access management is handled by
                OUCHUI.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                The commercial engine structures client acquisition through a
                CRM-driven pipeline, automated proposal generation, electronic
                signature workflows, and full contract lifecycle tracking with
                KPIs — including ARR, conversion rate, CAC, and churn.
              </p>
              <p>
                Security and regulatory compliance are embedded at every level,
                ensuring data confidentiality for location-sensitive information
                and strict adherence to the applicable legal framework.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DeFi Financing Layer */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader
            title="DeFi Financing Layer"
            subtitle="On-chain capital infrastructure for OUCHUI operations"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-300 leading-relaxed">
            <div className="space-y-4">
              <p>
                A dedicated DeFi financing layer enables the issuance of OUCHUI
                tokens (ERC-20) to investors who deposit USDC. A real-time NAV
                calculation and smart-contract-based lending mechanisms provide
                full transparency through on-chain indicators.
              </p>
              <p>
                Investors receive vault shares proportional to their deposit,
                tracked and verifiable entirely on-chain via ERC-4626 tokenized
                vaults.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Undeployed treasury capital is automatically optimized by
                investing in tokenized T-Bills, which also serve as a liquidity
                reserve for investor withdrawals.
              </p>
              <p>
                A potential lending loop further amplifies yield by using T-Bill
                positions as collateral to borrow additional USDC, creating a
                capital-efficient cycle while maintaining withdrawal liquidity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investor Features */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader
            title="Investor Features"
            subtitle="Protocol capabilities for liquidity providers"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {investorFeatures.map((f) => (
              <FeatureCard key={f.title} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader
            title="Security & Compliance"
            subtitle="Built for institutional-grade trust"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300 leading-relaxed">
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Regulatory Compliance</h3>
              <p>
                All investor interactions are subject to KYC verification.
                The protocol operates within a clearly defined legal perimeter.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Data Confidentiality</h3>
              <p>
                Location-sensitive data from healthcare facilities is handled
                with strict confidentiality and access controls.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <h3 className="text-sm font-semibold text-white mb-2">On-Chain Transparency</h3>
              <p>
                All capital flows, yields, and positions are verifiable on-chain.
                Smart contracts are auditable and deterministic.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              View Dashboard
            </Link>
            <Link
              href="/deposit"
              className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-200 hover:bg-gray-800 hover:border-gray-600 transition-colors"
            >
              Deposit / Withdraw
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default Home;
