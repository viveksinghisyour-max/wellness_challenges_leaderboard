/**
 * js/anomaly-detection.js
 * Rule-based, transparent anomaly detection engine for activity records.
 * Identifies implausible physiological records, cadence discrepancies, and time conflicts.
 */

(function () {
  'use strict';

  const ANOMALY_THRESHOLDS = {
    MAX_DAILY_STEPS: 45000,           // Human daily endurance threshold without elite ultra-endurance event
    EXTREME_DAILY_STEPS: 55000,       // Severe red flag threshold
    MAX_DAILY_ACTIVE_MINUTES: 600,    // 10 hours of active cardio/workout
    EXTREME_DAILY_ACTIVE_MINUTES: 800,// 13+ hours of active exercise
    MAX_CADENCE_STEPS_PER_MIN: 300,   // Max sprinting cadence (~250-300 steps/min)
    MAX_DAILY_HOURS_TOTAL: 24,        // Sleep + Active hours cannot exceed 24
    MAX_DAY_OVER_DAY_STEP_JUMP: 40000 // Jumping from baseline to +40k steps overnight
  };

  /**
   * Evaluates a participant's daily activities across their entire week.
   * Returns a structured report with severity, status badge, and reasons.
   */
  function inspectParticipantActivities(participant) {
    const dailyList = participant.dailyActivities || [];
    const anomalies = [];
    let maxSeverity = 'none'; // 'none' | 'low' | 'medium' | 'high'

    // Sort by date ascending to evaluate day-over-day changes
    const sortedDays = [...dailyList].sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    let prevSteps = null;

    sortedDays.forEach(day => {
      const steps = Number(day.steps) || 0;
      const activeMins = Number(day.activeMinutes) || 0;
      const sleepHours = Number(day.sleep) || 0;
      const date = day.date || 'Unknown date';

      // Rule 1: Step Ceiling Check
      if (steps > ANOMALY_THRESHOLDS.EXTREME_DAILY_STEPS) {
        anomalies.push({
          rule: 'EXTREME_STEP_CEILING',
          severity: 'high',
          date,
          observed: steps,
          threshold: ANOMALY_THRESHOLDS.EXTREME_DAILY_STEPS,
          reason: `Extreme daily steps (${steps.toLocaleString()}) severely exceeds maximum physiological threshold (${ANOMALY_THRESHOLDS.EXTREME_DAILY_STEPS.toLocaleString()} steps).`
        });
        maxSeverity = 'high';
      } else if (steps > ANOMALY_THRESHOLDS.MAX_DAILY_STEPS) {
        anomalies.push({
          rule: 'HIGH_STEP_CEILING',
          severity: 'medium',
          date,
          observed: steps,
          threshold: ANOMALY_THRESHOLDS.MAX_DAILY_STEPS,
          reason: `High daily steps (${steps.toLocaleString()}) exceeds standard endurance limit (${ANOMALY_THRESHOLDS.MAX_DAILY_STEPS.toLocaleString()} steps).`
        });
        if (maxSeverity !== 'high') maxSeverity = 'medium';
      }

      // Rule 2: Active Duration Ceiling Check
      if (activeMins > ANOMALY_THRESHOLDS.EXTREME_DAILY_ACTIVE_MINUTES) {
        const hours = (activeMins / 60).toFixed(1);
        anomalies.push({
          rule: 'EXTREME_ACTIVE_MINUTES',
          severity: 'high',
          date,
          observed: activeMins,
          threshold: ANOMALY_THRESHOLDS.EXTREME_DAILY_ACTIVE_MINUTES,
          reason: `Implausible active duration: ${activeMins} minutes (${hours} hours) in a single 24-hour window.`
        });
        maxSeverity = 'high';
      } else if (activeMins > ANOMALY_THRESHOLDS.MAX_DAILY_ACTIVE_MINUTES) {
        anomalies.push({
          rule: 'HIGH_ACTIVE_MINUTES',
          severity: 'medium',
          date,
          observed: activeMins,
          threshold: ANOMALY_THRESHOLDS.MAX_DAILY_ACTIVE_MINUTES,
          reason: `Unusually high active workout duration: ${activeMins} minutes in a single day.`
        });
        if (maxSeverity !== 'high') maxSeverity = 'medium';
      }

      // Rule 3: Step Cadence Plausibility Check (Steps / Active Minutes)
      // Only applicable when significant steps (>10,000) are recorded in very short active time (<45 mins)
      if (steps > 12000 && activeMins > 0 && activeMins <= 45) {
        const cadence = Math.round(steps / activeMins);
        if (cadence > ANOMALY_THRESHOLDS.MAX_CADENCE_STEPS_PER_MIN) {
          anomalies.push({
            rule: 'IMPOSSIBLE_CADENCE',
            severity: 'high',
            date,
            observed: `${cadence} steps/min`,
            threshold: `${ANOMALY_THRESHOLDS.MAX_CADENCE_STEPS_PER_MIN} steps/min`,
            reason: `Implausible step cadence: ${steps.toLocaleString()} steps recorded with only ${activeMins} active minutes (${cadence} steps/min; physiological max is ~300).`
          });
          maxSeverity = 'high';
        }
      }

      // Rule 4: Total Time Conflict Check (Active hours + Sleep hours > 24)
      const activeHours = activeMins / 60;
      if (activeHours + sleepHours > ANOMALY_THRESHOLDS.MAX_DAILY_HOURS_TOTAL) {
        anomalies.push({
          rule: 'TIME_CONFLICT',
          severity: 'medium',
          date,
          observed: `${(activeHours + sleepHours).toFixed(1)} hrs`,
          threshold: '24 hrs',
          reason: `Conflicting day budget: ${activeHours.toFixed(1)}h active time + ${sleepHours.toFixed(1)}h sleep exceeds 24h total.`
        });
        if (maxSeverity !== 'high') maxSeverity = 'medium';
      }

      // Rule 5: Extreme Day-Over-Day Jump
      if (prevSteps !== null && (steps - prevSteps) > ANOMALY_THRESHOLDS.MAX_DAY_OVER_DAY_STEP_JUMP) {
        anomalies.push({
          rule: 'EXTREME_DAY_JUMP',
          severity: 'low',
          date,
          observed: `+${(steps - prevSteps).toLocaleString()} steps`,
          threshold: `+${ANOMALY_THRESHOLDS.MAX_DAY_OVER_DAY_STEP_JUMP.toLocaleString()} steps`,
          reason: `Sudden spike of +${(steps - prevSteps).toLocaleString()} steps compared to previous day (${prevSteps.toLocaleString()} -> ${steps.toLocaleString()}).`
        });
        if (maxSeverity === 'none') maxSeverity = 'low';
      }
      prevSteps = steps;
    });

    let status = 'Normal';
    let badgeClass = 'badge-normal';

    if (maxSeverity === 'high') {
      status = 'Requires Review';
      badgeClass = 'badge-danger';
    } else if (maxSeverity === 'medium' || maxSeverity === 'low') {
      status = 'Unusual Activity';
      badgeClass = 'badge-warning';
    }

    return {
      participantId: participant.id,
      participantName: participant.name,
      isAnomaly: anomalies.length > 0,
      severity: maxSeverity,
      status,
      badgeClass,
      reasons: anomalies.map(a => a.reason),
      anomalies,
      disclaimer: 'Note: Anomaly flags indicate automated pattern alerts for human review and are not conclusive proof of tampering. Client-side local storage is used for demonstration purposes.'
    };
  }

  /**
   * Quick check for a newly submitted activity entry by the user.
   */
  function inspectIndividualRecord(type, value, activeMinutesToday = 0) {
    const val = Number(value) || 0;
    const warnings = [];

    if (type === 'steps') {
      if (val > ANOMALY_THRESHOLDS.EXTREME_DAILY_STEPS) {
        warnings.push(`Record exceeds extreme physiological threshold of ${ANOMALY_THRESHOLDS.EXTREME_DAILY_STEPS.toLocaleString()} steps.`);
      } else if (val > ANOMALY_THRESHOLDS.MAX_DAILY_STEPS) {
        warnings.push(`Steps exceed standard high daily threshold of ${ANOMALY_THRESHOLDS.MAX_DAILY_STEPS.toLocaleString()} steps.`);
      }
    } else if (type === 'active-minutes') {
      if (val > ANOMALY_THRESHOLDS.MAX_DAILY_ACTIVE_MINUTES) {
        warnings.push(`Active duration (${val} mins) exceeds 10 hours in a single day.`);
      }
    } else if (type === 'water') {
      if (val > 25) {
        warnings.push(`Water intake (${val} glasses) is unusually high and may be unsafe.`);
      }
    } else if (type === 'sleep') {
      if (val > 18) {
        warnings.push(`Sleep duration (${val} hours) is exceptionally high for a single night.`);
      }
    }

    return {
      hasWarning: warnings.length > 0,
      warnings
    };
  }

  window.WellnessAnomaly = {
    ANOMALY_THRESHOLDS,
    inspectParticipantActivities,
    inspectIndividualRecord
  };
})();
