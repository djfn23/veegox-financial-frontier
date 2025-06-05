
const { ethers } = require("ethers");

// Configuration VeegoxChain
const VEEGOXCHAIN_CONFIG = {
  chainId: 0x7645782, // 123456789 en décimal
  name: "VeegoxChain",
  symbol: "VGX",
  consensus: "PoS",
  blockTime: 3, // 3 secondes
  gasLimit: "30000000",
  initialValidators: 3,
  stakingRequirement: ethers.utils.parseEther("10000") // 10,000 VGX minimum pour être validateur
};

module.exports = { VEEGOXCHAIN_CONFIG };
