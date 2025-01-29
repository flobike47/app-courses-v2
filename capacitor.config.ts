import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.fb.app',
    appName: 'app-courses-v2',
    webDir: 'dist',
    android: {allowMixedContent: true}
};

export default config;
