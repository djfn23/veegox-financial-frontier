
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Configuration simplifiée pour éviter les erreurs
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

if (!ALCHEMY_API_KEY) {
  console.warn("⚠️ ALCHEMY_API_KEY non configurée dans .env");
}

if (!PRIVATE_KEY) {
  console.warn("⚠️ PRIVATE_KEY non configurée dans .env");
}

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      chainId: 1337,
      blockGasLimit: 30000000,
      gas: 30000000,
      gasPrice: "auto",
      allowUnlimitedContractSize: true,
      mining: {
        auto: true,
        interval: 0
      }
    },
    
    sepolia: {
      url: ALCHEMY_API_KEY ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}` : "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
      gas: 6000000,
      gasPrice: 20000000000, // 20 gwei
      timeout: 120000,
      allowUnlimitedContractSize: true
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || ""
    }
  },
  mocha: {
    timeout: 300000
  }
};
