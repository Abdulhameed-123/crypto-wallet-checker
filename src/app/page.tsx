'use client';

import { useState } from 'react';
import type { WalletReport } from '@/types';
import WalletInput from '@/components/WalletInput';
import ScoreCard from '@/components/ScoreCard';
import MetricPanel from '@/components/MetricPanel';
import RiskIndicators from '@/components/RiskIndicators';
import TokenHoldings from '@/components/TokenHoldings';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<WalletReport | null>(null);
  const [error, setError] = useState('');

  async function handleAnalyze(chain: string, address: string, apiKey?: string) {
    setLoading(true);
    setError('');
    setReport(null);

    try {
      let url = `/api/wallet/${chain}/${address}`;
      if (apiKey) url += `?apiKey=${encodeURIComponent(apiKey)}`;

      const res = await fetch(url);
      const data: WalletReport & { error?: string } = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to analyze wallet');
        return;
      }

      setReport(data as WalletReport);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-3 sm:px-4 py-8 sm:py-20 gap-5 sm:gap-8">
      <div className="text-center max-w-lg px-2 sm:px-0">
        <h1 className="text-2xl sm:text-4xl font-bold text-white">
          Wallet Reputation Checker
        </h1>
        <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm">
          Paste any wallet address to get a reputation score, transaction insights, and risk indicators.
        </p>
      </div>

      <WalletInput onAnalyze={handleAnalyze} loading={loading} />

      {loading && (
        <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          Fetching on-chain data...
        </div>
      )}

      {error && (
        <div className="w-full max-w-2xl px-2 sm:px-0">
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-3 sm:p-4 text-red-300 text-xs sm:text-sm break-words">
            {error}
          </div>
        </div>
      )}

      {report && (
        <>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-500 px-2 sm:px-0">
            <span className="font-mono">{report.address.slice(0, 10)}...{report.address.slice(-6)}</span>
            <span className="hidden sm:inline">•</span>
            <span>{report.chainName}</span>
            <a
              href={report.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              View on explorer
            </a>
          </div>

          <ScoreCard score={report.score} />
          <MetricPanel metrics={report.metrics} />
          <TokenHoldings metrics={report.metrics} />
          <RiskIndicators flags={report.riskFlags} />
        </>
      )}
    </div>
  );
}
