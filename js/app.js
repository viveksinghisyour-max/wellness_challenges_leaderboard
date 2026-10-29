/**
 * js/app.js
 * Global Application Controller: Navigation, Toasts, Modals, Quick Log,
 * Reset Data dialog, and Dashboard (index.html) integration.
 */

(function () {
  'use strict';

  // Global Toast Notification System
  function showToast(message, type = 'info', duration = 3500) {
    let toastContainer = document.getElementById('wellness-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'wellness-toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button type="button" class="toast-close" aria-label="Dismiss">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Fade in animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });

    const closeToast = () => {
      toast.classList.remove('toast-show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', closeToast);
    setTimeout(closeToast, duration);
  }

  // Global Navigation Setup
  function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('nav-link-active');
      } else {
        link.classList.remove('nav-link-active');
      }
    });

    // Mobile Hamburger Menu
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('main-nav-menu');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        const isExpanded = navMenu.classList.toggle('nav-menu-open');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
      });
    }

    // Reset Demo Data Trigger & Confirmation Modal
    const resetBtns = document.querySelectorAll('.btn-reset-demo-data');
    const resetModal = document.getElementById('reset-confirm-modal');
    const resetConfirmBtn = document.getElementById('confirm-reset-action-btn');
    const resetCancelBtn = document.getElementById('cancel-reset-action-btn');

    resetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (resetModal) {
          resetModal.classList.add('modal-open');
        } else {
          if (confirm('Reset all demo data back to initial state? Custom activities and enrollments will be re-seeded.')) {
            window.WellnessStorage.resetToDefaults();
            showToast('All demo data has been reset to defaults! 🔄', 'success');
          }
        }
      });
    });

    if (resetConfirmBtn && resetModal) {
      resetConfirmBtn.addEventListener('click', () => {
        window.WellnessStorage.resetToDefaults();
        resetModal.classList.remove('modal-open');
        showToast('All demo data has been reset to defaults! 🔄', 'success');
      });
    }

    if (resetCancelBtn && resetModal) {
      resetCancelBtn.addEventListener('click', () => {
        resetModal.classList.remove('modal-open');
      });
    }

    // Quick Log Modal
    const quickLogModal = document.getElementById('quick-log-modal');
    const quickLogBtns = document.querySelectorAll('.btn-open-quick-log');
    const quickLogCloseBtn = document.getElementById('quick-log-close-btn');
    const quickLogForm = document.getElementById('quick-log-form');

    if (quickLogBtns && quickLogModal) {
      quickLogBtns.forEach(b => {
        b.addEventListener('click', () => {
          quickLogModal.classList.add('modal-open');
        });
      });
    }

    if (quickLogCloseBtn && quickLogModal) {
      quickLogCloseBtn.addEventListener('click', () => {
        quickLogModal.classList.remove('modal-open');
      });
    }

    if (quickLogForm) {
      quickLogForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const typeSelect = document.getElementById('quick-log-type');
        const valInput = document.getElementById('quick-log-value');
        const type = typeSelect ? typeSelect.value : 'steps';
        const val = Number(valInput ? valInput.value : 0);

        if (isNaN(val) || val <= 0) {
          showToast('Please enter a valid positive number.', 'error');
          return;
        }

        const unitMap = { 'steps': 'steps', 'active-minutes': 'minutes', 'water': 'glasses', 'sleep': 'hours' };
        window.WellnessStorage.addActivity({
          type,
          value: val,
          unit: unitMap[type] || 'units',
          date: new Date().toISOString().split('T')[0],
          notes: 'Quick logged via top bar'
        });

        quickLogModal.classList.remove('modal-open');
        quickLogForm.reset();
        showToast(`Quick logged ${val.toLocaleString()} ${unitMap[type]}! 🚀`, 'success');
      });
    }
  }

  // Dashboard Page Initialization (index.html)
  function initDashboardPage() {
    const greetingElement = document.getElementById('dashboard-greeting');
    const summarySteps = document.getElementById('dashboard-summary-steps');
    const summaryActive = document.getElementById('dashboard-summary-active');
    const summaryCalories = document.getElementById('dashboard-summary-calories');
    const summaryScore = document.getElementById('dashboard-summary-score');
    const streakBadge = document.getElementById('dashboard-streak-count');

    // Progress rings containers
    const ringStepsContainer = document.getElementById('ring-container-steps');
    const ringActiveContainer = document.getElementById('ring-container-active');
    const ringWaterContainer = document.getElementById('ring-container-water');
    const ringSleepContainer = document.getElementById('ring-container-sleep');

    // Weekly chart container
    const weeklyChartContainer = document.getElementById('dashboard-weekly-chart');

    // Active challenges list container
    const activeChallengesContainer = document.getElementById('dashboard-active-challenges-list');

    // Recent activity list
    const recentActivitiesContainer = document.getElementById('dashboard-recent-activities-list');

    // Top 5 leaderboard container
    const topLeaderboardContainer = document.getElementById('dashboard-top-leaderboard-list');

    let ringSteps = null;
    let ringActive = null;
    let ringWater = null;
    let ringSleep = null;

    function renderDashboard() {
      const userProfile = window.WellnessStorage.getUserProfile();
      const activities = window.WellnessStorage.getActivities();
      const enrollments = window.WellnessStorage.getEnrollments();
      const allChallenges = window.WellnessData.initialChallenges;
      const dayMap = window.WellnessScoring.aggregateActivitiesByDay(activities);

      // Greeting with time-of-day
      if (greetingElement) {
        const hour = new Date().getHours();
        let timeGreeting = 'Good morning';
        if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
        if (hour >= 17) timeGreeting = 'Good evening';

        greetingElement.textContent = `${timeGreeting}, ${userProfile.name}! 🌟`;
      }

      if (streakBadge) {
        streakBadge.textContent = `${userProfile.streakDays || 7} Days`;
      }

      // Today's metrics
      const today = new Date().toISOString().split('T')[0];
      const todayMetrics = dayMap[today] || { steps: 0, activeMinutes: 0, water: 0, sleep: 0 };

      // Compute estimated calories (~0.045 kcal/step + ~7.5 kcal/active min)
      const estimatedCalories = Math.round((todayMetrics.steps * 0.045) + (todayMetrics.activeMinutes * 7.5));

      // Compute current user score
      const userScoreObj = window.WellnessScoring.computeCurrentUserScore(activities, enrollments, userProfile);

      if (summarySteps) summarySteps.textContent = todayMetrics.steps.toLocaleString();
      if (summaryActive) summaryActive.textContent = `${todayMetrics.activeMinutes}m`;
      if (summaryCalories) summaryCalories.textContent = `${estimatedCalories.toLocaleString()} kcal`;
      if (summaryScore) summaryScore.textContent = `${userScoreObj.totalScore.toLocaleString()} pts`;

      // Render or Update 4 Circular Progress Rings
      if (window.WellnessCharts) {
        // 1. Steps Ring (goal 10,000)
        if (ringStepsContainer) {
          if (!ringSteps) {
            ringSteps = window.WellnessCharts.createProgressRing(ringStepsContainer, {
              size: 115,
              strokeWidth: 9,
              color: '#10b981', // emerald
              label: 'Steps Goal',
              unit: 'steps',
              value: todayMetrics.steps,
              goal: 10000
            });
          } else {
            ringSteps.update(todayMetrics.steps, 10000);
          }
        }

        // 2. Active Minutes Ring (goal 45)
        if (ringActiveContainer) {
          if (!ringActive) {
            ringActive = window.WellnessCharts.createProgressRing(ringActiveContainer, {
              size: 115,
              strokeWidth: 9,
              color: '#06b6d4', // teal/cyan
              label: 'Active Minutes',
              unit: 'mins',
              value: todayMetrics.activeMinutes,
              goal: 45
            });
          } else {
            ringActive.update(todayMetrics.activeMinutes, 45);
          }
        }

        // 3. Hydration Ring (goal 8 glasses)
        if (ringWaterContainer) {
          if (!ringWater) {
            ringWater = window.WellnessCharts.createProgressRing(ringWaterContainer, {
              size: 115,
              strokeWidth: 9,
              color: '#3b82f6', // blue
              label: 'Hydration',
              unit: 'glasses',
              value: todayMetrics.water,
              goal: 8
            });
          } else {
            ringWater.update(todayMetrics.water, 8);
          }
        }

        // 4. Sleep Rest Ring (goal 8 hours)
        if (ringSleepContainer) {
          if (!ringSleep) {
            ringSleep = window.WellnessCharts.createProgressRing(ringSleepContainer, {
              size: 115,
              strokeWidth: 9,
              color: '#8b5cf6', // purple
              label: 'Sleep Rest',
              unit: 'hrs',
              value: todayMetrics.sleep,
              goal: 8
            });
          } else {
            ringSleep.update(todayMetrics.sleep, 8);
          }
        }
      }

      // Render Weekly Activity Bar Chart
      if (weeklyChartContainer && window.WellnessCharts) {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const dStr = window.WellnessData.getDateString(i);
          const dayM = dayMap[dStr] || { steps: 0, activeMinutes: 0, water: 0, sleep: 0 };
          last7Days.push({
            date: dStr,
            steps: dayM.steps,
            activeMinutes: dayM.activeMinutes,
            water: dayM.water,
            sleep: dayM.sleep
          });
        }

        window.WellnessCharts.renderWeeklyBarChart(weeklyChartContainer, last7Days, {
          metric: 'steps',
          metricLabel: 'Daily Steps',
          unit: 'steps',
          goal: 10000,
          barColor: '#10b981',
          goalColor: '#f59e0b'
        });
      }

      // Render Active Challenges Preview
      if (activeChallengesContainer) {
        const enrolledChallenges = allChallenges.filter(ch => enrollments.some(e => e.challengeId === ch.id));

        if (enrolledChallenges.length === 0) {
          activeChallengesContainer.innerHTML = `
            <div class="empty-state-card">
              <p>No active challenges yet. Join a challenge to boost your wellness!</p>
              <a href="challenges.html" class="btn btn-primary btn-sm">Explore Challenges</a>
            </div>
          `;
        } else {
          // Compute 7-day steps for weekly walking
          let weeklySteps = 0;
          Object.values(dayMap).forEach(d => { weeklySteps += d.steps; });

          activeChallengesContainer.innerHTML = enrolledChallenges.slice(0, 4).map(ch => {
            let current = todayMetrics.steps;
            if (ch.id === 'weekly-walking') current = weeklySteps;
            else if (ch.id === 'active-minutes' || ch.id === 'core-power') current = todayMetrics.activeMinutes;
            else if (ch.id === 'hydration-habit') current = todayMetrics.water;
            else if (ch.id === 'sleep-routine') current = todayMetrics.sleep;
            else if (ch.id === 'wellness-streak') current = userProfile.streakDays || 7;

            const pct = Math.min(100, Math.round((current / ch.target) * 100));

            return `
              <div class="dashboard-challenge-item">
                <div class="dash-ch-info">
                  <div class="dash-ch-title">${ch.name}</div>
                  <div class="dash-ch-meta">${current.toLocaleString()} / ${ch.target.toLocaleString()} ${ch.unit}</div>
                </div>
                <div class="dash-ch-progress">
                  <div class="progress-bar-track">
                    <div class="progress-bar-fill ${pct >= 100 ? 'fill-completed' : ''}" style="width: ${pct}%;"></div>
                  </div>
                  <span class="dash-ch-pct">${pct}%</span>
                </div>
              </div>
            `;
          }).join('') + `
            <div class="dashboard-section-cta">
              <a href="challenges.html" class="link-emerald">View All Challenges (${enrollments.length} active) &rarr;</a>
            </div>
          `;
        }
      }

      // Render Recent Activity History Preview
      if (recentActivitiesContainer) {
        if (activities.length === 0) {
          recentActivitiesContainer.innerHTML = `
            <div class="empty-state-card">
              <p>No logged activities yet.</p>
              <a href="progress.html" class="btn btn-primary btn-sm">Log First Activity</a>
            </div>
          `;
        } else {
          recentActivitiesContainer.innerHTML = activities.slice(0, 5).map(act => {
            let icon = '🏃';
            if (act.type === 'active-minutes') icon = '🔥';
            if (act.type === 'water') icon = '💧';
            if (act.type === 'sleep') icon = '🌙';

            const dateObj = new Date(act.date + 'T00:00:00');
            const dateStr = isNaN(dateObj) ? act.date : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return `
              <div class="recent-act-item">
                <div class="recent-act-icon">${icon}</div>
                <div class="recent-act-body">
                  <div class="recent-act-name">${Number(act.value).toLocaleString()} ${act.unit}</div>
                  <div class="recent-act-notes">${act.notes || 'Activity entry'}</div>
                </div>
                <div class="recent-act-date">${dateStr}</div>
              </div>
            `;
          }).join('') + `
            <div class="dashboard-section-cta">
              <a href="progress.html" class="link-emerald">View Complete Activity History &rarr;</a>
            </div>
          `;
        }
      }

      // Render Top 5 Leaderboard Preview
      if (topLeaderboardContainer) {
        const synthetic = window.WellnessData.sampleParticipants;
        // Current user participant item
        const currentUserItem = {
          id: userProfile.id,
          name: userProfile.name,
          avatar: userProfile.avatar,
          city: 'Austin, TX',
          isCurrentUser: true,
          score: userScoreObj.totalScore,
          steps: userScoreObj.totalSteps,
          activeMinutes: userScoreObj.totalActiveMinutes,
          completedChallenges: userScoreObj.completedChallengesCount
        };

        const all = [currentUserItem, ...synthetic.map(p => {
          const s = window.WellnessScoring.computeParticipantScore(p);
          return {
            id: p.id,
            name: p.name,
            avatar: p.avatar,
            city: p.city,
            isCurrentUser: false,
            score: s.totalScore,
            steps: s.totalSteps,
            activeMinutes: s.totalActiveMinutes,
            completedChallenges: p.completedChallenges
          };
        })];

        all.sort((a, b) => window.WellnessScoring.compareParticipants(a, b));

        topLeaderboardContainer.innerHTML = all.slice(0, 5).map((p, idx) => {
          let rankSymbol = `#${idx + 1}`;
          if (idx === 0) rankSymbol = '🥇';
          if (idx === 1) rankSymbol = '🥈';
          if (idx === 2) rankSymbol = '🥉';

          return `
            <div class="top-leaderboard-row ${p.isCurrentUser ? 'row-user-highlight' : ''}">
              <span class="leader-rank">${rankSymbol}</span>
              <div class="avatar avatar-sm ${p.isCurrentUser ? 'avatar-user' : ''}">${p.avatar}</div>
              <div class="leader-info">
                <strong>${p.name} ${p.isCurrentUser ? '(You)' : ''}</strong>
                <span class="text-muted" style="font-size:11px;">${p.steps.toLocaleString()} steps</span>
              </div>
              <div class="leader-score">${p.score.toLocaleString()} pts</div>
            </div>
          `;
        }).join('') + `
          <div class="dashboard-section-cta">
            <a href="leaderboard.html" class="link-emerald">Explore Full Leaderboard (22+ Competitors) &rarr;</a>
          </div>
        `;
      }
    }

    window.addEventListener('wellness:storage-updated', renderDashboard);
    renderDashboard();
  }

  // Auto-dispatch initialization on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();

    // Check current page
    const pathname = window.location.pathname;
    if (pathname.endsWith('index.html') || pathname.endsWith('/') || !pathname.includes('.html')) {
      if (document.getElementById('dashboard-greeting')) {
        initDashboardPage();
      }
    }
    if (pathname.endsWith('challenges.html') && window.WellnessChallenges) {
      window.WellnessChallenges.init();
    }
    if (pathname.endsWith('progress.html') && window.WellnessProgress) {
      window.WellnessProgress.init();
    }
    if (pathname.endsWith('leaderboard.html') && window.WellnessLeaderboard) {
      window.WellnessLeaderboard.init();
    }
  });

  window.WellnessApp = {
    showToast,
    initNavigation,
    initDashboardPage
  };
})();
