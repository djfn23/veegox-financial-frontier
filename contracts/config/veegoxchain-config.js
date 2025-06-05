
// Configuration VeegoxChain - Version corrigée
const VEEGOXCHAIN_CONFIG = {
  chainId: 0x7645782, // 123456789 en décimal
  name: "VeegoxChain",
  symbol: "VGX",
  consensus: "PoS",
  blockTime: 3, // 3 secondes
  gasLimit: "30000000",
  initialValidators: 3,
  stakingRequirement: "10000000000000000000000" // 10,000 VGX en wei (string pour éviter les erreurs de précision)
};

module.exports = { VEEGOXCHAIN_CONFIG };
