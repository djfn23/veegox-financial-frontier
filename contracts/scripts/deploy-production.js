
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Déploiement des contrats Veegox en production...");
  console.log("Compte de déploiement:", deployer.address);
  console.log("Solde du compte:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Vérifier que nous avons assez d'ETH pour le déploiement
  const balance = await deployer.getBalance();
  const minimumBalance = ethers.utils.parseEther("0.1"); // 0.1 ETH minimum
  
  if (balance.lt(minimumBalance)) {
    throw new Error(`Solde insuffisant. Minimum requis: 0.1 ETH, solde actuel: ${ethers.utils.formatEther(balance)} ETH`);
  }

  // Déployer le contrat VeegoxEcosystem
  console.log("\n📋 Déploiement du contrat VeegoxEcosystem...");
  const VeegoxEcosystem = await ethers.getContractFactory("VeegoxEcosystem");
  
  // Estimer le gas nécessaire
  const deployTx = VeegoxEcosystem.getDeployTransaction();
  const gasEstimate = await ethers.provider.estimateGas(deployTx);
  const gasPrice = await ethers.provider.getGasPrice();
  const deploymentCost = gasEstimate.mul(gasPrice);
  
  console.log("Gas estimé:", gasEstimate.toString());
  console.log("Prix du gas:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
  console.log("Coût estimé du déploiement:", ethers.utils.formatEther(deploymentCost), "ETH");

  const veegoxEcosystem = await VeegoxEcosystem.deploy({
    gasLimit: gasEstimate.mul(120).div(100), // 20% de marge
    gasPrice: gasPrice
  });

  console.log("⏳ Attente de la confirmation du déploiement...");
  await veegoxEcosystem.deployed();

  console.log("✅ VeegoxEcosystem déployé à l'adresse:", veegoxEcosystem.address);
  console.log("📝 Hash de transaction de déploiement:", veegoxEcosystem.deployTransaction.hash);

  // Attendre quelques confirmations pour la sécurité
  console.log("⏳ Attente de 3 confirmations...");
  await veegoxEcosystem.deployTransaction.wait(3);

  // Configuration initiale du contrat
  console.log("\n⚙️ Configuration initiale du contrat...");
  
  try {
    // Mint des tokens initiaux pour la liquidité
    const initialVEXSupply = ethers.utils.parseEther("1000000"); // 1M VEX
    const initialSVEXSupply = ethers.utils.parseEther("500000");  // 500K sVEX
    const initialGVEXSupply = ethers.utils.parseEther("100000");  // 100K gVEX

    console.log("🪙 Mint des tokens initiaux...");
    
    // Mint sVEX et gVEX (VEX est déjà minté dans le constructeur)
    const mintSVEXTx = await veegoxEcosystem.mintSVEX(deployer.address, initialSVEXSupply);
    await mintSVEXTx.wait();
    console.log("✅ sVEX mintés:", ethers.utils.formatEther(initialSVEXSupply));

    const mintGVEXTx = await veegoxEcosystem.mintGVEX(deployer.address, initialGVEXSupply);
    await mintGVEXTx.wait();
    console.log("✅ gVEX mintés:", ethers.utils.formatEther(initialGVEXSupply));

    // Vérifier les balances
    const vexBalance = await veegoxEcosystem.balanceOf(deployer.address, 0);
    const svexBalance = await veegoxEcosystem.balanceOf(deployer.address, 1);
    const gvexBalance = await veegoxEcosystem.balanceOf(deployer.address, 2);

    console.log("\n💰 Balances initiales du déployeur:");
    console.log("- VEX:", ethers.utils.formatEther(vexBalance));
    console.log("- sVEX:", ethers.utils.formatEther(svexBalance));
    console.log("- gVEX:", ethers.utils.formatEther(gvexBalance));

  } catch (error) {
    console.error("❌ Erreur lors de la configuration initiale:", error.message);
  }

  // Sauvegarder les informations de déploiement
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: veegoxEcosystem.address,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    gasUsed: gasEstimate.toString(),
    gasPrice: gasPrice.toString(),
    deploymentCost: ethers.utils.formatEther(deploymentCost),
    transactionHash: veegoxEcosystem.deployTransaction.hash,
    chainId: (await ethers.provider.getNetwork()).chainId,
    contractConfig: {
      stakingAPY: "8.5%",
      swapFeeRate: "0.3%",
      quorumThreshold: "10000",
      votingDuration: "7 days",
      stakingDuration: "90 days"
    }
  };

  // Sauvegarder dans plusieurs formats
  fs.writeFileSync(
    "./deployed-contracts.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Créer les variables d'environnement pour Supabase
  const supabaseEnvVars = `
# Configuration des contrats Veegox pour Supabase
VEX_CONTRACT_ADDRESS=${veegoxEcosystem.address}
SVEX_CONTRACT_ADDRESS=${veegoxEcosystem.address}
GVEX_CONTRACT_ADDRESS=${veegoxEcosystem.address}
VEEGOX_ECOSYSTEM_ADDRESS=${veegoxEcosystem.address}
DEPLOYMENT_NETWORK=${hre.network.name}
DEPLOYMENT_BLOCK=${await ethers.provider.getBlockNumber()}
CHAIN_ID=${(await ethers.provider.getNetwork()).chainId}
DEPLOYER_ADDRESS=${deployer.address}
DEPLOYMENT_TRANSACTION=${veegoxEcosystem.deployTransaction.hash}
CONTRACT_DEPLOYMENT_DATE=${new Date().toISOString()}
`;

  fs.writeFileSync("./supabase-env-vars.txt", supabaseEnvVars);

  // Créer la configuration Alchemy
  const alchemyConfig = {
    webhooks: [
      {
        name: "veegox-address-activity",
        type: "ADDRESS_ACTIVITY",
        addresses: [veegoxEcosystem.address],
        url: "https://uvtwsfothnnyufxmcpdg.supabase.co/functions/v1/alchemy-webhook"
      },
      {
        name: "veegox-mined-transactions",
        type: "MINED_TRANSACTION", 
        addresses: [veegoxEcosystem.address],
        url: "https://uvtwsfothnnyufxmcpdg.supabase.co/functions/v1/alchemy-webhook"
      }
    ],
    contractAddresses: [veegoxEcosystem.address],
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId
  };

  fs.writeFileSync("./alchemy-config.json", JSON.stringify(alchemyConfig, null, 2));

  console.log("\n🎉 Déploiement terminé avec succès!");
  console.log("=".repeat(50));
  console.log("📍 Adresse du contrat:", veegoxEcosystem.address);
  console.log("🌐 Réseau:", hre.network.name);
  console.log("🔗 Hash de déploiement:", veegoxEcosystem.deployTransaction.hash);
  console.log("👤 Déployeur:", deployer.address);
  console.log("📄 Fichiers créés:");
  console.log("  - deployed-contracts.json");
  console.log("  - supabase-env-vars.txt");
  console.log("  - alchemy-config.json");

  console.log("\n📋 Prochaines étapes:");
  console.log("1. Ajouter les variables d'environnement à Supabase:");
  console.log("   - Copier le contenu de supabase-env-vars.txt");
  console.log("   - Les ajouter dans Supabase Project Settings > Environment Variables");
  console.log("2. Configurer les webhooks Alchemy:");
  console.log("   - Utiliser la configuration dans alchemy-config.json");
  console.log("   - Ajouter l'adresse du contrat aux webhooks Alchemy Notify");
  console.log("3. Vérifier le contrat sur Etherscan:");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${veegoxEcosystem.address}`);
  console.log("4. Tester l'intégration avec une transaction de test");

  return {
    contract: veegoxEcosystem,
    address: veegoxEcosystem.address,
    deployer: deployer.address,
    network: hre.network.name
  };
}

main()
  .then((result) => {
    console.log("\n✅ Déploiement réussi!");
    console.log("Adresse du contrat:", result.address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Échec du déploiement:", error);
    process.exit(1);
  });
