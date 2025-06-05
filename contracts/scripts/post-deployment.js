
const fs = require('fs');
const path = require('path');

console.log("📄 Post-traitement du déploiement VeegoxChain");
console.log("===========================================");

async function postDeployment() {
  const deploymentFile = 'veegoxchain-deployment.json';
  
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Fichier de déploiement introuvable");
    return;
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  
  console.log("📋 Informations de déploiement :");
  console.log("Réseau :", deployment.network.name);
  console.log("Chain ID :", deployment.network.chainId);
  console.log("Déployeur :", deployment.deployer);
  console.log("Timestamp :", deployment.deploymentTime);
  
  console.log("\n📍 Adresses des contrats :");
  console.log("Consensus :", deployment.contracts.consensus);
  console.log("Validator :", deployment.contracts.validator);
  console.log("Token VGX :", deployment.contracts.nativeToken);

  // Créer le fichier de configuration Alchemy
  const alchemyConfig = {
    chainId: deployment.network.chainId,
    name: "VeegoxChain",
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    wsUrl: `wss://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    contracts: deployment.contracts,
    deploymentInfo: {
      deployer: deployment.deployer,
      timestamp: deployment.deploymentTime,
      network: deployment.network.name
    }
  };

  fs.writeFileSync('veegoxchain-alchemy-config.json', JSON.stringify(alchemyConfig, null, 2));
  console.log("\n✅ Configuration Alchemy créée : veegoxchain-alchemy-config.json");

  // Créer le fichier Genesis pour la blockchain
  const genesisConfig = {
    chainId: `0x${deployment.network.chainId.toString(16)}`,
    homesteadBlock: 0,
    eip150Block: 0,
    eip155Block: 0,
    eip158Block: 0,
    byzantiumBlock: 0,
    constantinopleBlock: 0,
    petersburgBlock: 0,
    istanbulBlock: 0,
    berlinBlock: 0,
    londonBlock: 0,
    alloc: {
      [deployment.deployer]: {
        balance: "0x21e19e0c9bab2400000"
      }
    },
    difficulty: "0x1",
    gasLimit: "0x1c9c380"
  };

  fs.writeFileSync('veegoxchain-genesis.json', JSON.stringify(genesisConfig, null, 2));
  console.log("✅ Fichier Genesis créé : veegoxchain-genesis.json");

  // Créer les variables d'environnement pour Supabase
  const supabaseEnv = `
# Variables VeegoxChain pour Supabase
VEEGOXCHAIN_CONSENSUS_ADDRESS=${deployment.contracts.consensus}
VEEGOXCHAIN_VALIDATOR_ADDRESS=${deployment.contracts.validator}
VEEGOXCHAIN_TOKEN_ADDRESS=${deployment.contracts.nativeToken}
VEEGOXCHAIN_DEPLOYER=${deployment.deployer}
VEEGOXCHAIN_NETWORK=${deployment.network.name}
VEEGOXCHAIN_CHAIN_ID=${deployment.network.chainId}
VEEGOXCHAIN_DEPLOYMENT_TIME=${deployment.deploymentTime}
`;

  fs.writeFileSync('supabase-veegoxchain-env.txt', supabaseEnv);
  console.log("✅ Variables Supabase créées : supabase-veegoxchain-env.txt");

  console.log("\n🎉 Post-traitement terminé !");
  console.log("📁 Fichiers générés :");
  console.log("   - veegoxchain-deployment.json");
  console.log("   - veegoxchain-alchemy-config.json");
  console.log("   - veegoxchain-genesis.json");
  console.log("   - supabase-veegoxchain-env.txt");
}

postDeployment().catch(console.error);
