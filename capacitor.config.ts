import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hancockpaws.app',
  appName: 'paws',
  webDir: 'dist',
  plugins: {
    App: {
      urlScheme: 'paws'
    }
  }
};

export default config;
