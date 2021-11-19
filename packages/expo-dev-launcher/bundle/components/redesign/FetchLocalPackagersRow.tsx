import { RefreshIcon } from '@expo/styleguide-native';
import * as React from 'react';

import { useExpoTheme } from '../../hooks/useExpoTheme';
import { Button } from './Button';
import { PulseIndicator } from './PulseIndicator';
import { Text } from './Text';
import { Spacer } from './View';

type FetchLocalPackagersRowProps = {
  isFetching: boolean;
  onRefetchPress: () => void;
};

export function FetchLocalPackagersRow({
  isFetching,
  onRefetchPress,
}: FetchLocalPackagersRowProps) {
  const theme = useExpoTheme();
  const backgroundColor = isFetching ? theme.status.info : theme.status.default;

  return (
    <Button padding="medium" align="row" onPress={onRefetchPress} disabled={isFetching}>
      <PulseIndicator isActive={isFetching} color={backgroundColor} />
      <Spacer.Horizontal size="small" />
      <Text size="large">
        {isFetching ? 'Searching for local servers...' : 'Refetch local servers'}
      </Text>
      <Spacer.Vertical size="flex" />
      {!isFetching && <RefreshIcon size={16} />}
    </Button>
  );
}
