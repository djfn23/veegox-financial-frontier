
const { execSync } = require('child_process');
const path = require('path');

console.log("🚀 Lancement automatique de VeegoxChain");
console.log("=====================================");

// Fonction pour exécuter une commande et afficher la sortie
function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: path.resolve(__dirname, '..')
    });
    console.log(`✅ ${description} terminé avec succès`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de ${description}:`, error.message);
    return false;
  }
}

async function launchVeegoxChain() {
  try {
    // Vérifier que nous sommes dans le bon répertoire
    const currentDir = process.cwd();
    console.log("📍 Répertoire actuel:", currentDir);

    // 1. Installation des dépendances avec --legacy-peer-deps
    if (!runCommand('npm install --legacy-peer-deps', 'Installation des dépendances')) {
      process.exit(1);
    }

    // 2. Compilation des contrats
    if (!runCommand('npx hardhat compile', 'Compilation des contrats')) {
      process.exit(1);
    }

    // 3. Déploiement sur Sepolia
    if (!runCommand('npx hardhat run scripts/deploy-veegoxchain.js --network sepolia', 'Déploiement VeegoxChain sur Sepolia')) {
      process.exit(1);
    }

    console.log("\n🎉 VeegoxChain déployée avec succès!");
    console.log("📄 Vérifiez les fichiers générés dans le dossier contracts/");
    console.log("📋 Prochaines étapes:");
    console.log("1. Ajouter les variables d'environnement à Supabase");
    console.log("2. Configurer les nœuds Alchemy");
    console.log("3. Activer la surveillance blockchain");

  } catch (error) {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  }
}

// Lancer le déploiement
launchVeegoxChain();
