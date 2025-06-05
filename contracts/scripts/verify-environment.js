
const fs = require('fs');
const path = require('path');

console.log("🔍 Vérification de l'environnement de déploiement");
console.log("==============================================");

function checkEnvironment() {
  let allChecks = true;

  // Vérifier .env
  console.log("\n📋 Vérification du fichier .env...");
  if (!fs.existsSync('.env')) {
    console.error("❌ Fichier .env manquant");
    allChecks = false;
  } else {
    require('dotenv').config();
    
    if (!process.env.ALCHEMY_API_KEY) {
      console.error("❌ ALCHEMY_API_KEY manquante");
      allChecks = false;
    } else {
      console.log("✅ ALCHEMY_API_KEY présente");
    }

    if (!process.env.PRIVATE_KEY) {
      console.error("❌ PRIVATE_KEY manquante");
      allChecks = false;
    } else {
      console.log("✅ PRIVATE_KEY présente");
    }
  }

  // Vérifier package.json
  console.log("\n📦 Vérification de package.json...");
  if (!fs.existsSync('package.json')) {
    console.error("❌ package.json manquant");
    allChecks = false;
  } else {
    console.log("✅ package.json présent");
  }

  // Vérifier hardhat.config.js
  console.log("\n⚙️ Vérification de hardhat.config.js...");
  if (!fs.existsSync('hardhat.config.js')) {
    console.error("❌ hardhat.config.js manquant");
    allChecks = false;
  } else {
    console.log("✅ hardhat.config.js présent");
  }

  // Vérifier les contrats
  console.log("\n📜 Vérification des contrats...");
  const requiredContracts = [
    'contracts/VeegoxConsensus.sol',
    'contracts/VeegoxValidator.sol',
    'contracts/VeegoxToken.sol'
  ];

  requiredContracts.forEach(contract => {
    if (!fs.existsSync(contract)) {
      console.error(`❌ ${contract} manquant`);
      allChecks = false;
    } else {
      console.log(`✅ ${contract} présent`);
    }
  });

  // Vérifier le script de déploiement
  console.log("\n🚀 Vérification du script de déploiement...");
  if (!fs.existsSync('scripts/deploy-veegoxchain.js')) {
    console.error("❌ Script de déploiement manquant");
    allChecks = false;
  } else {
    console.log("✅ Script de déploiement présent");
  }

  console.log("\n" + "=".repeat(50));
  if (allChecks) {
    console.log("🎉 Environnement prêt pour le déploiement !");
    console.log("Vous pouvez maintenant lancer :");
    console.log("node scripts/complete-deployment.js");
  } else {
    console.log("❌ Environnement incomplet. Corrigez les erreurs ci-dessus.");
  }
  
  return allChecks;
}

checkEnvironment();
