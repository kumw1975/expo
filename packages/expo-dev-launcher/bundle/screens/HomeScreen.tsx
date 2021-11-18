import { ChevronDownIcon, RefreshIcon } from '@expo/styleguide-native';
import * as React from 'react';
import { TextInput as NativeTextInput, Animated, ScrollView } from 'react-native';

import { Button } from '../components/redesign/Button';
import { TerminalIcon } from '../components/redesign/TerminalIcon';
import { Heading, Text, TextInput } from '../components/redesign/Text';
import { Divider, Row, Spacer, View } from '../components/redesign/View';
import { useExpoTheme } from '../hooks/useExpoTheme';
import { Packager, useLocalPackagers } from '../hooks/useLocalPackagers';

type HomeScreenProps = {
  isSimulator: boolean;
};

export function HomeScreen(props: HomeScreenProps) {
  const { isSimulator = true } = props;

  const { data, status, refetch } = useLocalPackagers(isSimulator);

  const onPackagerPress = (packager: Packager) => {
    console.log({ packager });
  };

  const onUrlSubmit = (url: string) => {
    console.log({ url });
  };

  return (
    <ScrollView>
      <View py="large">
        <Row px="medium" align="center">
          <View px="small">
            <TerminalIcon />
          </View>
          <Heading size="small" color="secondary">
            Development servers
          </Heading>
        </Row>

        <Spacer.Vertical size="small" />

        <View px="medium">
          <View bg="default" rounded="large">
            {data?.length > 0 ? (
              <LocalPackagersList packagers={data} onPackagerPress={onPackagerPress} />
            ) : (
              <>
                <View padding="medium">
                  <Text size="medium">Start a local development server with:</Text>
                  <Spacer.Vertical size="small" />

                  <View bg="secondary" border="default" rounded="medium" padding="medium">
                    <Text type="mono">expo start</Text>
                  </View>

                  <Spacer.Vertical size="small" />
                  <Text size="medium">Then, select the local server when it appears here.</Text>
                </View>
                <Divider />

                <Button padding="medium" align="row" onPress={() => refetch()}>
                  <PulseIndicator
                    isSearching={status === 'loading'}
                    isSuccessful={data?.length > 0}
                  />
                  <Spacer.Horizontal size="small" />
                  <LocalServerSearchText
                    isSearching={status === 'loading'}
                    isSuccessful={data?.length > 0}
                  />
                  <Spacer.Vertical size="flex" />
                  {data?.length === 0 && <RefreshIcon size={16} />}
                </Button>

                <Divider />
              </>
            )}

            <UrlDropdown onSubmit={onUrlSubmit} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

type LocalPackagersListProps = {
  packagers?: Packager[];
  onPackagerPress: (packager: Packager) => void;
};

function LocalPackagersList({ packagers = [], onPackagerPress }: LocalPackagersListProps) {
  if (packagers.length === 0) {
    return null;
  }

  return (
    <View>
      {packagers.map((packager) => {
        return (
          <View key={packager.description}>
            <Button align="row" padding="medium" onPress={() => onPackagerPress(packager)}>
              <View width="micro" height="micro" bg="success" rounded="full" />
              <Spacer.Horizontal size="small" />
              <Text>{packager.description}</Text>
              <Spacer.Horizontal size="flex" />
              <ChevronDownIcon style={{ transform: [{ rotate: '-90deg' }] }} />
            </Button>
            <Divider />
          </View>
        );
      })}
    </View>
  );
}

type UrlDropdownProps = {
  onSubmit: (url: string) => void;
};

function UrlDropdown({ onSubmit }: UrlDropdownProps) {
  const theme = useExpoTheme();
  const ref = React.useRef<NativeTextInput>();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const rotate = open ? '0deg' : '-90deg';
  // slight visual adjustment for centering icon
  const translateX = -3;
  const arrowStyle = { transform: [{ translateX }, { rotate }] };

  function onConnectPress() {
    onSubmit(inputValue);
    ref.current.blur();
  }

  return (
    <View padding="medium">
      <Button onPress={() => setOpen(!open)}>
        <Row align="center">
          <ChevronDownIcon style={arrowStyle} color={theme.icon.default} />
          <Spacer.Horizontal size="tiny" />
          <Text size="large">Enter URL manually</Text>
        </Row>
      </Button>

      {open && (
        <View py="medium">
          <View border="default" rounded="medium" padding="medium" shadow="micro">
            <TextInput
              autoFocus
              placeholder="exp://192..."
              placeholderTextColor={theme.text.default}
              ref={ref}
              value={inputValue}
              onChangeText={setInputValue}
            />
          </View>

          <Spacer.Vertical size="medium" />

          <Button
            bg="tertiary"
            shadow="button"
            rounded="medium"
            py="small"
            onPress={onConnectPress}>
            <Text align="center" weight="semibold" button="tertiary">
              Connect
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
}

type PulseIndicatorProps = {
  isSearching: boolean;
  isSuccessful: boolean;
};

function PulseIndicator({ isSearching, isSuccessful }: PulseIndicatorProps) {
  const animatedValue = React.useRef(new Animated.Value(0));
  const theme = useExpoTheme();

  const pulseScale = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 2],
  });

  const pulseOpacity = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animatedValue.current, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );

    loop.start();

    return () => loop.stop();
  }, []);

  const backgroundColor = React.useMemo(() => {
    return isSearching
      ? theme.status.info
      : isSuccessful
      ? theme.status.success
      : theme.status.default;
  }, [isSearching]);

  return (
    <View
      width="micro"
      height="micro"
      rounded="full"
      style={{ transform: [{ scale: 0.9 }], backgroundColor }}>
      <Animated.View
        style={{
          flex: 1,
          borderRadius: 100,
          transform: [{ scale: pulseScale }],
          opacity: pulseOpacity,
          backgroundColor,
        }}
      />
    </View>
  );
}

function LocalServerSearchText({ isSearching, isSuccessful }) {
  if (isSearching) {
    return <Text size="large">Searching for local servers...</Text>;
  }

  if (!isSuccessful) {
    return (
      <Text size="large" numberOfLines={2}>
        Unable to find local servers
      </Text>
    );
  }

  return null;
}
