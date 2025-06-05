
const { ethers } = require("hardhat");

class ContractDeployer {
  constructor(deployer) {
    this.deployer = deployer;
  }

  async deployConsensus(stakingRequirement, blockTime) {
    console.log("\n📋 1. Déploiement du contrat de consensus...");
    const VeegoxConsensus = await ethers.getContractFactory("VeegoxConsensus");
    
    const consensus = await VeegoxConsensus.deploy(stakingRequirement, blockTime);
    await consensus.waitForDeployment();
    
    console.log("✅ Consensus déployé:", consensus.target);
    console.log("📝 Transaction hash:", consensus.deploymentTransaction().hash);
    
    return consensus;
  }

  async deployValidator(consensusAddress, stakingRequirement) {
    console.log("\n🛡️ 2. Déploiement du système de validation...");
    const VeegoxValidator = await ethers.getContractFactory("VeegoxValidator");
    
    const validator = await VeegoxValidator.deploy(consensusAddress, stakingRequirement);
    await validator.waitForDeployment();
    
    console.log("✅ Validateur déployé:", validator.target);
    console.log("📝 Transaction hash:", validator.deploymentTransaction().hash);
    
    return validator;
  }

  async deployToken(name, symbol, totalSupply) {
    console.log("\n🪙 3. Déploiement du token natif VGX...");
    const VeegoxToken = await ethers.getContractFactory("VeegoxToken");
    
    const vgxToken = await VeegoxToken.deploy(name, symbol, totalSupply);
    await vgxToken.waitForDeployment();
    
    console.log("✅ Token VGX déployé:", vgxToken.target);
    console.log("📝 Transaction hash:", vgxToken.deploymentTransaction().hash);
    
    return vgxToken;
  }

  async configureContracts(consensus, validator, vgxToken) {
    console.log("\n⚙️ 4. Configuration initiale...");
    
    // Configurer le consensus avec le token VGX
    const setStakingTokenTx = await consensus.setStakingToken(vgxToken.target);
    await setStakingTokenTx.wait();
    console.log("✅ Token de staking configuré");

    // Configurer le validateur avec le token VGX
    const setValidatorTokenTx = await validator.setStakingToken(vgxToken.target);
    await setValidatorTokenTx.wait();
    console.log("✅ Token validateur configuré");
  }
}

module.exports = { ContractDeployer };
