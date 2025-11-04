'use client';

import { create } from 'zustand';
import type { OrderBook, Trade } from '@/types/binance';

interface BinanceStore {
  // Order book state
  orderBook: OrderBook;
  
  // Recent trades state
  trades: Trade[];
  
  // Connection state
  isConnected: boolean;
  manualDisconnect: boolean;
  error: string | null;
  
  // Actions
  updateOrderBook: (bids: [string, string][], asks: [string, string][]) => void;
  addTrade: (trade: Trade) => void;
  setConnectionStatus: (isConnected: boolean) => void;
  toggleConnection: () => void;
  setError: (error: string | null) => void;
}

export const useBinanceStore = create<BinanceStore>((set) => ({
  // Initial state
  orderBook: {
    bids: new Map(),
    asks: new Map(),
  },
  trades: [],
  isConnected: false,
  manualDisconnect: false,
  error: null,
  
  // Actions
  updateOrderBook: (bids, asks) => set((state) => {
    const newBids = new Map(state.orderBook.bids);
    const newAsks = new Map(state.orderBook.asks);
    
    // Process bids
    for (const [priceStr, amountStr] of bids) {
      const price = parseFloat(priceStr);
      const amount = parseFloat(amountStr);
      
      if (amount === 0) {
        newBids.delete(price);
      } else {
        newBids.set(price, amount);
      }
    }
    
    // Process asks
    for (const [priceStr, amountStr] of asks) {
      const price = parseFloat(priceStr);
      const amount = parseFloat(amountStr);
      
      if (amount === 0) {
        newAsks.delete(price);
      } else {
        newAsks.set(price, amount);
      }
    }
    
    return { orderBook: { bids: newBids, asks: newAsks } };
  }),
  
  addTrade: (trade) => set((state) => {
    const newTrades = [trade, ...state.trades].slice(0, 50); // Keep only 50 most recent
    return { trades: newTrades };
  }),
  
  setConnectionStatus: (isConnected) => set((state) => ({ 
    isConnected: state.manualDisconnect ? false : isConnected 
  })),
  
  toggleConnection: () => set((state) => ({ 
    manualDisconnect: !state.manualDisconnect,
    isConnected: state.manualDisconnect ? true : false
  })),
  
  setError: (error) => set({ error }),
}));