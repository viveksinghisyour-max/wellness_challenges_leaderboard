/**
 * js/leaderboard.js
 * Leaderboard rendering, multi-column sorting, search, anomaly detection inspection,
 * podium showcase, and participant detail modal.
 */

(function () {
  'use strict';

  function initLeaderboardPage() {
    const tableBody = document.getElementById('leaderboard-table-body');
    const searchInput = document.getElementById('leaderboard-search-input');
    const sortBySelect = document.getElementById('leaderboard-sort-select');
    const filterSelect = document.getElementById('leaderboard-filter-select');
    const emptyState = document.getElementById('leaderboard-empty-state');
    const podiumContainer = document.getElementById('leaderboard-podium-container');
    const currentUserRankBanner = document.getElementById('current-user-rank-banner');

    // Participant Modal Elements
    const modal = document.getElementById('participant-detail-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalAvatar = document.getElementById('modal-participant-avatar');
    const modalName = document.getElementById('modal-participant-name');
    const modalCity = document.getElementById('modal-participant-city');
    const modalScore = document.getElementById('modal-participant-score');
    const modalBreakdown = document.getElementById('modal-score-breakdown');
    const modalAnomalyAlert = document.getElementById('modal-anomaly-report');
    const modalActivitiesList = document.getElementById('modal-activities-list');

    let currentSort = 'score'; // 'score' | 'steps' | 'activeMinutes' | 'challenges'

    function getCombinedLeaderboardData() {
      const syntheticParticipants = window.WellnessData ? window.WellnessData.sampleParticipants : [];
      const userProfile = window.WellnessStorage ? window.WellnessStorage.getUserProfile() : {};
      const userActivities = window.WellnessStorage ? window.WellnessStorage.getActivities() : [];
      const userEnrollments = window.WellnessStorage ? window.WellnessStorage.getEnrollments() : [];

      // 1. Calculate score for current user dynamically
      const userScoreObj = window.WellnessScoring ?
        window.WellnessScoring.computeCurrentUserScore(userActivities, userEnrollments, userProfile) :
        { totalScore: 2150, totalSteps: 66800, totalActiveMinutes: 308, completedChallengesCount: 2 };

      // Convert user's activities to 7-day format for uniform anomaly checking & modal display
      const userDayMap = window.WellnessScoring ? window.WellnessScoring.aggregateActivitiesByDay(userActivities) : {};
      const userDailyActivities = [];
      for (let i = 6; i >= 0; i--) {
        const dStr = window.WellnessData.getDateString(i);
        const dayM = userDayMap[dStr] || { steps: 0, activeMinutes: 0, water: 0, sleep: 0 };
        userDailyActivities.push({
          date: dStr,
          steps: dayM.steps,
          activeMinutes: dayM.activeMinutes,
          water: dayM.water,
          sleep: dayM.sleep
        });
      }

      const currentUserItem = {
        id: userProfile.id || 'user_alex_01',
        name: userProfile.name || 'Alex Rivera',
        avatar: userProfile.avatar || 'AR',
        city: 'Austin, TX',
        isCurrentUser: true,
        streakDays: userScoreObj.streakDays || 7,
        completedChallenges: userScoreObj.completedChallengesCount || 2,
        score: userScoreObj.totalScore,
        steps: userScoreObj.totalSteps,
        activeMinutes: userScoreObj.totalActiveMinutes,
        scoreDetails: userScoreObj,
        dailyActivities: userDailyActivities
      };

      // 2. Compute scores for synthetic participants
      const participantsList = syntheticParticipants.map(part => {
        const scoreObj = window.WellnessScoring ?
          window.WellnessScoring.computeParticipantScore(part) :
          { totalScore: 1500, totalSteps: 50000, totalActiveMinutes: 200, challengeBonus: 500, streakBonus: 100, activityScore: 900 };

        return {
          id: part.id,
          name: part.name,
          avatar: part.avatar,
          city: part.city,
          isCurrentUser: false,
          streakDays: part.streakDays || 0,
          completedChallenges: part.completedChallenges || 0,
          score: scoreObj.totalScore,
          steps: scoreObj.totalSteps,
          activeMinutes: scoreObj.totalActiveMinutes,
          scoreDetails: scoreObj,
          dailyActivities: part.dailyActivities || []
        };
      });

      // Combine current user with synthetic list
      const combined = [currentUserItem, ...participantsList];

      // Run Anomaly Detection for each participant
      combined.forEach(p => {
        p.anomalyReport = window.WellnessAnomaly ?
          window.WellnessAnomaly.inspectParticipantActivities(p) :
          { isAnomaly: false, status: 'Normal', badgeClass: 'badge-normal', reasons: [] };
      });

      return combined;
    }

    function render() {
      const allParticipants = getCombinedLeaderboardData();

      // Sort
      const sorted = [...allParticipants].sort((a, b) => {
        if (currentSort === 'steps') {
          if (b.steps !== a.steps) return b.steps - a.steps;
        } else if (currentSort === 'activeMinutes') {
          if (b.activeMinutes !== a.activeMinutes) return b.activeMinutes - a.activeMinutes;
        } else if (currentSort === 'challenges') {
          if (b.completedChallenges !== a.completedChallenges) return b.completedChallenges - a.completedChallenges;
        }
        // Default or secondary: Score tie-breaker
        return window.WellnessScoring ? window.WellnessScoring.compareParticipants(a, b) : b.score - a.score;
      });

      // Assign true ranks (1-indexed)
      sorted.forEach((p, index) => {
        p.rank = index + 1;
      });

      // Filter and Search
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const filterVal = filterSelect ? filterSelect.value : 'all';

      let displayList = sorted.filter(p => {
        if (query && !p.name.toLowerCase().includes(query) && !p.city.toLowerCase().includes(query)) {
          return false;
        }
        if (filterVal === 'anomalies' && !p.anomalyReport.isAnomaly) {
          return false;
        }
        if (filterVal === 'clean' && p.anomalyReport.isAnomaly) {
          return false;
        }
        if (filterVal === 'top10' && p.rank > 10) {
          return false;
        }
        return true;
      });

      // Render Current User Quick Banner
      const currentUser = sorted.find(p => p.isCurrentUser);
      if (currentUserRankBanner && currentUser) {
        currentUserRankBanner.innerHTML = `
          <div class="user-rank-banner-content">
            <div class="banner-left">
              <span class="banner-rank-badge">#${currentUser.rank}</span>
              <div>
                <strong>${currentUser.name} (You)</strong>
                <span class="text-muted" style="font-size:12px; margin-left:8px;">${currentUser.city}</span>
              </div>
            </div>
            <div class="banner-right">
              <div class="banner-stat"><strong>${currentUser.score.toLocaleString()}</strong> pts</div>
              <div class="banner-stat"><strong>${currentUser.steps.toLocaleString()}</strong> steps</div>
              <div class="banner-stat"><strong>${currentUser.activeMinutes}</strong> mins</div>
              <button type="button" class="btn btn-outline btn-sm btn-inspect-self" data-id="${currentUser.id}">View Breakdown</button>
            </div>
          </div>
        `;
        const inspectSelfBtn = currentUserRankBanner.querySelector('.btn-inspect-self');
        if (inspectSelfBtn) {
          inspectSelfBtn.addEventListener('click', () => openParticipantModal(currentUser));
        }
      }

      // Render Top 3 Podium Showcase
      if (podiumContainer) {
        const top3 = sorted.slice(0, 3);
        if (top3.length >= 3) {
          // Podium order: Silver (#2, left), Gold (#1, center), Bronze (#3, right)
          const p1 = top3[0];
          const p2 = top3[1];
          const p3 = top3[2];

          podiumContainer.innerHTML = `
            <!-- Silver (#2) -->
            <div class="podium-step step-silver" data-id="${p2.id}">
              <div class="podium-avatar-box">
                <span class="podium-medal">🥈</span>
                <div class="avatar avatar-md">${p2.avatar}</div>
              </div>
              <h4 class="podium-name">${p2.name} ${p2.isCurrentUser ? '(You)' : ''}</h4>
              <span class="podium-score">${p2.score.toLocaleString()} pts</span>
              <span class="podium-sub">${p2.steps.toLocaleString()} steps</span>
              <div class="podium-pillar pillar-2">#2</div>
            </div>

            <!-- Gold (#1) -->
            <div class="podium-step step-gold" data-id="${p1.id}">
              <div class="podium-avatar-box">
                <span class="podium-crown">👑</span>
                <span class="podium-medal">🥇</span>
                <div class="avatar avatar-lg">${p1.avatar}</div>
              </div>
              <h4 class="podium-name">${p1.name} ${p1.isCurrentUser ? '(You)' : ''}</h4>
              <span class="podium-score">${p1.score.toLocaleString()} pts</span>
              <span class="podium-sub">${p1.steps.toLocaleString()} steps</span>
              <div class="podium-pillar pillar-1">#1</div>
            </div>

            <!-- Bronze (#3) -->
            <div class="podium-step step-bronze" data-id="${p3.id}">
              <div class="podium-avatar-box">
                <span class="podium-medal">🥉</span>
                <div class="avatar avatar-md">${p3.avatar}</div>
              </div>
              <h4 class="podium-name">${p3.name} ${p3.isCurrentUser ? '(You)' : ''}</h4>
              <span class="podium-score">${p3.score.toLocaleString()} pts</span>
              <span class="podium-sub">${p3.steps.toLocaleString()} steps</span>
              <div class="podium-pillar pillar-3">#3</div>
            </div>
          `;

          podiumContainer.querySelectorAll('.podium-step').forEach(step => {
            step.addEventListener('click', (e) => {
              const id = e.currentTarget.getAttribute('data-id');
              const found = sorted.find(p => p.id === id);
              if (found) openParticipantModal(found);
            });
          });
        }
      }

      // Render Leaderboard Table Rows
      if (tableBody) {
        if (displayList.length === 0) {
          tableBody.innerHTML = '';
          if (emptyState) emptyState.style.display = 'block';
        } else {
          if (emptyState) emptyState.style.display = 'none';

          tableBody.innerHTML = displayList.map(p => {
            let rankDisplay = `#${p.rank}`;
            let rankClass = '';
            if (p.rank === 1) { rankDisplay = '🥇 1'; rankClass = 'rank-gold'; }
            else if (p.rank === 2) { rankDisplay = '🥈 2'; rankClass = 'rank-silver'; }
            else if (p.rank === 3) { rankDisplay = '🥉 3'; rankClass = 'rank-bronze'; }

            return `
              <tr class="leaderboard-row ${p.isCurrentUser ? 'row-current-user' : ''}" data-id="${p.id}" tabindex="0">
                <td class="col-rank">
                  <span class="rank-badge ${rankClass}">${rankDisplay}</span>
                </td>
                <td class="col-participant">
                  <div class="participant-cell">
                    <div class="avatar ${p.isCurrentUser ? 'avatar-user' : ''}">${p.avatar}</div>
                    <div class="participant-meta">
                      <div class="participant-name">
                        ${p.name} ${p.isCurrentUser ? '<span class="badge badge-you">You</span>' : ''}
                      </div>
                      <div class="participant-city">${p.city} • 🔥 ${p.streakDays}d streak</div>
                    </div>
                  </div>
                </td>
                <td class="col-score">
                  <strong>${p.score.toLocaleString()}</strong>
                  <span class="text-muted" style="font-size:11px;">pts</span>
                </td>
                <td class="col-steps">${p.steps.toLocaleString()}</td>
                <td class="col-active">${p.activeMinutes} mins</td>
                <td class="col-challenges">
                  <span class="badge badge-outline">${p.completedChallenges} completed</span>
                </td>
                <td class="col-status">
                  <span
                    class="badge ${p.anomalyReport.badgeClass} clickable-badge"
                    data-id="${p.id}"
                    title="Click to inspect activity & anomaly details"
                    style="cursor:pointer;"
                  >
                    ${p.anomalyReport.status}
                    ${p.anomalyReport.isAnomaly ? ' ℹ️' : ' ✓'}
                  </span>
                </td>
              </tr>
            `;
          }).join('');

          // Row click to inspect participant
          tableBody.querySelectorAll('.leaderboard-row').forEach(row => {
            row.addEventListener('click', (e) => {
              const id = e.currentTarget.getAttribute('data-id');
              const found = sorted.find(p => p.id === id);
              if (found) openParticipantModal(found);
            });
          });
        }
      }
    }

    // Modal open handler
    function openParticipantModal(participant) {
      if (!modal) return;

      if (modalAvatar) modalAvatar.textContent = participant.avatar;
      if (modalName) modalName.textContent = participant.name + (participant.isCurrentUser ? ' (You)' : '');
      if (modalCity) modalCity.textContent = `${participant.city} • Rank #${participant.rank} • ${participant.streakDays}-day streak`;
      if (modalScore) modalScore.textContent = `${participant.score.toLocaleString()} pts`;

      // Score Breakdown
      if (modalBreakdown && participant.scoreDetails) {
        const sd = participant.scoreDetails;
        modalBreakdown.innerHTML = `
          <div class="breakdown-grid">
            <div class="breakdown-item">
              <span class="bd-label">Activity Points</span>
              <span class="bd-val">+${sd.activityScore.toLocaleString()}</span>
            </div>
            <div class="breakdown-item">
              <span class="bd-label">Challenge Bonus (${participant.completedChallenges} × 250)</span>
              <span class="bd-val text-emerald">+${sd.challengeBonus.toLocaleString()}</span>
            </div>
            <div class="breakdown-item">
              <span class="bd-label">Streak Bonus (${participant.streakDays}d × 25)</span>
              <span class="bd-val text-teal">+${sd.streakBonus.toLocaleString()}</span>
            </div>
            <div class="breakdown-item breakdown-total">
              <span class="bd-label"><strong>Total Verified Score</strong></span>
              <span class="bd-val"><strong>${participant.score.toLocaleString()} pts</strong></span>
            </div>
          </div>
        `;
      }

      // Anomaly Report
      if (modalAnomalyAlert) {
        const ar = participant.anomalyReport;
        if (ar && ar.isAnomaly) {
          modalAnomalyAlert.className = `anomaly-detail-card anomaly-${ar.severity}`;
          modalAnomalyAlert.innerHTML = `
            <div class="anomaly-header">
              <span class="anomaly-badge ${ar.badgeClass}">${ar.status}</span>
              <span class="anomaly-severity">Severity: <strong>${ar.severity.toUpperCase()}</strong></span>
            </div>
            <h5 style="margin: 8px 0 4px;">Heuristic Warnings Detected:</h5>
            <ul class="anomaly-reasons-list">
              ${ar.reasons.map(r => `<li>${r}</li>`).join('')}
            </ul>
            <p class="anomaly-disclaimer">${ar.disclaimer}</p>
          `;
          modalAnomalyAlert.style.display = 'block';
        } else {
          modalAnomalyAlert.className = 'anomaly-detail-card anomaly-none';
          modalAnomalyAlert.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge badge-normal">✓ Clean Activity Pattern</span>
              <span style="font-size:12px; color:var(--text-secondary);">All 7-day metrics conform to realistic human thresholds.</span>
            </div>
          `;
          modalAnomalyAlert.style.display = 'block';
        }
      }

      // 7-Day Activities History Table
      if (modalActivitiesList) {
        modalActivitiesList.innerHTML = (participant.dailyActivities || []).map(d => `
          <div class="modal-day-row">
            <span class="day-date">${d.date}</span>
            <span class="day-metric"><strong>${(d.steps || 0).toLocaleString()}</strong> steps</span>
            <span class="day-metric"><strong>${d.activeMinutes || 0}</strong> mins active</span>
            <span class="day-metric"><strong>${d.water || 0}</strong> glasses</span>
            <span class="day-metric"><strong>${d.sleep || 0}</strong> hrs sleep</span>
          </div>
        `).join('');
      }

      modal.classList.add('modal-open');
    }

    function closeModal() {
      if (modal) modal.classList.remove('modal-open');
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Keyboard ESC to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('modal-open')) {
        closeModal();
      }
    });

    // Event listeners for sorting & filtering
    if (sortBySelect) {
      sortBySelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        render();
      });
    }

    if (filterSelect) {
      filterSelect.addEventListener('change', render);
    }

    if (searchInput) {
      searchInput.addEventListener('input', render);
    }

    window.addEventListener('wellness:storage-updated', render);
    render();
  }

  window.WellnessLeaderboard = {
    init: initLeaderboardPage
  };
})();
