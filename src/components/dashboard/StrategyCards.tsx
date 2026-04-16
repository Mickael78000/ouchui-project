const strategies = [
  {
    title: 'Tranche T — Treasury Optimization',
    description:
      'Capital allocated to tokenized T-Bills for stable, low-risk yield generation. Serves as the primary liquidity reserve for investor withdrawals.',
    status: 'Scaffold — pending T-Bill integration',
  },
  {
    title: 'Tranche D — Direct Deployment',
    description:
      'Capital deployed to fund healthcare equipment installations. Returns driven by subscription revenue from hospital clients.',
    status: 'Scaffold — pending operational deployment',
  },
  {
    title: 'Lending Loop',
    description:
      'T-Bill positions used as collateral to borrow additional USDC, creating a capital-efficient yield amplification cycle.',
    status: 'Scaffold — pending lending protocol integration',
  },
];

export function StrategyCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {strategies.map((s) => (
        <div
          key={s.title}
          className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 space-y-3"
        >
          <h3 className="text-sm font-semibold text-white">{s.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{s.description}</p>
          <p className="text-xs text-gray-600 italic">{s.status}</p>
        </div>
      ))}
    </div>
  );
}
