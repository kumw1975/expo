import { HomeFilledIcon, SettingsFilledIcon } from '@expo/styleguide-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { AppProviders } from '../components/AppProviders';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

type LauncherAppProps = {
  isSimulator?: boolean;
};

function LauncherApp(props: LauncherAppProps) {
  return (
    <AppProviders>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: HomeFilledIcon,
            tabBarIconStyle: { transform: [{ scale: 0.85 }] },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: SettingsFilledIcon,
            tabBarIconStyle: { transform: [{ scale: 0.85 }] },
          }}
        />
      </Tab.Navigator>
    </AppProviders>
  );
}

export default class LauncherRootApp extends React.PureComponent<LauncherAppProps> {
  render() {
    return <LauncherApp {...this.props} />;
  }
}
