
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Starting Veegox deployment...");
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Deploy VeegoxEcosystem contract
  console.log("\n📋 Deploying VeegoxEcosystem contract...");
  const VeegoxEcosystem = await ethers.getContractFactory("VeegoxEcosystem");
  const veegoxEcosystem = await VeegoxEcosystem.deploy();

  console.log("⏳ Waiting for deployment confirmation...");
  await veegoxEcosystem.deployed();

  console.log("✅ VeegoxEcosystem deployed to:", veegoxEcosystem.address);

  // Initial configuration
  console.log("\n⚙️  Configuring initial parameters...");
  
  // Set up initial token distributions
  const initialVEXSupply = ethers.utils.parseEther("1000000"); // 1M VEX for liquidity
  const initialSVEXSupply = ethers.utils.parseEther("500000");  // 500K sVEX for stability
  const initialGVEXSupply = ethers.utils.parseEther("100000");  // 100K gVEX for governance

  // Mint additional tokens for ecosystem
  console.log("🪙 Minting initial token supplies...");
  await veegoxEcosystem.mintSVEX(deployer.address, initialSVEXSupply);
  await veegoxEcosystem.mintGVEX(deployer.address, initialGVEXSupply);

  console.log("Initial token balances:");
  console.log("- VEX:", ethers.utils.formatEther(await veegoxEcosystem.balanceOf(deployer.address, 0)));
  console.log("- sVEX:", ethers.utils.formatEther(await veegoxEcosystem.balanceOf(deployer.address, 1)));
  console.log("- gVEX:", ethers.utils.formatEther(await veegoxEcosystem.balanceOf(deployer.address, 2)));

  // Save deployment information
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: veegoxEcosystem.address,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    gasPrice: await ethers.provider.getGasPrice(),
    initialSupplies: {
      VEX: ethers.utils.formatEther(initialVEXSupply),
      sVEX: ethers.utils.formatEther(initialSVEXSupply),
      gVEX: ethers.utils.formatEther(initialGVEXSupply)
    },
    contractConfig: {
      stakingAPY: "8.5%",
      swapFeeRate: "0.3%",
      quorumThreshold: "10000",
      votingDuration: "7 days",
      stakingDuration: "90 days"
    }
  };

  // Write deployment info to multiple formats
  fs.writeFileSync(
    "./deployed-contracts.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Create environment variables file for Supabase integration
  const envVars = `
# Veegox Smart Contract Configuration
VEX_CONTRACT_ADDRESS=${veegoxEcosystem.address}
SVEX_CONTRACT_ADDRESS=${veegoxEcosystem.address}
GVEX_CONTRACT_ADDRESS=${veegoxEcosystem.address}
VEEGOX_ECOSYSTEM_ADDRESS=${veegoxEcosystem.address}
DEPLOYMENT_NETWORK=${hre.network.name}
DEPLOYER_ADDRESS=${deployer.address}
CONTRACT_DEPLOY_BLOCK=${await ethers.provider.getBlockNumber()}
`;

  fs.writeFileSync("./contract-env-vars.txt", envVars);

  console.log("\n📄 Deployment Summary:");
  console.log("======================");
  console.log("✅ Contract deployed successfully!");
  console.log("📍 Address:", veegoxEcosystem.address);
  console.log("🌐 Network:", hre.network.name);
  console.log("👤 Deployer:", deployer.address);
  console.log("📝 Config saved to: deployed-contracts.json");
  console.log("🔧 Environment variables saved to: contract-env-vars.txt");

  console.log("\n🔗 Next Steps:");
  console.log("1. Add contract address to Supabase environment variables");
  console.log("2. Update Alchemy webhook configuration");
  console.log("3. Verify contract on Etherscan (if on public network)");
  console.log("4. Set up monitoring and analytics");
  
  if (hre.network.name !== "hardhat") {
    console.log("\n🔍 Verify contract with:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${veegoxEcosystem.address}`);
  }

  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
