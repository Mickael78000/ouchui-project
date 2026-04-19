# OUCHUI – Frontend Sepolia ERC‑4626

OUCHUI est une dApp frontend construite avec **Next.js**, **React** et **TypeScript** pour interagir avec des vaults **ERC‑4626** déployés sur **Sepolia**.  
Elle permet à un investisseur testnet de connecter son portefeuille, d’approuver un token `MockUSDC`, de déposer dans un vault, puis de gérer le rachat et le retrait de parts, avec un cycle de vie de transaction aligné sur les bonnes pratiques wagmi.

> ⚠️ **Statut** : flux investisseur Sepolia solide, mais **non prêt pour la production**. Utilisation limitée à des tests sur Sepolia.

---

## Démo

🚀 **Application déployée** : https://ouchui-project.vercel.app/

---

## Fonctionnalités

- Connexion de portefeuille via **RainbowKit** (wagmi + viem).
- Détection de réseau et bascule guidée vers **Sepolia**.
- Lecture consolidée des données de vault (soldes, autorisations, `totalAssets`, etc.).
- Flux d’approbation `MockUSDC` puis dépôt dans un vault ERC‑4626.
- Aperçu de retrait basé sur `previewWithdraw(assets)` pour les retraits orientés « montant d’actifs ».
- Gestion explicite des états de transaction :
  - attente de signature portefeuille ;
  - soumis / en attente de confirmation on‑chain ;
  - confirmé on‑chain.
- UX renforcée pour la saisie des montants, les boutons « Max » et les validations en ligne.

---

## Stack technique

- **Framework** : Next.js, React
- **Langage** : TypeScript
- **Web3** : wagmi, viem, RainbowKit
- **Style** : Tailwind CSS
- **Gestion de paquets** : pnpm

---

## Architecture du code

Le projet adopte une architecture **feature‑based** pour favoriser la scalabilité et la maintenabilité.

```txt
src/
├── features/           # Logique métier et UI spécifiques
│   ├── dashboard/      # Composants de dashboard
│   └── vaults/         # Composants et hooks liés aux vaults
└── shared/             # Éléments réutilisables
    ├── ui/             # Composants UI génériques
    ├── layout/         # Layouts partagés
    ├── config/         # Configuration (contrats, chaînes, etc.)
    └── contracts/      # ABI des contrats
```

### Conventions d’import

- `@features/*` → logique métier et UI spécifique à un domaine.
- `@shared/*` → composants, layouts et configuration réutilisables.
- Pas d’`index.ts` globaux : imports explicites uniquement.
- Chemins d’import directs pour maximiser la clarté et la traçabilité.

Cette approche garantit une séparation claire des responsabilités, une forte réutilisabilité du code partagé et une maintenance facilitée grâce à des dépendances explicites.

---

## Contexte smart contracts

OUCHUI est connecté à quatre contrats déployés sur **Sepolia** :

- **MockUSDC** : token ERC‑20 factice à 6 décimales, utilisé comme actif sous‑jacent de test.
- **VaultT** : vault ERC‑4626, routé vers `VaultMockYield` pour la génération de rendement.
- **VaultD** : vault ERC‑4626.
- **VaultMockYield** : source de rendement factice basée sur la frappe, utilisée pour les scénarios de test.

---

## Flux fonctionnel Sepolia (investisseur)

Le flux actuellement couvert côté frontend est un **parcours investisseur testnet** :

1. Connexion du portefeuille via RainbowKit.
2. Vérification/bascule réseau vers **Sepolia**.
3. Lecture des soldes, autorisations et données de vault.
4. Approbation `MockUSDC` pour le vault cible.
5. Dépôt dans le vault ERC‑4626 sélectionné.
6. Consultation des soldes mis à jour et des aperçus de retrait.
7. Rachat / retrait de parts avec prévisualisation de la quantité de parts à brûler.

Ce flux a été vérifié de bout en bout sur Sepolia : frappe de `MockUSDC`, approbation, dépôt, puis vérification des soldes et de `totalAssets()` côté contrats.

---

## Améliorations clés vs prototype précédent

### Transactions basées sur les reçus

Le cycle de vie des transactions est maintenant aligné sur les bonnes pratiques wagmi :  
les rafraîchissements d’UI attendent la **confirmation on‑chain** (réception du reçu) plutôt que de se déclencher juste après la signature du portefeuille ou l’obtention du hash de transaction.  
Les lectures post‑transaction reposent ainsi explicitement sur un état confirmé, ce qui rend les flux d’écriture plus fiables sur testnet.

### Modèle de lecture unifié

Le hook `useVaultData.ts` a été étendu pour regrouper les lectures **orientées utilisateur** (soldes, autorisations) et **orientées vault** (paramètres du vault).  
Les résultats de multicall sont mappés sur des **champs nommés** plutôt que d’exposer des index fragiles dans les composants UI, ce qui simplifie l’intégration et sécurise la maintenance future.

### Aperçu de retrait ERC‑4626 correct

Le flux de retrait utilise désormais `previewWithdraw(assets)` pour calculer l’estimation de parts à brûler à partir d’un montant d’actifs.  
C’est la fonction d’aperçu ERC‑4626 conforme aux standards pour les retraits orientés « actifs », plus correcte qu’un helper de conversion générique pour ce cas d’usage UI.

### Feedback de transaction plus précis

Le feedback utilisateur distingue clairement :

- l’attente de signature du portefeuille ;
- l’état « soumis, en attente de confirmation on‑chain » ;
- l’état « confirmé on‑chain ».

Cela reflète la réalité du pipeline de transaction : l’approbation du portefeuille et la confirmation de la chaîne sont des événements distincts et ne sont plus conflés dans un seul état.

### Comportement réseau plus sûr

- **Sepolia** est la chaîne principale dans la configuration wagmi.
- Les états de mauvais réseau ne sont plus passifs : l’UI propose une action de bascule automatique « Basculer vers Sepolia ».
- Si la bascule automatique échoue, l’interface affiche un message de bascule manuelle clair.

Ce comportement assume que la bascule automatique n’est pas garantie sur tous les portefeuilles et fournit un repli manuel explicite.

---

## Améliorations UX

### Saisie des montants

Un composant réutilisable `AmountInput` est utilisé pour les dépôts et les retraits :

- entrée contrôlée avec `inputMode="decimal"` plutôt que les champs numériques natifs ;
- meilleure expérience pour les montants financiers (évite les spinners et la notation scientifique) ;
- nettoyage de la saisie qui préserve les états intermédiaires naturels (`""`, `"."`, `"0."`, zéros décimaux de fin) tout en appliquant :
  - un seul point décimal ;
  - une précision maximale de **6 décimales** (alignée sur `MockUSDC`).

L’objectif est de rendre la frappe plus naturelle sans relâcher la sécurité sur les montants envoyés on‑chain.

### Boutons « Max » et validation

Les flux de dépôt et de retrait/rachat gèrent :

- un bouton **Max** pour préremplir avec le solde pertinent ;
- une validation en ligne renforcée pour bloquer les actions obviously invalides (par exemple : déposer plus d’USDC que le portefeuille ne détient, ou retirer au‑delà de la position disponible).

L’idée est de prévenir au maximum les échecs évitables **avant** qu’ils n’atteignent la chaîne, dès lors que le frontend dispose de suffisamment d’information locale.

### États vides et états en attente

- Le panneau de retrait gère explicitement le cas « part = 0 » et indique à l’utilisateur qu’il doit d’abord déposer.
- Les états de transaction en cours utilisent des libellés d’action explicites : « Approbation… », « Dépôt… », « Rachat… », « Retrait… ».
- Les messages de succès sont automatiquement nettoyés après un court délai afin de ne pas encombrer l’interface une fois l’action terminée.

---

## Fiabilité RPC

Le endpoint RPC Sepolia public initial a été remplacé par un endpoint **Alchemy Sepolia** injecté via la configuration d’environnement.  
Les endpoints publics Sepolia étant souvent limités ou instables, un fournisseur RPC dédié améliore la stabilité et la prévisibilité du frontend pendant les tests.

---

## Statut actuel

Ce frontend doit être considéré comme une **itération solide du flux investisseur sur Sepolia**, avec :

- un cycle de vie de transaction plus robuste ;
- une UX d’interaction significativement plus sûre.

Cependant, des travaux importants restent nécessaires avant de pouvoir le qualifier de **prêt pour la production** (sécurité, couverture de tests, conformité, intégrations supplémentaires, etc.).

---

## Travail restant / Roadmap

Les éléments suivants sont actuellement hors périmètre ou incomplets :

- Application complète du **KYC** au niveau des contrats.
- Évaluation soutenue par **NAV/oracle**.
- Intégration des **T‑Bills tokenisés**.
- Intégration des flux de **prêt / stratégie**.
- Couverture de tests automatisés plus large.
- Durcissement du pipeline et de la configuration de déploiement production.
- Exécution et vérification de bout en bout du flux de retrait/rachat complet sur Sepolia (si non encore effectuée).

---

## Démarrage rapide

### Prérequis

- Node.js (version compatible Next.js).
- pnpm installé globalement.
- Accès à un endpoint RPC Sepolia (par exemple via Alchemy).
- Un projet WalletConnect / Reown pour RainbowKit.

### Installation et lancement

```bash
pnpm install
pnpm dev
```

L’application sera disponible sur http://localhost:3000 par défaut.

---

## Configuration d’environnement

Créer un fichier `.env.local` à la racine avec au minimum :

- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` – identifiant projet WalletConnect/Reown pour RainbowKit.
- `NEXT_PUBLIC_SEPOLIA_RPC_URL` – endpoint RPC Sepolia (par exemple Alchemy).

---

## Notes supplémentaires

Lorsque des fonctions d’aperçu ERC‑4626 sont disponibles, OUCHUI privilégie les fonctions **sémantiquement correctes** (`previewDeposit`, `previewMint`, `previewWithdraw`, etc.) pour les estimations orientées utilisateur.  
L’UI reste une couche de commodité au‑dessus des contrats et ne doit jamais être considérée comme un substitut aux garanties fournies par le protocole lui‑même.

---