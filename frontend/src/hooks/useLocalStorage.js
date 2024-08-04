import { useState } from "react";

export const useLocalStorage = (
  key,
  defaultValue = null,
  callback = undefined,
) => {
  const getItemOrDefault = () => {
    try {
      const storedValue = JSON.parse(localStorage.getItem(key));
      if (storedValue == null) {
        return defaultValue;
      }
      return storedValue;
    } catch {
      return defaultValue;
    }
  };

  const [value, setValue] = useState(() => {
    const value = getItemOrDefault();
    if (callback != null) {
      callback(value);
    }
    return value;
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (e) {
      console.error("Failed to set local storage for", key, e);
    }
  };

  return [value, setStoredValue, setValue];
};
