'use client';

import { useBinanceSocket } from '@/hooks/useBinanceSocket';
import OrderBook from '@/components/OrderBook';
import RecentTrades from '@/components/RecentTrades';
import { useBinanceStore } from '@/store/binanceStore';

export default function Home() {
  // Initialize the WebSocket connection
  useBinanceSocket();
  
  // Get state from the store
  const { isConnected, error, orderBook, toggleConnection } = useBinanceStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8 max-w-[1600px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Real-Time Order Book Visualizer
          </h1>
          <p className="text-gray-400">
            Live BTC/USDT market data from Binance
          </p>
          
          {/* Status indicator and toggle button */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span className={`text-sm ${isConnected ? 'text-green-300 font-medium' : 'text-red-300'}`}>
                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
            <button 
              onClick={toggleConnection}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isConnected 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isConnected ? 'DISCONNECT' : 'CONNECT'}
            </button>
            {error && (
              <span className="text-sm text-yellow-400 bg-gray-800 px-3 py-1 rounded-full">
                {error.replace('Will attempt to reconnect automatically.', 'Reconnecting...')}
              </span>
            )}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Book - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Order Book</h2>
                <div className="text-sm text-gray-400">
                  {orderBook.bids.size + orderBook.asks.size} levels
                </div>
              </div>
              <OrderBook />
            </div>
          </div>

          {/* Recent Trades - 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 h-full">
              <RecentTrades />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Powered by Binance WebSocket API • Data updates in real-time
          </p>
        </div>
      </div>
    </div>
  );
}
