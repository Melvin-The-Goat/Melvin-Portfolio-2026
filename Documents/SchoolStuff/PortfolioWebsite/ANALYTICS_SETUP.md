# Analytics Setup Guide

## Google Analytics 4 Setup

1. **Create a Google Analytics Account**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new property for your portfolio website
   - Get your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Update the Analytics ID**
   - Open `index.html`
   - Replace `G-XXXXXXXXXX` with your actual Google Analytics Measurement ID in two places:
     - Line 17: `<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>`
     - Line 22: `gtag('config', 'G-XXXXXXXXXX');`
   - Also update `src/utils/analytics.js` line 20 with your Measurement ID

3. **What's Being Tracked**
   - Page views
   - Project views (when modal opens)
   - Project link clicks (GitHub, Roblox, etc.)
   - Section navigation
   - Cyber mode toggles
   - 3D model views

4. **Testing**
   - In development mode, events are logged to console
   - Check Google Analytics Real-Time reports to verify tracking

## Alternative: Vercel Analytics

If you prefer Vercel's built-in analytics:
1. Install: `npm install @vercel/analytics`
2. Add to `src/main.jsx`:
   ```jsx
   import { Analytics } from '@vercel/analytics/react';
   // Add <Analytics /> inside your App component
   ```
