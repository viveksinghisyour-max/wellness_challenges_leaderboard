/**
 * src/utils/leaderboard.js
 * Ranking engine and participant aggregation with deterministic tie-breaking.
 */

import { compareParticipants } from './scoring';
import { inspectParticipantActivities } from './anomalyDetection';

export function rankLeaderboard(userEntry, participants = []) {
  const combined = [];

  if (userEntry) {
    combined.push({
      ...userEntry,
      isCurrentUser: true
    });
  }

  participants.forEach(p => {
    combined.push({
      ...p,
      isCurrentUser: false
    });
  });

  // Sort deterministically
  combined.sort(compareParticipants);

  // Assign ranks and run anomaly inspection
  return combined.map((p, idx) => {
    const anomalyReport = inspectParticipantActivities(p);
    return {
      ...p,
      rank: idx + 1,
      anomalyReport
    };
  });
}
