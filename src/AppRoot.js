import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { AppStoreProvider } from './store/AppStoreProvider';
import { AppNavigator } from './navigation/AppNavigator';
import './i18n';

/**
 * Root component for the app.
 *
 * IMPORTANT: You said you'll manage App.js manually.
 * Typical App.js usage:
 *   import AppRoot from './src/AppRoot';
 *   export default AppRoot;
 */
export default function AppRoot() {
  return (
    <AppStoreProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AppStoreProvider>
  );
}
