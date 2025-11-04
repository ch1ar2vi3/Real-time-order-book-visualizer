# Real-Time Order Book Visualizer

A high-performance, real-time cryptocurrency order book visualizer built with Next.js, TypeScript, and Tailwind CSS. This application displays live market data from Binance's WebSocket API for BTC/USDT trading pair.

![Real-Time Order Book](https://img.shields.io/badge/Real-Time-Order_Book-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Binance WebSocket](https://img.shields.io/badge/API-Binance-yellow)

## Features

- **Real-Time Order Book**: Live bid/ask data with depth visualization
- **Live Trade Feed**: Recent trades with flash animations
- **High Performance**: Optimized for high-frequency updates without UI lag
- **WebSocket Integration**: Direct connection to Binance WebSocket API
- **Auto-Reconnect**: Automatic reconnection on connection loss
- **Professional UI**: Clean, modern interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the project directory:

```bash
cd app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build

To create a production build:

```bash
npm run build
npm start
```

## Architecture & Design Choices

### State Management

I chose to use React's built-in `useState` and `useMemo` hooks rather than external state management libraries for the following reasons:

1. **Simplicity**: The state requirements were straightforward - order book updates and trade history
2. **Performance**: React's built-in optimizations with `useMemo`, `useCallback`, and `React.memo` are sufficient for this use case
3. **No External Dependencies**: Reduced bundle size and complexity

### WebSocket Implementation

The application uses Binance's combined WebSocket stream endpoint to subscribe to both:
- **Order Book Depth Stream**: `btcusdt@depth20@100ms` - Updates every 100ms
- **Aggregate Trade Stream**: `btcusdt@aggTrade` - Real-time trade data

**Key Implementation Details:**

1. **Initial Snapshot**: Before starting WebSocket updates, an initial order book snapshot is fetched via REST API
2. **Delta Updates**: The WebSocket provides delta updates that are applied incrementally to the state
3. **Connection Management**: Automatic reconnection with exponential backoff (3-second delay)
4. **Error Handling**: Graceful handling of connection errors and invalid data

### Performance Optimizations

To handle high-frequency updates without UI lag, the following optimizations were implemented:

1. **Data Structures**: Used `Map` for O(1) order book updates instead of arrays
2. **Memoization**: Applied `React.memo`, `useMemo`, and `useCallback` strategically:
   - `OrderBook` component memoized to prevent unnecessary re-renders
   - `OrderBookSide` sub-component memoized for per-side optimization
   - `TradeItem` memoized to prevent flash animation on all items
3. **Computed Values**: Spread, cumulative totals, and max depth calculated with `useMemo`
4. **Batched Updates**: React batches state updates automatically
5. **Limited Display**: Only the top 20 levels displayed for each side
6. **Trade History**: Maintained exactly 50 recent trades

### Component Structure

```
app/
├── app/
│   ├── page.tsx          # Main page with layout
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles and animations
├── components/
│   ├── OrderBook.tsx     # Main order book display
│   └── RecentTrades.tsx  # Trade history with flashing
├── hooks/
│   └── useBinanceSocket.ts  # WebSocket connection logic
└── types/
    └── binance.ts        # TypeScript type definitions
```

## API Integration

### Binance WebSocket API

The application connects to Binance's public WebSocket stream using the combined endpoint:

```
wss://stream.binance.com:9443/stream?streams=btcusdt@depth20@100ms/btcusdt@aggTrade
```

**Message Format:**

Order book updates arrive as:
```json
{
  "stream": "btcusdt@depth20@100ms",
  "data": {
    "e": "depthUpdate",
    "b": [["price", "quantity"], ...],
    "a": [["price", "quantity"], ...]
  }
}
```

Trade events arrive as:
```json
{
  "stream": "btcusdt@aggTrade",
  "data": {
    "e": "aggTrade",
    "p": "price",
    "q": "quantity",
    "T": timestamp,
    "m": isMarketMaker
  }
}
```

### Data Processing

- **Zero Quantity**: When a price level has quantity "0", it's removed from the order book
- **Trade Direction**: Determined by the `m` field - if buyer is NOT market maker, it's a buy
- **Cumulative Totals**: Calculated by summing amounts from top to bottom of each side

## UI/UX Features

### Order Book Display

- **Two-Column Layout**: Bids (green) on left, Asks (red) on right
- **Depth Visualization**: Background bars show relative depth
- **Spread Display**: Centered spread indicator with percentage
- **Color Coding**: Green for buys, red for sells (financial convention)

### Recent Trades

- **Flash Animation**: New trades flash briefly to draw attention
- **Direction Indicators**: Color-coded by trade direction
- **Real-Time Updates**: Trades appear at the top as they occur
- **Limited History**: Maintains 50 most recent trades

### Status Indicators

- **Connection Status**: Visual indicator (green/red) shows WebSocket state
- **Error Display**: Error messages shown when connection issues occur

## Deployment

The application is optimized for deployment on Vercel, Netlify, or any platform that supports Next.js:

1. **Vercel**: Simply connect your GitHub repository
2. **Netlify**: Use the build command `npm run build` and publish directory `.next`
3. **Other Platforms**: Ensure Node.js 18+ is supported

## Technical Stack

- **Framework**: Next.js 16.0 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **API**: Binance WebSocket Streams
- **State**: React Hooks (useState, useMemo, useCallback)
- **Performance**: React.memo for component memoization

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design with touch-friendly UI

## Future Enhancements

Potential improvements for future versions:

1. **Multiple Trading Pairs**: Support for different cryptocurrency pairs
2. **Configurable Depth**: User-selectable order book depth
3. **Historical Charts**: Price charts and volume indicators
4. **User Preferences**: Customizable color schemes and layouts
5. **WebSocket Compression**: Implement compression for reduced bandwidth

## License

This project is created as a technical assessment. Feel free to use it as a reference or learning resource.

## Acknowledgments

- Binance for providing public WebSocket API
- Next.js team for the excellent framework
- Tailwind CSS for the utility-first styling approach

---

Built with ❤️ for high-performance financial data visualization
