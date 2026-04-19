import Head from 'next/head';
import { MainNav } from './MainNav';

interface AppShellProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function AppShell({
  title = 'OUCHUI',
  description = 'Healthcare infrastructure financing via DeFi',
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <MainNav />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-800 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>OUCHUI Protocol · Healthcare Infrastructure Financing</span>
          <span>Sepolia Testnet · ERC-4626 Vaults</span>
        </div>
      </footer>
    </div>
  );
}
