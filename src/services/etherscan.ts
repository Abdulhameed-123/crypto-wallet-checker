import { CHAIN_IDS, ETHERSCAN_API_KEY } from '@/config';
import type { EtherscanTx, EtherscanTokenTx, EtherscanInternalTx } from '@/types';

const API_BASE = 'https://api.etherscan.io/v2/api';

export class EtherscanError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'EtherscanError';
  }
}

async function callEtherscan(url: string): Promise<any> {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.status === '0') {
    if (data.message === 'No transactions found' || data.message === 'No internal transactions found') {
      return data;
    }
    throw new EtherscanError(data.message || 'Etherscan API error', data.result);
  }
  return data;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function buildUrl(chain: string, action: string, address: string): string {
  const chainId = CHAIN_IDS[chain] || 1;
  return `${API_BASE}?chainid=${chainId}&module=account&action=${action}&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
}

async function getNormalTxs(
  chain: string,
  address: string,
  page = 1,
  offset = 100
): Promise<EtherscanTx[]> {
  let url = buildUrl(chain, 'txlist', address);
  url += `&page=${page}&offset=${offset}&sort=asc`;
  const data = await callEtherscan(url);
  return data.result || [];
}

async function getInternalTxs(
  chain: string,
  address: string,
  page = 1,
  offset = 100
): Promise<EtherscanInternalTx[]> {
  let url = buildUrl(chain, 'txlistinternal', address);
  url += `&page=${page}&offset=${offset}&sort=asc`;
  const data = await callEtherscan(url);
  return data.result || [];
}

async function getTokenTxs(
  chain: string,
  address: string,
  page = 1,
  offset = 100
): Promise<EtherscanTokenTx[]> {
  let url = buildUrl(chain, 'tokentx', address);
  url += `&page=${page}&offset=${offset}&sort=asc`;
  const data = await callEtherscan(url);
  return data.result || [];
}

async function getNativeBalance(
  chain: string,
  address: string
): Promise<string> {
  const url = buildUrl(chain, 'balance', address);
  const data = await callEtherscan(url);
  return data.result || '0';
}

export async function getWalletData(chain: string, address: string): Promise<{
  normalTxs: EtherscanTx[];
  internalTxs: EtherscanInternalTx[];
  tokenTxs: EtherscanTokenTx[];
  nativeBalance: string;
}> {
  const normalTxs = await getNormalTxs(chain, address);
  await delay(400);
  const internalTxs = await getInternalTxs(chain, address);
  await delay(400);
  const tokenTxs = await getTokenTxs(chain, address);
  await delay(400);
  const nativeBalance = await getNativeBalance(chain, address);
  return { normalTxs, internalTxs, tokenTxs, nativeBalance };
}
