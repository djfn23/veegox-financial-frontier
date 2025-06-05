
const fs = require("fs");

class FileGenerator {
  constructor(config, deploymentInfo) {
    this.config = config;
    this.deploymentInfo = deploymentInfo;
  }

  generateAlchemyConfig() {
    const networkInfo = this.deploymentInfo.network;
    
    return {
      chainId: this.config.chainId,
      chainName: this.config.name,
      networkName: networkInfo.name,
      deployedOn: {
        network: networkInfo.name,
        chainId: networkInfo.chainId
      },
      nativeCurrency: {
        name: "VeegoxChain Token",
        symbol: this.config.symbol,
        decimals: 18
      },
      rpcUrls: [
        `https://veegoxchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      ],
      blockExplorerUrls: [
        "https://explorer.veegoxchain.com"
      ],
      contracts: this.deploymentInfo.contracts,
      genesis: {
        blockNumber: 0,
        blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        timestamp: Math.floor(Date.now() / 1000),
        difficulty: "0x1",
        gasLimit: this.config.gasLimit,
        alloc: {
          [this.deploymentInfo.deployer]: {
            balance: "1000000000000000000000000" // 1M tokens
          }
        }
      }
    };
  }

  generateGenesisConfig() {
    return {
      config: {
        chainId: this.config.chainId,
        homesteadBlock: 0,
        eip150Block: 0,
        eip155Block: 0,
        eip158Block: 0,
        byzantiumBlock: 0,
        constantinopleBlock: 0,
        petersburgBlock: 0,
        istanbulBlock: 0,
        berlinBlock: 0,
        londonBlock: 0,
        clique: {
          period: this.config.blockTime,
          epoch: 30000
        }
      },
      difficulty: "0x1",
      gasLimit: this.config.gasLimit,
      extradata: "0x" + "0".repeat(64) + this.deploymentInfo.deployer.slice(2) + "0".repeat(130),
      alloc: this.generateAlchemyConfig().genesis.alloc
    };
  }

  generateSupabaseEnvVars() {
    return `
# Configuration VeegoxChain - Déployé le ${new Date().toISOString()}
VEEGOXCHAIN_CHAIN_ID=${this.config.chainId}
VEEGOXCHAIN_NAME=${this.config.name}
VEEGOXCHAIN_SYMBOL=${this.config.symbol}
VEEGOXCHAIN_CONSENSUS_ADDRESS=${this.deploymentInfo.contracts.consensus.address}
VEEGOXCHAIN_VALIDATOR_ADDRESS=${this.deploymentInfo.contracts.validator.address}
VEEGOXCHAIN_TOKEN_ADDRESS=${this.deploymentInfo.contracts.nativeToken.address}
VEEGOXCHAIN_RPC_URL=https://veegoxchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}
VEEGOXCHAIN_WSS_URL=wss://veegoxchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}
VEEGOXCHAIN_EXPLORER_URL=https://explorer.veegoxchain.com
VEEGOXCHAIN_DEPLOYED_ON=${this.deploymentInfo.network.name}
VEEGOXCHAIN_DEPLOYER=${this.deploymentInfo.deployer}
`;
  }

  writeAllFiles() {
    console.log("\n🌐 5. Génération des fichiers de configuration...");
    
    const alchemyConfig = this.generateAlchemyConfig();
    const genesisConfig = this.generateGenesisConfig();
    const supabaseEnvVars = this.generateSupabaseEnvVars();

    // Écrire les fichiers de configuration
    fs.writeFileSync("./veegoxchain-deployment.json", JSON.stringify(this.deploymentInfo, null, 2));
    fs.writeFileSync("./veegoxchain-alchemy-config.json", JSON.stringify(alchemyConfig, null, 2));
    fs.writeFileSync("./veegoxchain-genesis.json", JSON.stringify(genesisConfig, null, 2));
    fs.writeFileSync("./supabase-veegoxchain-env.txt", supabaseEnvVars);

    console.log("\n📄 Fichiers générés:");
    console.log("  - veegoxchain-deployment.json");
    console.log("  - veegoxchain-alchemy-config.json");
    console.log("  - veegoxchain-genesis.json");
    console.log("  - supabase-veegoxchain-env.txt");
  }
}

module.exports = { FileGenerator };
