// Binance API types

export interface BinanceStreamMessage {
  stream: string;
  data: BinanceOrderBookUpdate | BinanceTradeEvent;
}

export interface BinanceOrderBookUpdate {
  e: string; // event type
  E: number; // event time
  s: string; // symbol
  U: number; // first update ID
  u: number; // final update ID
  b: [string, string][]; // bids [price, quantity]
  a: [string, string][]; // asks [price, quantity]
}

export interface BinanceTradeEvent {
  e: string; // event type (aggTrade)
  E: number; // event time
  s: string; // symbol
  a: number; // aggregated trade ID
  p: string; // price
  q: string; // quantity
  f: number; // first trade ID
  l: number; // last trade ID
  T: number; // trade time
  m: boolean; // is buyer the market maker?
}

export interface OrderBookLevel {
  price: number;
  amount: number;
  total: number;
}

export interface Trade {
  id: number;
  price: number;
  amount: number;
  time: number;
  isBuy: boolean;
}

export interface OrderBook {
  bids: Map<number, number>; // price -> amount
  asks: Map<number, number>; // price -> amount
}

