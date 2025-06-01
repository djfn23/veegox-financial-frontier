
export interface VeegoxChainConfig {
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  wsUrl: string;
  explorerUrl: string;
  consensus: 'PoS' | 'PoA';
  blockTime: number;
  gasLimit: bigint;
  validators: string[];
}

export interface VeegoxNode {
  id: string;
  address: string;
  status: 'online' | 'offline' | 'syncing';
  blockHeight: number;
  peers: number;
  version: string;
  region: string;
}

export interface VeegoxBlock {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactions: VeegoxTransaction[];
  validator: string;
  gasUsed: bigint;
  gasLimit: bigint;
}

export interface VeegoxTransaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  gasPrice: bigint;
  gasUsed: bigint;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  blockHash?: string;
}

export interface VeegoxValidator {
  address: string;
  stake: bigint;
  commissionRate: number;
  isActive: boolean;
  delegators: number;
  uptime: number;
}
