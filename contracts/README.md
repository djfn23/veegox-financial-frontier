
# Veegox Smart Contracts

Smart contracts for the Veegox DeFi ecosystem, featuring VEX, sVEX, and gVEX tokens with integrated staking, governance, and swap mechanisms.

## Overview

The Veegox ecosystem consists of three interconnected tokens:

- **VEX**: Utility token for transaction fees, staking, and platform access
- **sVEX**: Stable token pegged to USDC for savings and low-risk DeFi strategies
- **gVEX**: Governance token for DAO voting and protocol decisions

## Features

### Token Management
- Multi-token ERC-20 contract managing all three token types
- Controlled minting with maximum supply caps
- Burn functionality for deflationary mechanics

### Staking System
- Stake VEX tokens to earn sVEX rewards
- Configurable APY (default 8.5%)
- 90-day lock period for staking rewards
- Real-time reward calculation

### Governance (DAO)
- Create proposals with gVEX tokens (minimum 1000 gVEX)
- Vote on proposals using gVEX voting power
- Quorum threshold (10,000 gVEX)
- 7-day voting period
- Automatic proposal execution

### Token Swapping
- Swap between VEX and sVEX
- 0.3% swap fee
- Fee collection for ecosystem sustainability

### Security Features
- Pausable contract for emergency situations
- ReentrancyGuard protection
- Owner-only administrative functions
- Rate limiting and validation

## Contract Architecture

```
VeegoxEcosystem.sol
├── Token Management
│   ├── VEX (Utility Token)
│   ├── sVEX (Stable Token)
│   └── gVEX (Governance Token)
├── Staking Module
│   ├── Stake VEX
│   ├── Claim Rewards (sVEX)
│   └── Unstake with Rewards
├── Governance Module
│   ├── Create Proposals
│   ├── Vote on Proposals
│   └── Execute Proposals
└── Swap Module
    ├── VEX ↔ sVEX
    └── Fee Collection
```

## Deployment

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Configure your `.env` file with:
   - Private key for deployment
   - RPC URLs for networks
   - Etherscan API key (for verification)

### Local Development

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to local network
npm run deploy:local
```

### Testnet Deployment

```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Verify contract on Etherscan
npm run verify -- --network sepolia [CONTRACT_ADDRESS]
```

### Mainnet Deployment

```bash
# Deploy to mainnet
npm run deploy:mainnet

# Verify contract
npm run verify -- --network mainnet [CONTRACT_ADDRESS]
```

## Integration

After deployment, update your environment variables:

```env
VEX_CONTRACT_ADDRESS=0x...
SVEX_CONTRACT_ADDRESS=0x... # Same as VEX (multi-token contract)
GVEX_CONTRACT_ADDRESS=0x... # Same as VEX (multi-token contract)
```

## Token Economics

### VEX (Utility Token)
- **Max Supply**: 100,000,000 VEX
- **Use Cases**: Transaction fees, staking, platform access
- **Staking Rewards**: Earn sVEX at 8.5% APY

### sVEX (Stable Token)
- **Max Supply**: 50,000,000 sVEX
- **Stability**: Pegged to USDC through reserves
- **Use Cases**: Savings, stable yield farming, payments

### gVEX (Governance Token)
- **Max Supply**: 25,000,000 gVEX
- **Governance**: DAO voting rights
- **Proposal Threshold**: 1,000 gVEX minimum
- **Quorum**: 10,000 gVEX required

## Security Considerations

- The contract is pausable by the owner for emergency situations
- ReentrancyGuard protects against reentrancy attacks
- All external calls are protected with proper validation
- Staking has time locks to prevent flash loan attacks
- Governance has minimum thresholds to prevent spam

## Testing

The contract includes comprehensive tests covering:
- Token minting and burning
- Staking and reward calculations
- Governance proposal lifecycle
- Token swapping mechanics
- Security measures

Run tests with:
```bash
npm run test
```

## Gas Optimization

- Optimized for minimal gas usage
- Batch operations where possible
- Efficient storage patterns
- Event logging for off-chain indexing

## Audit Status

🔄 **Pending Audit** - This contract has not been audited yet. Use at your own risk.

For production deployment, we recommend:
1. Professional smart contract audit
2. Bug bounty program
3. Gradual rollout with limited initial supplies

## Support

For technical support or questions:
- Create an issue in this repository
- Contact the development team
- Review the documentation

## License

MIT License - see LICENSE file for details.
