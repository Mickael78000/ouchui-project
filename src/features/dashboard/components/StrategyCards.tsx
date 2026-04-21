const strategies = [
  {
    title: 'Tranche T — Optimisation de Trésorerie',
    description:
      'Capital alloué aux T-Bills tokenisés pour une génération de rendement stable et peu risquée. Sert de réserve de liquidité principale pour les retraits des investisseurs.',
    status: 'Scaffold — intégration T-Bills en attente',
  },
  {
    title: 'Tranche D — Déploiement Direct',
    description:
      'Capital déployé pour financer les installations d\'équipements médicaux. Rendements générés par les revenus d\'abonnement des établissements hospitaliers clients.',
    status: 'Scaffold — déploiement opérationnel en attente',
  },
  {
    title: 'Boucle de Prêt',
    description:
      'Les positions T-Bills utilisées comme collatéral pour emprunter des USDC supplémentaires, créant un cycle d\'amplification de rendement efficace en capital.',
    status: 'Scaffold — intégration protocole de prêt en attente',
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
