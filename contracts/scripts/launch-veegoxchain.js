
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🚀 Lancement automatique de VeegoxChain");
console.log("=====================================");

// Fonction pour exécuter une commande et afficher la sortie
function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: path.resolve(__dirname, '..'),
      timeout: 300000 // 5 minutes timeout
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
    // Vérifier les variables d'environnement
    require('dotenv').config();
    
    if (!process.env.ALCHEMY_API_KEY) {
      console.error("❌ ALCHEMY_API_KEY manquante dans le fichier .env");
      process.exit(1);
    }
    
    if (!process.env.PRIVATE_KEY) {
      console.error("❌ PRIVATE_KEY manquante dans le fichier .env");
      process.exit(1);
    }

    console.log("✅ Variables d'environnement vérifiées");

    // Vérifier que nous sommes dans le bon répertoire
    const currentDir = process.cwd();
    console.log("📍 Répertoire actuel:", currentDir);

    // Vérifier que les fichiers de contrats existent
    const contractsDir = path.join(__dirname, '..', 'contracts');
    if (!fs.existsSync(contractsDir)) {
      console.error("❌ Dossier contracts/ non trouvé");
      process.exit(1);
    }

    const requiredContracts = [
      'VeegoxConsensus.sol',
      'VeegoxValidator.sol', 
      'VeegoxToken.sol'
    ];

    for (const contract of requiredContracts) {
      const contractPath = path.join(contractsDir, contract);
      if (!fs.existsSync(contractPath)) {
        console.error(`❌ Contrat ${contract} non trouvé dans ${contractsDir}`);
        process.exit(1);
      }
    }

    // 1. Installation des dépendances
    if (!runCommand('npm install', 'Installation des dépendances')) {
      process.exit(1);
    }

    // 2. Nettoyage du cache Hardhat
    runCommand('npx hardhat clean', 'Nettoyage du cache');

    // 3. Compilation des contrats
    if (!runCommand('npx hardhat compile', 'Compilation des contrats')) {
      process.exit(1);
    }

    // 4. Déploiement sur Sepolia
    if (!runCommand('npx hardhat run scripts/deploy-veegoxchain.js --network sepolia', 'Déploiement VeegoxChain sur Sepolia')) {
      process.exit(1);
    }

    console.log("\n🎉 VeegoxChain déployée avec succès!");
    console.log("📄 Vérifiez les fichiers générés dans le dossier contracts/");

  } catch (error) {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  }
}

// Lancer le déploiement
launchVeegoxChain();
