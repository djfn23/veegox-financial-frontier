
const { execSync } = require('child_process');
const fs = require('fs');

console.log("🌐 Déploiement multi-réseaux VeegoxChain");
console.log("======================================");

const networks = [
  { name: 'sepolia', displayName: 'Sepolia Testnet' },
  { name: 'polygon', displayName: 'Polygon Mainnet' },
  { name: 'arbitrum', displayName: 'Arbitrum One' },
  { name: 'optimism', displayName: 'Optimism' },
  { name: 'base', displayName: 'Base' }
];

function runDeployment(network) {
  console.log(`\n🚀 Déploiement sur ${network.displayName}...`);
  try {
    execSync(`npx hardhat run scripts/deploy-veegoxchain.js --network ${network.name}`, {
      stdio: 'inherit',
      timeout: 300000
    });
    
    // Renommer le fichier de déploiement
    if (fs.existsSync('veegoxchain-deployment.json')) {
      const deploymentData = JSON.parse(fs.readFileSync('veegoxchain-deployment.json', 'utf8'));
      fs.writeFileSync(`veegoxchain-deployment-${network.name}.json`, JSON.stringify(deploymentData, null, 2));
      console.log(`✅ Déploiement ${network.displayName} terminé`);
      return deploymentData;
    }
    return null;
  } catch (error) {
    console.error(`❌ Erreur déploiement ${network.displayName}:`, error.message);
    return null;
  }
}

async function deployAllNetworks() {
  const deployments = {};
  
  for (const network of networks) {
    const deployment = runDeployment(network);
    if (deployment) {
      deployments[network.name] = deployment;
    }
    
    // Pause entre les déploiements
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  // Créer un résumé
  const summary = {
    deploymentTime: new Date().toISOString(),
    networks: deployments,
    totalNetworks: Object.keys(deployments).length
  };
  
  fs.writeFileSync('veegoxchain-multi-deployment-summary.json', JSON.stringify(summary, null, 2));
  
  console.log("\n🎉 Déploiement multi-réseaux terminé !");
  console.log(`✅ Déployé sur ${Object.keys(deployments).length} réseaux`);
  console.log("📄 Résumé : veegoxchain-multi-deployment-summary.json");
}

deployAllNetworks().catch(console.error);
