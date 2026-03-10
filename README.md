# Cipher Strike — Digital Warfare Mobile Game

Cipher Strike is a digital warfare mobile game built with React and Capacitor. Experience high-stakes simulated hacking missions in a neon-lit cyber-espionage world.

## Features
- **Hacking Simulation Interfaces:** Engage with terminal-style missions using simulated real-world cyber tools (e.g., nmap, wireshark, aircrack-ng).
- **Cross-Platform Support:** Ready for iOS and Android deployment via Ionic Capacitor.
- **Immersive Cyberpunk Aesthetics:** Neon glowing UI, terminal interfaces, and a futuristic sci-fi atmosphere.

## Tech Stack
- **Frontend:** React 18
- **Mobile Framework:** Capacitor 6 (iOS & Android)

## Getting Started

### Prerequisites
- Node.js
- npm (or yarn)
- Android Studio / Xcode (for mobile builds)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/arzdevapp/cipherstrike-mobile.git
   cd cipherstrike-mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To run the app in the browser for development:
```bash
npm start
```

### Mobile Deployment
To deploy to a standard mobile simulator or device, first sync web assets, then open the respective native IDE.

**Sync web assets:**
```bash
npm run cap:sync
```

**Android:**
```bash
npm run cap:open:android
```

**iOS:**
```bash
npm run cap:open:ios
```

## License
Private
