'use client';

import type { WalletMetrics } from '@/types';

interface Props {
  metrics: WalletMetrics;
}

export default function TokenHoldings({ metrics }: Props) {
  if (metrics.tokens.count === 0) {
    return (
      <div className="w-full max-w-2xl px-2 sm:px-0">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">Tokens Held</div>
          <p className="text-xs sm:text-sm text-gray-400">No ERC-20 tokens detected on this address.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl px-2 sm:px-0">
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4">
        <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
          Tokens Held ({metrics.tokens.count})
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {metrics.tokens.uniqueTokens.map((symbol) => (
            <span
              key={symbol}
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-700 rounded-full text-[11px] sm:text-xs text-gray-200 font-medium"
            >
              {symbol}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
