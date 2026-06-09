import type { EtherscanTx, EtherscanInternalTx, EtherscanTokenTx, WalletMetrics } from '@/types';

function toUnix(ts: string): number {
  return parseInt(ts, 10);
}

function daysBetween(a: number, b: number): number {
  return Math.max(0, Math.floor((b - a) / 86400));
}

export function analyzeWallet(
  address: string,
  chain: string,
  normalTxs: EtherscanTx[],
  internalTxs: EtherscanInternalTx[],
  tokenTxs: EtherscanTokenTx[],
  nativeBalance: string
): WalletMetrics {
  const now = Math.floor(Date.now() / 1000);

  const allTxs = normalTxs;

  if (allTxs.length === 0) {
    return {
      address,
      chain,
      age: { days: 0, firstTxTimestamp: now, lastTxTimestamp: now },
      activity: {
        totalTxs: 0,
        totalInternalTxs: internalTxs.length,
        avgTxsPerMonth: 0,
        uniqueActiveDays: 0,
        activeMonths: 0,
        totalMonths: 0,
      },
      tokens: { count: 0, uniqueTokens: [] },
      contracts: { uniqueInteracted: 0, topContracts: [] },
      nativeBalance,
    };
  }

  const firstTxTime = toUnix(allTxs[0].timeStamp);
  const lastTxTime = toUnix(allTxs[allTxs.length - 1].timeStamp);
  const ageDays = daysBetween(firstTxTime, now);

  const uniqueDays = new Set(allTxs.map((tx) =>
    new Date(toUnix(tx.timeStamp) * 1000).toISOString().slice(0, 10)
  ));

  const firstDate = new Date(firstTxTime * 1000);
  const lastDate = new Date(lastTxTime * 1000);
  const totalMonths = Math.max(1, (lastDate.getFullYear() - firstDate.getFullYear()) * 12
    + (lastDate.getMonth() - firstDate.getMonth()) + 1);

  const activeMonthsSet = new Set(allTxs.map((tx) => {
    const d = new Date(toUnix(tx.timeStamp) * 1000);
    return `${d.getFullYear()}-${d.getMonth()}`;
  }));

  const contractCounts = new Map<string, number>();
  for (const tx of allTxs) {
    if (tx.to && tx.to !== '' && tx.input !== '0x') {
      contractCounts.set(tx.to, (contractCounts.get(tx.to) || 0) + 1);
    }
  }

  const topContracts = [...contractCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([address, count]) => ({ address, count }));

  const uniqueTokens = [...new Set(tokenTxs.map((tx) => tx.tokenSymbol).filter(Boolean))];

  return {
    address,
    chain,
    age: { days: ageDays, firstTxTimestamp: firstTxTime, lastTxTimestamp: lastTxTime },
    activity: {
      totalTxs: allTxs.length,
      totalInternalTxs: internalTxs.length,
      avgTxsPerMonth: Math.round((allTxs.length / totalMonths) * 10) / 10,
      uniqueActiveDays: uniqueDays.size,
      activeMonths: activeMonthsSet.size,
      totalMonths,
    },
    tokens: {
      count: uniqueTokens.length,
      uniqueTokens,
    },
    contracts: {
      uniqueInteracted: contractCounts.size,
      topContracts,
    },
    nativeBalance,
  };
}
