# Step-by-Step Testing Guide

## Quick Testing Steps

### 1. Check Browser Console

**Press F12** (or Right-click → Inspect) to open Developer Tools, then:

1. Go to the **Console** tab
2. Refresh the page (Ctrl+R or Cmd+R)
3. Look for these messages in order:

```
Fetching snapshot from Binance...
Snapshot received: {lastUpdateId: ..., bids: ..., asks: ...}
Order book initialized with 20 bids and 20 asks
WebSocket connected to Binance
Raw message: {stream: 'btcusdt@depth', data: {...}}
```

### 2. What You Should See

**If Working Correctly:**
- ✅ "Connected" with green pulsing dot
- ✅ Order book showing numbers like "70150.50", etc.
- ✅ Spread showing a value
- ✅ Console logs showing data

**If Not Working:**
- ❌ "Disconnected" with red dot
- ❌ Empty order book
- ❌ Error messages in console

### 3. Common Issues & Fixes

#### Issue: CORS Error
**Symptom:** Console shows CORS error
**Fix:** Shouldn't happen with WebSocket, but check if site is served on HTTPS

#### Issue: "WebSocket connection failed"
**Symptom:** Connection fails immediately
**Fix:** 
- Check internet connection
- Try different network
- Check if Binance is blocked in your region

#### Issue: "Fetch error" or "Network error"
**Symptom:** Snapshot not loading
**Fix:**
- Check `https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=20` in browser
- Should show JSON data
- If blocked, use VPN or proxy

#### Issue: Connected but no data
**Symptom:** Green dot but empty order book
**Fix:**
- Check console for "Raw message:" logs
- Look for "Processing stream:" logs
- Verify data structure matches expected format

### 4. Manual API Test

Open browser console and run:

```javascript
// Test REST API
fetch('https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=20')
  .then(r => r.json())
  .then(console.log);

// Test WebSocket
const ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@depth/btcusdt@aggTrade');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
ws.onopen = () => console.log('Connected!');
```

**Expected Results:**
- REST API: Returns JSON with bids/asks arrays
- WebSocket: Logs "Connected!" and then continuous message logs

### 5. Network Tab Check

1. Go to **Network** tab in DevTools
2. Filter by "WS" (WebSocket)
3. Refresh page
4. Should see a WebSocket connection to `stream.binance.com:9443`
5. Status should be "101 Switching Protocols"
6. Messages tab should show continuous data flow

### 6. Verify Data Flow

Watch the console for:
- **Snapshot loaded**: "Order book initialized with..."
- **Connection established**: "WebSocket connected"
- **Messages arriving**: "Raw message:" appearing regularly
- **Events processed**: "Processing stream: btcusdt@depth Event: depthUpdate"

### 7. Troubleshooting Commands

If still not working, in the browser console:

```javascript
// Check if WebSocket is supported
console.log('WebSocket support:', typeof WebSocket !== 'undefined');

// Check Fetch API
fetch('https://httpbin.org/get').then(r => r.json()).then(console.log);

// Direct connection test
const testWS = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
testWS.onmessage = e => console.log('Direct test:', e.data);
testWS.onerror = e => console.error('Direct test error:', e);
```

### 8. Expected Console Output

**Full successful output should look like:**

```
Fetching snapshot from Binance...
Snapshot received: {lastUpdateId: 12345678, bids: [["70150.00", "0.5"], ...], asks: [["70151.00", "0.3"], ...]}
Order book initialized with 20 bids and 20 asks
WebSocket connected to Binance
Raw message: {stream: "btcusdt@aggTrade", data: {e: "aggTrade", p: "70150.50", ...}}
Processing stream: btcusdt@aggTrade Event: aggTrade
Raw message: {stream: "btcusdt@depth", data: {e: "depthUpdate", b: [...], a: [...]}}
Processing stream: btcusdt@depth Event: depthUpdate
```

### 9. Success Indicators

When everything is working, you should see:

✅ Green pulsing connection dot
✅ Numbers updating in real-time in order book
✅ New trades appearing with flash animation
✅ Spread value displaying correctly
✅ Console logs showing continuous data flow

### 10. Get Help

If none of this works, share:
1. Console output (screenshot or text)
2. Network tab showing any failed requests
3. Browser version (Chrome, Firefox, Safari, etc.)
4. Any error messages displayed

Copy and paste console logs here for debugging!

