import { darkTheme, lightTheme } from '@expo/styleguide-native';
import { Text as RNText, TextInput as RNTextInput } from 'react-native';

import { createComponent } from './createComponent';

export const Heading = createComponent(RNText, {
  base: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    color: lightTheme.text.default,
  },

  props: {
    accessibilityRole: 'header',
  },

  variants: {
    size: {
      small: {
        fontSize: 18,
        lineHeight: 24,
      },
      medium: {
        fontSize: 22,
        lineHeight: 28,
      },
      large: {
        fontSize: 28,
        lineHeight: 32,
      },
    },

    weight: {
      thin: { fontWeight: '100' },
      extralight: { fontWeight: '200' },
      light: { fontWeight: '300' },
      normal: { fontWeight: '400' },
      medium: { fontWeight: '500' },
      semibold: { fontWeight: '600' },
      bold: { fontWeight: '700' },
      extrabold: { fontWeight: '800' },
      black: { fontWeight: '900' },
    },

    color: {
      error: { color: lightTheme.text.error },
      warning: { color: lightTheme.text.warning },
      success: { color: lightTheme.text.success },
      secondary: { color: lightTheme.text.secondary },
    },
  },

  selectors: {
    dark: {
      base: {
        color: darkTheme.text.default,
      },

      color: {
        error: { color: darkTheme.text.error },
        warning: { color: darkTheme.text.warning },
        success: { color: darkTheme.text.success },
        secondary: { color: darkTheme.text.secondary },
      },
    },
  },
});

export const Text = createComponent(RNText, {
  base: {
    fontWeight: 'normal',
    color: lightTheme.text.default,
    fontSize: 16,
  },

  props: {
    accessibilityRole: 'text',
  },

  variants: {
    align: {
      center: { textAlign: 'center' },
    },

    size: {
      small: {
        fontSize: 12,
        lineHeight: 14,
      },
      medium: {
        fontSize: 16,
        lineHeight: 18,
      },
      large: {
        fontSize: 18,
        lineHeight: 22,
      },
    },

    type: {
      mono: {
        fontFamily: 'Menlo',
      },
    },

    weight: {
      thin: { fontWeight: '100' },
      extralight: { fontWeight: '200' },
      light: { fontWeight: '300' },
      normal: { fontWeight: '400' },
      medium: { fontWeight: '500' },
      semibold: { fontWeight: '600' },
      bold: { fontWeight: '700' },
      extrabold: { fontWeight: '800' },
      black: { fontWeight: '900' },
    },

    color: {
      secondary: { color: lightTheme.text.secondary },
    },

    button: {
      primary: { color: lightTheme.button.primary.foreground },
      secondary: { color: lightTheme.button.secondary.foreground },
      tertiary: { color: lightTheme.button.tertiary.foreground },
      ghost: { color: lightTheme.button.ghost.foreground },
      transparent: { color: lightTheme.button.transparent.foreground },
    },
  },

  selectors: {
    dark: {
      base: {
        color: darkTheme.text.default,
      },

      color: {
        error: { color: darkTheme.text.error },
        warning: { color: darkTheme.text.warning },
        success: { color: darkTheme.text.success },
        secondary: { color: darkTheme.text.secondary },
      },

      button: {
        primary: { color: darkTheme.button.primary.foreground },
        secondary: { color: darkTheme.button.secondary.foreground },
        tertiary: { color: darkTheme.button.tertiary.foreground },
        ghost: { color: darkTheme.button.ghost.foreground },
        transparent: { color: darkTheme.button.transparent.foreground },
      },
    },
  },
});

export const TextInput = createComponent(RNTextInput, {
  base: {
    fontWeight: 'normal',
    color: lightTheme.text.default,
    fontSize: 16,
    lineHeight: 18,
  },

  variants: {
    size: {
      small: {
        fontSize: 12,
        lineHeight: 14,
      },
      medium: {
        fontSize: 16,
        lineHeight: 18,
      },
      large: {
        fontSize: 18,
        lineHeight: 22,
      },
    },

    type: {
      mono: {
        fontFamily: 'Menlo',
      },
    },

    weight: {
      thin: { fontWeight: '100' },
      extralight: { fontWeight: '200' },
      light: { fontWeight: '300' },
      normal: { fontWeight: '400' },
      medium: { fontWeight: '500' },
      semibold: { fontWeight: '600' },
      bold: { fontWeight: '700' },
      extrabold: { fontWeight: '800' },
      black: { fontWeight: '900' },
    },

    color: {
      error: { color: lightTheme.text.error },
      warning: { color: lightTheme.text.warning },
      success: { color: lightTheme.text.success },
      secondary: { color: lightTheme.text.secondary },
    },
  },

  selectors: {
    dark: {
      base: {
        color: darkTheme.text.default,
      },

      color: {
        error: { color: darkTheme.text.error },
        warning: { color: darkTheme.text.warning },
        success: { color: darkTheme.text.success },
        secondary: { color: darkTheme.text.secondary },
      },
    },
  },
});
