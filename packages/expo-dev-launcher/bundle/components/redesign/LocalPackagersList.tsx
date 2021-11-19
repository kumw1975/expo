import { ChevronDownIcon } from '@expo/styleguide-native';
import * as React from 'react';

import { Packager } from '../../functions/getLocalPackagersAsync';
import { Button } from './Button';
import { Text } from './Text';
import { Divider, Spacer, StatusIndicator, View } from './View';

type LocalPackagersListProps = {
  packagers?: Packager[];
  onPackagerPress: (packager: Packager) => void;
};

export function LocalPackagersList({ packagers = [], onPackagerPress }: LocalPackagersListProps) {
  if (packagers.length === 0) {
    return null;
  }

  return (
    <View>
      {packagers.map((packager) => {
        return (
          <View key={packager.description}>
            <Button align="row" padding="medium" onPress={() => onPackagerPress(packager)}>
              <StatusIndicator size="small" status="success" />
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
