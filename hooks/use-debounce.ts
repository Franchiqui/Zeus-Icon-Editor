import { useState, useEffect, useCallback, useRef } from 'react';

interface UseDebounceOptions {
  delay?: number;
  leading?: boolean;
  trailing?: boolean;
}

const DEFAULT_OPTIONS: UseDebounceOptions = {
  delay: 300,
  leading: false,
  trailing: true,
};

export function useDebounce<T>(
  value: T,
  options?: UseDebounceOptions
): T {
  const { delay, leading, trailing } = { ...DEFAULT_OPTIONS, ...options };
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const leadingRef = useRef<boolean>(true);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (leading && leadingRef.current) {
      setDebouncedValue(value);
      leadingRef.current = false;
      return;
    }

    clearTimer();

    if (trailing) {
      timerRef.current = setTimeout(() => {
        setDebouncedValue(value);
        leadingRef.current = true;
      }, delay);
    }

    return () => clearTimer();
  }, [value, delay, leading, trailing, clearTimer]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  options?: UseDebounceOptions
): (...args: Parameters<T>) => void {
  const { delay, leading, trailing } = { ...DEFAULT_OPTIONS, ...options };
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const leadingRef = useRef<boolean>(true);
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return useCallback(
    (...args: Parameters<T>) => {
      if (leading && leadingRef.current) {
        callbackRef.current(...args);
        leadingRef.current = false;
        return;
      }

      clearTimer();

      if (trailing) {
        timerRef.current = setTimeout(() => {
          callbackRef.current(...args);
          leadingRef.current = true;
        }, delay);
      }
    },
    [delay, leading, trailing, clearTimer]
  );
}

export function useDebouncedEffect(
  effect: () => void | (() => void),
  deps: unknown[],
  options?: UseDebounceOptions
): void {
  const { delay, leading, trailing } = { ...DEFAULT_OPTIONS, ...options };
  const effectRef = useRef(effect);
  const cleanupRef = useRef<void | (() => void)>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const leadingRef = useRef<boolean>(true);
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (leading) {
        cleanupRef.current = effectRef.current();
        leadingRef.current = false;
        return;
      }
    }

    if (leading && leadingRef.current) {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      cleanupRef.current = effectRef.current();
      leadingRef.current = false;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (trailing) {
      timerRef.current = setTimeout(() => {
        if (cleanupRef.current) {
          cleanupRef.current();
        }
        cleanupRef.current = effectRef.current();
        leadingRef.current = true;
      }, delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, deps);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);
}

export function useDebouncedState<T>(
  initialValue: T,
  options?: UseDebounceOptions
): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, options);

  return [value, debouncedValue, setValue];
}

export function useDebouncedMemo<T>(
  factory: () => T,
  deps: unknown[],
  options?: UseDebounceOptions
): T {
  const [debouncedDeps, setDebouncedDeps] = useState(deps);
  const debouncedFactory = useDebouncedCallback(() => {
    setDebouncedDeps([...deps]);
  }, options);

  useEffect(() => {
    debouncedFactory();
  }, deps);

  return useCallback(factory, debouncedDeps)();
}