
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🚀 Installation complète et déploiement de VeegoxChain");
console.log("===================================================");

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

async function installAndDeploy() {
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

  // Installation complète des dépendances
  console.log("\n📦 Installation de toutes les dépendances...");
  if (!runCommand('npm install', 'Installation npm')) {
    console.error("❌ Échec de l'installation npm");
    return;
  }

  // Vérifier que Hardhat fonctionne
  if (!runCommand('npx hardhat --version', 'Vérification Hardhat')) {
    console.error("❌ Hardhat non fonctionnel");
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

installAndDeploy().catch(console.error);
