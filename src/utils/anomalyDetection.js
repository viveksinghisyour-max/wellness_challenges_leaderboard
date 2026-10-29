/**
 * src/utils/anomalyDetection.js
 * Rule-based heuristic anomaly detection engine.
 * Flags implausible physiological values, cadence discrepancies, and time conflicts.
 */

export const ANOMALY_THRESHOLDS = {
  MAX_DAILY_STEPS: 45000,
  EXTREME_DAILY_STEPS: 55000,
  MAX_DAILY_ACTIVE_MINUTES: 600,
  EXTREME_DAILY_ACTIVE_MINUTES: 800,
  MAX_CADENCE_STEPS_PER_MIN: 300,
  MAX_DAILY_HOURS_TOTAL: 24,
  MAX_DAY_OVER_DAY_STEP_JUMP: 40000
};

export function inspectParticipantActivities(participant) {
  const dailyList = participant.dailyActivities || [];
  const anomalies = [];
  let maxSeverity = 'none';

  const sortedDays = [...dailyList].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  let prevSteps = null;

  sortedDays.forEach(day => {
    const steps = Number(day.steps) || 0;
    const activeMins = Number(day.activeMinutes) || 0;
    const sleepHours = Number(day.sleep) || 0;
    const date = day.date || 'Unknown date';

    // Step ceiling check
    if (steps > ANOMALY_THRESHOLDS.EXTREME_DAILY_STEPS) {
      anomalies.push({
        rule: 'EXTREME_STEP_CEILING',
        severity: 'high',
        date,
        observed: steps,
        threshold: ANOMALY_THRESHOLDS.EXTREME_DAILY_STEPS,
        reason: `Extreme daily steps (${steps.toLocaleString()}) exceeds maximum physiological ceiling (${ANOMALY_THRESHOLDS.EXTREME_DAILY_STEPS.toLocaleString()}).`
      });
      maxSeverity = 'high';
    } else if (steps > ANOMALY_THRESHOLDS.MAX_DAILY_STEPS) {
      anomalies.push({
        rule: 'HIGH_STEP_CEILING',
        severity: 'medium',
        date,
        observed: steps,
        threshold: ANOMALY_THRESHOLDS.MAX_DAILY_STEPS,
        reason: `High daily steps (${steps.toLocaleString()}) exceeds endurance limit (${ANOMALY_THRESHOLDS.MAX_DAILY_STEPS.toLocaleString()}).`
      });
      if (maxSeverity !== 'high') maxSeverity = 'medium';
    }

    // Active minutes check
    if (activeMins > ANOMALY_THRESHOLDS.EXTREME_DAILY_ACTIVE_MINUTES) {
      const hours = (activeMins / 60).toFixed(1);
      anomalies.push({
        rule: 'EXTREME_ACTIVE_MINUTES',
        severity: 'high',
        date,
        observed: activeMins,
        threshold: ANOMALY_THRESHOLDS.EXTREME_DAILY_ACTIVE_MINUTES,
        reason: `Implausible active duration: ${activeMins} minutes (${hours} hours) in a single day.`
      });
      maxSeverity = 'high';
    } else if (activeMins > ANOMALY_THRESHOLDS.MAX_DAILY_ACTIVE_MINUTES) {
      anomalies.push({
        rule: 'HIGH_ACTIVE_MINUTES',
        severity: 'medium',
        date,
        observed: activeMins,
        threshold: ANOMALY_THRESHOLDS.MAX_DAILY_ACTIVE_MINUTES,
        reason: `Unusually high workout duration: ${activeMins} minutes in a single day.`
      });
      if (maxSeverity !== 'high') maxSeverity = 'medium';
    }

    // Cadence check
    if (steps > 12000 && activeMins > 0 && activeMins <= 45) {
      const cadence = Math.round(steps / activeMins);
      if (cadence > ANOMALY_THRESHOLDS.MAX_CADENCE_STEPS_PER_MIN) {
        anomalies.push({
          rule: 'IMPOSSIBLE_CADENCE',
          severity: 'high',
          date,
          observed: `${cadence} steps/min`,
          threshold: `${ANOMALY_THRESHOLDS.MAX_CADENCE_STEPS_PER_MIN} steps/min`,
          reason: `Implausible cadence: ${steps.toLocaleString()} steps with ${activeMins} active mins (${cadence} steps/min; physiological max is ~300).`
        });
        maxSeverity = 'high';
      }
    }

    // Time budget conflict
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

    // Overnight spike
    if (prevSteps !== null && (steps - prevSteps) > ANOMALY_THRESHOLDS.MAX_DAY_OVER_DAY_STEP_JUMP) {
      anomalies.push({
        rule: 'EXTREME_DAY_JUMP',
        severity: 'low',
        date,
        observed: `+${(steps - prevSteps).toLocaleString()} steps`,
        threshold: `+${ANOMALY_THRESHOLDS.MAX_DAY_OVER_DAY_STEP_JUMP.toLocaleString()} steps`,
        reason: `Sudden spike of +${(steps - prevSteps).toLocaleString()} steps compared to prior day.`
      });
      if (maxSeverity === 'none') maxSeverity = 'low';
    }

    prevSteps = steps;
  });

  let status = 'Normal';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (maxSeverity === 'high') {
    status = 'Requires Review';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (maxSeverity === 'medium' || maxSeverity === 'low') {
    status = 'Unusual Activity';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return {
    participantId: participant.id,
    participantName: participant.name,
    isAnomaly: anomalies.length > 0,
    severity: maxSeverity,
    status,
    badgeColor,
    reasons: anomalies.map(a => a.reason),
    anomalies,
    disclaimer: 'Note: Anomaly flags indicate automated pattern alerts for human review and are not conclusive proof of tampering. Client-side local storage is used for demonstration.'
  };
}

export function inspectIndividualRecord(type, value) {
  const val = Number(value) || 0;
  const warnings = [];

  if (type === 'steps') {
    if (val > ANOMALY_THRESHOLDS.EXTREME_DAILY_STEPS) {
      warnings.push(`Exceeds extreme ceiling of ${ANOMALY_THRESHOLDS.EXTREME_DAILY_STEPS.toLocaleString()} steps.`);
    } else if (val > ANOMALY_THRESHOLDS.MAX_DAILY_STEPS) {
      warnings.push(`Exceeds high standard ceiling of ${ANOMALY_THRESHOLDS.MAX_DAILY_STEPS.toLocaleString()} steps.`);
    }
  } else if (type === 'active-minutes') {
    if (val > ANOMALY_THRESHOLDS.MAX_DAILY_ACTIVE_MINUTES) {
      warnings.push(`Active duration (${val} mins) exceeds 10 hours in a single day.`);
    }
  } else if (type === 'water') {
    if (val > 25) {
      warnings.push(`Water intake (${val} glasses) is unusually high.`);
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
