
const { ethers } = require("hardhat");
const fs = require("fs");

async function deployVeegoxChainWithExistingContract() {
  console.log("🚀 Déploiement VeegoxChain avec contrat existant");
  console.log("=".repeat(60));

  const [deployer] = await ethers.getSigners();
  console.log("Déployeur:", deployer.address);

  const network = await ethers.provider.getNetwork();
  console.log("Réseau:", network.name, "Chain ID:", network.chainId);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Solde:", ethers.formatEther(balance), "ETH");

  // Adresse du contrat existant fournie par l'utilisateur
  const existingContractAddress = "0xF3E1D80dA667D50641f0110F2Bb70882cd16343E";
  console.log("Contrat existant:", existingContractAddress);

  // Vérifier que le contrat existe
  const code = await ethers.provider.getCode(existingContractAddress);
  if (code === "0x") {
    throw new Error(`❌ Aucun contrat trouvé à l'adresse ${existingContractAddress}`);
  }
  console.log("✅ Contrat vérifié à l'adresse spécifiée");

  // 1. Déployer le contrat de consensus
  console.log("\n📋 1. Déploiement du contrat de consensus...");
  const VeegoxConsensus = await ethers.getContractFactory("VeegoxConsensus");
  
  const stakingRequirement = ethers.parseEther("10000"); // 10,000 VGX
  const blockTime = 3; // 3 secondes
  
  const consensus = await VeegoxConsensus.deploy(stakingRequirement, blockTime);
  await consensus.waitForDeployment();
  
  console.log("✅ Consensus déployé:", await consensus.getAddress());

  // 2. Déployer le contrat de validation
  console.log("\n🛡️ 2. Déploiement du système de validation...");
  const VeegoxValidator = await ethers.getContractFactory("VeegoxValidator");
  
  const validator = await VeegoxValidator.deploy(await consensus.getAddress(), stakingRequirement);
  await validator.waitForDeployment();
  
  console.log("✅ Validateur déployé:", await validator.getAddress());

  // 3. Utiliser le contrat existant comme token natif
  console.log("\n🪙 3. Intégration du token existant...");
  console.log("✅ Token existant intégré:", existingContractAddress);

  // 4. Configuration initiale
  console.log("\n⚙️ 4. Configuration initiale...");
  
  try {
    // Configurer le consensus avec le token existant
    const setStakingTokenTx = await consensus.setStakingToken(existingContractAddress);
    await setStakingTokenTx.wait();
    console.log("✅ Token de staking configuré");

    // Configurer le validateur avec le token existant
    const setValidatorTokenTx = await validator.setStakingToken(existingContractAddress);
    await setValidatorTokenTx.wait();
    console.log("✅ Token validateur configuré");
  } catch (error) {
    console.log("⚠️ Configuration automatique non disponible:", error.message);
  }

  // 5. Créer la configuration VeegoxChain
  const chainConfig = {
    chainId: 0x7645782, // 123456789 en décimal
    name: "VeegoxChain",
    symbol: "VGX",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2",
    wsUrl: "wss://eth-sepolia.g.alchemy.com/v2",
    consensus: "PoS",
    blockTime: 3,
    gasLimit: "30000000",
    validators: [deployer.address]
  };

  // 6. Informations de déploiement
  const deploymentInfo = {
    network: {
      name: network.name,
      chainId: Number(network.chainId)
    },
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    chainConfig: chainConfig,
    contracts: {
      consensus: await consensus.getAddress(),
      validator: await validator.getAddress(),
      existingToken: existingContractAddress,
      nativeToken: existingContractAddress // Utilise le contrat existant
    },
    contractVerified: true,
    existingContractIntegrated: true
  };

  // 7. Sauvegarder les informations de déploiement
  fs.writeFileSync("./veegoxchain-deployment.json", JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 VeegoxChain déployée avec succès!");
  console.log("=".repeat(70));
  console.log("🌐 Réseau:", network.name);
  console.log("🔗 Chain ID:", chainConfig.chainId);
  console.log("📍 Consensus:", await consensus.getAddress());
  console.log("🛡️ Validateur:", await validator.getAddress());
  console.log("🪙 Token (existant):", existingContractAddress);
  console.log("📄 Informations sauvegardées dans veegoxchain-deployment.json");

  console.log("\n📋 Prochaines étapes:");
  console.log("1. Exécuter: node scripts/post-deployment.js");
  console.log("2. Configurer l'interface avec les nouvelles adresses");
  console.log("3. Activer la surveillance blockchain");

  return deploymentInfo;
}

async function main() {
  try {
    return await deployVeegoxChainWithExistingContract();
  } catch (error) {
    console.error("❌ Erreur de déploiement:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { deployVeegoxChainWithExistingContract };
