/**
 * src/utils/storage.js
 * Versioned local storage utility with graceful in-memory fallback.
 */

export const STORAGE_KEYS = {
  ACTIVITIES: 'WELLNESS_REACT_V1_ACTIVITIES',
  ENROLLMENTS: 'WELLNESS_REACT_V1_ENROLLMENTS',
  PROFILE: 'WELLNESS_REACT_V1_PROFILE',
  PARTICIPANTS: 'WELLNESS_REACT_V1_PARTICIPANTS'
};

const memoryStore = {};

export function isStorageAvailable() {
  try {
    const testKey = '__test_storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function getItem(key, defaultValue = null) {
  if (isStorageAvailable()) {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  }
  return memoryStore[key] !== undefined ? memoryStore[key] : defaultValue;
}

export function setItem(key, value) {
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing ${key} to localStorage:`, e);
      memoryStore[key] = value;
    }
  } else {
    memoryStore[key] = value;
  }

  // Dispatch custom storage event for in-window reactive updates
  window.dispatchEvent(new CustomEvent('wellness:storage', { detail: { key, value } }));
}

export function removeItem(key) {
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing ${key} from localStorage:`, e);
    }
  }
  delete memoryStore[key];
  window.dispatchEvent(new CustomEvent('wellness:storage', { detail: { key, value: null } }));
}

export function clearAllWellnessData() {
  Object.values(STORAGE_KEYS).forEach(k => removeItem(k));
}
