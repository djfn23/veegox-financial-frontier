
const { ethers } = require("hardhat");

class DeploymentReporter {
  constructor(config, deploymentInfo) {
    this.config = config;
    this.deploymentInfo = deploymentInfo;
  }

  printSuccessReport() {
    const networkInfo = this.deploymentInfo.network;
    
    console.log("\n🎉 VeegoxChain déployée avec succès!");
    console.log("=".repeat(60));
    console.log("🌐 Réseau de déploiement:", networkInfo.name);
    console.log("📍 Consensus:", this.deploymentInfo.contracts.consensus.address);
    console.log("🛡️ Validateur:", this.deploymentInfo.contracts.validator.address);
    console.log("🪙 Token VGX:", this.deploymentInfo.contracts.nativeToken.address);
    console.log("🆔 VeegoxChain ID:", this.config.chainId);
    console.log("⛓️ Block Time:", this.config.blockTime, "secondes");
  }

  printNextSteps() {
    console.log("\n📋 Prochaines étapes:");
    console.log("1. Vérifier les contrats sur Etherscan");
    console.log("2. Configurer les nœuds Alchemy pour VeegoxChain");
    console.log("3. Ajouter les variables à Supabase");
    console.log("4. Déployer les contrats de l'écosystème Veegox");
    console.log("5. Configurer le bridge multi-chaînes");
    console.log("6. Activer la surveillance en temps réel");
  }

  printVerificationCommands() {
    const networkInfo = this.deploymentInfo.network;
    
    console.log("\n🔍 Commandes de vérification:");
    console.log(`npx hardhat verify --network ${networkInfo.name} ${this.deploymentInfo.contracts.consensus.address} "${this.config.stakingRequirement}" ${this.config.blockTime}`);
    console.log(`npx hardhat verify --network ${networkInfo.name} ${this.deploymentInfo.contracts.validator.address} "${this.deploymentInfo.contracts.consensus.address}" "${this.config.stakingRequirement}"`);
    console.log(`npx hardhat verify --network ${networkInfo.name} ${this.deploymentInfo.contracts.nativeToken.address} "VeegoxChain Token" "VGX" "${ethers.parseEther("1000000000")}"`);
  }

  printFullReport() {
    this.printSuccessReport();
    this.printNextSteps();
    this.printVerificationCommands();
  }
}

module.exports = { DeploymentReporter };
