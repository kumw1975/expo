import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { QueryClientProvider, QueryClient } from 'react-query';

import { useTheme } from '../hooks/useThemeName';
import { UserContextProvider } from '../hooks/useUserContext';
import { darkNavigationTheme, lightNavigationTheme } from './redesign/theme';

const client = new QueryClient();

export function AppProviders({
  children,
  queryClient = client,
}: {
  children?: React.ReactNode;
  queryClient?: QueryClient;
}) {
  const [, isDark] = useTheme();
  const statusBarContent = isDark ? 'light-content' : 'dark-content';

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <StatusBar barStyle={statusBarContent} />

        <NavigationContainer theme={isDark ? darkNavigationTheme : lightNavigationTheme}>
          {children}
        </NavigationContainer>
      </UserContextProvider>
    </QueryClientProvider>
  );
}
