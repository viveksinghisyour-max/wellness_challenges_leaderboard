/**
 * js/challenges.js
 * Challenge Catalogue, Filtering, Search, and Enrollment Management.
 */

(function () {
  'use strict';

  function initChallengesPage() {
    const searchInput = document.getElementById('challenge-search-input');
    const categorySelect = document.getElementById('challenge-category-filter');
    const statusSelect = document.getElementById('challenge-status-filter');
    const difficultySelect = document.getElementById('challenge-difficulty-filter');
    const container = document.getElementById('challenges-grid-container');
    const activeCountBadge = document.getElementById('active-enrolled-count');
    const emptyState = document.getElementById('challenges-empty-state');

    if (!container) return;

    function render() {
      const allChallenges = window.WellnessData ? window.WellnessData.initialChallenges : [];
      const enrollments = window.WellnessStorage ? window.WellnessStorage.getEnrollments() : [];
      const userActivities = window.WellnessStorage ? window.WellnessStorage.getActivities() : [];
      const dayMap = window.WellnessScoring ? window.WellnessScoring.aggregateActivitiesByDay(userActivities) : {};

      // Filter values
      const searchQuery = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const categoryFilter = categorySelect ? categorySelect.value : 'all';
      const statusFilter = statusSelect ? statusSelect.value : 'all';
      const difficultyFilter = difficultySelect ? difficultySelect.value : 'all';

      // Update enrolled counter badge
      if (activeCountBadge) {
        activeCountBadge.textContent = enrollments.length;
      }

      // Filter challenges
      const filtered = allChallenges.filter(ch => {
        const isEnrolled = enrollments.some(e => e.challengeId === ch.id);

        if (searchQuery && !ch.name.toLowerCase().includes(searchQuery) && !ch.description.toLowerCase().includes(searchQuery)) {
          return false;
        }
        if (categoryFilter !== 'all' && ch.category.toLowerCase() !== categoryFilter.toLowerCase()) {
          return false;
        }
        if (difficultyFilter !== 'all' && ch.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
          return false;
        }
        if (statusFilter === 'enrolled' && !isEnrolled) return false;
        if (statusFilter === 'available' && isEnrolled) return false;

        return true;
      });

      if (filtered.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
      } else {
        if (emptyState) emptyState.style.display = 'none';
      }

      // Compute today's user totals for challenge progress
      const today = new Date().toISOString().split('T')[0];
      const todayMetrics = dayMap[today] || { steps: 0, activeMinutes: 0, water: 0, sleep: 0 };

      // Compute 7-day totals for weekly challenges
      let weeklySteps = 0;
      let weeklyActiveMins = 0;
      Object.values(dayMap).forEach(d => {
        weeklySteps += (d.steps || 0);
        weeklyActiveMins += (d.activeMinutes || 0);
      });

      container.innerHTML = filtered.map(ch => {
        const enrolledObj = enrollments.find(e => e.challengeId === ch.id);
        const isEnrolled = !!enrolledObj;

        // Calculate progress for this challenge
        let currentProgress = 0;
        let target = ch.target;

        if (ch.id === 'daily-steps' || ch.id === 'ten-k-steps') {
          currentProgress = todayMetrics.steps;
        } else if (ch.id === 'weekly-walking') {
          currentProgress = weeklySteps;
        } else if (ch.id === 'active-minutes' || ch.id === 'core-power') {
          currentProgress = todayMetrics.activeMinutes;
        } else if (ch.id === 'hydration-habit' || ch.id === 'mindful-hydration') {
          currentProgress = todayMetrics.water;
        } else if (ch.id === 'sleep-routine') {
          currentProgress = todayMetrics.sleep;
        } else if (ch.id === 'weekend-movement') {
          currentProgress = Math.min(ch.target, weeklyActiveMins);
        } else if (ch.id === 'wellness-streak') {
          currentProgress = window.WellnessStorage.getUserProfile().streakDays || 7;
        }

        const percent = Math.min(100, Math.round((currentProgress / target) * 100));
        const isGoalMet = percent >= 100;

        // Difficulty badge color
        let diffColor = 'badge-diff-easy';
        if (ch.difficulty === 'Medium') diffColor = 'badge-diff-medium';
        if (ch.difficulty === 'Hard') diffColor = 'badge-diff-hard';

        return `
          <div class="card challenge-card ${isEnrolled ? 'challenge-card-enrolled' : ''}" data-id="${ch.id}">
            <div class="challenge-card-header">
              <div class="challenge-badges-row">
                <span class="badge ${diffColor}">${ch.difficulty}</span>
                <span class="badge badge-outline">${ch.category}</span>
                <span class="badge badge-duration">${ch.duration}</span>
              </div>
              <span class="challenge-status-pill ${isEnrolled ? 'status-enrolled' : 'status-available'}">
                ${isEnrolled ? (isGoalMet ? '✓ Goal Met' : '● Active') : 'Available'}
              </span>
            </div>

            <div class="challenge-card-body">
              <h3 class="challenge-title">${ch.name}</h3>
              <p class="challenge-desc">${ch.description}</p>

              <div class="challenge-metrics-meta">
                <div class="metric-meta-item">
                  <span class="meta-label">Target Goal</span>
                  <span class="meta-val">${ch.target.toLocaleString()} ${ch.unit}</span>
                </div>
                <div class="metric-meta-item">
                  <span class="meta-label">Reward</span>
                  <span class="meta-val text-emerald">+${ch.pointsReward} pts</span>
                </div>
                <div class="metric-meta-item">
                  <span class="meta-label">Participants</span>
                  <span class="meta-val">${(ch.participantsCount + (isEnrolled ? 1 : 0)).toLocaleString()}</span>
                </div>
              </div>

              ${isEnrolled ? `
                <div class="challenge-progress-box">
                  <div class="progress-box-header">
                    <span>Your Progress</span>
                    <strong>${currentProgress.toLocaleString()} / ${target.toLocaleString()} ${ch.unit} (${percent}%)</strong>
                  </div>
                  <div class="progress-bar-track">
                    <div class="progress-bar-fill ${isGoalMet ? 'fill-completed' : ''}" style="width: ${percent}%;"></div>
                  </div>
                </div>
              ` : ''}
            </div>

            <div class="challenge-card-footer">
              ${isEnrolled ? `
                <button
                  type="button"
                  class="btn btn-outline btn-sm btn-leave-challenge"
                  data-id="${ch.id}"
                  data-name="${ch.name}"
                  aria-label="Leave ${ch.name}"
                >
                  Leave Challenge
                </button>
              ` : `
                <button
                  type="button"
                  class="btn btn-primary btn-sm btn-join-challenge"
                  data-id="${ch.id}"
                  data-name="${ch.name}"
                  aria-label="Join ${ch.name}"
                >
                  Join Challenge
                </button>
              `}
            </div>
          </div>
        `;
      }).join('');

      // Attach button event listeners
      container.querySelectorAll('.btn-join-challenge').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const name = e.currentTarget.getAttribute('data-name');
          const res = window.WellnessStorage.enrollChallenge(id);
          if (res.success) {
            window.WellnessApp.showToast(`Joined "${name}"! Let's crush this goal! 🎯`, 'success');
            render();
          } else {
            window.WellnessApp.showToast(res.message, 'warning');
          }
        });
      });

      container.querySelectorAll('.btn-leave-challenge').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const name = e.currentTarget.getAttribute('data-name');
          if (confirm(`Are you sure you want to leave the "${name}" challenge?`)) {
            const res = window.WellnessStorage.unenrollChallenge(id);
            if (res.success) {
              window.WellnessApp.showToast(`Left "${name}".`, 'info');
              render();
            }
          }
        });
      });
    }

    // Attach search and filter listeners with debounce
    if (searchInput) {
      searchInput.addEventListener('input', render);
    }
    if (categorySelect) {
      categorySelect.addEventListener('change', render);
    }
    if (statusSelect) {
      statusSelect.addEventListener('change', render);
    }
    if (difficultySelect) {
      difficultySelect.addEventListener('change', render);
    }

    // Listen to storage update event
    window.addEventListener('wellness:storage-updated', render);

    // Initial render
    render();
  }

  window.WellnessChallenges = {
    init: initChallengesPage
  };
})();
