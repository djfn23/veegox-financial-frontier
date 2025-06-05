
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🚀 Lancement VeegoxChain avec contrat existant");
console.log("==============================================");
console.log("Contrat: 0xF3E1D80dA667D50641f0110F2Bb70882cd16343E");

function runCommand(command, description, options = {}) {
  console.log(`\n📋 ${description}...`);
  try {
    const defaultOptions = { 
      stdio: 'inherit', 
      cwd: path.resolve(__dirname, '..'),
      timeout: 300000,
      shell: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    execSync(command, mergedOptions);
    console.log(`✅ ${description} terminé avec succès`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de ${description}:`, error.message);
    return false;
  }
}

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

async function launchVeegoxChainWithContract() {
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

    // 1. Nettoyer le cache
    console.log("\n🧹 Nettoyage du cache...");
    cleanCache();

    // 2. Installation des dépendances
    if (!runCommand('npm install --no-optional --legacy-peer-deps', 'Installation des dépendances')) {
      console.error("❌ Échec de l'installation des dépendances");
      process.exit(1);
    }

    // 3. Compilation des contrats
    console.log("\n🔨 Compilation des contrats...");
    if (!runCommand('npx hardhat clean', 'Nettoyage Hardhat')) return;
    if (!runCommand('npx hardhat compile --force', 'Compilation forcée')) {
      console.error("❌ Échec de la compilation");
      process.exit(1);
    }

    // 4. Déploiement avec le contrat existant
    if (!runCommand('npx hardhat run scripts/deploy-with-existing-contract.js --network sepolia', 'Déploiement VeegoxChain avec contrat existant')) {
      console.error("❌ Échec du déploiement");
      process.exit(1);
    }

    // 5. Post-traitement
    if (fs.existsSync(path.join(__dirname, '..', 'veegoxchain-deployment.json'))) {
      console.log("\n📄 Post-traitement...");
      runCommand('node scripts/post-deployment.js', 'Post-traitement');
    }

    console.log("\n🎉 VeegoxChain avec contrat existant déployée avec succès!");
    console.log("📊 Contrat intégré: 0xF3E1D80dA667D50641f0110F2Bb70882cd16343E");

  } catch (error) {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  }
}

launchVeegoxChainWithContract();
