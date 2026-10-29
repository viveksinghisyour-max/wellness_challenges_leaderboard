/**
 * js/charts.js
 * Native SVG Circular Progress Rings and Interactive SVG Activity Charts.
 * Built with zero external dependencies, accessible SVG markup, and smooth CSS transitions.
 */

(function () {
  'use strict';

  /**
   * Reusable Animated Circular Progress Ring.
   * Uses SVG stroke-dasharray and stroke-dashoffset with CSS transitions.
   */
  function createProgressRing(container, options = {}) {
    if (!container) return null;

    const size = Number(options.size) || 120;
    const strokeWidth = Number(options.strokeWidth) || 10;
    const color = options.color || '#10b981';
    const secondaryColor = options.secondaryColor || '#e2e8f0';
    const id = options.id || 'ring_' + Math.floor(Math.random() * 10000);
    const label = options.label || 'Progress';
    const unit = options.unit || '';
    const initialValue = Math.max(0, Number(options.value) || 0);
    const initialGoal = Math.max(0.0001, Number(options.goal) || 1);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    const calcPercent = (val, g) => {
      const v = Math.max(0, Number(val) || 0);
      const safeGoal = Math.max(0.0001, Number(g) || 1);
      return Math.round((v / safeGoal) * 100);
    };

    const calcOffset = (pct) => {
      const clampedPct = Math.min(100, Math.max(0, pct));
      return circumference - (clampedPct / 100) * circumference;
    };

    const initialPercent = calcPercent(initialValue, initialGoal);
    const initialOffset = calcOffset(initialPercent);
    const isCompleted = initialPercent >= 100;

    container.innerHTML = `
      <div class="progress-ring-wrapper" id="${id}-wrapper" style="width:${size}px; height:${size}px; position:relative; margin:0 auto;">
        <svg
          class="progress-ring-svg"
          width="${size}"
          height="${size}"
          viewBox="0 0 ${size} ${size}"
          role="progressbar"
          aria-valuenow="${initialPercent}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="${label}: ${initialValue} ${unit} of ${initialGoal} ${unit}"
          style="transform: rotate(-90deg); display:block; overflow:visible;"
        >
          <!-- Background track -->
          <circle
            cx="${center}"
            cy="${center}"
            r="${radius}"
            fill="transparent"
            stroke="${secondaryColor}"
            stroke-width="${strokeWidth}"
            class="ring-track"
          />
          <!-- Animated Foreground Progress -->
          <circle
            cx="${center}"
            cy="${center}"
            r="${radius}"
            fill="transparent"
            stroke="${color}"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${circumference} ${circumference}"
            stroke-dashoffset="${initialOffset}"
            stroke-linecap="round"
            class="ring-progress-bar"
            style="transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease;"
          />
        </svg>
        <div class="progress-ring-inner" style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; pointer-events:none;">
          <span class="ring-percent-text" style="font-size:${Math.round(size * 0.2)}px; font-weight:700; color:var(--text-primary, #0f172a); line-height:1.1;">
            ${initialPercent}%
          </span>
          <span class="ring-value-text" style="font-size:${Math.round(size * 0.1)}px; color:var(--text-secondary, #64748b); margin-top:2px;">
            ${initialValue >= 1000 ? (initialValue / 1000).toFixed(1) + 'k' : initialValue} / ${initialGoal >= 1000 ? (initialGoal / 1000).toFixed(0) + 'k' : initialGoal} ${unit}
          </span>
        </div>
      </div>
    `;

    const svgElement = container.querySelector('svg');
    const circleProgress = container.querySelector('.ring-progress-bar');
    const percentText = container.querySelector('.ring-percent-text');
    const valueText = container.querySelector('.ring-value-text');

    return {
      update(newValue, newGoal) {
        const val = Math.max(0, Number(newValue) || 0);
        const g = Math.max(0.0001, Number(newGoal) || 1);
        const pct = calcPercent(val, g);
        const offset = calcOffset(pct);

        if (circleProgress) {
          circleProgress.style.strokeDashoffset = offset;
          if (pct >= 100) {
            circleProgress.setAttribute('stroke', '#059669'); // Emerald celebration
          } else {
            circleProgress.setAttribute('stroke', color);
          }
        }

        if (svgElement) {
          svgElement.setAttribute('aria-valuenow', pct);
          svgElement.setAttribute('aria-label', `${label}: ${val} ${unit} of ${g} ${unit}`);
        }

        if (percentText) {
          percentText.textContent = `${pct}%`;
        }

        if (valueText) {
          const displayVal = val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val;
          const displayGoal = g >= 1000 ? (g / 1000).toFixed(0) + 'k' : g;
          valueText.textContent = `${displayVal} / ${displayGoal} ${unit}`;
        }
      }
    };
  }

  /**
   * Renders an interactive native SVG Weekly Activity Bar Chart.
   * Supports metric switching (steps, active minutes, water, sleep),
   * goal reference line, hover tooltips, and bar entrance animations.
   */
  function renderWeeklyBarChart(container, dailyData, options = {}) {
    if (!container) return;

    const metric = options.metric || 'steps'; // 'steps' | 'activeMinutes' | 'water' | 'sleep'
    const metricLabel = options.metricLabel || 'Steps';
    const unit = options.unit || 'steps';
    const goal = options.goal || 10000;
    const barColor = options.barColor || '#10b981';
    const goalColor = options.goalColor || '#f59e0b';

    // Ensure 7 days array
    const days = (dailyData && dailyData.length >= 7) ? dailyData.slice(-7) : (dailyData || []);

    const width = 640;
    const height = 240;
    const padding = { top: 25, right: 30, bottom: 45, left: 55 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Calculate maximum value for Y scale
    const values = days.map(d => Number(d[metric]) || 0);
    const maxVal = Math.max(goal * 1.2, ...values, 10);
    const yStep = maxVal / 4;

    const barWidth = Math.min(38, Math.floor(chartW / (days.length * 1.8)));
    const colSpacing = chartW / days.length;

    // Build SVG strings
    let svgContent = `
      <svg
        viewBox="0 0 ${width} ${height}"
        preserveAspectRatio="xMidYMid meet"
        class="activity-chart-svg"
        role="img"
        aria-label="7-Day Activity Chart for ${metricLabel}"
        style="width:100%; height:auto; display:block; overflow:visible;"
      >
        <defs>
          <linearGradient id="barGradient-${metric}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${barColor}" stop-opacity="1" />
            <stop offset="100%" stop-color="${barColor}" stop-opacity="0.65" />
          </linearGradient>
          <filter id="barShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.08" />
          </filter>
        </defs>

        <!-- Horizontal Grid Lines & Y Axis Labels -->
    `;

    for (let i = 0; i <= 4; i++) {
      const yVal = Math.round(i * yStep);
      const yPos = padding.top + chartH - (i * (chartH / 4));
      const formattedLabel = yVal >= 1000 ? (yVal / 1000).toFixed(yVal % 1000 === 0 ? 0 : 1) + 'k' : yVal;

      svgContent += `
        <line
          x1="${padding.left}"
          y1="${yPos}"
          x2="${width - padding.right}"
          y2="${yPos}"
          stroke="var(--border-light, #e2e8f0)"
          stroke-dasharray="${i === 0 ? 'none' : '3 3'}"
          stroke-width="1"
        />
        <text
          x="${padding.left - 10}"
          y="${yPos + 4}"
          text-anchor="end"
          font-size="11"
          fill="var(--text-muted, #94a3b8)"
          font-family="inherit"
        >
          ${formattedLabel}
        </text>
      `;
    }

    // Goal Reference Line
    if (goal > 0 && goal <= maxVal) {
      const goalY = padding.top + chartH - ((goal / maxVal) * chartH);
      svgContent += `
        <line
          x1="${padding.left}"
          y1="${goalY}"
          x2="${width - padding.right}"
          y2="${goalY}"
          stroke="${goalColor}"
          stroke-dasharray="5 4"
          stroke-width="1.5"
          opacity="0.85"
        />
        <text
          x="${width - padding.right}"
          y="${goalY - 6}"
          text-anchor="end"
          font-size="10"
          font-weight="600"
          fill="${goalColor}"
          font-family="inherit"
        >
          Target: ${goal.toLocaleString()} ${unit}
        </text>
      `;
    }

    // Bars & X-Axis Day Labels
    days.forEach((day, idx) => {
      const val = Number(day[metric]) || 0;
      const barH = Math.max(3, (val / maxVal) * chartH);
      const xPos = padding.left + (idx * colSpacing) + (colSpacing - barWidth) / 2;
      const yPos = padding.top + chartH - barH;

      // Extract day abbreviation from ISO date
      const dateObj = new Date(day.date + 'T00:00:00');
      const dayName = isNaN(dateObj) ? `D${idx + 1}` : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = isNaN(dateObj) ? '' : dateObj.getDate();
      const isToday = idx === days.length - 1;

      svgContent += `
        <!-- Bar Group with accessible tooltip interaction -->
        <g class="chart-bar-group" data-val="${val}" data-date="${day.date}" data-metric="${metricLabel}" tabindex="0" role="graphics-symbol" aria-label="${dayName} ${dayNum}: ${val.toLocaleString()} ${unit}">
          <!-- Full height hover hit-area -->
          <rect
            x="${xPos - 4}"
            y="${padding.top}"
            width="${barWidth + 8}"
            height="${chartH}"
            fill="transparent"
            class="chart-hit-area"
            style="cursor: pointer;"
          />
          <!-- The visual bar -->
          <rect
            x="${xPos}"
            y="${yPos}"
            width="${barWidth}"
            height="${barH}"
            rx="6"
            ry="6"
            fill="url(#barGradient-${metric})"
            class="chart-bar ${isToday ? 'chart-bar-today' : ''}"
            style="transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: bottom;"
          />
          <!-- Day label -->
          <text
            x="${xPos + barWidth / 2}"
            y="${padding.top + chartH + 18}"
            text-anchor="middle"
            font-size="11"
            font-weight="${isToday ? '700' : '500'}"
            fill="${isToday ? 'var(--primary-dark, #065f46)' : 'var(--text-secondary, #64748b)'}"
            font-family="inherit"
          >
            ${dayName}
          </text>
          <text
            x="${xPos + barWidth / 2}"
            y="${padding.top + chartH + 32}"
            text-anchor="middle"
            font-size="10"
            fill="var(--text-muted, #94a3b8)"
            font-family="inherit"
          >
            ${dayNum}
          </text>
        </g>
      `;
    });

    svgContent += `</svg>`;

    container.innerHTML = `
      <div class="chart-wrapper-inner" style="position:relative;">
        <div class="chart-tooltip" id="chart-dynamic-tooltip" style="display:none; position:absolute; pointer-events:none; background:var(--surface-dark, #0f172a); color:#fff; font-size:12px; padding:6px 10px; border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.15); z-index:20; white-space:nowrap; transform:translate(-50%, -100%); margin-top:-8px;">
        </div>
        ${svgContent}
      </div>
    `;

    // Attach interactive hover tooltips
    const tooltip = container.querySelector('#chart-dynamic-tooltip');
    const barGroups = container.querySelectorAll('.chart-bar-group');

    barGroups.forEach(group => {
      const showTooltip = (e) => {
        const val = Number(group.getAttribute('data-val')).toLocaleString();
        const date = group.getAttribute('data-date');
        const metricName = group.getAttribute('data-metric');
        const barRect = group.querySelector('.chart-bar').getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        tooltip.innerHTML = `<strong>${metricName}:</strong> ${val} ${unit}<br><span style="opacity:0.75; font-size:10px;">${date}</span>`;
        tooltip.style.display = 'block';
        tooltip.style.left = `${(barRect.left + barRect.width / 2) - containerRect.left}px`;
        tooltip.style.top = `${barRect.top - containerRect.top}px`;

        const bar = group.querySelector('.chart-bar');
        if (bar) bar.style.filter = 'brightness(1.15)';
      };

      const hideTooltip = () => {
        tooltip.style.display = 'none';
        const bar = group.querySelector('.chart-bar');
        if (bar) bar.style.filter = 'none';
      };

      group.addEventListener('mouseenter', showTooltip);
      group.addEventListener('mouseleave', hideTooltip);
      group.addEventListener('focus', showTooltip);
      group.addEventListener('blur', hideTooltip);
    });
  }

  window.WellnessCharts = {
    createProgressRing,
    renderWeeklyBarChart
  };
})();
