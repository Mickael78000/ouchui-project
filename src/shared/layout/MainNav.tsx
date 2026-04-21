import Link from 'next/link';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navItems = [
  { href: '/', label: 'OUCHUI' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/deposit', label: 'Dépôt/Retrait' },
];

export function MainNav() {
  const router = useRouter();

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map(({ href, label }) => {
            const isActive =
              href === '/'
                ? router.pathname === '/'
                : router.pathname.startsWith(href);
            const isLogo = href === '/';

            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isLogo
                    ? 'text-indigo-400 font-bold text-base mr-2'
                    : isActive
                    ? 'text-white bg-gray-800'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <ConnectButton showBalance={false} />
      </div>
    </header>
  );
}
