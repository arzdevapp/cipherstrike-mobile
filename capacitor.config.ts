import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cipherstrike.game',
  appName: 'Cipher Strike',
  webDir: 'build',
  bundledWebRuntime: false,

  // Server config — remove this block for production builds
  // Uncomment ONLY for live reload during development:
  // server: {
  //   url: 'http://YOUR_LOCAL_IP:3000',
  //   cleartext: true
  // },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#020a0f',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#020a0f'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  },

  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#020a0f'
  },

  ios: {
    contentInset: 'automatic',
    backgroundColor: '#020a0f',
    scrollEnabled: false,
    limitsNavigationsToAppBoundDomains: true
  }
};

export default config;
