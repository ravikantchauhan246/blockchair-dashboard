import axios from 'axios';

const API_KEY = import.meta.env.VITE_BLOCKCHAIR_API_KEY;

if (!API_KEY) {
  console.error('Blockchair API key is missing. Please add VITE_BLOCKCHAIR_API_KEY to your .env file');
}

const BASE_URL = 'https://api.blockchair.com';

// Types for the response
export interface BlockchainStats {
  blocks?: number;
  transactions?: number;
  circulation?: number;
  blockchain_size?: number;
  difficulty?: number;
  hashrate_24h?: string;
  best_block_height?: number;
  best_block_hash?: string;
  best_block_time?: string;
  mempool_transactions?: number;
  market_price_usd?: number;
  market_price_btc?: number;
  market_price_usd_change_24h_percentage?: number;
  market_cap_usd?: number;
  market_dominance_percentage?: number;
}

export interface CrossChainStats {
  tether?: { data: any };
  'usd-coin'?: { data: any };
  'binance-usd'?: { data: any };
}

export interface GeneralStatsResponse {
  data: {
    bitcoin?: { data: BlockchainStats };
    'bitcoin-cash'?: { data: BlockchainStats };
    ethereum?: { data: BlockchainStats };
    litecoin?: { data: BlockchainStats };
    'bitcoin-sv'?: { data: BlockchainStats };
    dogecoin?: { data: BlockchainStats };
    dash?: { data: BlockchainStats };
    ripple?: { data: BlockchainStats };
    groestlcoin?: { data: BlockchainStats };
    stellar?: { data: BlockchainStats };
    monero?: { data: BlockchainStats };
    cardano?: { data: BlockchainStats };
    zcash?: { data: BlockchainStats };
    mixin?: { data: BlockchainStats };
    'cross-chain'?: CrossChainStats;
  };
}

const getUrl = (endpoint: string) => {
  if (!API_KEY) {
    throw new Error('Blockchair API key is missing. Please add VITE_BLOCKCHAIR_API_KEY to your .env file');
  }
  return `${BASE_URL}${endpoint}?key=${API_KEY}`;
};

export const getGeneralStats = async (): Promise<GeneralStatsResponse> => {
  const url = getUrl('/stats');
  const response = await axios.get(url);
  return response.data;
};

export const getBitcoinStats = async () => {
  const url = getUrl('/bitcoin/stats');
  const response = await axios.get(url);
  return response.data.data;
};

export const getBitcoinRecentTransactions = async () => {
  const url = getUrl('/bitcoin/transactions?limit=5');
  const response = await axios.get(url);
  return response.data.data;
};

export const getBitcoinAddress = async (address: string) => {
  const url = getUrl(`/bitcoin/dashboards/address/${address}`);
  const response = await axios.get(url);
  return response.data.data;
};

export const getBitcoinTransaction = async (txid: string) => {
  const url = getUrl(`/bitcoin/dashboards/transaction/${txid}`);
  const response = await axios.get(url);
  return response.data.data;
}; 