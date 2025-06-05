
const { ethers } = require("hardhat");

async function deployVeegoxChain() {
  console.log("🚀 Déploiement de VeegoxChain");
  console.log("=".repeat(50));

  const [deployer] = await ethers.getSigners();
  console.log("Déployeur:", deployer.address);

  const network = await ethers.provider.getNetwork();
  console.log("Réseau:", network.name, "Chain ID:", network.chainId);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Solde:", ethers.formatEther(balance), "ETH");

  if (balance < ethers.parseEther("0.01")) {
    throw new Error("❌ Solde insuffisant pour le déploiement. Minimum 0.01 ETH requis.");
  }

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

  // 3. Déployer le token natif VGX
  console.log("\n🪙 3. Déploiement du token natif VGX...");
  const VeegoxToken = await ethers.getContractFactory("VeegoxToken");
  
  const totalSupply = ethers.parseEther("1000000000"); // 1 milliard de tokens
  const vgxToken = await VeegoxToken.deploy("VeegoxChain Token", "VGX", totalSupply);
  await vgxToken.waitForDeployment();
  
  console.log("✅ Token VGX déployé:", await vgxToken.getAddress());

  // 4. Configuration initiale
  console.log("\n⚙️ 4. Configuration initiale...");
  
  // Configurer le consensus avec le token VGX
  const setStakingTokenTx = await consensus.setStakingToken(await vgxToken.getAddress());
  await setStakingTokenTx.wait();
  console.log("✅ Token de staking configuré");

  // Configurer le validateur avec le token VGX
  const setValidatorTokenTx = await validator.setStakingToken(await vgxToken.getAddress());
  await setValidatorTokenTx.wait();
  console.log("✅ Token validateur configuré");

  // 5. Informations de déploiement
  const deploymentInfo = {
    network: {
      name: network.name,
      chainId: Number(network.chainId)
    },
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    contracts: {
      consensus: await consensus.getAddress(),
      validator: await validator.getAddress(),
      nativeToken: await vgxToken.getAddress()
    }
  };

  // 6. Sauvegarder les informations de déploiement
  const fs = require("fs");
  fs.writeFileSync("./veegoxchain-deployment.json", JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 VeegoxChain déployée avec succès!");
  console.log("=".repeat(60));
  console.log("🌐 Réseau:", network.name);
  console.log("📍 Consensus:", await consensus.getAddress());
  console.log("🛡️ Validateur:", await validator.getAddress());
  console.log("🪙 Token VGX:", await vgxToken.getAddress());
  console.log("📄 Informations sauvegardées dans veegoxchain-deployment.json");

  console.log("\n📋 Prochaines étapes:");
  console.log("1. Vérifier les contrats sur Etherscan");
  console.log("2. Ajouter les adresses aux variables d'environnement");
  console.log("3. Configurer l'interface utilisateur");

  return deploymentInfo;
}

async function main() {
  try {
    return await deployVeegoxChain();
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

module.exports = { deployVeegoxChain };
