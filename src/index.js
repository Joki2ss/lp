import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { AppStoreProvider } from './store/AppStoreProvider';
import { AppNavigator } from './navigation/AppNavigator';
import './i18n';

/**
 * App entrypoint exported from /src.
 *
 * Your root App.js (outside /src) can do:
 *   import App from './src';
 *   export default App;
 */
export default function App() {
  return (
    <AppStoreProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AppStoreProvider>
  );
}
