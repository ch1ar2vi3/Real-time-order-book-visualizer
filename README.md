# Real-Time Order Book Visualizer

A high-performance, real-time cryptocurrency order book visualizer built with Next.js, TypeScript, and Tailwind CSS. This application displays live market data from Binance's WebSocket API for BTC/USDT trading pair.

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation & Running

1. Navigate to the app directory:

```bash
cd app
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [real-time-order-book-visualizer-pi.vercel.app) in your browser

### Production Build

```bash
cd app
npm run build
npm start
```

## Project Structure

All application code is located in the `app/` directory:

```
app/
├── app/              # Next.js app directory
│   ├── page.tsx     # Main page
│   ├── layout.tsx   # Root layout
│   └── globals.css  # Global styles
├── components/       # React components
│   ├── OrderBook.tsx
│   └── RecentTrades.tsx
├── hooks/           # Custom hooks
│   └── useBinanceSocket.ts
├── types/           # TypeScript types
│   └── binance.ts
├── public/          # Static assets
└── README.md        # Detailed documentation
```

## Features

- ✅ Real-time order book with bid/ask visualization
- ✅ Live trade feed with flash animations
- ✅ Auto-reconnecting WebSocket connection
- ✅ High-performance rendering optimized for high-frequency updates
- ✅ Professional UI with Tailwind CSS
- ✅ TypeScript for type safety

## Key Highlights

### Performance Optimizations

1. **Efficient Data Structures**: Uses `Map` for O(1) order book updates
2. **Memoization**: Strategic use of `React.memo`, `useMemo`, and `useCallback`
3. **Limited Rendering**: Only displays top 20 levels per side
4. **Batched Updates**: React automatically batches state updates

### API Integration

- Connects to Binance WebSocket API using combined streams
- Fetches initial order book snapshot via REST API
- Handles delta updates for efficient state management
- Automatic reconnection on connection loss

## Deployment

This application is ready to deploy on:
- **Vercel**: Recommended (Next.js creators)
- **Netlify**: Fully supported
- **Any Node.js 18+ platform**

For detailed deployment instructions and design decisions, see [app/README.md](app/README.md).

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Technologies Used

- **Next.js 16.0** - React framework with App Router
- **TypeScript 5.0** - Type safety
- **Tailwind CSS 4.0** - Utility-first styling
- **Binance WebSocket API** - Real-time market data

## Development Status

✅ All core features implemented
✅ Performance optimizations applied
✅ Error handling and reconnection logic
✅ Professional UI/UX
✅ Comprehensive documentation

---

For more details, architecture decisions, and technical documentation, please see the [detailed README in the app directory](app/README.md).

