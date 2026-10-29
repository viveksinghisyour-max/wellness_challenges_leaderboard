import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return getItem(key, initialValue);
  });

  const setValue = useCallback((value) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      setItem(key, valueToStore);
      return valueToStore;
    });
  }, [key]);

  useEffect(() => {
    function handleStorageChange(e) {
      if (e.detail && e.detail.key === key) {
        setStoredValue(e.detail.value !== null ? e.detail.value : initialValue);
      }
    }

    window.addEventListener('wellness:storage', handleStorageChange);
    return () => window.removeEventListener('wellness:storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
}
