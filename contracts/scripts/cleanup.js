
const fs = require('fs');
const path = require('path');

console.log("🧹 Nettoyage complet du projet");
console.log("============================");

function cleanup() {
  const dirsToClean = [
    'cache',
    'artifacts',
    'node_modules',
    'typechain-types'
  ];

  const filesToClean = [
    'package-lock.json',
    'yarn.lock',
    'veegoxchain-deployment.json',
    'veegoxchain-alchemy-config.json',
    'veegoxchain-genesis.json',
    'supabase-veegoxchain-env.txt'
  ];

  console.log("🗂️ Suppression des dossiers...");
  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✅ ${dir} supprimé`);
      } catch (error) {
        console.warn(`⚠️ Impossible de supprimer ${dir}:`, error.message);
      }
    } else {
      console.log(`ℹ️ ${dir} n'existe pas`);
    }
  });

  console.log("\n📄 Suppression des fichiers...");
  filesToClean.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
        console.log(`✅ ${file} supprimé`);
      } catch (error) {
        console.warn(`⚠️ Impossible de supprimer ${file}:`, error.message);
      }
    } else {
      console.log(`ℹ️ ${file} n'existe pas`);
    }
  });

  console.log("\n🎉 Nettoyage terminé !");
  console.log("Vous pouvez maintenant relancer le déploiement avec :");
  console.log("node scripts/complete-deployment.js");
}

cleanup();
