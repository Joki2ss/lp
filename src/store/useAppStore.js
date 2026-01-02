import React from 'react';

export const AppStoreContext = React.createContext(null);

export function useAppStore() {
  const ctx = React.useContext(AppStoreContext);
  if (!ctx) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }
  return ctx;
}
