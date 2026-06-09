export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'G43PRJ54R2CE6941ZBVAU57R4AGV9C2IBV';

export interface ChainConfig {
  name: string;
  nativeToken: string;
  explorerUrl: string;
}

export const CHAINS: Record<string, ChainConfig> = {
  ethereum: {
    name: 'Ethereum',
    nativeToken: 'ETH',
    explorerUrl: 'https://etherscan.io',
  },
  bsc: {
    name: 'BNB Chain',
    nativeToken: 'BNB',
    explorerUrl: 'https://bscscan.com',
  },
  polygon: {
    name: 'Polygon',
    nativeToken: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
  },
  arbitrum: {
    name: 'Arbitrum',
    nativeToken: 'ETH',
    explorerUrl: 'https://arbiscan.io',
  },
  base: {
    name: 'Base',
    nativeToken: 'ETH',
    explorerUrl: 'https://basescan.org',
  },
};

export const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  bsc: 56,
  polygon: 137,
  arbitrum: 42161,
  base: 8453,
};

export const SCORE_WEIGHTS = {
  longevity: 25,
  activity: 25,
  diversity: 20,
  consistency: 15,
  riskDeduction: 15,
};
