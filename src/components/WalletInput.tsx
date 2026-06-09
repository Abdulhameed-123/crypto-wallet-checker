'use client';

import { useState, FormEvent } from 'react';
import { CHAINS } from '@/config';

interface Props {
  onAnalyze: (chain: string, address: string, apiKey?: string) => void;
  loading: boolean;
}

export default function WalletInput({ onAnalyze, loading }: Props) {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (address.trim()) onAnalyze(chain, address.trim(), apiKey.trim() || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl px-2 sm:px-0">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(CHAINS).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Paste wallet address (0x...)"
            className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            spellCheck={false}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !address.trim()}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors text-sm"
        >
          {loading ? 'Analyzing...' : 'Check Wallet Reputation'}
        </button>

        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showApiKey ? 'Hide' : 'Need an API key?'}
          </button>
          <a
            href="https://etherscan.io/register"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-400 hover:text-blue-300 underline"
          >
            Get free key
          </a>
        </div>

        {showApiKey && (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Etherscan API key"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              spellCheck={false}
            />
            <p className="text-[10px] text-gray-600">Required for deployed sites. Saved for this session only.</p>
          </div>
        )}
      </div>
    </form>
  );
}
