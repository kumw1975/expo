// copy / paste of react-native-primitives (for the time being)

import * as React from 'react';
import {
  Appearance,
  AccessibilityInfo,
  AccessibilityChangeEventName,
  StyleProp,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  Dimensions,
  PressableProps,
} from 'react-native';

// this was the best way I could think of to get the right style props
// ordering is important - view style overrides the others when placed first
type StyleFor<T> = T extends { style?: StyleProp<ImageStyle> }
  ? StyleProp<ImageStyle>
  : T extends { style?: StyleProp<TextStyle> }
  ? StyleProp<TextStyle>
  : T extends { style?: PressableProps['style'] }
  ? PressableProps['style']
  : T extends { style?: StyleProp<ViewStyle> }
  ? StyleProp<ViewStyle>
  : never;

type Options<T> = {
  base?: StyleFor<T>;
  variants?: VariantMap<StyleFor<T>>;
};

type VariantMap<T> = { [key: string]: { [key2: string]: T } };

type Nested<Type> = {
  [Property in keyof Type]?: keyof Type[Property];
};

type SelectorMap<VariantMap, Style> = Partial<{
  [K in keyof VariantMap]?: {
    [T in keyof VariantMap[K]]?: StyleFor<Style>;
  };
}>;

type DynamicMap<V, S> = SelectorMap<V, S>;

type Selectors<VariantMap, Style> = {
  light?: SelectorMap<VariantMap, Style>;
  dark?: SelectorMap<VariantMap, Style>;
  boldText?: SelectorMap<VariantMap, Style>;
  grayScale?: SelectorMap<VariantMap, Style>;
  invertColors?: SelectorMap<VariantMap, Style>;
  reduceTransparency?: SelectorMap<VariantMap, Style>;
  screenReader?: SelectorMap<VariantMap, Style>;
  width?: { [key: string]: DynamicMap<VariantMap, Style> };
  height?: { [key: string]: SelectorMap<VariantMap, Style> };
};

const selectorStore = createSelectorStore();

export function createComponent<T, O extends Options<T>>(
  component: React.ComponentType<T>,
  config: O & { selectors?: Selectors<O['variants'], T>; props?: T }
) {
  const styleFn = getStylesFn<T>(config);
  config.selectors = config.selectors || {};

  const Component = React.forwardRef(
    (
      props: React.PropsWithChildren<T & Nested<typeof config['variants']> & { as?: any }>,
      ref: any
    ) => {
      const style = styleFn(props);
      const selectorStyle = useSelectors(config.selectors, props);
      const Element = props.as || component;

      return (
        <Element
          {...props}
          {...config.props}
          style={StyleSheet.flatten([style, props.style, selectorStyle])}
          ref={ref}
        />
      );
    }
  );

  return Component;
}

export function getStylesFn<T>(options: Options<T>) {
  let styles: any = options.base || {};

  function handleVariantProps(props: any) {
    options.variants = options.variants || {};
    styles = options.base;

    for (const key in props) {
      if (options.variants[key]) {
        const value = props[key];

        if (props[key] && options[key] === 'true') {
          styles = StyleSheet.flatten(StyleSheet.compose(styles, options[key]['true']));
        } else {
          const styleValue = options.variants[key][value];
          if (styleValue) {
            styles = StyleSheet.flatten(StyleSheet.compose(styles, styleValue));
          }
        }
      }
    }

    return styles;
  }

  return handleVariantProps;
}

type SelectorStoreListener = (updatedKeys: string[], state: any) => void;

function createSelectorStore() {
  const activeSelectorMap: Record<string, boolean> = {};
  const dimensionMap: Record<string, number> = {};

  let listeners: SelectorStoreListener[] = [];

  const currentColorScheme = Appearance.getColorScheme();
  if (currentColorScheme != null) {
    if (currentColorScheme === 'light') {
      activeSelectorMap['light'] = true;
      activeSelectorMap['dark'] = false;
    } else if (currentColorScheme === 'dark') {
      activeSelectorMap['light'] = false;
      activeSelectorMap['dark'] = true;
    }

    notify(['light', 'dark']);
  }

  Appearance.addChangeListener(({ colorScheme }) => {
    if (colorScheme === 'light') {
      activeSelectorMap['light'] = true;
      activeSelectorMap['dark'] = false;
    } else if (colorScheme === 'dark') {
      activeSelectorMap['light'] = false;
      activeSelectorMap['dark'] = true;
    } else {
      delete activeSelectorMap['light'];
      delete activeSelectorMap['dark'];
    }

    notify(['light', 'dark']);
  });

  const a11yTraits: AccessibilityChangeEventName[] = [
    'boldTextChanged',
    'grayscaleChanged',
    'invertColorsChanged',
    'reduceMotionChanged',
    'reduceTransparencyChanged',
    'screenReaderChanged',
  ];

  a11yTraits.forEach((trait) => {
    AccessibilityInfo.addEventListener(trait, (isActive) => {
      activeSelectorMap[trait] = isActive;
      notify([trait]);
    });
  });

  async function getInitialValues() {
    const [
      isBoldTextEnabled,
      isGrayscaleEnabled,
      isInvertColorsEnabled,
      isReduceMotionEnabled,
      isReduceTransparencyEnabled,
      isScreenReaderEnabled,
    ] = await Promise.all([
      AccessibilityInfo.isBoldTextEnabled(),
      AccessibilityInfo.isGrayscaleEnabled(),
      AccessibilityInfo.isInvertColorsEnabled(),
      AccessibilityInfo.isReduceMotionEnabled(),
      AccessibilityInfo.isReduceTransparencyEnabled(),
      AccessibilityInfo.isScreenReaderEnabled(),
    ]);

    activeSelectorMap['boldText'] = isBoldTextEnabled;
    activeSelectorMap['grayScale'] = isGrayscaleEnabled;
    activeSelectorMap['invertColors'] = isInvertColorsEnabled;
    activeSelectorMap['reduceMotion'] = isReduceMotionEnabled;
    activeSelectorMap['reduceTransparency'] = isReduceTransparencyEnabled;
    activeSelectorMap['screenReader'] = isScreenReaderEnabled;

    notify(a11yTraits);
  }

  getInitialValues();

  const { width: initialWidth, height: initialHeight } = Dimensions.get('screen');

  dimensionMap['width'] = initialWidth;
  dimensionMap['height'] = initialHeight;

  Dimensions.addEventListener('change', ({ screen }) => {
    dimensionMap['width'] = screen.width;
    dimensionMap['height'] = screen.height;

    notify(['width', 'height']);
  });

  function subscribe(fn: SelectorStoreListener) {
    listeners.push(fn);

    notify([]);

    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }

  function getState() {
    return {
      ...activeSelectorMap,
      ...dimensionMap,
    };
  }

  function notify(keys: string[]) {
    const state = getState();
    listeners.forEach((listener) => listener(keys, state));
  }

  return {
    subscribe,
  };
}

function useSelectors(selectors: any, props: any) {
  const [activeVariants, setActiveVariants] = React.useState({});

  React.useEffect(() => {
    const unsubscribe = selectorStore.subscribe((keys, state) => {
      const variants: any = {};

      Object.entries(state).forEach(([selectorKey, selectorValue]: any) => {
        if (selectorValue !== false) {
          if (selectorKey === 'width' || selectorKey === 'height') {
            const queries = selectors[selectorKey];
            for (let mediaQuery in queries) {
              const expression = `${selectorValue} ${mediaQuery}`;
              try {
                if (eval(expression)) {
                  mergeDeep(variants, queries[mediaQuery]);
                }
              } catch (error) {
                console.warn(
                  `Did not pass in a valid query selector '${expression}' -> try a key with a valid expression like '> {number}'`
                );
              }
            }
          } else {
            mergeDeep(variants, selectors[selectorKey]);
          }
        }
      });

      setActiveVariants(variants);
    });

    return () => unsubscribe();
  }, [selectors]);

  const activeStyles = {};

  if (activeVariants['base']) {
    mergeDeep(activeStyles, activeVariants['base']);
  }

  Object.entries(props).forEach(([variantKey, variantValue]: any) => {
    if (activeVariants[variantKey] && activeVariants[variantKey][variantValue]) {
      mergeDeep(activeStyles, activeVariants[variantKey][variantValue]);
    }
  });

  return activeStyles;
}

function mergeDeep(target: any, source: any) {
  const isObject = (obj: any) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
}
