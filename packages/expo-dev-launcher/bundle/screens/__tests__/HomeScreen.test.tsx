import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import { QueryClient } from 'react-query';

import * as DevLauncher from '../../DevLauncherInternal';
import { AppProviders } from '../../components/AppProviders';
import { Packager } from '../../functions/getLocalPackagersAsync';
import { HomeScreen, HomeScreenProps } from '../HomeScreen';

const api = require('../../functions/getLocalPackagersAsync');
jest.mock('../../functions/getLocalPackagersAsync');
jest.mock('../../DevLauncherInternal', () => {
  return {
    loadApp: jest.fn(),
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const packagerInstructionsRegex = /start a local development server with/i;
const fetchingPackagersRegex = /searching for local servers/i;
const refetchPackagersRegex = /refetch local servers/i;
const textInputToggleRegex = /enter url manually/i;

const wrapper = ({ children }) => <AppProviders queryClient={queryClient}>{children}</AppProviders>;

test('displays instructions on starting packager when none are found', async () => {
  api.getLocalPackagersAsync = jest.fn().mockResolvedValue([]);

  const { getByText } = await renderHomeScreen();

  await waitFor(() => getByText(packagerInstructionsRegex));
});

test('displays refetch button', async () => {
  api.getLocalPackagersAsync = jest.fn().mockResolvedValue([]);

  const { getByText } = await renderHomeScreen();

  await waitFor(() => getByText(refetchPackagersRegex));
});

test('fetching local packagers on mount', async () => {
  const fakeLocalPackager: Packager = {
    url: 'hello',
    description: 'fakePackagerDescription',
    hideImage: false,
    source: 'test',
  };

  api.getLocalPackagersAsync = jest.fn().mockResolvedValue([fakeLocalPackager]);

  const { getByText } = await renderHomeScreen();

  await waitFor(() => getByText(fakeLocalPackager.description));
});

test('refetching local packagers on button press', async () => {
  api.getLocalPackagersAsync = jest.fn().mockResolvedValue([]);

  const { getByText, refetch } = await renderHomeScreen({
    refetchPollInterval: 0,
    refetchPollAmount: 2,
  });

  const fakeLocalPackager: Packager = {
    url: 'hello',
    description: 'fakePackagerDescription',
    hideImage: false,
    source: 'test',
  };

  api.getLocalPackagersAsync = jest.fn().mockResolvedValue([fakeLocalPackager]);
  expect(() => getByText(fakeLocalPackager.description)).toThrow();
  expect(api.getLocalPackagersAsync).not.toHaveBeenCalled();

  await refetch();
  expect(getByText(fetchingPackagersRegex));
  expect(api.getLocalPackagersAsync).toHaveBeenCalled();

  await waitFor(() => getByText(fakeLocalPackager.description));
});

test('refetching enabled after polling is completed', async () => {
  api.getLocalPackagersAsync = jest.fn().mockResolvedValue([]);

  const { getByText, refetch } = await renderHomeScreen({
    refetchPollAmount: 1,
    refetchPollInterval: 0,
  });

  api.getLocalPackagersAsync.mockClear();
  await refetch();
  expect(api.getLocalPackagersAsync).toHaveBeenCalledTimes(1);

  // ensure button is disabled when fetching
  await act(async () => fireEvent.press(getByText(fetchingPackagersRegex)));
  expect(api.getLocalPackagersAsync).toHaveBeenCalledTimes(1);

  await refetch();
  expect(api.getLocalPackagersAsync).toHaveBeenCalledTimes(2);
});

test('select packager by entered url', async () => {
  const { getByText, getByPlaceholderText } = await renderHomeScreen();

  expect(() => getByPlaceholderText(/exp:\/\/192/i)).toThrow();
  const toggleButton = getByText(textInputToggleRegex);
  fireEvent.press(toggleButton);

  const input = await waitFor(() => getByPlaceholderText(/exp:\/\/192/i));
  fireEvent.changeText(input, 'testing testing 123');
  fireEvent.press(getByText(/connect/i));

  expect(DevLauncher.loadApp).toHaveBeenCalledTimes(1);
  expect(DevLauncher.loadApp).toHaveBeenCalledWith('testing testing 123');
});

test.todo('unable to enter an invalid url');
test.todo('display for a valid url that is not found');

test('select packager from packager list', async () => {
  const fakeLocalPackager: Packager = {
    url: 'hello',
    description: 'fakePackagerDescription',
    hideImage: false,
    source: 'test',
  };

  api.getLocalPackagersAsync = jest.fn().mockResolvedValue([fakeLocalPackager]);

  const { getByText } = await renderHomeScreen();
  await waitFor(() => getByText(refetchPackagersRegex));

  fireEvent.press(getByText(fakeLocalPackager.description));
  expect(DevLauncher.loadApp).toHaveBeenCalled();
  expect(DevLauncher.loadApp).toHaveBeenCalledWith(fakeLocalPackager.url);
});

async function renderHomeScreen(props?: HomeScreenProps) {
  const { getByText, ...fns } = render(<HomeScreen {...props} />, {
    wrapper,
  });

  await waitFor(() => getByText(packagerInstructionsRegex));

  async function refetch() {
    await waitFor(() => getByText(refetchPackagersRegex));
    await act(async () => fireEvent.press(getByText(refetchPackagersRegex)));
  }

  return {
    ...fns,
    getByText,
    refetch,
  };
}
