
const { ethers } = require("hardhat");
const { VEEGOXCHAIN_CONFIG } = require("../config/veegoxchain-config");
const { ContractDeployer } = require("../utils/contract-deployer");
const { FileGenerator } = require("../utils/file-generator");
const { DeploymentReporter } = require("../utils/deployment-reporter");

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

  const contractDeployer = new ContractDeployer(deployer);

  // 1. Déployer le contrat de consensus
  const consensus = await contractDeployer.deployConsensus(
    VEEGOXCHAIN_CONFIG.stakingRequirement,
    VEEGOXCHAIN_CONFIG.blockTime
  );

  // 2. Déployer le contrat de validation
  const validator = await contractDeployer.deployValidator(
    consensus.address,
    VEEGOXCHAIN_CONFIG.stakingRequirement
  );

  // 3. Déployer le token natif VGX
  const vgxToken = await contractDeployer.deployToken(
    "VeegoxChain Token",
    "VGX",
    ethers.utils.parseEther("1000000000") // 1 milliard de tokens
  );

  // 4. Configuration initiale
  await contractDeployer.configureContracts(consensus, validator, vgxToken);

  // 5. Préparer les informations de déploiement
  const networkInfo = await ethers.provider.getNetwork();
  const deploymentInfo = {
    network: networkInfo,
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
    config: VEEGOXCHAIN_CONFIG
  };

  // 6. Générer tous les fichiers de configuration
  const fileGenerator = new FileGenerator(VEEGOXCHAIN_CONFIG, deploymentInfo);
  fileGenerator.writeAllFiles();

  // 7. Afficher le rapport final
  const reporter = new DeploymentReporter(VEEGOXCHAIN_CONFIG, deploymentInfo);
  reporter.printFullReport();

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
