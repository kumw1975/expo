import * as React from 'react';

import * as DevLauncher from '../../DevLauncherInternal';
import { getLocalPackagersAsync, Packager } from '../../functions/getLocalPackagersAsync';
import { render, waitFor, fireEvent, act } from '../../test-utils';
import { HomeScreen, HomeScreenProps } from '../HomeScreen';

jest.mock('../../functions/getLocalPackagersAsync');

const mockGetLocalPackagersAsync = getLocalPackagersAsync as jest.Mock;

function mockGetPackagersResponse(response: Packager[]) {
  return mockGetLocalPackagersAsync.mockResolvedValueOnce(response);
}

const packagerInstructionsRegex = /start a local development server with/i;
const fetchingPackagersRegex = /searching for local servers/i;
const refetchPackagersRegex = /refetch local servers/i;
const textInputToggleRegex = /enter url manually/i;

test('displays instructions on starting packager when none are found', async () => {
  const { getByText } = await renderHomeScreen();
  await waitFor(() => getByText(packagerInstructionsRegex));
});

test('displays refetch button', async () => {
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

  const fakeLocalPackager2: Packager = {
    url: 'hello',
    description: 'fakePackagerDescription2',
    hideImage: false,
    source: 'test',
  };

  mockGetPackagersResponse([fakeLocalPackager, fakeLocalPackager2]);

  expect(() => getByText(fakeLocalPackager.description)).toThrow();

  const { getByText } = await renderHomeScreen();

  await waitFor(() => getByText(fakeLocalPackager.description));
  await waitFor(() => getByText(fakeLocalPackager2.description));
});

test('refetching local packagers on button press', async () => {
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

  mockGetLocalPackagersAsync.mockClear();
  mockGetPackagersResponse([fakeLocalPackager]);
  expect(() => getByText(fakeLocalPackager.description)).toThrow();
  expect(getLocalPackagersAsync).not.toHaveBeenCalled();

  await refetch();
  expect(getByText(fetchingPackagersRegex));
  expect(getLocalPackagersAsync).toHaveBeenCalled();

  await waitFor(() => getByText(fakeLocalPackager.description));
});

test('refetching enabled after polling is completed', async () => {
  const { getByText, refetch } = await renderHomeScreen({
    refetchPollAmount: 1,
    refetchPollInterval: 0,
  });

  mockGetLocalPackagersAsync.mockClear();
  await refetch();
  expect(getLocalPackagersAsync).toHaveBeenCalledTimes(1);

  // ensure button is disabled when fetching
  await act(async () => fireEvent.press(getByText(fetchingPackagersRegex)));
  expect(getLocalPackagersAsync).toHaveBeenCalledTimes(1);

  await refetch();
  expect(getLocalPackagersAsync).toHaveBeenCalledTimes(2);
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

  mockGetPackagersResponse([fakeLocalPackager]);

  const { getByText } = await renderHomeScreen();

  await waitFor(() => getByText(fakeLocalPackager.description));

  fireEvent.press(getByText(fakeLocalPackager.description));
  expect(DevLauncher.loadApp).toHaveBeenCalled();
  expect(DevLauncher.loadApp).toHaveBeenCalledWith(fakeLocalPackager.url);
});

async function renderHomeScreen(props?: HomeScreenProps) {
  const { getByText, ...fns } = render(<HomeScreen {...props} />);

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
