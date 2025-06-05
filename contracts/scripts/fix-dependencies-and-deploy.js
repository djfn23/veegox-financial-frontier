
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🔧 Correction des dépendances et déploiement de VeegoxChain");
console.log("============================================================");

function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: path.resolve(__dirname, '..'),
      timeout: 300000,
      shell: true
    });
    console.log(`✅ ${description} terminé`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur: ${description}`);
    console.error(error.message);
    return false;
  }
}

async function fixAndDeploy() {
  // Vérifier l'environnement
  require('dotenv').config();
  
  if (!process.env.ALCHEMY_API_KEY) {
    console.error("❌ ALCHEMY_API_KEY manquante dans .env");
    return;
  }

  console.log("✅ Variables d'environnement trouvées");

  // Nettoyer complètement
  console.log("🧹 Nettoyage complet...");
  ['cache', 'artifacts', 'node_modules', 'package-lock.json'].forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(fullPath)) {
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`🧹 ${dir} supprimé`);
      } catch (error) {
        console.warn(`⚠️ Impossible de supprimer ${dir}`);
      }
    }
  });

  // Installation complète de toutes les dépendances Hardhat
  console.log("\n📦 Installation des dépendances Hardhat...");
  const hardhatDeps = [
    '@nomicfoundation/hardhat-chai-matchers@^2.0.0',
    '@nomicfoundation/hardhat-ethers@^3.0.0', 
    '@nomicfoundation/hardhat-network-helpers@^1.0.0',
    '@nomicfoundation/hardhat-verify@^2.0.0',
    '@typechain/ethers-v6@^0.5.0',
    '@typechain/hardhat@^9.0.0',
    '@types/chai@^4.2.0',
    '@types/mocha@^10.0.0',
    'chai@^4.2.0',
    'ethers@^6.4.0',
    'hardhat-gas-reporter@^1.0.8',
    'solidity-coverage@^0.8.1',
    'ts-node@^10.0.0',
    'typechain@^8.3.0',
    'typescript@^5.0.0'
  ].join(' ');

  if (!runCommand(`npm install --save-dev ${hardhatDeps}`, 'Installation dépendances Hardhat')) {
    console.error("❌ Échec de l'installation des dépendances Hardhat");
    return;
  }

  // Installation des dépendances principales
  console.log("\n📦 Installation des dépendances principales...");
  if (!runCommand('npm install @openzeppelin/contracts@^4.9.3 dotenv@^16.3.1', 'Installation dépendances principales')) {
    console.error("❌ Échec de l'installation des dépendances principales");
    return;
  }

  // Vérifier que Hardhat fonctionne maintenant
  if (!runCommand('npx hardhat --version', 'Vérification Hardhat')) {
    console.error("❌ Hardhat non fonctionnel après installation");
    return;
  }

  // Compilation
  console.log("\n🔨 Compilation des contrats...");
  if (!runCommand('npx hardhat clean', 'Nettoyage Hardhat')) return;
  if (!runCommand('npx hardhat compile --force', 'Compilation')) return;

  // Déploiement
  console.log("\n🌐 Déploiement sur Sepolia...");
  if (!runCommand('npx hardhat run scripts/deploy-veegoxchain.js --network sepolia', 'Déploiement VeegoxChain')) {
    console.error("❌ Échec du déploiement");
    return;
  }

  console.log("\n🎉 VeegoxChain déployée avec succès!");
  
  // Vérifier si le fichier de déploiement existe
  const deploymentFile = path.join(__dirname, '..', 'veegoxchain-deployment.json');
  if (fs.existsSync(deploymentFile)) {
    console.log("📄 Fichier de déploiement créé :", deploymentFile);
    const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    console.log("📍 Adresses déployées :");
    console.log("   - Consensus:", deployment.contracts.consensus);
    console.log("   - Validator:", deployment.contracts.validator);
    console.log("   - Token VGX:", deployment.contracts.nativeToken);
  }
}

fixAndDeploy().catch(console.error);
