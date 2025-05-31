
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Configuration avancée pour les nœuds Alchemy
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
  console.warn("⚠️ ALCHEMY_API_KEY non configurée");
}

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: 5000
      }
    },
    
    // Ethereum networks via Alchemy
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1,
      gasPrice: "auto",
      gas: "auto"
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: "auto"
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5
    },

    // Polygon networks via Alchemy
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137,
      gasPrice: 50000000000 // 50 gwei
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001
    },

    // Arbitrum networks via Alchemy
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 42161
    },
    "arbitrum-sepolia": {
      url: `https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 421614
    },

    // Optimism networks via Alchemy
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 10
    },
    "optimism-sepolia": {
      url: `https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155420
    },

    // Base networks via Alchemy
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8453
    },
    "base-sepolia": {
      url: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532
    }
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      arbitrumOne: process.env.ARBISCAN_API_KEY,
      arbitrumSepolia: process.env.ARBISCAN_API_KEY,
      optimisticEthereum: process.env.OPTIMISM_API_KEY,
      optimismSepolia: process.env.OPTIMISM_API_KEY,
      base: process.env.BASESCAN_API_KEY,
      baseSepolia: process.env.BASESCAN_API_KEY
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  }
};
