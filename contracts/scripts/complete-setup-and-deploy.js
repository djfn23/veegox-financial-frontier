
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🔧 Configuration complète et déploiement VeegoxChain");
console.log("==================================================");

function runCommand(command, description, allowFailure = false) {
  console.log(`\n📋 ${description}...`);
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: path.resolve(__dirname, '..'),
      timeout: 600000, // 10 minutes
      shell: true
    });
    console.log(`✅ ${description} terminé`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur: ${description}`);
    if (!allowFailure) {
      console.error(error.message);
      return false;
    }
    return true;
  }
}

async function completeSetupAndDeploy() {
  // Vérifier l'environnement
  require('dotenv').config();
  
  if (!process.env.ALCHEMY_API_KEY) {
    console.error("❌ ALCHEMY_API_KEY manquante dans .env");
    console.log("Créez le fichier .env avec votre clé Alchemy");
    return;
  }

  console.log("✅ Variables d'environnement trouvées");

  // Nettoyage radical
  console.log("🧹 Nettoyage radical du projet...");
  const itemsToClean = [
    'cache', 
    'artifacts', 
    'node_modules', 
    'package-lock.json',
    'yarn.lock',
    'typechain-types'
  ];

  itemsToClean.forEach(item => {
    const fullPath = path.join(__dirname, '..', item);
    if (fs.existsSync(fullPath)) {
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`🧹 ${item} supprimé`);
      } catch (error) {
        console.warn(`⚠️ Impossible de supprimer ${item}:`, error.message);
      }
    }
  });

  // Nettoyer le cache npm
  console.log("\n🧹 Nettoyage du cache npm...");
  runCommand('npm cache clean --force', 'Nettoyage cache npm', true);

  // Vérifier et corriger npm
  console.log("\n🔧 Vérification npm...");
  runCommand('npm --version', 'Version npm');

  // Installation par étapes avec flags spéciaux
  console.log("\n📦 Installation étape 1: Hardhat core...");
  if (!runCommand('npm install --no-package-lock --legacy-peer-deps hardhat@^2.19.0', 'Installation Hardhat')) {
    console.error("❌ Impossible d'installer Hardhat");
    return;
  }

  console.log("\n📦 Installation étape 2: OpenZeppelin...");
  if (!runCommand('npm install --no-package-lock --legacy-peer-deps @openzeppelin/contracts@^4.9.3', 'Installation OpenZeppelin')) {
    console.error("❌ Impossible d'installer OpenZeppelin");
    return;
  }

  console.log("\n📦 Installation étape 3: Ethers...");
  if (!runCommand('npm install --no-package-lock --legacy-peer-deps ethers@^6.4.0', 'Installation Ethers')) {
    console.error("❌ Impossible d'installer Ethers");
    return;
  }

  console.log("\n📦 Installation étape 4: Dotenv...");
  if (!runCommand('npm install --no-package-lock --legacy-peer-deps dotenv@^16.3.1', 'Installation Dotenv')) {
    console.error("❌ Impossible d'installer Dotenv");
    return;
  }

  console.log("\n📦 Installation étape 5: Toolbox Hardhat...");
  if (!runCommand('npm install --save-dev --no-package-lock --legacy-peer-deps @nomicfoundation/hardhat-toolbox@^4.0.0', 'Installation Toolbox')) {
    console.error("❌ Impossible d'installer Toolbox");
    return;
  }

  // Vérifier que les modules sont bien installés
  console.log("\n🔍 Vérification des modules installés...");
  const requiredModules = [
    'hardhat',
    'ethers', 
    '@openzeppelin/contracts',
    'dotenv'
  ];

  for (const module of requiredModules) {
    const modulePath = path.join(__dirname, '..', 'node_modules', module);
    if (!fs.existsSync(modulePath)) {
      console.error(`❌ Module ${module} non trouvé`);
      return;
    } else {
      console.log(`✅ ${module} installé`);
    }
  }

  // Test Hardhat
  console.log("\n🔍 Test de Hardhat...");
  if (!runCommand('npx hardhat --version', 'Test Hardhat')) {
    console.error("❌ Hardhat ne fonctionne pas");
    return;
  }

  // Compilation
  console.log("\n🔨 Compilation des contrats...");
  if (!runCommand('npx hardhat clean', 'Nettoyage Hardhat')) return;
  if (!runCommand('npx hardhat compile --force', 'Compilation forcée')) {
    console.error("❌ Échec de la compilation");
    return;
  }

  // Déploiement
  console.log("\n🌐 Déploiement sur Sepolia...");
  if (!runCommand('npx hardhat run scripts/deploy-veegoxchain.js --network sepolia', 'Déploiement VeegoxChain')) {
    console.error("❌ Échec du déploiement");
    return;
  }

  console.log("\n🎉 VeegoxChain déployée avec succès!");
  
  // Vérifier le fichier de déploiement
  const deploymentFile = path.join(__dirname, '..', 'veegoxchain-deployment.json');
  if (fs.existsSync(deploymentFile)) {
    console.log("📄 Fichier de déploiement créé");
    const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    console.log("\n📍 Adresses déployées :");
    console.log("   - Consensus:", deployment.contracts?.consensus || 'Non disponible');
    console.log("   - Validator:", deployment.contracts?.validator || 'Non disponible');
    console.log("   - Token VGX:", deployment.contracts?.nativeToken || 'Non disponible');
    
    console.log("\n🔗 Prochaines étapes :");
    console.log("1. Lancer: node scripts/post-deployment.js");
    console.log("2. Configurer Supabase avec les nouvelles variables");
    console.log("3. Activer la surveillance blockchain");
  } else {
    console.log("⚠️ Fichier de déploiement non créé");
  }
}

completeSetupAndDeploy().catch(console.error);
