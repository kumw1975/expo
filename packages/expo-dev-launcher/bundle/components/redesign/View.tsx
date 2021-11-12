import { lightTheme, darkTheme, shadows, borderRadius, iconSize } from '@expo/styleguide-native';
import { View as RNView } from 'react-native';

import { createComponent } from './createComponent';
import { scale } from './theme';

export const View = createComponent(RNView, {
  variants: {
    flex: {
      '1': { flex: 1 },
      '0': { flex: 0 },
    },

    bg: {
      default: { backgroundColor: lightTheme.background.default },
      secondary: { backgroundColor: lightTheme.background.secondary },
      info: { backgroundColor: lightTheme.status.info },
      success: { backgroundColor: lightTheme.status.success },
    },

    border: {
      default: { borderColor: lightTheme.border.default, borderWidth: 1 },
    },

    rounded: {
      small: { borderRadius: borderRadius.small },
      medium: { borderRadius: borderRadius.medium },
      large: { borderRadius: borderRadius.large },
      full: { borderRadius: 99999 },
    },

    shadow: {
      micro: shadows.micro,
      tiny: shadows.tiny,
      small: shadows.small,
      medium: shadows.medium,
      button: shadows.button,
    },

    width: {
      micro: {
        width: iconSize.micro,
      },
      tiny: {
        width: iconSize.tiny,
      },
      small: {
        width: iconSize.small,
      },
    },

    height: {
      micro: { height: iconSize.micro },
      tiny: { height: iconSize.tiny },
      small: { height: iconSize.small },
    },

    padding: {
      tiny: { padding: scale.tiny },
      small: { padding: scale.small },
      medium: { padding: scale.medium },
      large: { padding: scale.large },
    },

    px: {
      tiny: { paddingHorizontal: scale.tiny },
      small: { paddingHorizontal: scale.small },
      medium: { paddingHorizontal: scale.medium },
      large: { paddingHorizontal: scale.large },
    },

    py: {
      tiny: { paddingVertical: scale.tiny },
      small: { paddingVertical: scale.small },
      medium: { paddingVertical: scale.medium },
      large: { paddingVertical: scale.large },
    },
  },

  selectors: {
    dark: {
      bg: {
        default: { backgroundColor: darkTheme.background.default },
        secondary: { backgroundColor: darkTheme.background.secondary },
        info: { backgroundColor: darkTheme.status.info },
      },

      border: {
        default: { borderColor: darkTheme.border.default, borderWidth: 1 },
      },
    },
  },
});

export const Row = createComponent(RNView, {
  base: {
    flexDirection: 'row',
  },

  variants: {
    align: {
      center: { alignItems: 'center' },
      start: { alignItems: 'flex-start' },
      end: { alignItems: 'flex-end' },
    },

    padding: {
      tiny: { padding: scale.tiny },
      small: { padding: scale.small },
      medium: { padding: scale.medium },
      large: { padding: scale.large },
    },

    px: {
      tiny: { paddingHorizontal: scale.tiny },
      small: { paddingHorizontal: scale.small },
      medium: { paddingHorizontal: scale.medium },
      large: { paddingHorizontal: scale.large },
    },

    py: {
      tiny: { paddingVertical: scale.tiny },
      small: { paddingVertical: scale.small },
      medium: { paddingVertical: scale.medium },
      large: { paddingVertical: scale.large },
    },
  },
});

const Horizontal = createComponent(RNView, {
  variants: {
    size: {
      flex: { flex: 1 },
      tiny: { width: scale.tiny },
      small: { width: scale.small },
      medium: { width: scale.medium },
      large: { width: scale.large },
    },
  },
});

const Vertical = createComponent(RNView, {
  variants: {
    size: {
      flex: { flex: 1 },
      tiny: { height: scale.tiny },
      small: { height: scale.small },
      medium: { height: scale.medium },
      large: { height: scale.large },
    },
  },
});

export const Spacer = {
  Vertical,
  Horizontal,
};

export const Divider = createComponent(RNView, {
  base: {
    borderWidth: 0.5,
    borderColor: lightTheme.border.default,
  },

  variants: {
    weight: {
      thin: { borderWidth: 0.5 },
      normal: { borderWidth: 1 },
      heavy: { borderWidth: 2 },
    },

    margin: {
      tiny: { margin: scale.tiny },
      small: { margin: scale.small },
      medium: { margin: scale.medium },
      large: { margin: scale.large },
    },

    mx: {
      tiny: { marginHorizontal: scale.tiny },
      small: { marginHorizontal: scale.small },
      medium: { marginHorizontal: scale.medium },
      large: { marginHorizontal: scale.large },
    },

    my: {
      tiny: { marginVertical: scale.tiny },
      small: { marginVertical: scale.small },
      medium: { marginVertical: scale.medium },
      large: { marginVertical: scale.large },
    },
  },

  selectors: {
    dark: {
      borderColor: darkTheme.border.default,
    },
  },
});
