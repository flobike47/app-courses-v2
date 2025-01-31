import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.fb.app',
    appName: 'Courses',
    webDir: 'dist',
    android: {allowMixedContent: true}
};

export default config;
