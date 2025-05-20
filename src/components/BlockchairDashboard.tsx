import React, { useEffect, useState } from 'react';
import {
  getGeneralStats,
  getBitcoinAddress,
  getBitcoinTransaction,
} from '../services/blockchair';
import type { GeneralStatsResponse } from '../services/blockchair';

const BlockchairDashboard: React.FC = () => {
  const [generalStats, setGeneralStats] = useState<GeneralStatsResponse | null>(null);
  const [address, setAddress] = useState('');
  const [addressData, setAddressData] = useState<any>(null);
  const [txid, setTxid] = useState('');
  const [txData, setTxData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    general: true,
    address: false,
    transaction: false
  });

  useEffect(() => {
    const fetchGeneralStats = async () => {
      try {
        const data = await getGeneralStats();
        setGeneralStats(data);
      } catch (err: any) {
        if (err.message.includes('API key is missing')) {
          setError('Blockchair API key is missing. Please add VITE_BLOCKCHAIR_API_KEY to your .env file');
        } else if (err.response?.status === 402) {
          setError('Invalid or expired Blockchair API key. Please check your API key in the .env file');
        } else {
          setError('Failed to fetch general stats. Please try again later.');
        }
      } finally {
        setLoading(prev => ({ ...prev, general: false }));
      }
    };

    fetchGeneralStats();
  }, []);

  const handleAddressLookup = async () => {
    if (!address) return;
    
    setError(null);
    setAddressData(null);
    setLoading(prev => ({ ...prev, address: true }));
    
    try {
      const data = await getBitcoinAddress(address);
      setAddressData(data);
    } catch (err: any) {
      if (err.message.includes('API key is missing')) {
        setError('Blockchair API key is missing. Please add VITE_BLOCKCHAIR_API_KEY to your .env file');
      } else if (err.response?.status === 402) {
        setError('Invalid or expired Blockchair API key. Please check your API key in the .env file');
      } else {
        setError('Failed to fetch address data. Please try again later.');
      }
    } finally {
      setLoading(prev => ({ ...prev, address: false }));
    }
  };

  const handleTxLookup = async () => {
    if (!txid) return;
    
    setError(null);
    setTxData(null);
    setLoading(prev => ({ ...prev, transaction: true }));
    
    try {
      const data = await getBitcoinTransaction(txid);
      setTxData(data);
    } catch (err: any) {
      if (err.message.includes('API key is missing')) {
        setError('Blockchair API key is missing. Please add VITE_BLOCKCHAIR_API_KEY to your .env file');
      } else if (err.response?.status === 402) {
        setError('Invalid or expired Blockchair API key. Please check your API key in the .env file');
      } else {
        setError('Failed to fetch transaction data. Please try again later.');
      }
    } finally {
      setLoading(prev => ({ ...prev, transaction: false }));
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatPercentage = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num / 100);
  };

  const getChainIcon = (chain: string) => {
    const icons: { [key: string]: string } = {
      bitcoin: '₿',
      ethereum: 'Ξ',
      'bitcoin-cash': '₿',
      litecoin: 'Ł',
      'bitcoin-sv': '₿',
      dogecoin: 'Ð',
      dash: 'Ð',
      ripple: 'XRP',
      stellar: 'XLM',
      monero: 'XMR',
      cardano: '₳',
      zcash: 'ZEC',
      mixin: 'XIN'
    };
    return icons[chain] || chain.charAt(0).toUpperCase();
  };

  const chainMeta: Record<string, { name: string; symbol: string; color: string; icon: React.ReactNode }> = {
    bitcoin: {
      name: 'Bitcoin',
      symbol: 'BTC',
      color: 'bg-gradient-to-tr from-yellow-400 to-orange-500',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#F7931A"/><path d="M23.5 18.5c1.5-.5 2.5-1.5 2.5-3 0-2-1.5-3-4-3V10h-2v2.5h-2V10h-2v2.5H11v2h1.5v10H11v2h2v2.5h2V30h2v-2.5h2V30h2v-2.5c2.5 0 4-1 4-3 0-1.5-1-2.5-2.5-3zm-6-6h4c1.5 0 2.5.5 2.5 2s-1 2-2.5 2h-4v-4zm4 10h-4v-4h4c1.5 0 2.5.5 2.5 2s-1 2-2.5 2z" fill="#fff"/></svg>
      ),
    },
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      color: 'bg-gradient-to-tr from-blue-500 to-indigo-700',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#627EEA"/><path d="M20 8v10.87l8.5 3.8L20 8z" fill="#fff"/><path d="M20 8l-8.5 14.67 8.5-3.8V8z" fill="#fff"/><path d="M20 32v-7.13l8.5-4.07L20 32z" fill="#fff"/><path d="M20 32l-8.5-11.2 8.5 4.07V32z" fill="#fff"/></svg>
      ),
    },
    'bitcoin-cash': {
      name: 'Bitcoin Cash',
      symbol: 'BCH',
      color: 'bg-gradient-to-tr from-green-400 to-green-600',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#8DC351"/><text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" dy=".3em">B</text></svg>
      ),
    },
    // ... add more chains as needed ...
  };

  function timeAgo(date: Date | number) {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - (typeof date === 'number' ? date : date.getTime())) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hours ago`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#181824] via-[#23243a] to-[#3a1c71] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-10 text-center drop-shadow">Blockchain Dashboard</h1>
        {error && (
          <div className="bg-red-500/80 text-white rounded-lg p-4 mb-8 text-center shadow-lg">{error}</div>
        )}
        {loading.general ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400"></div>
          </div>
        ) : generalStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Object.entries(generalStats.data).map(([chain, chainData]) => {
              if (!chainData || !('data' in chainData)) return null;
              const meta = chainMeta[chain] || { name: chain, symbol: '', color: 'bg-gray-700', icon: <span className="w-10 h-10" /> };
              const data = chainData.data;
              // Fallbacks for missing data
              const price = data.market_price_usd;
              const latestBlock = data.blocks;
              const blockTime = data.best_block_time;
              // No average fee available in API, so display N/A
              const avgFee = 'N/A';
              // Convert blockTime to time ago if possible
              let ago = '';
              if (blockTime) {
                const blockDate = new Date(blockTime);
                ago = timeAgo(blockDate);
              }
              return (
                <div key={chain} className={`relative rounded-2xl p-6 shadow-xl bg-white/10 backdrop-blur-md border border-white/20 ${meta.color} transition-all duration-300`} style={{boxShadow:'0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0">{meta.icon}</div>
                    <div>
                      <div className="text-xl font-bold text-white flex items-center gap-2">{meta.name}</div>
                      <div className="text-lg text-white/80 font-mono">{price ? formatPrice(price) : '--'} <span className="text-sm text-white/40 font-sans">{meta.symbol}</span></div>
                    </div>
                  </div>
                  <div className="mt-2 text-white/80">
                    <div className="text-sm mb-1">Latest block</div>
                    <div className="text-lg font-mono flex items-center gap-2">
                      {latestBlock ? formatNumber(latestBlock) : '--'}
                      {ago && <span className="text-xs text-white/50 ml-2">· {ago}</span>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-white/60">Average fee</div>
                    <div className="text-lg font-mono text-white">N/A</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Address Lookup</h2>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Bitcoin address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddressLookup}
                disabled={loading.address}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-200"
              >
                {loading.address ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : 'Lookup'}
              </button>
            </div>
            {addressData && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Address Details</h3>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(addressData, null, 2)}
                </pre>
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction Lookup</h2>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
                placeholder="Enter Transaction ID"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleTxLookup}
                disabled={loading.transaction}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-200"
              >
                {loading.transaction ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : 'Lookup'}
              </button>
            </div>
            {txData && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Transaction Details</h3>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(txData, null, 2)}
                </pre>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BlockchairDashboard; 