
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🚀 Lancement automatique de VeegoxChain");
console.log("=====================================");

// Fonction pour exécuter une commande et afficher la sortie
function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    // Force kill any existing Hardhat processes on Windows
    if (process.platform === 'win32') {
      try {
        execSync('taskkill /f /im node.exe /fi "WINDOWTITLE eq Hardhat*"', { stdio: 'ignore' });
      } catch (e) {
        // Ignore if no processes found
      }
    }

    execSync(command, { 
      stdio: 'inherit', 
      cwd: path.resolve(__dirname, '..'),
      timeout: 300000, // 5 minutes timeout
      env: { ...process.env, FORCE_COLOR: '0' }
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
    if (!runCommand('npm install --legacy-peer-deps --no-audit', 'Installation des dépendances')) {
      process.exit(1);
    }

    // 2. Nettoyage du cache Hardhat
    if (!runCommand('npx hardhat clean', 'Nettoyage du cache')) {
      console.log("⚠️ Nettoyage échoué, continuons...");
    }

    // 3. Compilation des contrats avec gestion d'erreur améliorée
    console.log("\n🔨 Compilation des contrats...");
    try {
      execSync('npx hardhat compile --force', { 
        stdio: 'inherit', 
        cwd: path.resolve(__dirname, '..'),
        timeout: 120000, // 2 minutes timeout
        env: { ...process.env, FORCE_COLOR: '0' }
      });
      console.log("✅ Compilation terminée avec succès");
    } catch (error) {
      console.error("❌ Erreur de compilation:", error.message);
      console.log("🔍 Tentative de diagnostic...");
      
      // Vérifier la structure des fichiers
      console.log("📁 Contenu du dossier contracts:");
      const files = fs.readdirSync(contractsDir);
      files.forEach(file => {
        console.log(`  - ${file}`);
      });
      
      process.exit(1);
    }

    // 4. Déploiement sur Sepolia
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
