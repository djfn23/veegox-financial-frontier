
const fs = require('fs');
const path = require('path');

console.log("🔍 Vérification de la structure des contrats...");

const contractsDir = path.join(__dirname, '..', 'contracts');
const requiredContracts = [
  'VeegoxConsensus.sol',
  'VeegoxValidator.sol',
  'VeegoxToken.sol'
];

console.log("📁 Répertoire des contrats:", contractsDir);

requiredContracts.forEach(contract => {
  const filePath = path.join(contractsDir, contract);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${contract} - Taille: ${stats.size} bytes`);
  } else {
    console.log(`❌ ${contract} - MANQUANT`);
  }
});

// Vérifier le contenu des fichiers
requiredContracts.forEach(contract => {
  const filePath = path.join(contractsDir, contract);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('pragma solidity') && content.includes('contract')) {
      console.log(`✅ ${contract} - Structure Solidity valide`);
    } else {
      console.log(`⚠️ ${contract} - Structure Solidity invalide`);
    }
  }
});

console.log("\n📋 Vérification terminée");
