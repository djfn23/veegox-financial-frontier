
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🚀 Lancement automatique de VeegoxChain");
console.log("=====================================");

// Fonction pour exécuter une commande et afficher la sortie
function runCommand(command, description, options = {}) {
  console.log(`\n📋 ${description}...`);
  try {
    const defaultOptions = { 
      stdio: 'inherit', 
      cwd: path.resolve(__dirname, '..'),
      timeout: 300000, // 5 minutes timeout
      windowsHide: true, // Hide window on Windows
      shell: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    execSync(command, mergedOptions);
    console.log(`✅ ${description} terminé avec succès`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de ${description}:`, error.message);
    if (error.stdout) console.log('STDOUT:', error.stdout.toString());
    if (error.stderr) console.log('STDERR:', error.stderr.toString());
    return false;
  }
}

// Fonction pour nettoyer les fichiers de cache
function cleanCache() {
  const cacheDirs = ['cache', 'artifacts', 'node_modules/.cache'];
  
  cacheDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(fullPath)) {
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`🧹 Cache ${dir} nettoyé`);
      } catch (error) {
        console.warn(`⚠️ Impossible de nettoyer ${dir}:`, error.message);
      }
    }
  });
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

    console.log("✅ Tous les contrats requis sont présents");

    // 1. Nettoyer le cache
    console.log("\n🧹 Nettoyage du cache...");
    cleanCache();

    // 2. Installation des dépendances
    if (!runCommand('npm install --no-optional --legacy-peer-deps', 'Installation des dépendances')) {
      console.error("❌ Échec de l'installation des dépendances");
      process.exit(1);
    }

    // 3. Compilation des contrats avec retry
    console.log("\n🔨 Compilation des contrats...");
    let compilationSuccess = false;
    const maxRetries = 3;
    
    for (let i = 0; i < maxRetries; i++) {
      console.log(`Tentative de compilation ${i + 1}/${maxRetries}...`);
      
      if (runCommand('npx hardhat clean', 'Nettoyage Hardhat', { stdio: 'pipe' })) {
        if (runCommand('npx hardhat compile --force', 'Compilation forcée', { stdio: 'inherit' })) {
          compilationSuccess = true;
          break;
        }
      }
      
      if (i < maxRetries - 1) {
        console.log("⏳ Attente avant nouvelle tentative...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        cleanCache();
      }
    }

    if (!compilationSuccess) {
      console.error("❌ Échec de la compilation après plusieurs tentatives");
      process.exit(1);
    }

    // 4. Déploiement sur Sepolia
    if (!runCommand('npx hardhat run scripts/deploy-veegoxchain.js --network sepolia', 'Déploiement VeegoxChain sur Sepolia')) {
      console.error("❌ Échec du déploiement");
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
