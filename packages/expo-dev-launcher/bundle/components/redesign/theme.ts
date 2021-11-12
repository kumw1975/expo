import { spacing, lightTheme, darkTheme } from '@expo/styleguide-native';
import { Theme as NavigationTheme } from '@react-navigation/native';

export const scale = {
  tiny: spacing[1],
  small: spacing[3],
  medium: spacing[4],
  large: spacing[8],
};

export const lightNavigationTheme: NavigationTheme = {
  dark: false,
  colors: {
    primary: lightTheme.button.primary.background,
    background: lightTheme.background.secondary,
    card: lightTheme.background.default,
    text: lightTheme.text.default,
    border: lightTheme.border.default,
    notification: lightTheme.highlight.accent,
  },
};

export const darkNavigationTheme: NavigationTheme = {
  dark: true,
  colors: {
    primary: darkTheme.button.primary.background,
    background: darkTheme.background.secondary,
    card: darkTheme.background.default,
    text: darkTheme.text.default,
    border: darkTheme.border.default,
    notification: darkTheme.highlight.accent,
  },
};
