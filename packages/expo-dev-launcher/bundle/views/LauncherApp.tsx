import { HomeFilledIcon, SettingsFilledIcon } from '@expo/styleguide-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import { QueryClientProvider, QueryClient } from 'react-query';

import { darkNavigationTheme, lightNavigationTheme } from '../components/redesign/theme';
import { useTheme } from '../hooks/useThemeName';
import { UserContextProvider } from '../hooks/useUserContext';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';


const Tab = createBottomTabNavigator();

type LauncherAppProps = {
  isSimulator?: boolean;
};

const queryClient = new QueryClient();

function LauncherApp(props: LauncherAppProps) {
  const [, isDark] = useTheme();

  const statusBarContent = isDark ? 'light-content' : 'dark-content';

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <StatusBar barStyle={statusBarContent} />

        <NavigationContainer theme={isDark ? darkNavigationTheme : lightNavigationTheme}>
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
        </NavigationContainer>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default class LauncherRootApp extends React.PureComponent<LauncherAppProps> {
  render() {
    return <LauncherApp {...this.props} />;
  }
}
