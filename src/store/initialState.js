import { ROLES } from '../utils/constants';

export const initialState = {
  hydrated: false,
  session: {
    role: ROLES.ADMIN,
    isPro: false,
    userId: 'admin',
    email: 'admin@example.com',
    language: 'en',
  },
  ui: {
    lastToast: null,
  },
};
