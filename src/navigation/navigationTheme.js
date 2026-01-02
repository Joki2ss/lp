import { DefaultTheme } from '@react-navigation/native';

import { colors } from '../styles/colors';

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.brand,
    background: colors.bg,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    notification: colors.danger,
  },
};
