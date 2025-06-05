
const { ethers } = require("hardhat");
const fs = require("fs");

// Configuration VeegoxChain
const VEEGOXCHAIN_CONFIG = {
  chainId: 0x7645782, // 123456789 en décimal
  name: "VeegoxChain",
  symbol: "VGX",
  consensus: "PoS",
  blockTime: 3, // 3 secondes
  gasLimit: "30000000",
  initialValidators: 3,
  stakingRequirement: ethers.utils.parseEther("10000") // 10,000 VGX minimum pour être validateur
};

async function deployVeegoxChain() {
  const [deployer] = await ethers.getSigners();
  
  console.log("🚀 Déploiement de VeegoxChain");
  console.log("=".repeat(50));
  console.log("Déployeur:", deployer.address);
  console.log("Réseau:", await ethers.provider.getNetwork());
  
  const balance = await deployer.getBalance();
  console.log("Solde:", ethers.utils.formatEther(balance), "ETH");

  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    throw new Error("❌ Solde insuffisant pour le déploiement. Minimum 0.01 ETH requis.");
  }

  // 1. Déployer le contrat de consensus VeegoxChain
  console.log("\n📋 1. Déploiement du contrat de consensus...");
  const VeegoxConsensus = await ethers.getContractFactory("VeegoxConsensus");
  
  const consensus = await VeegoxConsensus.deploy(
    VEEGOXCHAIN_CONFIG.stakingRequirement,
    VEEGOXCHAIN_CONFIG.blockTime
  );
  
  await consensus.deployed();
  console.log("✅ Consensus déployé:", consensus.address);
  console.log("📝 Transaction hash:", consensus.deployTransaction.hash);

  // 2. Déployer le contrat de validation
  console.log("\n🛡️ 2. Déploiement du système de validation...");
  const VeegoxValidator = await ethers.getContractFactory("VeegoxValidator");
  
  const validator = await VeegoxValidator.deploy(
    consensus.address,
    VEEGOXCHAIN_CONFIG.stakingRequirement
  );
  
  await validator.deployed();
  console.log("✅ Validateur déployé:", validator.address);
  console.log("📝 Transaction hash:", validator.deployTransaction.hash);

  // 3. Déployer le token natif VGX
  console.log("\n🪙 3. Déploiement du token natif VGX...");
  const VeegoxToken = await ethers.getContractFactory("VeegoxToken");
  
  const vgxToken = await VeegoxToken.deploy(
    "VeegoxChain Token",
    "VGX",
    ethers.utils.parseEther("1000000000") // 1 milliard de tokens
  );
  
  await vgxToken.deployed();
  console.log("✅ Token VGX déployé:", vgxToken.address);
  console.log("📝 Transaction hash:", vgxToken.deployTransaction.hash);

  // 4. Configuration initiale
  console.log("\n⚙️ 4. Configuration initiale...");
  
  // Configurer le consensus avec le token VGX
  const setStakingTokenTx = await consensus.setStakingToken(vgxToken.address);
  await setStakingTokenTx.wait();
  console.log("✅ Token de staking configuré");

  // Configurer le validateur avec le token VGX
  const setValidatorTokenTx = await validator.setStakingToken(vgxToken.address);
  await setValidatorTokenTx.wait();
  console.log("✅ Token validateur configuré");

  // 5. Configuration Alchemy pour VeegoxChain
  console.log("\n🌐 5. Configuration Alchemy...");
  
  const networkInfo = await ethers.provider.getNetwork();
  const alchemyConfig = {
    chainId: VEEGOXCHAIN_CONFIG.chainId,
    chainName: VEEGOXCHAIN_CONFIG.name,
    networkName: networkInfo.name,
    deployedOn: {
      network: networkInfo.name,
      chainId: networkInfo.chainId
    },
    nativeCurrency: {
      name: "VeegoxChain Token",
      symbol: VEEGOXCHAIN_CONFIG.symbol,
      decimals: 18
    },
    rpcUrls: [
      `https://veegoxchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ],
    blockExplorerUrls: [
      "https://explorer.veegoxchain.com"
    ],
    contracts: {
      consensus: consensus.address,
      validator: validator.address,
      nativeToken: vgxToken.address
    },
    genesis: {
      blockNumber: 0,
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      timestamp: Math.floor(Date.now() / 1000),
      difficulty: "0x1",
      gasLimit: VEEGOXCHAIN_CONFIG.gasLimit,
      alloc: {
        [deployer.address]: {
          balance: ethers.utils.parseEther("1000000").toString()
        }
      }
    }
  };

  // Sauvegarder la configuration
  const deploymentInfo = {
    network: networkInfo.name,
    chainId: networkInfo.chainId,
    veegoxChainId: VEEGOXCHAIN_CONFIG.chainId,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    gasUsed: {
      consensus: (await consensus.deployTransaction.wait()).gasUsed.toString(),
      validator: (await validator.deployTransaction.wait()).gasUsed.toString(),
      token: (await vgxToken.deployTransaction.wait()).gasUsed.toString()
    },
    contracts: {
      consensus: {
        address: consensus.address,
        txHash: consensus.deployTransaction.hash
      },
      validator: {
        address: validator.address,
        txHash: validator.deployTransaction.hash
      },
      nativeToken: {
        address: vgxToken.address,
        txHash: vgxToken.deployTransaction.hash
      }
    },
    config: VEEGOXCHAIN_CONFIG,
    alchemy: alchemyConfig
  };

  // Écrire les fichiers de configuration
  fs.writeFileSync("./veegoxchain-deployment.json", JSON.stringify(deploymentInfo, null, 2));
  fs.writeFileSync("./veegoxchain-alchemy-config.json", JSON.stringify(alchemyConfig, null, 2));

  // Générer le fichier genesis.json
  const genesisConfig = {
    config: {
      chainId: VEEGOXCHAIN_CONFIG.chainId,
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
      clique: {
        period: VEEGOXCHAIN_CONFIG.blockTime,
        epoch: 30000
      }
    },
    difficulty: "0x1",
    gasLimit: VEEGOXCHAIN_CONFIG.gasLimit,
    extradata: "0x" + "0".repeat(64) + deployer.address.slice(2) + "0".repeat(130),
    alloc: alchemyConfig.genesis.alloc
  };

  fs.writeFileSync("./veegoxchain-genesis.json", JSON.stringify(genesisConfig, null, 2));

  // Variables d'environnement pour Supabase
  const supabaseEnvVars = `
# Configuration VeegoxChain - Déployé le ${new Date().toISOString()}
VEEGOXCHAIN_CHAIN_ID=${VEEGOXCHAIN_CONFIG.chainId}
VEEGOXCHAIN_NAME=${VEEGOXCHAIN_CONFIG.name}
VEEGOXCHAIN_SYMBOL=${VEEGOXCHAIN_CONFIG.symbol}
VEEGOXCHAIN_CONSENSUS_ADDRESS=${consensus.address}
VEEGOXCHAIN_VALIDATOR_ADDRESS=${validator.address}
VEEGOXCHAIN_TOKEN_ADDRESS=${vgxToken.address}
VEEGOXCHAIN_RPC_URL=https://veegoxchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}
VEEGOXCHAIN_WSS_URL=wss://veegoxchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}
VEEGOXCHAIN_EXPLORER_URL=https://explorer.veegoxchain.com
VEEGOXCHAIN_DEPLOYED_ON=${networkInfo.name}
VEEGOXCHAIN_DEPLOYER=${deployer.address}
`;

  fs.writeFileSync("./supabase-veegoxchain-env.txt", supabaseEnvVars);

  console.log("\n🎉 VeegoxChain déployée avec succès!");
  console.log("=".repeat(60));
  console.log("🌐 Réseau de déploiement:", networkInfo.name);
  console.log("📍 Consensus:", consensus.address);
  console.log("🛡️ Validateur:", validator.address);
  console.log("🪙 Token VGX:", vgxToken.address);
  console.log("🆔 VeegoxChain ID:", VEEGOXCHAIN_CONFIG.chainId);
  console.log("⛓️ Block Time:", VEEGOXCHAIN_CONFIG.blockTime, "secondes");
  
  console.log("\n📄 Fichiers générés:");
  console.log("  - veegoxchain-deployment.json");
  console.log("  - veegoxchain-alchemy-config.json");
  console.log("  - veegoxchain-genesis.json");
  console.log("  - supabase-veegoxchain-env.txt");

  console.log("\n📋 Prochaines étapes:");
  console.log("1. Vérifier les contrats sur Etherscan");
  console.log("2. Configurer les nœuds Alchemy pour VeegoxChain");
  console.log("3. Ajouter les variables à Supabase");
  console.log("4. Déployer les contrats de l'écosystème Veegox");
  console.log("5. Configurer le bridge multi-chaînes");
  console.log("6. Activer la surveillance en temps réel");

  // Commandes de vérification
  console.log("\n🔍 Commandes de vérification:");
  console.log(`npx hardhat verify --network ${networkInfo.name} ${consensus.address} "${VEEGOXCHAIN_CONFIG.stakingRequirement}" ${VEEGOXCHAIN_CONFIG.blockTime}`);
  console.log(`npx hardhat verify --network ${networkInfo.name} ${validator.address} "${consensus.address}" "${VEEGOXCHAIN_CONFIG.stakingRequirement}"`);
  console.log(`npx hardhat verify --network ${networkInfo.name} ${vgxToken.address} "VeegoxChain Token" "VGX" "${ethers.utils.parseEther("1000000000")}"`);

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur de déploiement VeegoxChain:", error);
    process.exit(1);
  });

async function main() {
  return await deployVeegoxChain();
}
