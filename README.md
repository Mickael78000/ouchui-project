# OUCHUI Frontend Update

OUCHUI est une dApp Next.js + React + TypeScript pour interagir avec les vaults ERC-4626 sur Sepolia. Elle utilise wagmi + viem pour les lectures et écritures de contrats, RainbowKit pour la connexion de portefeuille, et Tailwind CSS pour le style. Le périmètre actuel est un flux testnet orienté investisseur : connecter un portefeuille, lire les données du vault, approuver MockUSDC, déposer dans un vault, et gérer le rachat de parts et l'UX de retrait. [web:20][web:183][cite:3]

Le frontend est maintenant considérablement plus fiable pour les tests Sepolia que le prototype précédent. Le cycle de vie des transactions attend les reçus on-chain avant de rafraîchir l'état, l'UX de saisie des montants est renforcée, les actions impossibles sont désactivées plus tôt, et la gestion des mauvais réseaux est explicite et récupérable. Ces changements rendent l'application plus sûre et plus claire pour l'utilisation testnet, bien qu'elle ne devrait pas encore être décrite comme prête pour la production. [web:76][web:121][web:143]

## Déploiement

🚀 **Application déployée :** https://ouchui-project.vercel.app/

## Stack Technique

- Next.js
- React
- TypeScript
- wagmi
- viem
- RainbowKit
- Tailwind CSS [web:20][web:170]

## Architecture du Code

Le projet utilise une architecture feature-based pour une meilleure scalabilité et maintenabilité :

```
src/
├── features/           # Logique métier et UI spécifique
│   ├── dashboard/      # Composants dashboard
│   └── vaults/         # Composants et hooks vaults
└── shared/             # Éléments réutilisables
    ├── ui/            # Composants UI génériques
    ├── layout/        # Layouts partagés
    ├── config/        # Configuration contrats
    └── contracts/     # ABI des contrats
```

### Conventions d'Imports

- **`@features/*`** → Logique métier et UI spécifique à un domaine
- **`@shared/*`** → Composants, layouts et configuration réutilisables
- **Pas d'index.ts globaux** → Imports explicites uniquement
- **Chemins directs** → Privilégier la clarté et la traçabilité

Cette approche garantit :
- Séparation claire des responsabilités
- Réutilisabilité maximale du code partagé
- Maintenance facilitée avec des dépendances explicites

## Contexte des Contrats

Le frontend est connecté à quatre contrats Sepolia :

- MockUSDC — actif sous-jacent ERC-20 factice à 6 décimales utilisé pour les tests
- VaultT — vault ERC-4626 (route vers VaultMockYield pour le rendement)
- VaultD — vault ERC-4626
- VaultMockYield — source de rendement factice pour les tests basés sur la frappe [cite:3]

## Ce Qui a Changé

### Écritures basées sur les reçus

Le flux de transactions a été mis à niveau pour que les rafraîchissements de l'UI n'aient lieu qu'après confirmation on-chain, pas immédiatement après la signature du portefeuille ou le retour du hash de transaction. C'est le modèle correct pour les flux d'écriture basés sur wagmi car les lectures post-transaction doivent dépendre de la confirmation du reçu, pas seulement de l'état de soumission. [web:76][web:78]


### Meilleur modèle de lecture

`useVaultData.ts` a été étendu pour que les lectures orientées utilisateur et les lectures orientées vault se rafraîchissent ensemble. Le hook inclut maintenant la lecture des autorisations pour le flux de dépôt et utilise des champs de retour nommés au lieu de divulguer des hypothèses fragiles d'index multicall dans les composants UI. Mapper les résultats multicall en champs nommés est un modèle d'intégration plus propre et rend la maintenance ultérieure plus sûre. [web:78][web:167]

### Aperçu de retrait ERC-4626 correct

Le flux de retrait utilise maintenant `previewWithdraw(assets)` pour la vue "parts à brûler" estimée, qui est l'aperçu ERC-4626 conforme aux normes pour les retraits basés sur les actifs au bloc actuel. C'est plus correct que d'utiliser un assistant de conversion générique pour le même objectif UI. [web:75][web:94]

### Feedback de transaction plus clair

Le feedback de transaction distingue maintenant :
- attente de la signature du portefeuille,
- soumis et attente de confirmation on-chain,
- confirmé on-chain. [web:76]

Cette formulation est délibérément plus précise car l'approbation du portefeuille et la confirmation de chaîne ne sont pas le même événement. [web:76]

### Comportement réseau plus sûr

Sepolia est maintenant la chaîne principale dans la configuration wagmi. Les états de mauvais réseau ne sont plus passifs : l'UI présente une action "Basculer vers Sepolia" et revient à un message de basculement manuel clair si la demande automatique échoue. Le basculement automatique de chaîne est utile mais n'est pas garanti sur tous les portefeuilles, donc le repli manuel reste important. [web:121][web:143]

## Améliorations UX

### Renforcement de la saisie des montants

Un composant `AmountInput` réutilisable a été introduit pour les actions de dépôt et de retrait. Il utilise une saisie de texte contrôlée avec `inputMode="decimal"` plutôt que de s'appuyer sur les saisies numériques du navigateur, ce qui améliore le comportement de saisie numérique pour les montants financiers et évite les particularités spécifiques au navigateur telles que les spinners et la saisie en notation scientifique. [web:132][web:129]

La désinfection de la saisie préserve les états de frappe intermédiaires naturels tels que `""`, `"."`, `"0."` et les zéros décimaux de fin tout en appliquant toujours un point décimal unique et une limite de précision de 6 décimales pour le flux basé sur MockUSDC. Cela produit une expérience de frappe plus naturelle sans relâcher la sécurité des montants. [web:142][cite:3]

### Boutons Max et validation

Les flux de dépôt et de retrait/rachat supportent maintenant le comportement du bouton Max et une validation en ligne plus forte. L'UI empêche les actions évidemment invalides avant soumission, comme essayer de déposer plus d'USDC que le portefeuille ne détient ou tenter de retirer/racheter au-delà de la position disponible. Une bonne UX dApp devrait bloquer les échecs évitables avant qu'ils n'atteignent la chaîne chaque fois que l'application a suffisamment d'informations locales pour savoir que l'action échouera. [web:116][web:127]

### Meilleurs états vides et en attente

Le panneau de retrait gère maintenant un état de part zéro explicitement en indiquant à l'utilisateur qu'il n'a pas encore de parts et devrait d'abord déposer. Les états de transaction en attente utilisent également des étiquettes d'action plus claires comme "Approbation…", "Dépôt…", "Rachat…" et "Retrait…", rendant l'interface plus lisible pendant la progression de la transaction. [web:127]

Les états confirmés ne persistent plus indéfiniment. Le feedback de succès est automatiquement effacé après un court délai pour que les utilisateurs puissent continuer à l'action suivante sans que des bannières de confirmation obsolètes ne dominent le panneau. [web:127]

## Fiabilité RPC

Le chemin RPC Sepolia public original a été remplacé par un endpoint Alchemy Sepolia via la configuration de l'environnement. C'est une amélioration pratique de stabilité car les endpoints Sepolia publics sont souvent limités en débit ou peu fiables, tandis qu'un fournisseur RPC dédié donne un comportement frontend plus prévisible pendant les tests. [web:156][web:158]

## Flux Sepolia Vérifié

Le chemin d'approbation et de dépôt a été vérifié de bout en bout sur Sepolia :

1. MockUSDC a été frappé vers le portefeuille de test
2. Le portefeuille s'est connecté via le frontend sur Sepolia
3. L'approbation a été accordée pour le vault cible
4. Un dépôt a été soumis et confirmé on-chain
5. Les soldes post-dépôt ont été vérifiés contre les lectures de contrats on-chain [cite:3]

L'état post-dépôt vérifié a montré :
- le solde de parts du vault mis à jour comme attendu,
- le `totalAssets()` du vault reflète le dépôt,
- le solde USDC du portefeuille a diminué du montant déposé. [cite:3]

## Statut Actuel

Ce frontend devrait être considéré comme une **itération de flux investisseur prête Sepolia** solide, pas une version prête pour la production. Il a maintenant un cycle de vie de transaction beaucoup plus fiable et une sécurité d'interaction significativement meilleure, mais un travail important reste avant que le produit puisse être décrit comme complet. [cite:3]

## Travail Restant

Les éléments suivants restent hors périmètre ou incomplets pour le moment :

- application complète du KYC au niveau des contrats
- évaluation soutenue par NAV/oracle
- intégration des T-Bills tokenisés
- intégration prêt/stratégie
- couverture de tests automatisés plus large
- durcissement du déploiement de production final
- confirmation que le chemin de retrait/rachat complet a été exécuté et vérifié de bout en bout sur Sepolia, si ce n'est pas encore fait [cite:3]

## Démarrage Rapide

```bash
pnpm install
pnpm dev
```

Assurez-vous que `.env.local` inclut :
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- `NEXT_PUBLIC_SEPOLIA_RPC_URL`

Ensuite ouvrez l'application, connectez un portefeuille, basculez vers Sepolia si nécessaire, et testez le flux de dépôt / retrait avec un petit montant d'abord. [web:20][web:183][web:156]

## Notes

Lorsque les aperçus ERC-4626 sont utilisés, le frontend préfère maintenant les fonctions d'aperçu sémantiquement correctes pour les estimations orientées utilisateur. Cela améliore la clarté, mais l'UI devrait toujours être traitée comme une couche de commodité sur les contrats plutôt qu'un substitut aux garanties au niveau du protocole. [web:75][web:94]