export interface EtherscanTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId?: string;
  functionName?: string;
}

export interface EtherscanTokenTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

export interface EtherscanInternalTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  traceId: string;
  isError: string;
  errCode: string;
}

export interface WalletMetrics {
  address: string;
  chain: string;
  age: {
    days: number;
    firstTxTimestamp: number;
    lastTxTimestamp: number;
  };
  activity: {
    totalTxs: number;
    totalInternalTxs: number;
    avgTxsPerMonth: number;
    uniqueActiveDays: number;
    activeMonths: number;
    totalMonths: number;
  };
  tokens: {
    count: number;
    uniqueTokens: string[];
  };
  contracts: {
    uniqueInteracted: number;
    topContracts: { address: string; count: number }[];
  };
  nativeBalance: string;
}

export interface RiskFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  label: string;
  detail: string;
}

export interface ScoreBreakdown {
  longevity: number;
  activity: number;
  diversity: number;
  consistency: number;
  riskDeduction: number;
}

export interface WalletScore {
  score: number;
  grade: string;
  breakdown: ScoreBreakdown;
}

export interface WalletReport {
  address: string;
  chain: string;
  chainName: string;
  explorerUrl: string;
  score: WalletScore;
  metrics: WalletMetrics;
  riskFlags: RiskFlag[];
  error?: string;
}
