
"use client";

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  // Load saved settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);

      if (saved !== null) {
        const parsed = JSON.parse(saved);

        if (parsed !== null && parsed !== undefined) {
          setValue(parsed as T);
        }
      }
    } catch (error) {
      console.error("Could not load saved data:", error);
    } finally {
      setLoaded(true);
    }
  }, [key]);

  // Save settings whenever they change
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Could not save data:", error);
    }
  }, [key, value, loaded]);

  return [value, setValue, loaded];
}
