import { useEffect, useState } from "react";

// localStorage-backed state. Starts on the default so server and client render the same,
// then loads any saved value after mount.
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // storage unavailable or corrupt; keep the default
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota / private-mode errors
    }
  }, [key, value, loaded]);

  return [value, setValue] as const;
}
