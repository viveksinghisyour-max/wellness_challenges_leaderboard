/**
 * js/storage.js
 * Versioned localStorage management with graceful in-memory fallback.
 * Manages user activity records, challenge enrollments, and participant state.
 */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    ACTIVITIES: 'WELLNESS_V1_ACTIVITIES',
    ENROLLMENTS: 'WELLNESS_V1_ENROLLMENTS',
    USER_PROFILE: 'WELLNESS_V1_USER_PROFILE',
    CUSTOM_PARTICIPANTS: 'WELLNESS_V1_CUSTOM_PARTICIPANTS'
  };

  // In-memory fallback in case localStorage is disabled (e.g. strict private mode)
  const memoryStore = {};
  let storageAvailable = null;

  function isLocalStorageAvailable() {
    if (storageAvailable !== null) return storageAvailable;
    try {
      const testKey = '__wellness_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      storageAvailable = true;
    } catch (e) {
      console.warn('localStorage is not available, using in-memory session store:', e);
      storageAvailable = false;
    }
    return storageAvailable;
  }

  function readItem(key, fallbackValue) {
    if (isLocalStorageAvailable()) {
      try {
        const item = window.localStorage.getItem(key);
        if (item === null || item === undefined) return fallbackValue;
        return JSON.parse(item);
      } catch (err) {
        console.error(`Error reading ${key} from localStorage:`, err);
        return fallbackValue;
      }
    } else {
      return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : fallbackValue;
    }
  }

  function writeItem(key, value) {
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error(`Error saving ${key} to localStorage:`, err);
        memoryStore[key] = value;
      }
    } else {
      memoryStore[key] = value;
    }
  }

  function removeItem(key) {
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(key);
      } catch (err) {
        console.error(`Error removing ${key} from localStorage:`, err);
      }
    }
    delete memoryStore[key];
  }

  // --- Activities Management ---
  function getActivities() {
    const defaultList = window.WellnessData ? window.WellnessData.initialUserActivities : [];
    const activities = readItem(STORAGE_KEYS.ACTIVITIES, null);
    if (!activities || !Array.isArray(activities)) {
      // Seed default activities if empty
      writeItem(STORAGE_KEYS.ACTIVITIES, defaultList);
      return [...defaultList];
    }
    return activities;
  }

  function saveActivities(activities) {
    writeItem(STORAGE_KEYS.ACTIVITIES, activities);
    notifyStorageChange('activities');
  }

  function addActivity(newEntry) {
    const list = getActivities();
    // Validate entry has unique ID and correct fields
    const entry = {
      id: newEntry.id || 'act_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      date: newEntry.date || new Date().toISOString().split('T')[0],
      type: newEntry.type,
      value: Number(newEntry.value),
      unit: newEntry.unit,
      notes: (newEntry.notes || '').trim(),
      source: 'manual',
      createdAt: new Date().toISOString()
    };

    list.unshift(entry);
    saveActivities(list);
    return entry;
  }

  function updateActivity(id, updatedFields) {
    const list = getActivities();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;

    const current = list[index];
    const updated = {
      ...current,
      date: updatedFields.date || current.date,
      type: updatedFields.type || current.type,
      value: updatedFields.value !== undefined ? Number(updatedFields.value) : current.value,
      unit: updatedFields.unit || current.unit,
      notes: updatedFields.notes !== undefined ? updatedFields.notes.trim() : current.notes,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    saveActivities(list);
    return updated;
  }

  function deleteActivity(id) {
    const list = getActivities();
    const filtered = list.filter(item => item.id !== id);
    saveActivities(filtered);
    return filtered.length < list.length;
  }

  // --- Enrollments Management ---
  function getEnrollments() {
    const defaultList = window.WellnessData ? window.WellnessData.defaultEnrollments : [];
    const enrollments = readItem(STORAGE_KEYS.ENROLLMENTS, null);
    if (!enrollments || !Array.isArray(enrollments)) {
      writeItem(STORAGE_KEYS.ENROLLMENTS, defaultList);
      return [...defaultList];
    }
    return enrollments;
  }

  function saveEnrollments(enrollments) {
    writeItem(STORAGE_KEYS.ENROLLMENTS, enrollments);
    notifyStorageChange('enrollments');
  }

  function isEnrolled(challengeId) {
    const enrollments = getEnrollments();
    return enrollments.some(e => e.challengeId === challengeId);
  }

  function enrollChallenge(challengeId) {
    const enrollments = getEnrollments();
    if (enrollments.some(e => e.challengeId === challengeId)) {
      return { success: false, message: 'Already enrolled in this challenge.' };
    }
    const today = new Date().toISOString().split('T')[0];
    enrollments.push({
      challengeId,
      enrolledAt: today,
      completed: false
    });
    saveEnrollments(enrollments);
    return { success: true, message: 'Enrolled successfully!' };
  }

  function unenrollChallenge(challengeId) {
    const enrollments = getEnrollments();
    const initialLen = enrollments.length;
    const filtered = enrollments.filter(e => e.challengeId !== challengeId);
    if (filtered.length === initialLen) {
      return { success: false, message: 'Challenge enrollment not found.' };
    }
    saveEnrollments(filtered);
    return { success: true, message: 'Unenrolled from challenge.' };
  }

  // --- Profile Management ---
  function getUserProfile() {
    const defaultProfile = window.WellnessData ? window.WellnessData.currentUser : {
      id: 'user_alex_01',
      name: 'Alex Rivera',
      avatar: 'AR',
      streakDays: 7
    };
    const profile = readItem(STORAGE_KEYS.USER_PROFILE, null);
    if (!profile) {
      writeItem(STORAGE_KEYS.USER_PROFILE, defaultProfile);
      return { ...defaultProfile };
    }
    return profile;
  }

  function saveUserProfile(profile) {
    writeItem(STORAGE_KEYS.USER_PROFILE, profile);
    notifyStorageChange('profile');
  }

  // --- Reset All Demo Data ---
  function resetToDefaults() {
    if (isLocalStorageAvailable()) {
      removeItem(STORAGE_KEYS.ACTIVITIES);
      removeItem(STORAGE_KEYS.ENROLLMENTS);
      removeItem(STORAGE_KEYS.USER_PROFILE);
      removeItem(STORAGE_KEYS.CUSTOM_PARTICIPANTS);
    }
    // Re-seed from initial dataset
    if (window.WellnessData) {
      writeItem(STORAGE_KEYS.ACTIVITIES, window.WellnessData.initialUserActivities);
      writeItem(STORAGE_KEYS.ENROLLMENTS, window.WellnessData.defaultEnrollments);
      writeItem(STORAGE_KEYS.USER_PROFILE, window.WellnessData.currentUser);
    }
    notifyStorageChange('reset');
  }

  // Simple event dispatcher for components listening in the same window
  function notifyStorageChange(type) {
    const event = new CustomEvent('wellness:storage-updated', { detail: { type } });
    window.dispatchEvent(event);
  }

  window.WellnessStorage = {
    isLocalStorageAvailable,
    getActivities,
    saveActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    getEnrollments,
    saveEnrollments,
    isEnrolled,
    enrollChallenge,
    unenrollChallenge,
    getUserProfile,
    saveUserProfile,
    resetToDefaults
  };
})();
