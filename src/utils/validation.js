/**
 * src/utils/validation.js
 * Input validation for activity records and challenge operations.
 */

export const ACTIVITY_UNITS = {
  steps: 'steps',
  'active-minutes': 'minutes',
  water: 'glasses',
  sleep: 'hours'
};

export const ACTIVITY_LIMITS = {
  steps: { min: 1, max: 150000, label: 'Steps' },
  'active-minutes': { min: 1, max: 1440, label: 'Active Minutes' },
  water: { min: 1, max: 50, label: 'Glasses of Water' },
  sleep: { min: 0.5, max: 24, label: 'Hours of Sleep' }
};

export function validateActivityInput(type, value, date) {
  const errors = {};

  if (!type || !ACTIVITY_LIMITS[type]) {
    errors.type = 'Please select a valid activity type.';
  }

  const numVal = Number(value);
  if (isNaN(numVal) || numVal <= 0) {
    errors.value = 'Value must be a positive number greater than 0.';
  } else if (ACTIVITY_LIMITS[type]) {
    const { min, max, label } = ACTIVITY_LIMITS[type];
    if (numVal < min || numVal > max) {
      errors.value = `${label} must be between ${min} and ${max.toLocaleString()}.`;
    }
  }

  if (!date) {
    errors.date = 'Please select a date.';
  } else {
    const selected = new Date(date);
    if (isNaN(selected.getTime())) {
      errors.date = 'Invalid date format.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
