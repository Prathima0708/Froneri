import {useCallback, useState} from 'react';

export function useForceUpdate() {
  const [, setTick] = useState(true);
  const update = useCallback(() => {
    setTick(tick => !tick);
  }, []);
  return update;
}
