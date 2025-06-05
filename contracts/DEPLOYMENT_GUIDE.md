
# Guide de Déploiement VeegoxChain

## Vue d'ensemble

Ce guide vous accompagne dans le déploiement complet de VeegoxChain avec tous les outils automatisés.

## Prérequis

1. **Node.js** (version 18 ou supérieure)
2. **npm** ou **yarn**
3. **Git** (optionnel)

## Configuration initiale

### 1. Variables d'environnement

Créez ou modifiez le fichier `.env` :

```bash
# Configuration Alchemy
ALCHEMY_API_KEY=votre_cle_alchemy_ici

# Clé privée (sans 0x)
PRIVATE_KEY=votre_cle_privee_ici

# Réseau cible
TARGET_NETWORK=sepolia

# API Keys pour vérification
ETHERSCAN_API_KEY=votre_cle_etherscan
POLYGONSCAN_API_KEY=votre_cle_polygonscan
ARBISCAN_API_KEY=votre_cle_arbiscan
OPTIMISM_API_KEY=votre_cle_optimism
BASESCAN_API_KEY=votre_cle_basescan
```

### 2. Vérification de l'environnement

```bash
node scripts/verify-environment.js
```

## Méthodes de déploiement

### Méthode 1 : Script automatique complet

```bash
node scripts/complete-deployment.js
```

### Méthode 2 : Scripts par OS

**Windows :**
```cmd
deploy-windows.cmd
```

**Linux/Mac :**
```bash
chmod +x deploy-linux.sh
./deploy-linux.sh
```

### Méthode 3 : Déploiement multi-réseaux

```bash
node scripts/deploy-all-networks.js
```

## Après le déploiement

### 1. Post-traitement automatique

```bash
node scripts/post-deployment.js
```

### 2. Fichiers générés

- `veegoxchain-deployment.json` - Informations principales
- `veegoxchain-alchemy-config.json` - Configuration Alchemy
- `veegoxchain-genesis.json` - Fichier Genesis blockchain
- `supabase-veegoxchain-env.txt` - Variables pour Supabase

## Nettoyage

Si vous devez recommencer :

```bash
node scripts/cleanup.js
```

## Dépannage

### Erreur HH801 (dépendances manquantes)

Le script `complete-deployment.js` installe automatiquement toutes les dépendances.

### Erreur de compilation

1. Nettoyez : `node scripts/cleanup.js`
2. Relancez : `node scripts/complete-deployment.js`

### Erreur de réseau

Vérifiez vos variables d'environnement avec :
```bash
node scripts/verify-environment.js
```

## Support

- Vérifiez les logs de déploiement
- Consultez les fichiers générés
- Utilisez les scripts de vérification

## Prochaines étapes

1. Ajoutez les variables Supabase
2. Configurez les nœuds Alchemy
3. Activez la surveillance blockchain
4. Déployez l'écosystème Veegox (VEX, sVEX, gVEX)
