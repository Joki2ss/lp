import React, { useCallback, useEffect, useMemo, useReducer } from 'react';

import { AppStoreContext } from './useAppStore';
import { appReducer } from './appReducer';
import { initialState } from './initialState';
import { ACTIONS } from './actions';
import { getItem, setItem } from '../services/storage';
import { applyLanguage } from '../i18n/rtl';

const PERSIST_KEY = 'app_state';

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const persisted = await getItem(PERSIST_KEY);
      if (cancelled) return;
      if (persisted && typeof persisted === 'object') {
        dispatch({ type: ACTIONS.HYDRATE, payload: persisted });
      } else {
        dispatch({ type: ACTIONS.HYDRATE, payload: {} });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    setItem(PERSIST_KEY, {
      session: state.session,
    }).catch(() => {});
  }, [state.hydrated, state.session]);

  useEffect(() => {
    if (!state.hydrated) return;
    applyLanguage(state.session.language).catch(() => {});
  }, [state.hydrated, state.session.language]);

  const setRole = useCallback((role) => {
    const userId = role === 'admin' ? 'admin' : role === 'staff' ? 'staff' : 'customer';
    dispatch({ type: ACTIONS.SET_ROLE, payload: { role, userId } });
  }, []);

  const setPro = useCallback((isPro) => {
    dispatch({ type: ACTIONS.SET_PRO, payload: { isPro } });
  }, []);

  const setEmail = useCallback((email) => {
    dispatch({ type: ACTIONS.SET_EMAIL, payload: { email } });
  }, []);

  const setProfile = useCallback(({ displayName, email, mobile }) => {
    dispatch({ type: ACTIONS.SET_PROFILE, payload: { displayName, email, mobile } });
  }, []);

  const setLanguage = useCallback((language) => {
    dispatch({ type: ACTIONS.SET_LANGUAGE, payload: { language } });
  }, []);

  const toast = useCallback((message) => {
    dispatch({ type: ACTIONS.TOAST, payload: { message, at: Date.now() } });
  }, []);

  const api = useMemo(
    () => ({ state, dispatch, setRole, setPro, setProfile, setEmail, setLanguage, toast }),
    [state, setRole, setPro, setProfile, setEmail, setLanguage, toast]
  );

  return <AppStoreContext.Provider value={api}>{children}</AppStoreContext.Provider>;
}
