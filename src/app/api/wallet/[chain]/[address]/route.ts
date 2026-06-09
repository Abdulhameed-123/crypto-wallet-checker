import { NextRequest, NextResponse } from 'next/server';
import { CHAINS } from '@/config';
import { getWalletData, EtherscanError } from '@/services/etherscan';
import { analyzeWallet } from '@/services/analyzer';
import { detectRisks } from '@/services/riskDetector';
import { computeScore } from '@/services/scorer';
import type { WalletReport } from '@/types';

interface RouteParams {
  params: Promise<{ chain: string; address: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { chain, address } = await params;

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid wallet address' } as WalletReport, { status: 400 });
  }

  const chainConfig = CHAINS[chain];
  if (!chainConfig) {
    return NextResponse.json({ error: `Unsupported chain: ${chain}` } as WalletReport, { status: 400 });
  }

  try {
    const { normalTxs, internalTxs, tokenTxs, nativeBalance } = await getWalletData(chain, address);

    const metrics = analyzeWallet(
      address,
      chain,
      normalTxs,
      internalTxs,
      tokenTxs,
      nativeBalance
    );

    const riskFlags = detectRisks(normalTxs, metrics);
    const score = computeScore(metrics, riskFlags);

    const report: WalletReport = {
      address,
      chain,
      chainName: chainConfig.name,
      explorerUrl: `${chainConfig.explorerUrl}/address/${address}`,
      score,
      metrics,
      riskFlags,
    };

    return NextResponse.json(report);
  } catch (err: any) {
    console.error('Wallet analysis error:', err);
    let message = err.message || 'Failed to analyze wallet';
    if (err instanceof EtherscanError) {
      if (message.includes('Invalid API Key') || message === 'NOTOK') {
        const code = err.code || '';
        if (code.toLowerCase().includes('rate limit')) {
          message = 'Rate limited by Etherscan API. Please wait a moment and try again.';
        } else if (code.includes('Invalid') || code.includes('Missing')) {
          message = 'Invalid Etherscan API key. Set a valid ETHERSCAN_API_KEY in .env.local';
        }
      } else {
        message = `Blockchain explorer API error: ${message}`;
      }
    }
    return NextResponse.json(
      { error: message } as WalletReport,
      { status: 500 }
    );
  }
}
