
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🔍 Vérification du déploiement des contrats Veegox...");

  // Lire les informations de déploiement
  let deploymentInfo;
  try {
    const deploymentData = fs.readFileSync("./deployed-contracts.json", "utf8");
    deploymentInfo = JSON.parse(deploymentData);
  } catch (error) {
    console.error("❌ Fichier deployed-contracts.json introuvable.");
    console.log("Assurez-vous d'avoir exécuté le script de déploiement en premier.");
    process.exit(1);
  }

  const contractAddress = deploymentInfo.contractAddress;
  console.log("📍 Adresse du contrat:", contractAddress);
  console.log("🌐 Réseau:", deploymentInfo.network);

  // Se connecter au contrat déployé
  const VeegoxEcosystem = await ethers.getContractFactory("VeegoxEcosystem");
  const contract = VeegoxEcosystem.attach(contractAddress);

  try {
    // Vérifier les informations de base du contrat
    console.log("\n📋 Vérification des informations du contrat...");
    
    const name = await contract.name();
    const symbol = await contract.symbol();
    const owner = await contract.owner();
    
    console.log("- Nom:", name);
    console.log("- Symbole:", symbol);
    console.log("- Propriétaire:", owner);

    // Vérifier les supplies totales
    console.log("\n💰 Vérification des supplies totales...");
    const vexSupply = await contract.totalSupply(0); // VEX
    const svexSupply = await contract.totalSupply(1); // sVEX  
    const gvexSupply = await contract.totalSupply(2); // gVEX

    console.log("- VEX Total Supply:", ethers.utils.formatEther(vexSupply));
    console.log("- sVEX Total Supply:", ethers.utils.formatEther(svexSupply));
    console.log("- gVEX Total Supply:", ethers.utils.formatEther(gvexSupply));

    // Vérifier les paramètres de configuration
    console.log("\n⚙️ Vérification de la configuration...");
    const stakingAPY = await contract.stakingAPY();
    const swapFeeRate = await contract.swapFeeRate();
    const stakingDuration = await contract.STAKING_DURATION();
    const quorumThreshold = await contract.QUORUM_THRESHOLD();

    console.log("- Staking APY:", stakingAPY.toString(), "bp (", (stakingAPY / 100).toString(), "%)");
    console.log("- Swap Fee Rate:", swapFeeRate.toString(), "bp (", (swapFeeRate / 100).toString(), "%)");
    console.log("- Staking Duration:", stakingDuration.toString(), "secondes (", (stakingDuration / 86400).toString(), "jours)");
    console.log("- Quorum Threshold:", ethers.utils.formatEther(quorumThreshold), "gVEX");

    // Vérifier que le contrat n'est pas en pause
    const paused = await contract.paused();
    console.log("- Contrat en pause:", paused ? "Oui ❌" : "Non ✅");

    // Tester une fonction de lecture
    console.log("\n🧪 Test des fonctions...");
    const deployerAddress = deploymentInfo.deployer;
    const deployerVEXBalance = await contract.balanceOf(deployerAddress, 0);
    console.log("- Balance VEX du déployeur:", ethers.utils.formatEther(deployerVEXBalance));

    // Générer un rapport de vérification
    const verificationReport = {
      verificationTime: new Date().toISOString(),
      contractAddress: contractAddress,
      network: deploymentInfo.network,
      contractInfo: {
        name: name,
        symbol: symbol,
        owner: owner,
        paused: paused
      },
      tokenSupplies: {
        VEX: ethers.utils.formatEther(vexSupply),
        sVEX: ethers.utils.formatEther(svexSupply),
        gVEX: ethers.utils.formatEther(gvexSupply)
      },
      configuration: {
        stakingAPY: stakingAPY.toString(),
        swapFeeRate: swapFeeRate.toString(),
        stakingDuration: stakingDuration.toString(),
        quorumThreshold: ethers.utils.formatEther(quorumThreshold)
      },
      status: "verified",
      checks: {
        contractAccessible: true,
        ownerCorrect: owner.toLowerCase() === deployerAddress.toLowerCase(),
        notPaused: !paused,
        tokensInitialized: vexSupply.gt(0) && svexSupply.gt(0) && gvexSupply.gt(0)
      }
    };

    fs.writeFileSync("./verification-report.json", JSON.stringify(verificationReport, null, 2));

    console.log("\n✅ Vérification terminée avec succès!");
    console.log("📄 Rapport sauvegardé dans verification-report.json");
    
    if (verificationReport.checks.ownerCorrect && 
        verificationReport.checks.notPaused && 
        verificationReport.checks.tokensInitialized) {
      console.log("🎉 Tous les checks sont passés - Le contrat est prêt à être utilisé!");
    } else {
      console.log("⚠️ Certains checks ont échoué - Vérifiez le rapport pour plus de détails");
    }

  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error.message);
    
    const errorReport = {
      verificationTime: new Date().toISOString(),
      contractAddress: contractAddress,
      network: deploymentInfo.network,
      status: "failed",
      error: error.message,
      stack: error.stack
    };

    fs.writeFileSync("./verification-error.json", JSON.stringify(errorReport, null, 2));
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur de vérification:", error);
    process.exit(1);
  });
