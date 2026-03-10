# Cipher Strike — Mobile Build Guide
## React + Capacitor → Android & iOS

---

## WHAT YOU NEED (Install First)

| Tool | Download |
|------|----------|
| Node.js 18+ | https://nodejs.org |
| Android Studio | https://developer.android.com/studio |
| Xcode 15+ (Mac only, for iOS) | Mac App Store |
| JDK 17 | https://adoptium.net |

---

## STEP 1 — SET UP THE PROJECT

Open a terminal and run:

```bash
# 1. Create the project folder and enter it
mkdir cipher-strike && cd cipher-strike

# 2. Create a new React app
npx create-react-app . --template minimal

# 3. Install Capacitor and plugins
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard @capacitor/haptics @capacitor/app
```

---

## STEP 2 — ADD YOUR GAME FILES

Replace the contents of your project with the provided files:

```
cipher-strike/
├── public/
│   └── index.html          ← replace with provided index.html
├── src/
│   ├── index.js            ← replace with provided index.js
│   └── CipherStrike.jsx    ← your game file (copy here)
├── capacitor.config.ts     ← copy provided file here
└── package.json            ← replace with provided package.json
```

Then run:

```bash
npm install
```

---

## STEP 3 — BUILD THE WEB APP

```bash
npm run build
```

This creates a `/build` folder — the compiled web app that Capacitor will wrap.

---

## STEP 4 — INITIALIZE CAPACITOR

```bash
npx cap init "Cipher Strike" "com.cipherstrike.game" --web-dir build
```

---

## STEP 5A — ANDROID BUILD

```bash
# Add Android platform
npx cap add android

# Copy web build into Android project
npx cap sync android

# Open in Android Studio
npx cap open android
```

**In Android Studio:**
1. Wait for Gradle sync to finish
2. Click **Run ▶** to test on emulator or plug in your phone
3. For release APK: `Build → Generate Signed Bundle/APK`

**To enable USB debugging on your Android phone:**
- Settings → About Phone → tap "Build Number" 7 times
- Settings → Developer Options → Enable USB Debugging
- Plug in phone, trust the computer prompt

---

## STEP 5B — iOS BUILD (Mac only)

```bash
# Add iOS platform
npx cap add ios

# Copy web build into iOS project  
npx cap sync ios

# Open in Xcode
npx cap open ios
```

**In Xcode:**
1. Select your project in the left panel
2. Under "Signing & Capabilities" — add your Apple Developer account
3. Select your iPhone as target device
4. Click **Run ▶**

> You need a free or paid Apple Developer account at https://developer.apple.com

---

## STEP 6 — AFTER EVERY CODE CHANGE

When you update `CipherStrike.jsx`, run this to push changes to mobile:

```bash
npm run build && npx cap sync
```

Then rebuild in Android Studio or Xcode.

---

## QUICK COMMANDS CHEAT SHEET

```bash
# Full Android deploy (build + sync + open)
npm run deploy:android

# Full iOS deploy (build + sync + open)
npm run deploy:ios

# Just sync after code changes
npx cap sync

# Live reload during development (Android)
# 1. Find your IP: ipconfig (Windows) or ifconfig (Mac)
# 2. In capacitor.config.ts, uncomment the server block and set your IP
# 3. Run: npm start
# 4. Then: npx cap run android
```

---

## ANDROID PERMISSIONS (already set by Capacitor)

In `android/app/src/main/AndroidManifest.xml`, Capacitor sets:
- `INTERNET` — for Google Fonts loading
- `ACCESS_NETWORK_STATE`

No extra permissions needed for this game.

---

## APP ICONS & SPLASH SCREEN

Place your icon files here after `npx cap add android`:

```
android/app/src/main/res/
├── mipmap-hdpi/ic_launcher.png        (72x72)
├── mipmap-mdpi/ic_launcher.png        (48x48)
├── mipmap-xhdpi/ic_launcher.png       (96x96)
├── mipmap-xxhdpi/ic_launcher.png      (144x144)
└── mipmap-xxxhdpi/ic_launcher.png     (192x192)

iOS (after npx cap add ios):
App/App/Assets.xcassets/AppIcon.appiconset/
```

**Recommended:** Use https://capacitorjs.com/docs/guides/splash-screens-and-icons
or the tool `@capacitor/assets` to auto-generate all sizes:

```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

---

## PUBLISHING TO STORES

### Google Play Store
1. Build a signed AAB: Android Studio → `Build → Generate Signed Bundle`
2. Go to https://play.google.com/console
3. Create app → upload AAB → fill store listing → publish

### Apple App Store
1. Archive in Xcode: `Product → Archive`
2. Upload via Xcode Organizer
3. Go to https://appstoreconnect.apple.com
4. Fill app info → submit for review

---

## TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| `npx cap sync` fails | Run `npm run build` first |
| Fonts not loading on device | Check internet connection; fonts load from Google |
| White screen on launch | Check browser console in Android Studio (chrome://inspect) |
| iOS build fails signing | Add Apple ID in Xcode → Preferences → Accounts |
| Keyboard pushes layout up | Already handled in capacitor.config.ts with `resize: body` |
| Safe area (notch) issues | Already handled in index.html with `env(safe-area-inset-*)` |

---

## OFFLINE FONT SUPPORT (Optional)

If you want fonts to work without internet, download them and add to `public/fonts/`:

```css
/* In CipherStrike.jsx, replace the @import with: */
@font-face {
  font-family: 'Share Tech Mono';
  src: url('/fonts/ShareTechMono-Regular.ttf');
}
@font-face {
  font-family: 'Orbitron';
  src: url('/fonts/Orbitron-Bold.ttf');
}
@font-face {
  font-family: 'Rajdhani';
  src: url('/fonts/Rajdhani-Regular.ttf');
}
```

Download fonts from https://fonts.google.com

---

*Cipher Strike — Built with React + Capacitor*
