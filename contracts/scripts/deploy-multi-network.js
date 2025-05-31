
const { ethers } = require("hardhat");
const fs = require("fs");

// Configuration des réseaux supportés par Alchemy
const ALCHEMY_NETWORKS = {
  ethereum: {
    mainnet: "eth-mainnet",
    sepolia: "eth-sepolia",
    goerli: "eth-goerli"
  },
  polygon: {
    mainnet: "polygon-mainnet", 
    mumbai: "polygon-mumbai"
  },
  arbitrum: {
    mainnet: "arb-mainnet",
    sepolia: "arb-sepolia"
  },
  optimism: {
    mainnet: "opt-mainnet",
    sepolia: "opt-sepolia"
  },
  base: {
    mainnet: "base-mainnet",
    sepolia: "base-sepolia"
  }
};

async function deployToNetwork(networkName, alchemyNetwork) {
  const [deployer] = await ethers.getSigners();
  
  console.log(`\n🚀 Déploiement sur ${networkName} (${alchemyNetwork})`);
  console.log("Compte de déploiement:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Solde:", ethers.utils.formatEther(balance), "ETH");

  // Déployer VeegoxEcosystem
  const VeegoxEcosystem = await ethers.getContractFactory("VeegoxEcosystem");
  
  const deployTx = VeegoxEcosystem.getDeployTransaction();
  const gasEstimate = await ethers.provider.estimateGas(deployTx);
  const gasPrice = await ethers.provider.getGasPrice();
  
  console.log("Gas estimé:", gasEstimate.toString());
  console.log("Prix du gas:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");

  const veegoxEcosystem = await VeegoxEcosystem.deploy({
    gasLimit: gasEstimate.mul(120).div(100),
    gasPrice: gasPrice
  });

  await veegoxEcosystem.deployed();
  console.log("✅ Contrat déployé:", veegoxEcosystem.address);

  // Configuration initiale
  const initialSupplies = {
    VEX: ethers.utils.parseEther("10000000"), // 10M VEX
    sVEX: ethers.utils.parseEther("5000000"), // 5M sVEX
    gVEX: ethers.utils.parseEther("1000000")  // 1M gVEX
  };

  console.log("🪙 Configuration des tokens...");
  
  await veegoxEcosystem.mintSVEX(deployer.address, initialSupplies.sVEX);
  await veegoxEcosystem.mintGVEX(deployer.address, initialSupplies.gVEX);

  // Informations de déploiement
  const deploymentInfo = {
    network: networkName,
    alchemyNetwork: alchemyNetwork,
    contractAddress: veegoxEcosystem.address,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    chainId: (await ethers.provider.getNetwork()).chainId,
    transactionHash: veegoxEcosystem.deployTransaction.hash,
    gasUsed: gasEstimate.toString(),
    gasPrice: gasPrice.toString(),
    initialSupplies: {
      VEX: ethers.utils.formatEther(initialSupplies.VEX),
      sVEX: ethers.utils.formatEther(initialSupplies.sVEX),
      gVEX: ethers.utils.formatEther(initialSupplies.gVEX)
    },
    alchemyEndpoints: {
      http: `https://${alchemyNetwork}.g.alchemy.com/v2/YOUR_API_KEY`,
      websocket: `wss://${alchemyNetwork}.g.alchemy.com/v2/YOUR_API_KEY`
    }
  };

  return deploymentInfo;
}

async function main() {
  const targetNetwork = process.env.TARGET_NETWORK || "sepolia";
  const networkConfig = getNetworkConfig(targetNetwork);
  
  if (!networkConfig) {
    throw new Error(`Réseau non supporté: ${targetNetwork}`);
  }

  console.log("🌐 Configuration Veegox Multi-Network avec Alchemy");
  console.log("=".repeat(60));

  const deploymentInfo = await deployToNetwork(targetNetwork, networkConfig.alchemy);

  // Sauvegarder les informations
  const deploymentsFile = "./deployments.json";
  let deployments = {};
  
  if (fs.existsSync(deploymentsFile)) {
    deployments = JSON.parse(fs.readFileSync(deploymentsFile, "utf8"));
  }
  
  deployments[targetNetwork] = deploymentInfo;
  fs.writeFileSync(deploymentsFile, JSON.stringify(deployments, null, 2));

  // Créer la configuration Alchemy spécifique
  const alchemyConfig = {
    networks: {
      [targetNetwork]: {
        name: targetNetwork,
        chainId: deploymentInfo.chainId,
        rpcUrl: deploymentInfo.alchemyEndpoints.http,
        wsUrl: deploymentInfo.alchemyEndpoints.websocket,
        contractAddress: deploymentInfo.contractAddress,
        blockExplorer: getBlockExplorerUrl(targetNetwork, deploymentInfo.contractAddress)
      }
    },
    webhooks: {
      addressActivity: {
        url: "https://uvtwsfothnnyufxmcpdg.supabase.co/functions/v1/alchemy-webhook",
        addresses: [deploymentInfo.contractAddress],
        events: ["NATIVE_TOKEN_TRANSFER", "ERC20_TRANSFER", "ERC1155_TRANSFER"]
      },
      minedTransactions: {
        url: "https://uvtwsfothnnyufxmcpdg.supabase.co/functions/v1/alchemy-webhook",
        addresses: [deploymentInfo.contractAddress]
      }
    },
    monitoring: {
      contractAddress: deploymentInfo.contractAddress,
      network: targetNetwork,
      alchemyNetwork: networkConfig.alchemy,
      trackTokenTransfers: true,
      trackContractInteractions: true,
      trackGasUsage: true
    }
  };

  fs.writeFileSync(`./alchemy-config-${targetNetwork}.json`, JSON.stringify(alchemyConfig, null, 2));

  // Variables d'environnement pour Supabase
  const supabaseEnvVars = `
# Configuration Veegox ${targetNetwork.toUpperCase()}
VEEGOX_NETWORK=${targetNetwork}
VEEGOX_CONTRACT_ADDRESS_${targetNetwork.toUpperCase()}=${deploymentInfo.contractAddress}
VEEGOX_CHAIN_ID_${targetNetwork.toUpperCase()}=${deploymentInfo.chainId}
ALCHEMY_NETWORK_${targetNetwork.toUpperCase()}=${networkConfig.alchemy}
ALCHEMY_RPC_${targetNetwork.toUpperCase()}=${deploymentInfo.alchemyEndpoints.http}
ALCHEMY_WSS_${targetNetwork.toUpperCase()}=${deploymentInfo.alchemyEndpoints.websocket}
DEPLOYMENT_BLOCK_${targetNetwork.toUpperCase()}=${deploymentInfo.blockNumber}
`;

  fs.writeFileSync(`./supabase-env-${targetNetwork}.txt`, supabaseEnvVars);

  console.log("\n🎉 Déploiement terminé!");
  console.log("=".repeat(50));
  console.log("📍 Contrat:", deploymentInfo.contractAddress);
  console.log("🌐 Réseau:", targetNetwork);
  console.log("🔗 Alchemy:", networkConfig.alchemy);
  console.log("📄 Fichiers créés:");
  console.log(`  - deployments.json`);
  console.log(`  - alchemy-config-${targetNetwork}.json`);
  console.log(`  - supabase-env-${targetNetwork}.txt`);

  console.log("\n📋 Prochaines étapes:");
  console.log("1. Configurer les webhooks Alchemy Notify");
  console.log("2. Ajouter les variables à Supabase");
  console.log("3. Activer la surveillance en temps réel");
  console.log("4. Tester les transactions");

  return deploymentInfo;
}

function getNetworkConfig(network) {
  const configs = {
    // Ethereum
    mainnet: { alchemy: "eth-mainnet", explorer: "https://etherscan.io" },
    sepolia: { alchemy: "eth-sepolia", explorer: "https://sepolia.etherscan.io" },
    goerli: { alchemy: "eth-goerli", explorer: "https://goerli.etherscan.io" },
    
    // Polygon
    polygon: { alchemy: "polygon-mainnet", explorer: "https://polygonscan.com" },
    mumbai: { alchemy: "polygon-mumbai", explorer: "https://mumbai.polygonscan.com" },
    
    // Arbitrum
    arbitrum: { alchemy: "arb-mainnet", explorer: "https://arbiscan.io" },
    "arbitrum-sepolia": { alchemy: "arb-sepolia", explorer: "https://sepolia.arbiscan.io" },
    
    // Optimism
    optimism: { alchemy: "opt-mainnet", explorer: "https://optimistic.etherscan.io" },
    "optimism-sepolia": { alchemy: "opt-sepolia", explorer: "https://sepolia-optimism.etherscan.io" },
    
    // Base
    base: { alchemy: "base-mainnet", explorer: "https://basescan.org" },
    "base-sepolia": { alchemy: "base-sepolia", explorer: "https://sepolia.basescan.org" }
  };
  
  return configs[network];
}

function getBlockExplorerUrl(network, address) {
  const config = getNetworkConfig(network);
  return `${config.explorer}/address/${address}`;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur de déploiement:", error);
    process.exit(1);
  });
