'use client';

import React, { memo, useEffect, useRef } from 'react';
import type { Trade } from '@/types/binance';
import { useBinanceStore } from '@/store/binanceStore';

const TradeItem: React.FC<{ trade: Trade; isNew: boolean }> = memo(({ trade, isNew }) => {
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNew && flashRef.current) {
      // Trigger flash animation
      flashRef.current.classList.remove('flash');
      void flashRef.current.offsetWidth; // Force reflow
      flashRef.current.classList.add('flash');
    }
  }, [isNew]);

  const tradeTime = new Date(trade.time).toLocaleTimeString();

  return (
    <div
      ref={flashRef}
      className={`flex text-xs font-mono border-b border-gray-800 hover:bg-gray-800 transition-colors ${
        trade.isBuy ? 'trade-buy' : 'trade-sell'
      }`}
    >
      <div className="w-1/4 px-3 py-2 text-gray-400">{tradeTime}</div>
      <div className={`w-1/4 px-3 py-2 text-right ${
        trade.isBuy ? 'text-green-400' : 'text-red-400'
      }`}>
        {trade.price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
      <div className="w-1/4 px-3 py-2 text-right text-gray-300">
        {trade.amount.toFixed(8)}
      </div>
      <div className={`w-1/4 px-3 py-2 text-right ${
        trade.isBuy ? 'text-green-400' : 'text-red-400'
      }`}>
        {(trade.price * trade.amount).toFixed(2)}
      </div>
    </div>
  );
});

TradeItem.displayName = 'TradeItem';

const RecentTrades: React.FC = () => {
  const { trades } = useBinanceStore();
  
  return (
    <div className="w-full">
      <div className="text-sm font-semibold mb-3 text-white">Recent Trades</div>
      
      {/* Header */}
      <div className="flex border-b border-gray-700 pb-2 mb-2">
        <div className="w-1/4 px-3 text-xs text-gray-500">Time</div>
        <div className="w-1/4 px-3 text-xs text-gray-500 text-right">Price</div>
        <div className="w-1/4 px-3 text-xs text-gray-500 text-right">Amount</div>
        <div className="w-1/4 px-3 text-xs text-gray-500 text-right">Total</div>
      </div>

      {/* Trades list */}
      <div className="max-h-[600px] overflow-y-auto">
        {trades.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-sm">
            No trades yet. Waiting for data...
          </div>
        ) : (
          trades.map((trade, index) => (
            <TradeItem key={`${trade.id}-${trade.time}`} trade={trade} isNew={index === 0} />
          ))
        )}
      </div>
    </div>
  );
};

export default memo(RecentTrades);

