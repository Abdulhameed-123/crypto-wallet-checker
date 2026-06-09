'use client';

import { useState, FormEvent } from 'react';
import { CHAINS } from '@/config';

interface Props {
  onAnalyze: (chain: string, address: string) => void;
  loading: boolean;
}

export default function WalletInput({ onAnalyze, loading }: Props) {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (address.trim()) onAnalyze(chain, address.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(CHAINS).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x... or 0x0000...0000"
            className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !address.trim()}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors text-sm"
        >
          {loading ? 'Analyzing...' : 'Check Wallet Reputation'}
        </button>
      </div>
    </form>
  );
}
