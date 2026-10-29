/**
 * js/progress.js
 * My Progress Tracking: Log activities, edit/delete entries, view 7-day interactive chart,
 * and track enrolled challenge progress.
 */

(function () {
  'use strict';

  function initProgressPage() {
    const activityForm = document.getElementById('activity-log-form');
    const typeSelect = document.getElementById('activity-type-select');
    const valueInput = document.getElementById('activity-value-input');
    const unitDisplay = document.getElementById('activity-unit-display');
    const dateInput = document.getElementById('activity-date-input');
    const notesInput = document.getElementById('activity-notes-input');
    const formSubmitBtn = document.getElementById('activity-submit-btn');
    const formCancelEditBtn = document.getElementById('activity-cancel-edit-btn');
    const editingRecordId = document.getElementById('editing-record-id');
    const formAnomalyAlert = document.getElementById('form-anomaly-warning');

    const chartContainer = document.getElementById('progress-chart-container');
    const metricFilterBtns = document.querySelectorAll('.chart-metric-btn');
    const recentTableBody = document.getElementById('recent-activities-table-body');
    const emptyState = document.getElementById('activities-empty-state');
    const enrolledGoalsContainer = document.getElementById('enrolled-goals-progress-grid');

    // Stats elements
    const statAvgSteps = document.getElementById('stat-avg-steps');
    const statTotalActive = document.getElementById('stat-total-active');
    const statTotalWater = document.getElementById('stat-total-water');
    const statAvgSleep = document.getElementById('stat-avg-sleep');

    let currentChartMetric = 'steps';

    // Unit map helper
    const UNIT_MAP = {
      'steps': 'steps',
      'active-minutes': 'minutes',
      'water': 'glasses',
      'sleep': 'hours'
    };

    // Set today's date as default
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Dynamic unit update when activity type changes
    if (typeSelect && unitDisplay) {
      typeSelect.addEventListener('change', () => {
        const unit = UNIT_MAP[typeSelect.value] || 'units';
        unitDisplay.textContent = unit;
        validateValueInput();
      });
    }

    // Anomaly warning check on value input change
    function validateValueInput() {
      if (!valueInput || !typeSelect || !formAnomalyAlert) return;
      const type = typeSelect.value;
      const val = Number(valueInput.value);

      if (val > 0 && window.WellnessAnomaly) {
        const check = window.WellnessAnomaly.inspectIndividualRecord(type, val);
        if (check.hasWarning) {
          formAnomalyAlert.innerHTML = `
            <strong>Notice:</strong> ${check.warnings.join(' ')}
            <br><span style="font-size:11px; opacity:0.85;">This will be flagged for review on the leaderboard.</span>
          `;
          formAnomalyAlert.style.display = 'block';
        } else {
          formAnomalyAlert.style.display = 'none';
        }
      } else {
        formAnomalyAlert.style.display = 'none';
      }
    }

    if (valueInput) {
      valueInput.addEventListener('input', validateValueInput);
    }

    // Renders the entire progress page
    function render() {
      const activities = window.WellnessStorage ? window.WellnessStorage.getActivities() : [];
      const enrollments = window.WellnessStorage ? window.WellnessStorage.getEnrollments() : [];
      const challenges = window.WellnessData ? window.WellnessData.initialChallenges : [];
      const dayMap = window.WellnessScoring ? window.WellnessScoring.aggregateActivitiesByDay(activities) : {};

      // 1. Calculate Summary Stats for the last 7 days
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const dateStr = window.WellnessData ? window.WellnessData.getDateString(i) : '';
        const dayMetrics = dayMap[dateStr] || { steps: 0, activeMinutes: 0, water: 0, sleep: 0 };
        last7Days.push({
          date: dateStr,
          steps: dayMetrics.steps,
          activeMinutes: dayMetrics.activeMinutes,
          water: dayMetrics.water,
          sleep: dayMetrics.sleep
        });
      }

      let sumSteps = 0;
      let sumActive = 0;
      let sumWater = 0;
      let sumSleep = 0;
      let sleepCount = 0;

      last7Days.forEach(d => {
        sumSteps += d.steps;
        sumActive += d.activeMinutes;
        sumWater += d.water;
        if (d.sleep > 0) {
          sumSleep += d.sleep;
          sleepCount++;
        }
      });

      const avgSteps = Math.round(sumSteps / 7);
      const avgSleep = sleepCount > 0 ? (sumSleep / sleepCount).toFixed(1) : '0.0';

      if (statAvgSteps) statAvgSteps.textContent = avgSteps.toLocaleString();
      if (statTotalActive) statTotalActive.textContent = `${sumActive.toLocaleString()} mins`;
      if (statTotalWater) statTotalWater.textContent = `${sumWater} glasses`;
      if (statAvgSleep) statAvgSleep.textContent = `${avgSleep} hrs`;

      // 2. Render Enrolled Challenges Progress Cards
      if (enrolledGoalsContainer) {
        const enrolledChallenges = challenges.filter(c => enrollments.some(e => e.challengeId === c.id));
        if (enrolledChallenges.length === 0) {
          enrolledGoalsContainer.innerHTML = `
            <div class="empty-state-small" style="grid-column: 1 / -1; padding: 20px; text-align: center; background: var(--surface-subtle); border-radius: 8px;">
              <p style="margin: 0 0 10px; color: var(--text-secondary);">You have not joined any challenges yet.</p>
              <a href="challenges.html" class="btn btn-primary btn-sm">Explore Challenges</a>
            </div>
          `;
        } else {
          // Today's metrics
          const today = new Date().toISOString().split('T')[0];
          const todayMetrics = dayMap[today] || { steps: 0, activeMinutes: 0, water: 0, sleep: 0 };

          enrolledGoalsContainer.innerHTML = enrolledChallenges.map(ch => {
            let current = 0;
            if (ch.id === 'daily-steps' || ch.id === 'ten-k-steps') current = todayMetrics.steps;
            else if (ch.id === 'weekly-walking') current = sumSteps;
            else if (ch.id === 'active-minutes' || ch.id === 'core-power') current = todayMetrics.activeMinutes;
            else if (ch.id === 'hydration-habit' || ch.id === 'mindful-hydration') current = todayMetrics.water;
            else if (ch.id === 'sleep-routine') current = todayMetrics.sleep;
            else if (ch.id === 'weekend-movement') current = Math.min(ch.target, sumActive);
            else if (ch.id === 'wellness-streak') current = window.WellnessStorage.getUserProfile().streakDays || 7;

            const pct = Math.min(100, Math.round((current / ch.target) * 100));
            const isDone = pct >= 100;

            return `
              <div class="goal-progress-card">
                <div class="goal-progress-header">
                  <span class="goal-title">${ch.name}</span>
                  <span class="goal-pct ${isDone ? 'text-emerald' : ''}">${pct}%</span>
                </div>
                <div class="progress-bar-track" style="margin: 8px 0;">
                  <div class="progress-bar-fill ${isDone ? 'fill-completed' : ''}" style="width: ${pct}%;"></div>
                </div>
                <div class="goal-progress-footer">
                  <span>${current.toLocaleString()} / ${ch.target.toLocaleString()} ${ch.unit}</span>
                  <span>${isDone ? '✓ Completed' : `${ch.duration}`}</span>
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // 3. Render 7-Day Chart
      if (chartContainer && window.WellnessCharts) {
        let metricConfig = {
          steps: { label: 'Daily Steps', unit: 'steps', goal: 10000, barColor: '#10b981', goalColor: '#f59e0b' },
          activeMinutes: { label: 'Active Time', unit: 'mins', goal: 45, barColor: '#06b6d4', goalColor: '#f59e0b' },
          water: { label: 'Hydration', unit: 'glasses', goal: 8, barColor: '#0ea5e9', goalColor: '#10b981' },
          sleep: { label: 'Sleep Rest', unit: 'hours', goal: 8, barColor: '#8b5cf6', goalColor: '#10b981' }
        };
        const config = metricConfig[currentChartMetric] || metricConfig.steps;
        window.WellnessCharts.renderWeeklyBarChart(chartContainer, last7Days, {
          metric: currentChartMetric,
          metricLabel: config.label,
          unit: config.unit,
          goal: config.goal,
          barColor: config.barColor,
          goalColor: config.goalColor
        });
      }

      // 4. Render Recent Activities Table
      if (recentTableBody) {
        if (activities.length === 0) {
          recentTableBody.innerHTML = '';
          if (emptyState) emptyState.style.display = 'block';
        } else {
          if (emptyState) emptyState.style.display = 'none';

          recentTableBody.innerHTML = activities.slice(0, 20).map(act => {
            const dateObj = new Date(act.date + 'T00:00:00');
            const dateLabel = isNaN(dateObj) ? act.date : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            let icon = '🏃';
            let typeLabel = 'Steps';
            if (act.type === 'active-minutes') { icon = '🔥'; typeLabel = 'Active Time'; }
            if (act.type === 'water') { icon = '💧'; typeLabel = 'Hydration'; }
            if (act.type === 'sleep') { icon = '🌙'; typeLabel = 'Sleep'; }

            return `
              <tr data-id="${act.id}">
                <td>${dateLabel}</td>
                <td>
                  <span class="activity-type-pill">
                    <span class="type-icon">${icon}</span>
                    <span class="type-name">${typeLabel}</span>
                  </span>
                </td>
                <td><strong>${Number(act.value).toLocaleString()}</strong> <span class="text-muted">${act.unit}</span></td>
                <td><span class="activity-notes-text">${act.notes ? escapeHtml(act.notes) : '<em class="text-muted">No notes</em>'}</span></td>
                <td class="text-right">
                  <div class="table-actions">
                    <button
                      type="button"
                      class="btn-icon btn-edit-activity"
                      data-id="${act.id}"
                      title="Edit Entry"
                      aria-label="Edit Entry"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button
                      type="button"
                      class="btn-icon btn-delete-activity text-danger"
                      data-id="${act.id}"
                      title="Delete Entry"
                      aria-label="Delete Entry"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join('');

          // Attach edit handlers
          recentTableBody.querySelectorAll('.btn-edit-activity').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const id = e.currentTarget.getAttribute('data-id');
              startEditActivity(id);
            });
          });

          // Attach delete handlers
          recentTableBody.querySelectorAll('.btn-delete-activity').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const id = e.currentTarget.getAttribute('data-id');
              if (confirm('Are you sure you want to delete this activity record?')) {
                const deleted = window.WellnessStorage.deleteActivity(id);
                if (deleted) {
                  window.WellnessApp.showToast('Activity record deleted.', 'info');
                }
              }
            });
          });
        }
      }
    }

    // Helper to escape HTML safely
    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Edit activity mode
    function startEditActivity(id) {
      const activities = window.WellnessStorage.getActivities();
      const record = activities.find(a => a.id === id);
      if (!record) return;

      if (editingRecordId) editingRecordId.value = record.id;
      if (typeSelect) typeSelect.value = record.type;
      if (unitDisplay) unitDisplay.textContent = record.unit;
      if (valueInput) valueInput.value = record.value;
      if (dateInput) dateInput.value = record.date;
      if (notesInput) notesInput.value = record.notes || '';

      if (formSubmitBtn) formSubmitBtn.textContent = 'Save Changes';
      if (formCancelEditBtn) formCancelEditBtn.style.display = 'inline-flex';

      validateValueInput();

      // Scroll smoothly to form
      activityForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function cancelEdit() {
      if (editingRecordId) editingRecordId.value = '';
      if (activityForm) activityForm.reset();
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
      if (unitDisplay && typeSelect) unitDisplay.textContent = UNIT_MAP[typeSelect.value] || 'steps';
      if (formSubmitBtn) formSubmitBtn.textContent = 'Log Activity';
      if (formCancelEditBtn) formCancelEditBtn.style.display = 'none';
      if (formAnomalyAlert) formAnomalyAlert.style.display = 'none';
    }

    if (formCancelEditBtn) {
      formCancelEditBtn.addEventListener('click', cancelEdit);
    }

    // Handle Form Submit (Add or Edit)
    if (activityForm) {
      activityForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = typeSelect ? typeSelect.value : 'steps';
        const rawVal = valueInput ? valueInput.value.trim() : '';
        const date = dateInput ? dateInput.value : '';
        const notes = notesInput ? notesInput.value.trim() : '';
        const isEdit = editingRecordId && editingRecordId.value;

        // Validation
        const numVal = Number(rawVal);
        if (isNaN(numVal) || numVal <= 0) {
          window.WellnessApp.showToast('Please enter a valid positive number for activity value.', 'error');
          if (valueInput) valueInput.focus();
          return;
        }

        if (!date) {
          window.WellnessApp.showToast('Please select a valid date.', 'error');
          if (dateInput) dateInput.focus();
          return;
        }

        const unit = UNIT_MAP[type] || 'units';

        if (isEdit) {
          window.WellnessStorage.updateActivity(editingRecordId.value, {
            type,
            value: numVal,
            unit,
            date,
            notes
          });
          window.WellnessApp.showToast('Activity record updated successfully! ✨', 'success');
          cancelEdit();
        } else {
          window.WellnessStorage.addActivity({
            type,
            value: numVal,
            unit,
            date,
            notes
          });
          window.WellnessApp.showToast(`Logged ${numVal.toLocaleString()} ${unit} of ${type}! 🚀`, 'success');
          activityForm.reset();
          if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
          if (unitDisplay) unitDisplay.textContent = UNIT_MAP[typeSelect.value] || 'steps';
          if (formAnomalyAlert) formAnomalyAlert.style.display = 'none';
        }
      });
    }

    // Chart metric tab buttons
    metricFilterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        metricFilterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentChartMetric = e.currentTarget.getAttribute('data-metric');
        render();
      });
    });

    window.addEventListener('wellness:storage-updated', render);
    render();
  }

  window.WellnessProgress = {
    init: initProgressPage
  };
})();
