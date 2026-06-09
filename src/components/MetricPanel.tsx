'use client';

import type { WalletMetrics } from '@/types';

interface Props {
  metrics: WalletMetrics;
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function MetricPanel({ metrics }: Props) {
  const cards = [
    {
      title: 'Wallet Age',
      value: metrics.age.days > 0 ? `${metrics.age.days} days` : 'Brand new',
      subtitle: metrics.age.firstTxTimestamp
        ? `First tx: ${formatDate(metrics.age.firstTxTimestamp)}`
        : 'No transaction history',
      icon: '📅',
    },
    {
      title: 'Transaction Activity',
      value: `${metrics.activity.totalTxs} txs`,
      subtitle: `${metrics.activity.avgTxsPerMonth} / month • ${metrics.activity.uniqueActiveDays} active days`,
      icon: '⚡',
    },
    {
      title: 'Token Holdings',
      value: `${metrics.tokens.count} tokens`,
      subtitle: metrics.tokens.count > 0
        ? metrics.tokens.uniqueTokens.slice(0, 5).join(', ') + (metrics.tokens.count > 5 ? '...' : '')
        : 'No ERC-20 tokens detected',
      icon: '🪙',
    },
    {
      title: 'Contract Interactions',
      value: `${metrics.contracts.uniqueInteracted} contracts`,
      subtitle: metrics.contracts.topContracts.length > 0
        ? metrics.contracts.topContracts.slice(0, 3).map((c) => c.address.slice(0, 10) + '...').join(', ')
        : 'No contract calls',
      icon: '🔗',
    },
  ];

  return (
    <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map((card) => (
        <div key={card.title} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">{card.icon}</span>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 uppercase tracking-wider">{card.title}</div>
              <div className="text-lg font-semibold text-white mt-0.5 truncate">{card.value}</div>
              <div className="text-xs text-gray-400 mt-1 line-clamp-2">{card.subtitle}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
