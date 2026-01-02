import { ACTIONS } from './actions';

export function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.HYDRATE: {
      return { ...state, ...action.payload, hydrated: true };
    }
    case ACTIONS.SET_ROLE: {
      return {
        ...state,
        session: { ...state.session, role: action.payload.role, userId: action.payload.userId },
      };
    }
    case ACTIONS.SET_PRO: {
      return { ...state, session: { ...state.session, isPro: action.payload.isPro } };
    }
    case ACTIONS.SET_EMAIL: {
      return { ...state, session: { ...state.session, email: action.payload.email } };
    }
    case ACTIONS.SET_LANGUAGE: {
      return { ...state, session: { ...state.session, language: action.payload.language } };
    }
    case ACTIONS.TOAST: {
      return { ...state, ui: { ...state.ui, lastToast: action.payload } };
    }
    default:
      return state;
  }
}
