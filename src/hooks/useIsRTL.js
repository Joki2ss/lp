import { useMemo } from 'react';
import { isLanguageRTL } from '../i18n/rtl';
import { useAppStore } from '../store/useAppStore';

export function useIsRTL() {
  const { state } = useAppStore();
  return useMemo(() => isLanguageRTL(state.session.language), [state.session.language]);
}
