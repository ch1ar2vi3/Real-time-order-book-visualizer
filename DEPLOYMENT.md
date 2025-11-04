# Deployment Guide

## Quick Deploy to Vercel

The easiest way to deploy this application is using Vercel:

1. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

2. **Deploy from the app directory**:
```bash
cd app
vercel
```

3. **Or use the Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your Git repository
   - Set the Root Directory to `app`
   - Deploy!

## Environment Variables

No environment variables are required for this deployment. The application uses public Binance WebSocket endpoints.

## Build Configuration

The project uses Next.js 16.0 with App Router. The build configuration is already optimized:

- **Build Command**: `npm run build` (automatically detected)
- **Output Directory**: `.next` (automatically detected)
- **Install Command**: `npm install`

## Netlify Deployment

To deploy on Netlify:

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - Base directory: `app`
   - Build command: `npm run build`
   - Publish directory: `app/.next`
5. Deploy!

## Docker Deployment

To deploy using Docker, create a Dockerfile in the `app` directory:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
cd app
docker build -t order-book-visualizer .
docker run -p 3000:3000 order-book-visualizer
```

## Self-Hosted Deployment

For self-hosted deployment on a VPS:

1. SSH into your server
2. Install Node.js 18+
3. Clone your repository
4. Navigate to app directory and build:
```bash
cd app
npm install
npm run build
```

5. Run with PM2 (recommended):
```bash
npm install -g pm2
pm2 start npm --name "order-book" -- start
pm2 save
pm2 startup
```

## Performance Monitoring

Consider adding monitoring services:

- **Vercel Analytics**: Built-in with Vercel
- **Sentry**: Error tracking
- **Web Vitals**: Performance metrics

## Troubleshooting

### WebSocket Connection Issues

If the application shows "Disconnected":
- Check that WebSocket connections are allowed by your hosting provider
- Verify firewall settings allow WSS connections
- Check browser console for connection errors

### Build Errors

If the build fails:
- Ensure Node.js 18+ is installed
- Clear `.next` directory and rebuild
- Check that all dependencies are installed correctly

### Port Configuration

By default, Next.js runs on port 3000. To change:
```bash
PORT=8080 npm start
```

Or update `next.config.ts`:
```typescript
module.exports = {
  // ... other config
  env: {
    PORT: 8080
  }
}
```

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd app && npm install
      - name: Build
        run: cd app && npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./app
```

## Production Checklist

Before deploying to production:

- [ ] All tests pass (if you have tests)
- [ ] Build completes without errors
- [ ] WebSocket connection works
- [ ] Performance is acceptable
- [ ] Error handling is in place
- [ ] Monitoring is configured
- [ ] Environment variables are set (if needed)
- [ ] SSL certificate is configured
- [ ] CORS is properly configured (if needed)

## Support

For issues or questions:
- Check the README.md
- Review Next.js deployment docs
- Check Binance API documentation
- Review application logs

