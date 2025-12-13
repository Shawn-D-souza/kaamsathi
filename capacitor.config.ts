import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kaamsaathi.app',
  appName: 'KaamSaathi',
  webDir: 'mobile-build',
  server: {
    url: 'https://kaamsaathi.netlify.app/',
    cleartext: true,
    androidScheme: 'https'
  }
};

export default config;