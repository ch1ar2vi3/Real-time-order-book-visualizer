# Testing the Connection

## How to Verify Live Data is Working

### 1. Open Browser Console
- Press F12 or Right-click → Inspect → Console tab
- You should see:
  - "WebSocket connected to Binance"
  - "WebSocket message received:" with JSON data
  - Regular trade updates every few seconds

### 2. Visual Indicators

**Connection Status:**
- Green pulsing dot = Connected and receiving data
- Red dot = Disconnected (check console for errors)

**Order Book:**
- Numbers should be updating in real-time
- Prices should reflect current BTC/USDT market
- Depth bars should be visible on each row

**Recent Trades:**
- New trades appearing at the top
- Green for buys, red for sells
- Flash animation on new trades

### 3. Expected Data Ranges

For BTC/USDT (as of typical market conditions):
- Price: $60,000 - $100,000 range
- Volumes: Varying amounts in BTC
- Trades: Multiple trades per second

### 4. Troubleshooting

**No data appearing:**
1. Check browser console for errors
2. Verify internet connection
3. Check if Binance API is accessible from your location
4. Try refreshing the page

**Connection status red:**
1. Check console logs
2. Verify WebSocket URL is correct
3. Check network tab for failed requests
4. Try reconnecting after a few seconds

**Slow updates:**
1. Check browser performance (F12 → Performance tab)
2. Verify no ad blockers blocking WebSocket
3. Check network latency

### 5. Testing Different Scenarios

**Test Reconnection:**
- Temporarily disable internet
- Watch for "WebSocket disconnected" in console
- Re-enable internet
- Should see "Attempting to reconnect..."
- Should reconnect automatically within 3 seconds

**Test High Frequency:**
- Leave application running
- Watch console for message frequency
- Verify UI remains smooth and responsive
- No lag or jank should be visible

### 6. Binance API Status

If you're not seeing data:
- Check Binance status: https://www.binance.com/en/support/announcement
- Test WebSocket manually with a tool like Postman
- Verify symbol is correct (BTCUSDT not BTC/USDT)

### Sample Expected Console Output

```
WebSocket connected to Binance
WebSocket message received: {stream: "btcusdt@aggTrade", data: {...}}
WebSocket message received: {stream: "btcusdt@depth", data: {...}}
```

### Direct API Test

You can test the Binance API directly in your browser console:

```javascript
const ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@depth/btcusdt@aggTrade');
ws.onmessage = (event) => console.log(JSON.parse(event.data));
```

If this works, you should see data streaming in the console.

## Success Criteria

✅ WebSocket connected message appears
✅ Regular message logs in console
✅ Order book showing real BTC prices
✅ Trades updating in real-time
✅ Connection status shows green
✅ No errors in console
✅ Smooth UI updates

