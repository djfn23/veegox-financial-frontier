
const { ethers } = require("hardhat");

class ContractDeployer {
  constructor(deployer) {
    this.deployer = deployer;
  }

  async deployConsensus(stakingRequirement, blockTime) {
    console.log("\n📋 1. Déploiement du contrat de consensus...");
    const VeegoxConsensus = await ethers.getContractFactory("VeegoxConsensus");
    
    const consensus = await VeegoxConsensus.deploy(stakingRequirement, blockTime);
    await consensus.deployed();
    
    console.log("✅ Consensus déployé:", consensus.address);
    console.log("📝 Transaction hash:", consensus.deployTransaction.hash);
    
    return consensus;
  }

  async deployValidator(consensusAddress, stakingRequirement) {
    console.log("\n🛡️ 2. Déploiement du système de validation...");
    const VeegoxValidator = await ethers.getContractFactory("VeegoxValidator");
    
    const validator = await VeegoxValidator.deploy(consensusAddress, stakingRequirement);
    await validator.deployed();
    
    console.log("✅ Validateur déployé:", validator.address);
    console.log("📝 Transaction hash:", validator.deployTransaction.hash);
    
    return validator;
  }

  async deployToken(name, symbol, totalSupply) {
    console.log("\n🪙 3. Déploiement du token natif VGX...");
    const VeegoxToken = await ethers.getContractFactory("VeegoxToken");
    
    const vgxToken = await VeegoxToken.deploy(name, symbol, totalSupply);
    await vgxToken.deployed();
    
    console.log("✅ Token VGX déployé:", vgxToken.address);
    console.log("📝 Transaction hash:", vgxToken.deployTransaction.hash);
    
    return vgxToken;
  }

  async configureContracts(consensus, validator, vgxToken) {
    console.log("\n⚙️ 4. Configuration initiale...");
    
    // Configurer le consensus avec le token VGX
    const setStakingTokenTx = await consensus.setStakingToken(vgxToken.address);
    await setStakingTokenTx.wait();
    console.log("✅ Token de staking configuré");

    // Configurer le validateur avec le token VGX
    const setValidatorTokenTx = await validator.setStakingToken(vgxToken.address);
    await setValidatorTokenTx.wait();
    console.log("✅ Token validateur configuré");
  }
}

module.exports = { ContractDeployer };
