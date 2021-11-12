import { Platform } from 'react-native';
import { useQuery } from 'react-query';

const baseAddress = Platform.select({
  ios: 'http://localhost',
  android: 'http://10.0.2.2',
});
const statusPage = 'status';
const portsToCheck = [8081, 8082, 19000, 19001, 19002, 19003, 19004, 19005];

export type Packager = {
  description: string;
  url: string;
  source: string;
  hideImage: boolean;
};

async function getLocalPackagersAsync(isSimulator?: boolean): Promise<Packager[]> {
  if (!isSimulator) {
    return [];
  }

  const onlinePackagers: Packager[] = [];

  for (const port of portsToCheck) {
    try {
      const address = `${baseAddress}:${port}`;
      const { status } = await fetch(`${address}/${statusPage}`);
      if (status === 200) {
        onlinePackagers.push({
          description: address,
          url: address,
          source: 'desktop',
          hideImage: true,
        });
      }
    } catch (e) {}
  }

  return onlinePackagers;
}

export function useLocalPackagers(isSimulator: boolean) {
  return useQuery('local-packagers', () => getLocalPackagersAsync(isSimulator), {
    retry: 5,
  });
}
