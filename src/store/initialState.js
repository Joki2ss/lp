import { ROLES } from '../utils/constants';

export const initialState = {
  hydrated: false,
  session: {
    role: ROLES.ADMIN,
    isPro: false,
    userId: 'admin',
    displayName: 'Admin',
    email: 'admin@example.com',
    mobile: '',
    language: 'en',
  },
  ui: {
    lastToast: null,
  },
};
