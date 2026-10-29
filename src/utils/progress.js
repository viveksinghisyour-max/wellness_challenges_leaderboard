/**
 * src/utils/progress.js
 * Progress calculations for challenges and activity metrics.
 */

import { aggregateActivitiesByDay } from './scoring';

export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

export function getDateStringDaysAgo(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function calculateSummaryStats(activities = []) {
  const dayMap = aggregateActivitiesByDay(activities);
  const todayStr = getTodayDateString();
  const today = dayMap[todayStr] || { steps: 0, activeMinutes: 0, water: 0, sleep: 0 };

  // Calculate 7-day rolling window
  const last7Days = [];
  let sumSteps = 0;
  let sumActive = 0;
  let sumWater = 0;
  let sumSleep = 0;
  let sleepCount = 0;

  for (let i = 6; i >= 0; i--) {
    const dStr = getDateStringDaysAgo(i);
    const dayData = dayMap[dStr] || { steps: 0, activeMinutes: 0, water: 0, sleep: 0 };
    
    // Day of week abbreviation
    const dateObj = new Date(dStr + 'T00:00:00');
    const dayName = isNaN(dateObj) ? `D${i}` : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    last7Days.push({
      date: dStr,
      dayName,
      steps: dayData.steps,
      activeMinutes: dayData.activeMinutes,
      water: dayData.water,
      sleep: dayData.sleep
    });

    sumSteps += dayData.steps;
    sumActive += dayData.activeMinutes;
    sumWater += dayData.water;
    if (dayData.sleep > 0) {
      sumSleep += dayData.sleep;
      sleepCount++;
    }
  }

  const avgSteps = Math.round(sumSteps / 7);
  const avgSleep = sleepCount > 0 ? (sumSleep / sleepCount).toFixed(1) : 0;
  const burnedCalories = Math.round((today.steps * 0.045) + (today.activeMinutes * 7.5));

  return {
    today,
    burnedCalories,
    avgSteps,
    totalActive: sumActive,
    totalWater: sumWater,
    avgSleep,
    last7Days
  };
}

export function calculateChallengeProgress(challenge, activities = [], profile = {}) {
  const dayMap = aggregateActivitiesByDay(activities);
  const todayStr = getTodayDateString();
  const today = dayMap[todayStr] || { steps: 0, activeMinutes: 0, water: 0, sleep: 0 };

  let totalWeeklySteps = 0;
  let totalWeeklyActive = 0;
  for (let i = 6; i >= 0; i--) {
    const dStr = getDateStringDaysAgo(i);
    const d = dayMap[dStr] || { steps: 0, activeMinutes: 0 };
    totalWeeklySteps += d.steps;
    totalWeeklyActive += d.activeMinutes;
  }

  let current = 0;
  const target = challenge.target;

  switch (challenge.id) {
    case 'daily-steps':
    case 'ten-k-steps':
      current = today.steps;
      break;
    case 'weekly-walking':
      current = totalWeeklySteps;
      break;
    case 'active-minutes':
    case 'core-power':
      current = today.activeMinutes;
      break;
    case 'hydration-habit':
    case 'mindful-hydration':
      current = today.water;
      break;
    case 'sleep-routine':
      current = today.sleep;
      break;
    case 'weekend-movement':
      current = Math.min(target, totalWeeklyActive);
      break;
    case 'wellness-streak':
      current = profile.streakDays || 0;
      break;
    default:
      current = today.steps;
      break;
  }

  const percentage = Math.min(100, Math.round((current / (target || 1)) * 100));
  const isCompleted = percentage >= 100;

  return {
    current,
    target,
    unit: challenge.unit,
    percentage,
    isCompleted
  };
}
