
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🚀 Lancement simplifié de VeegoxChain");
console.log("===================================");

function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: path.resolve(__dirname, '..'),
      timeout: 120000
    });
    console.log(`✅ ${description} terminé`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur: ${description}`);
    return false;
  }
}

async function launch() {
  // Vérifier l'environnement
  require('dotenv').config();
  
  if (!process.env.ALCHEMY_API_KEY) {
    console.error("❌ ALCHEMY_API_KEY manquante");
    return;
  }

  // Nettoyer
  console.log("🧹 Nettoyage...");
  ['cache', 'artifacts'].forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  });

  // Installation
  if (!runCommand('npm install --no-optional', 'Installation')) return;
  
  // Compilation
  if (!runCommand('npx hardhat clean', 'Nettoyage Hardhat')) return;
  if (!runCommand('npx hardhat compile', 'Compilation')) return;
  
  // Déploiement
  if (!runCommand('npx hardhat run scripts/deploy-veegoxchain.js --network sepolia', 'Déploiement')) return;

  console.log("\n🎉 Processus terminé!");
}

launch().catch(console.error);
