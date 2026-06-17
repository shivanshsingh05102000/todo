import { useState, useCallback } from "react";

/**
 * useLocalStorage
 * Drop-in replacement for useState that persists to localStorage.
 *
 * Why a hook instead of a useEffect dumped in App:
 * - Reusable for any future persisted value (filter, theme, etc).
 * - Keeps the read/write/error-handling logic in one tested place.
 *
 * Design note: the write happens *inside* the setter itself, not in a
 * useEffect that reacts to value changes. An effect-based version sets
 * state (the error flag) as a side effect of running the effect, which
 * is exactly the cascading-render anti-pattern the React docs warn
 * against. Writing inside the setter is also more correct here: state
 * and storage update in the same tick, so there's no render where React
 * state and localStorage are briefly out of sync.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - used if nothing valid is in storage yet
 * @returns {[value, setValue, error]} error is non-null if storage failed
 *          (e.g. private browsing mode, quota exceeded, corrupted JSON)
 */
export function useLocalStorage(key, initialValue) {
  const [error, setError] = useState(null);

  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      return JSON.parse(raw);
    } catch (err) {
      // Corrupted JSON or storage unavailable — fall back silently to
      // initialValue rather than crashing the whole app on load.
      console.error(`useLocalStorage: failed to read key "${key}"`, err);
      return initialValue;
    }
  });

  const setValueAndPersist = useCallback(
    (next) => {
      setValue((prev) => {
        // Support functional updates, same calling convention as useState.
        const resolved = typeof next === "function" ? next(prev) : next;

        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
          setError(null);
        } catch (err) {
          // Most common cause: quota exceeded, or storage disabled entirely.
          console.error(`useLocalStorage: failed to write key "${key}"`, err);
          setError(err);
        }

        return resolved;
      });
    },
    [key]
  );

  return [value, setValueAndPersist, error];
}
