import * as React from 'react';
import { useQuery } from 'react-query';

import { getLocalPackagersAsync } from '../functions/getLocalPackagersAsync';
import { sleepAsync } from '../functions/sleepAsync';

type PollOptions = {
  pollAmount?: number;
  pollInterval?: number;
};

export function useLocalPackagers() {
  const [isPolling, setIsPolling] = React.useState(false);

  const { refetch, isFetching, ...rest } = useQuery(
    'local-packagers',
    () => getLocalPackagersAsync(),
    {
      refetchInterval: isPolling ? 1000 : 0,
    }
  );

  const isMounted = React.useRef(false);
  React.useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  async function pollAsync({ pollAmount = 5, pollInterval = 1000 }: PollOptions) {
    let fetchCount = 0;
    setIsPolling(true);

    while (fetchCount < pollAmount) {
      await refetch();
      await sleepAsync(pollInterval);
      fetchCount += 1;
    }

    if (isMounted.current) {
      setIsPolling(false);
    }
  }

  return {
    ...rest,
    refetch,
    pollAsync,
    isFetching: isFetching || isPolling,
  };
}
