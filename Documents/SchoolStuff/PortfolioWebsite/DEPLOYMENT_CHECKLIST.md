# Deployment Checklist

## ✅ Pre-Deployment

### 1. Analytics Setup
- [ ] Get Google Analytics Measurement ID
- [ ] Update `index.html` with your GA4 ID (replace `G-XXXXXXXXXX`)
- [ ] Update `src/utils/analytics.js` line 20 with your GA4 ID
- [ ] Test analytics in development (check console logs)

### 2. Environment Variables (if needed)
- [ ] No environment variables required for basic setup
- [ ] All assets are in `/public` folder

### 3. Build Test
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] Check `dist` folder for all assets

### 4. Local Preview
```bash
npm run preview
```
- [ ] Test all sections
- [ ] Test 3D models load correctly
- [ ] Test mobile responsiveness
- [ ] Test cyber mode toggle

## 🚀 GitHub Push

```bash
git add .
git commit -m "Add lazy loading, mobile optimizations, and analytics"
git push origin main
```

## 📦 Vercel Deployment

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect Vite settings
4. Deploy!

### Vercel Settings (Auto-detected):
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## 🎯 Post-Deployment

- [ ] Test live site on desktop
- [ ] Test live site on mobile
- [ ] Verify analytics tracking
- [ ] Check 3D models load correctly
- [ ] Test all project links
- [ ] Verify resume PDF downloads

## 📊 Performance Optimizations Added

✅ **Lazy Loading for 3D Models**
- Models only load when scrolled into view
- Reduces initial page load time

✅ **Mobile Optimizations**
- Reduced particle count on mobile (30 → 10)
- Disabled custom cursor on mobile
- Reduced glitch effect complexity on mobile
- Disabled sound effects on mobile

✅ **Analytics Tracking**
- Project views
- Link clicks
- Section navigation
- Cyber mode usage
- 3D model interactions

## 🔧 Troubleshooting

### If 3D models don't load:
- Check browser console for errors
- Verify model files are in `/public/models/`
- Check file paths match exactly

### If analytics don't work:
- Verify GA4 ID is correct
- Check browser console for errors
- Use Google Analytics DebugView

### If build fails:
- Run `npm install` to ensure dependencies are up to date
- Check for TypeScript/ESLint errors
- Verify all imports are correct
