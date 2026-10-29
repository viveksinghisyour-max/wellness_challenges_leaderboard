/**
 * src/utils/scoring.js
 * Deterministic scoring engine with deduplication and tie-breaking comparator.
 */

export const SCORING_RULES = {
  STEPS_RATE: 1 / 100,            // 1 pt per 100 steps
  MAX_DAILY_STEPS_PTS: 300,      // Max 30,000 steps counted towards points (300 pts)
  ACTIVE_MIN_RATE: 2,            // 2 pts per active minute
  MAX_DAILY_ACTIVE_PTS: 240,     // Max 120 active minutes counted towards points (240 pts)
  WATER_GLASS_RATE: 10,          // 10 pts per glass up to 8 glasses (80 pts)
  WATER_BONUS_RATE: 5,           // 5 pts for extra glasses up to 10 total (90 pts max)
  MAX_DAILY_WATER_PTS: 90,
  SLEEP_HOUR_RATE: 10,           // 10 pts per hour of sleep
  MAX_DAILY_SLEEP_PTS: 90,       // Max 9 hrs counted (90 pts)
  CHALLENGE_COMPLETION_BONUS: 250, // 250 bonus points per completed challenge
  STREAK_BONUS_PER_DAY: 25        // 25 pts per day of active streak
};

export function calculateDailyScore(dayMetrics) {
  if (!dayMetrics) return 0;

  const steps = Math.max(0, Number(dayMetrics.steps || 0));
  const activeMinutes = Math.max(0, Number(dayMetrics.activeMinutes || 0));
  const water = Math.max(0, Number(dayMetrics.water || 0));
  const sleep = Math.max(0, Number(dayMetrics.sleep || 0));

  // Steps points
  const stepPoints = Math.min(
    Math.floor(steps * SCORING_RULES.STEPS_RATE),
    SCORING_RULES.MAX_DAILY_STEPS_PTS
  );

  // Active minutes points
  const activePoints = Math.min(
    Math.floor(activeMinutes * SCORING_RULES.ACTIVE_MIN_RATE),
    SCORING_RULES.MAX_DAILY_ACTIVE_PTS
  );

  // Hydration points
  let waterPoints = 0;
  if (water <= 8) {
    waterPoints = water * SCORING_RULES.WATER_GLASS_RATE;
  } else {
    waterPoints = (8 * SCORING_RULES.WATER_GLASS_RATE) +
                  (Math.min(water, 10) - 8) * SCORING_RULES.WATER_BONUS_RATE;
  }
  waterPoints = Math.min(waterPoints, SCORING_RULES.MAX_DAILY_WATER_PTS);

  // Sleep points
  const sleepPoints = Math.min(
    Math.floor(sleep * SCORING_RULES.SLEEP_HOUR_RATE),
    SCORING_RULES.MAX_DAILY_SLEEP_PTS
  );

  return stepPoints + activePoints + waterPoints + sleepPoints;
}

export function aggregateActivitiesByDay(activityList = []) {
  const dayMap = {};
  const seenIds = new Set();

  activityList.forEach(record => {
    if (record.id && seenIds.has(record.id)) return; // Prevent duplicate IDs
    if (record.id) seenIds.add(record.id);

    const date = record.date;
    if (!date) return;

    if (!dayMap[date]) {
      dayMap[date] = { steps: 0, activeMinutes: 0, water: 0, sleep: 0 };
    }

    const val = Number(record.value) || 0;
    if (val < 0) return;

    switch (record.type) {
      case 'steps':
        dayMap[date].steps += val;
        break;
      case 'active-minutes':
      case 'activeMinutes':
      case 'activity':
        dayMap[date].activeMinutes += val;
        break;
      case 'water':
      case 'hydration':
        dayMap[date].water += val;
        break;
      case 'sleep':
        dayMap[date].sleep = Math.max(dayMap[date].sleep, val);
        break;
      default:
        break;
    }
  });

  return dayMap;
}

export function computeUserScore(activities = [], enrollments = [], userProfile = {}) {
  const dayMap = aggregateActivitiesByDay(activities);
  let activityScore = 0;
  let totalSteps = 0;
  let totalActiveMinutes = 0;

  Object.values(dayMap).forEach(day => {
    activityScore += calculateDailyScore(day);
    totalSteps += day.steps;
    totalActiveMinutes += day.activeMinutes;
  });

  const completedChallengesCount = (enrollments || []).filter(e => e.completed).length;
  const challengeBonus = completedChallengesCount * SCORING_RULES.CHALLENGE_COMPLETION_BONUS;

  const streak = (userProfile && Number(userProfile.streakDays)) || 0;
  const streakBonus = streak * SCORING_RULES.STREAK_BONUS_PER_DAY;

  const totalScore = activityScore + challengeBonus + streakBonus;

  return {
    totalScore,
    activityScore,
    challengeBonus,
    streakBonus,
    totalSteps,
    totalActiveMinutes,
    completedChallengesCount,
    streakDays: streak
  };
}

export function compareParticipants(a, b) {
  if (b.score !== a.score) {
    return b.score - a.score;
  }
  if (b.completedChallenges !== a.completedChallenges) {
    return b.completedChallenges - a.completedChallenges;
  }
  if (b.activeMinutes !== a.activeMinutes) {
    return b.activeMinutes - a.activeMinutes;
  }
  if (b.steps !== a.steps) {
    return b.steps - a.steps;
  }
  return (a.name || '').localeCompare(b.name || '');
}
