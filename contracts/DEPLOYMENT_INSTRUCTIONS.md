
# Guide de Déploiement VeegoxChain

## Étapes de Déploiement

### 1. Configuration des Variables d'Environnement

Éditez le fichier `contracts/.env` avec vos vraies clés :

```bash
# Configuration Alchemy pour VeegoxChain
ALCHEMY_API_KEY=votre_vraie_cle_api_alchemy

# Clé privée pour le déploiement (sans préfixe 0x)
PRIVATE_KEY=votre_cle_privee_sans_0x

# Configuration réseau cible
TARGET_NETWORK=sepolia

# API Keys pour la vérification des contrats
ETHERSCAN_API_KEY=votre_cle_etherscan
POLYGONSCAN_API_KEY=votre_cle_polygonscan
ARBISCAN_API_KEY=votre_cle_arbiscan
OPTIMISM_API_KEY=votre_cle_optimism
BASESCAN_API_KEY=votre_cle_basescan
```

### 2. Installation et Compilation

```bash
cd contracts
npm install
npm run compile
```

### 3. Test Local (Optionnel)

```bash
# Démarrer un nœud local
npm run node

# Dans un autre terminal
npm run deploy:veegoxchain
```

### 4. Déploiement sur Sepolia

```bash
npm run deploy:veegoxchain:sepolia
```

### 5. Déploiement sur Mainnet (Production)

```bash
npm run deploy:veegoxchain:mainnet
```

## Fichiers Générés

Après le déploiement, les fichiers suivants seront créés :

- `veegoxchain-deployment.json` - Informations de déploiement
- `veegoxchain-alchemy-config.json` - Configuration Alchemy
- `veegoxchain-genesis.json` - Fichier Genesis de la blockchain
- `supabase-veegoxchain-env.txt` - Variables pour Supabase

## Post-Déploiement

1. Ajouter les variables d'environnement à Supabase
2. Configurer les nœuds Alchemy
3. Activer la surveillance blockchain
4. Déployer l'écosystème Veegox (VEX, sVEX, gVEX)

## Vérification des Contrats

```bash
npm run verify:sepolia -- ADRESSE_CONTRAT
npm run verify:mainnet -- ADRESSE_CONTRAT
```
