
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy VeegoxEcosystem contract
  const VeegoxEcosystem = await ethers.getContractFactory("VeegoxEcosystem");
  const veegoxEcosystem = await VeegoxEcosystem.deploy();

  console.log("VeegoxEcosystem deployed to:", veegoxEcosystem.address);

  // Wait for deployment to be mined
  await veegoxEcosystem.deployed();

  console.log("Deployment completed!");
  console.log("Contract addresses:");
  console.log("VeegoxEcosystem:", veegoxEcosystem.address);

  // Save addresses to a file for frontend integration
  const fs = require("fs");
  const contractAddresses = {
    VeegoxEcosystem: veegoxEcosystem.address,
    network: hre.network.name,
    deployer: deployer.address
  };

  fs.writeFileSync(
    "./deployed-contracts.json",
    JSON.stringify(contractAddresses, null, 2)
  );

  console.log("Contract addresses saved to deployed-contracts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
