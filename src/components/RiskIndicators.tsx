'use client';

import type { RiskFlag } from '@/types';

interface Props {
  flags: RiskFlag[];
}

const severityColors: Record<string, string> = {
  low: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  medium: 'bg-orange-900/50 text-orange-300 border-orange-700',
  high: 'bg-red-900/50 text-red-300 border-red-700',
};

const badgeColors: Record<string, string> = {
  low: 'bg-yellow-700 text-yellow-100',
  medium: 'bg-orange-700 text-orange-100',
  high: 'bg-red-700 text-red-100',
};

export default function RiskIndicators({ flags }: Props) {
  if (flags.length === 0) {
    return (
      <div className="w-full max-w-2xl bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
        <span className="text-2xl">✅</span>
        <p className="text-green-400 font-medium mt-2">No risk flags detected</p>
        <p className="text-xs text-gray-500 mt-1">This wallet shows normal behavioral patterns.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-2">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
        Risk Flags ({flags.length})
      </h3>
      {flags.map((flag, i) => (
        <div
          key={i}
          className={`border rounded-xl p-4 ${severityColors[flag.severity] || severityColors.low}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{flag.label}</span>
                <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${badgeColors[flag.severity] || badgeColors.low}`}>
                  {flag.severity}
                </span>
              </div>
              <p className="text-xs mt-1 opacity-80">{flag.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
