import type { EtherscanTx, RiskFlag, WalletMetrics } from '@/types';

export function detectRisks(
  normalTxs: EtherscanTx[],
  metrics: WalletMetrics
): RiskFlag[] {
  const flags: RiskFlag[] = [];

  if (metrics.age.days < 7 && metrics.activity.totalTxs > 0) {
    flags.push({
      type: 'fresh_wallet',
      severity: 'high',
      label: 'Freshly Funded Wallet',
      detail: `Wallet is only ${metrics.age.days} days old with transaction activity.`,
    });
  }

  const incomingSmallTxs = normalTxs.filter((tx) => {
    const valEth = Number(tx.value) / 1e18;
    return tx.to.toLowerCase() === metrics.address.toLowerCase() && valEth < 0.001 && valEth > 0;
  });
  if (incomingSmallTxs.length >= 20) {
    flags.push({
      type: 'dusting',
      severity: incomingSmallTxs.length >= 50 ? 'high' : 'medium',
      label: 'Dusting Activity',
      detail: `${incomingSmallTxs.length} tiny incoming transactions detected (< 0.001 ${metrics.chain === 'bsc' ? 'BNB' : 'ETH'}).`,
    });
  }

  const uniqueCounterparties = new Set<string>();
  for (const tx of normalTxs) {
    if (tx.from.toLowerCase() === metrics.address.toLowerCase() && tx.to) {
      uniqueCounterparties.add(tx.to.toLowerCase());
    }
    if (tx.to && tx.to.toLowerCase() === metrics.address.toLowerCase()) {
      uniqueCounterparties.add(tx.from.toLowerCase());
    }
  }
  if (uniqueCounterparties.size < 3 && metrics.activity.totalTxs > 5) {
    flags.push({
      type: 'low_engagement',
      severity: 'medium',
      label: 'Low Engagement',
      detail: `Only ${uniqueCounterparties.size} unique counterparties across ${metrics.activity.totalTxs} transactions.`,
    });
  }

  if (metrics.contracts.uniqueInteracted === 0 && metrics.activity.totalTxs > 10) {
    flags.push({
      type: 'no_contracts',
      severity: 'low',
      label: 'No Contract Interaction',
      detail: 'Wallet has never interacted with any smart contract.',
    });
  }

  if (metrics.activity.totalTxs > 0 && metrics.age.days < 1) {
    flags.push({
      type: 'instant_activity',
      severity: 'medium',
      label: 'Instant Activity',
      detail: 'Transactions started immediately on the day of wallet creation.',
    });
  }

  const oneDayCounts = new Map<string, number>();
  for (const tx of normalTxs) {
    const day = new Date(Number(tx.timeStamp) * 1000).toISOString().slice(0, 10);
    oneDayCounts.set(day, (oneDayCounts.get(day) || 0) + 1);
  }
  const maxDay = Math.max(...oneDayCounts.values(), 0);
  if (metrics.activity.totalTxs > 20 && maxDay > metrics.activity.totalTxs * 0.5) {
    flags.push({
      type: 'velocity_spike',
      severity: 'high',
      label: 'Velocity Spike',
      detail: `${maxDay} transactions occurred in a single day (${Math.round(maxDay / metrics.activity.totalTxs * 100)}% of all activity).`,
    });
  }

  return flags;
}
