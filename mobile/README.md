# Gene Calculator Mobile

Mobile version of Gene Calculator using Capacitor for iOS and Android deployment.

## 🏗️ Architecture

This mobile app uses a **hybrid approach**:
- **Shared Logic**: All 15 calculator modules from `../calculators/` are reused
- **Separate UI**: Mobile-optimized interface with touch interactions
- **Independent**: Can be developed/deployed separately from web version

## 📁 Structure

```
mobile/
├── index.html              # Mobile entry point with sliding menu
├── js/
│   └── mobile-app.js      # Mobile-specific app logic
├── css/
│   └── mobile.css         # Touch-optimized styles
├── build.sh               # Build script (copies files to www/)
├── www/                   # Generated - contains all built files
├── ios/                   # Generated - iOS native project
└── android/               # Generated - Android native project
```

## 🚀 Quick Start

### Prerequisites
- Node.js (installed)
- Xcode (for iOS development)
- Android Studio (for Android development)

### Development

1. **Test in browser** (during development):
   ```bash
   npm run dev
   # Opens on http://localhost:8001
   ```

2. **Build for mobile**:
   ```bash
   npm run build
   # Runs build.sh to copy files to www/
   ```

3. **Sync with native projects**:
   ```bash
   npm run sync          # Sync both iOS and Android
   npm run sync:ios      # Sync iOS only
   npm run sync:android  # Sync Android only
   ```

4. **Open in IDEs**:
   ```bash
   npm run open:ios      # Opens in Xcode
   npm run open:android  # Opens in Android Studio
   ```

## 📱 Key Features

### Mobile UI Differences
- **Sliding Menu**: Swipe from left or tap ☰ button
- **Touch Optimized**: All buttons min 48px (iOS guidelines)
- **Safe Areas**: Support for iPhone notches/Dynamic Island
- **Gestures**: Swipe left to close menu
- **No Tabs**: Single-screen navigation vs web's tab bar
- **Optimized Layout**: Fits better on small screens

### Shared Features
- All 15 calculators work identically
- History persistence (localStorage)
- Live currency rates with caching
- Same business logic as web version

## 🔧 Development Workflow

### Making Changes

1. Edit mobile-specific files:
   - `index.html` - UI structure
   - `js/mobile-app.js` - App logic
   - `css/mobile.css` - Styling

2. Edit calculator logic (shared with web):
   - `../calculators/*/` - Changes affect both versions

3. Build and sync:
   ```bash
   npm run sync
   ```

4. Test:
   - iOS: `npm run open:ios` → Run in simulator
   - Android: `npm run open:android` → Run in emulator

### Deploying to Devices

**iOS (TestFlight)**:
1. Open in Xcode: `npm run open:ios`
2. Select target device
3. Product → Archive
4. Upload to App Store Connect
5. Add to TestFlight

**Android (Google Play)**:
1. Open in Android Studio: `npm run open:android`
2. Build → Generate Signed Bundle/APK
3. Upload to Google Play Console
4. Internal/Beta testing track

## 📦 Build Process

The `build.sh` script:
1. Cleans `www/` directory
2. Copies mobile-specific files (index.html, mobile-app.js, mobile.css)
3. Copies shared dependencies (js/utils.js, css/shared.css)
4. Copies all calculator modules (calculators/*)

This ensures:
- Mobile and web stay independent
- Calculator logic stays DRY (Don't Repeat Yourself)
- Easy to maintain both versions

## 🎨 Customization

### App Icon & Splash Screen
1. Add assets to `ios/App/App/Assets.xcassets/`
2. Use [Capacitor Assets Generator](https://github.com/ionic-team/capacitor-assets)

### Native Plugins
Add Capacitor plugins as needed:
```bash
npm install @capacitor/haptics  # Vibration feedback
npm install @capacitor/share    # Native sharing
npm install @capacitor/status-bar  # Status bar styling
```

## 📝 Notes

- **Module Imports**: Paths adjusted for mobile structure (`../../calculators/`)
- **Server Not Required**: Once built, runs natively (no http.server needed)
- **Updates**: Run `npm run sync` after any code changes
- **Git**: `www/`, `ios/`, `android/` folders can be gitignored if desired
- **Separate Branches**: Can use different git branches for mobile features

## 🐛 Troubleshooting

**Build fails**: Make sure `build.sh` is executable (`chmod +x build.sh`)

**Module not found**: Check paths in `mobile-app.js` use `../../calculators/`

**iOS build fails**: Update Xcode to latest version

**Android build fails**: Update Android SDK in Android Studio

**White screen**: Check browser console, likely a path issue

## 📊 Differences from Web Version

| Feature | Web | Mobile |
|---------|-----|--------|
| Navigation | Horizontal tabs | Sliding menu |
| Calculator Access | Click tabs | Swipe/tap menu |
| Layout | Desktop-optimized | Touch-optimized |
| Entry Point | index-new.html | index.html |
| Port | 8000 | 8001 (dev only) |
| Deployment | GitHub Pages | App Stores |
