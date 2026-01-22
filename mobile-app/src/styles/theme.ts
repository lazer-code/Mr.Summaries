import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const createThemedStyles = (isDark: boolean) => {
  const theme = isDark ? colors.dark : colors.light;
  
  return {
    theme,
    commonStyles: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.background,
      },
      card: {
        backgroundColor: theme.card,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      input: {
        backgroundColor: theme.backgroundSecondary,
        borderWidth: 2,
        borderColor: theme.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: theme.text,
      },
      button: {
        backgroundColor: theme.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
      },
      text: {
        color: theme.text,
        fontSize: 16,
      },
      textSecondary: {
        color: theme.textSecondary,
        fontSize: 14,
      },
      textTertiary: {
        color: theme.textTertiary,
        fontSize: 12,
      },
      heading1: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.text,
      },
      heading2: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.text,
      },
      heading3: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.text,
      },
    }),
  };
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};
