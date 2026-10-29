/**
 * js/scoring.js
 * Deterministic scoring engine with duplicate prevention and deterministic tie-breakers.
 */

(function () {
  'use strict';

  const SCORING_RULES = {
    STEPS_RATE: 1 / 100,            // 1 pt per 100 steps
    MAX_DAILY_STEPS_PTS: 300,      // Max 30,000 steps counted towards score (300 pts)
    ACTIVE_MIN_RATE: 2,            // 2 pts per active minute
    MAX_DAILY_ACTIVE_PTS: 240,     // Max 120 active minutes counted towards score (240 pts)
    WATER_GLASS_RATE: 10,          // 10 pts per glass up to 8 glasses (80 pts)
    WATER_BONUS_RATE: 5,           // 5 pts for extra glasses up to 10 total (90 pts max)
    MAX_DAILY_WATER_PTS: 90,
    SLEEP_HOUR_RATE: 10,           // 10 pts per hour of sleep (e.g. 8 hrs = 80 pts)
    MAX_DAILY_SLEEP_PTS: 90,       // Max 9 hrs counted (90 pts)
    CHALLENGE_COMPLETION_BONUS: 250, // 250 bonus points per completed challenge
    STREAK_BONUS_PER_DAY: 25        // 25 pts per day of active streak
  };

  /**
   * Calculate points earned for a single day's activity metrics.
   * Handles clamping to physiological ceilings to prevent runaway gaming.
   */
  function calculateDailyScore(dayMetrics) {
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

  /**
   * Aggregates raw activity logs into day-by-day metrics.
   * Deduplicates entries to prevent inflation.
   */
  function aggregateActivitiesByDay(activityList) {
    const dayMap = {};
    const seenIds = new Set();

    (activityList || []).forEach(record => {
      // Prevent duplicate record IDs from ever being added twice
      if (record.id && seenIds.has(record.id)) return;
      if (record.id) seenIds.add(record.id);

      const date = record.date;
      if (!date) return;

      if (!dayMap[date]) {
        dayMap[date] = { steps: 0, activeMinutes: 0, water: 0, sleep: 0 };
      }

      const val = Number(record.value) || 0;
      if (val < 0) return; // Ignore negative values

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
          // For sleep, we take the largest logged sleep for the night if multiple
          dayMap[date].sleep = Math.max(dayMap[date].sleep, val);
          break;
      }
    });

    return dayMap;
  }

  /**
   * Computes the total score for the current demo user based on their activities,
   * enrolled challenges completed, and streak.
   */
  function computeCurrentUserScore(activities, enrollments, userProfile) {
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

  /**
   * Computes score for a synthetic participant.
   */
  function computeParticipantScore(participant) {
    let activityScore = 0;
    let totalSteps = 0;
    let totalActiveMinutes = 0;

    (participant.dailyActivities || []).forEach(day => {
      activityScore += calculateDailyScore(day);
      totalSteps += (day.steps || 0);
      totalActiveMinutes += (day.activeMinutes || 0);
    });

    const challengeBonus = (participant.completedChallenges || 0) * SCORING_RULES.CHALLENGE_COMPLETION_BONUS;
    const streakBonus = (participant.streakDays || 0) * SCORING_RULES.STREAK_BONUS_PER_DAY;
    const totalScore = activityScore + challengeBonus + streakBonus;

    return {
      totalScore,
      activityScore,
      challengeBonus,
      streakBonus,
      totalSteps,
      totalActiveMinutes,
      completedChallenges: participant.completedChallenges || 0,
      streakDays: participant.streakDays || 0
    };
  }

  /**
   * Deterministic tie-breaker comparator.
   * 1. Total Score descending
   * 2. Completed Challenges descending
   * 3. Total Active Minutes descending
   * 4. Total Steps descending
   * 5. Name alphabetically ascending
   */
  function compareParticipants(a, b) {
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
    return a.name.localeCompare(b.name);
  }

  window.WellnessScoring = {
    SCORING_RULES,
    calculateDailyScore,
    aggregateActivitiesByDay,
    computeCurrentUserScore,
    computeParticipantScore,
    compareParticipants
  };
})();
