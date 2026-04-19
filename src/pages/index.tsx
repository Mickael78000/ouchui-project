import type { NextPage } from 'next';
import Link from 'next/link';
import { AppShell } from '../shared/layout/AppShell';
import { FeatureCard } from '../shared/ui/FeatureCard';
import { SectionHeader } from '../shared/ui/SectionHeader';

const investorFeatures = [
  {
    title: 'KYC & Sécurité',
    description:
      'Vérification d\'identité obligatoire avant tout dépôt, sécurisant l\'accès au protocole et garantissant la conformité réglementaire.',
  },
  {
    title: 'Émission de Tokens',
    description:
      'Émission automatique de tokens OUCHUI (ERC-20) en proportion exacte de votre dépôt USDC, servant comme preuve de participation on-chain.',
  },
  {
    title: 'NAV en Temps Réel',
    description:
      'Suivi en direct de la Valeur Nette d\'Actifs (NAV) pour vos tokens, offrant une visibilité précise sur la valeur actuelle de votre position.',
  },
  {
    title: 'Prêt via Smart Contracts',
    description:
      'Prêtez vos fonds via des smart contracts sécurisés pour gagner un rendement transparent et vérifiable.',
  },
  {
    title: 'Indicateurs On-Chain',
    description:
      'Accédez à un dashboard financier avec des métriques TVL, liquidité, exposition et rendement pour évaluer la santé de votre investissement.',
  },
  {
    title: 'Liquidité & Retraits',
    description:
      'Récupérez vos USDC à tout moment via une réserve de liquidité optimisée, permettant des sorties sans restriction.',
  },
  {
    title: 'Optimisation T-Bills',
    description:
      'Le capital inactif est automatiquement investi dans des T-Bills tokenisés, générant un rendement continu et sécurisé.',
  },
  {
    title: 'Collatéralisation',
    description:
      'Les T-Bills servent de collatéral pour emprunter des USDC, permettant des boucles de prêt pour amplifier les rendements.',
  },
  {
    title: 'Transparence de la Stratégie',
    description:
      'Visualisation claire de la stratégie DeFi, expliquant l\'origine des rendements et les mécanismes de protection en place.',
  },
];

const Home: NextPage = () => {
  return (
    <AppShell
      title="OUCHUI — Financement d'Infrastructure Santé"
      description="Suivi d'équipements médicaux en temps réel financé via infrastructure DeFi"
    >
      {/* Hero */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <p className="text-indigo-400 text-sm font-medium tracking-wide uppercase mb-3">
            Infrastructure Santé · Financement DeFi
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
            Suivi d'équipements médicaux en temps réel, financé via DeFi institutionnelle
          </h1>
          <p className="mt-6 text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            OUCHUI fournit aux hôpitaux un service de localisation d'équipements
            entièrement géré et en temps réel — accessible depuis tout smartphone — tout en offrant
            aux investisseurs institutionnels un rendement on-chain transparent via des vaults ERC-4626.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Voir Dashboard
            </Link>
            <Link
              href="/deposit"
              className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-200 hover:bg-gray-800 hover:border-gray-600 transition-colors"
            >
              Dépôt / Retrait
            </Link>
          </div>
        </div>
      </section>

      {/* Healthcare Operations Layer */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader
            title="Opérations Santé"
            subtitle="La fondation opérationnelle alimentant l'impact réel"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-300 leading-relaxed">
            <div className="space-y-4">
              <p>
                OUCHUI fournit un service de localisation en temps réel pour les équipements
                médicaux dans les établissements de santé. La solution est
                accessible via smartphone et complétée par un dashboard de gestion
                pour optimiser la logistique interne et l'utilisation des actifs.
              </p>
              <p>
                Les hôpitaux opèrent sous des contraintes d'investissement strictes. OUCHUI
                répond à cela en offrant un service entièrement clé en main facturé comme
                abonnement mensuel (OPEX), ne nécessitant aucune modification de l'infrastructure IT
                existante. Toute la gestion des contrats et des accès est assurée par
                OUCHUI.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Le moteur commercial structure l'acquisition clients via un
                pipeline CRM, la génération automatisée de propositions, les workflows
                de signature électronique, et le suivi complet du cycle de vie des contrats avec
                des KPIs — incluant ARR, taux de conversion, CAC, et churn.
              </p>
              <p>
                La sécurité et la conformité réglementaire sont intégrées à tous les niveaux,
                garantissant la confidentialité des données pour les informations sensibles de localisation
                et le respect strict du cadre légal applicable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DeFi Financing Layer */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader
            title="Couche de Financement DeFi"
            subtitle="Infrastructure de capital on-chain pour les opérations OUCHUI"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-300 leading-relaxed">
            <div className="space-y-4">
              <p>
                Une couche de financement DeFi dédiée permet l'émission de tokens
                OUCHUI (ERC-20) aux investisseurs qui déposent USDC. Un calcul NAV
                en temps réel et des mécanismes de prêt via smart contracts fournissent
                une transparence complète via des indicateurs on-chain.
              </p>
              <p>
                Les investisseurs reçoivent des shares de vault proportionnels à leur dépôt,
                suivis et vérifiables entièrement on-chain via des vaults tokenisés
                ERC-4626.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Le capital de trésorerie non déployé est automatiquement optimisé en
                investissant dans des T-Bills tokenisés, qui servent également de réserve
                de liquidité pour les retraits des investisseurs.
              </p>
              <p>
                Une boucle de prêt potentielle amplifie davantage le rendement en utilisant les positions
                T-Bill comme collatéral pour emprunter des USDC supplémentaires, créant
                un cycle efficace en capital tout en maintenant la liquidité de retrait.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investor Features */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader
            title="Fonctionnalités Investisseur"
            subtitle="Capacités du protocole pour les fournisseurs de liquidité"
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
            title="Sécurité & Conformité"
            subtitle="Conçu pour la confiance institutionnelle"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300 leading-relaxed">
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Conformité Réglementaire</h3>
              <p>
                Toutes les interactions investisseur sont soumises à vérification KYC.
                Le protocole opère dans un périmètre légal clairement défini.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Confidentialité des Données</h3>
              <p>
                Les données sensibles de localisation des établissements de santé sont traitées
                avec une confidentialité stricte et des contrôles d'accès.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Transparence On-Chain</h3>
              <p>
                Tous les flux de capital, rendements et positions sont vérifiables on-chain.
                Les smart contracts sont auditable et déterministes.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Voir Dashboard
            </Link>
            <Link
              href="/deposit"
              className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-200 hover:bg-gray-800 hover:border-gray-600 transition-colors"
            >
              Dépôt / Retrait
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default Home;
