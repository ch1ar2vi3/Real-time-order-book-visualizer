'use client';

import React, { useMemo, memo } from 'react';
import type { OrderBookLevel } from '@/types/binance';
import { useBinanceStore } from '@/store/binanceStore';

interface OrderBookSideProps {
  levels: OrderBookLevel[];
  maxTotal: number;
  isBids: boolean;
}

const OrderBookSide: React.FC<OrderBookSideProps> = memo(({ levels, maxTotal, isBids }) => {
  return (
    <div className="flex-1">
      <div className="text-xs text-gray-500 mb-2 px-3">
        {isBids ? 'BIDS (BUY)' : 'ASKS (SELL)'}
      </div>
      <div className="space-y-px">
        {levels.map((level, index) => {
          const depthPercent = (level.total / maxTotal) * 100;
          
          return (
            <div
              key={`${isBids ? 'bid' : 'ask'}-${level.price}-${index}`}
              className="relative overflow-hidden group hover:bg-opacity-80 transition-all"
            >
              {/* Depth background bar */}
              <div
                className={`absolute inset-0 ${
                  isBids ? 'bg-green-500' : 'bg-red-500'
                } opacity-10`}
                style={{
                  width: `${depthPercent}%`,
                  right: isBids ? 'auto' : 0,
                  left: isBids ? 0 : 'auto',
                }}
              />
              
              {/* Content */}
              <div className="relative flex text-xs font-mono">
                <div className={`w-1/3 text-right px-2 py-1 ${
                  isBids ? 'text-green-400' : 'text-red-400'
                }`}>
                  {level.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="w-1/3 text-right px-2 py-1 text-gray-300">
                  {level.amount.toFixed(8)}
                </div>
                <div className="w-1/3 text-right px-3 py-1 text-gray-400">
                  {level.total.toFixed(8)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

OrderBookSide.displayName = 'OrderBookSide';

const OrderBook: React.FC = () => {
  const { orderBook } = useBinanceStore();
  
  const { bidsLevels, asksLevels, spread, spreadPercent } = useMemo(() => {
    // Convert Maps to sorted arrays
    const bidsArray: OrderBookLevel[] = Array.from(orderBook.bids.entries())
      .map(([price, amount]) => ({
        price,
        amount,
        total: 0, // Will be calculated below
      }))
      .sort((a, b) => b.price - a.price) // Descending for bids
      .slice(0, 20); // Show top 20 levels

    const asksArray: OrderBookLevel[] = Array.from(orderBook.asks.entries())
      .map(([price, amount]) => ({
        price,
        amount,
        total: 0, // Will be calculated below
      }))
      .sort((a, b) => a.price - b.price) // Ascending for asks
      .slice(0, 20); // Show top 20 levels

    // Calculate cumulative totals
    let runningTotal = 0;
    for (const level of bidsArray) {
      runningTotal += level.amount;
      level.total = runningTotal;
    }

    runningTotal = 0;
    for (const level of asksArray) {
      runningTotal += level.amount;
      level.total = runningTotal;
    }

    // Calculate spread
    const highestBid = bidsArray[0]?.price || 0;
    const lowestAsk = asksArray[0]?.price || 0;
    const spread = highestBid && lowestAsk ? lowestAsk - highestBid : 0;
    const spreadPercent = spread && highestBid ? (spread / highestBid) * 100 : 0;

    return {
      bidsLevels: bidsArray,
      asksLevels: asksArray,
      spread,
      spreadPercent,
    };
  }, [orderBook.bids, orderBook.asks]);

  const maxTotal = useMemo(() => {
    const maxBid = bidsLevels.length > 0 ? bidsLevels[bidsLevels.length - 1]?.total || 0 : 0;
    const maxAsk = asksLevels.length > 0 ? asksLevels[asksLevels.length - 1]?.total || 0 : 0;
    return Math.max(maxBid, maxAsk);
  }, [bidsLevels, asksLevels]);

  return (
    <div className="w-full">
      <div className="flex mb-1">
        <div className="text-xs text-gray-500 mb-2 px-3"></div>
      </div>
      
      {/* Header */}
      <div className="flex mb-2 border-b border-gray-700 pb-2">
        <div className="flex-1 flex">
          <div className="w-1/3 text-right px-2 text-xs text-gray-500">Price</div>
          <div className="w-1/3 text-right px-2 text-xs text-gray-500">Amount</div>
          <div className="w-1/3 text-right px-3 text-xs text-gray-500">Total</div>
        </div>
      </div>

      {/* Order book content */}
      <div className="flex gap-4">
        {/* Bids */}
        <OrderBookSide levels={bidsLevels} maxTotal={maxTotal} isBids={true} />
        
        {/* Spread separator */}
        <div className="flex-shrink-0 w-32 flex flex-col items-center justify-center text-center px-2 border-l border-r border-gray-700">
          <div className="text-xs text-gray-500 mb-1">SPREAD</div>
          <div className="text-lg font-bold text-white">
            {spread.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">
            {((spread / (bidsLevels[0]?.price || 1)) * 100).toFixed(4)}%
          </div>
        </div>

        {/* Asks */}
        <OrderBookSide levels={asksLevels} maxTotal={maxTotal} isBids={false} />
      </div>
    </div>
  );
};

export default memo(OrderBook);

