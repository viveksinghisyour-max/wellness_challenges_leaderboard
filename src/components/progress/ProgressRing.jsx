import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressRing({
  size = 120,
  strokeWidth = 10,
  value = 0,
  goal = 100,
  unit = '',
  label = 'Goal',
  color = '#059669', // Emerald
  trackColor = '#e2e8f0',
  className = ''
}) {
  const safeGoal = Math.max(0.0001, Number(goal) || 1);
  const safeValue = Math.max(0, Number(value) || 0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.round((safeValue / safeGoal) * 100);
  const clampedPercentage = Math.min(100, percentage);
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  const isCompleted = percentage >= 100;
  const displayColor = isCompleted ? '#059669' : color;

  const formattedVal = safeValue >= 1000 ? (safeValue / 1000).toFixed(safeValue % 1000 === 0 ? 0 : 1) + 'k' : safeValue;
  const formattedGoal = safeGoal >= 1000 ? (safeGoal / 1000).toFixed(0) + 'k' : safeGoal;

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${safeValue} of ${safeGoal} ${unit}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 block overflow-visible"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Foreground Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={displayColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none p-1">
        <span className="text-lg font-black text-slate-900 leading-tight">
          {percentage}%
        </span>
        <span className="text-[11px] font-medium text-slate-500 mt-0.5">
          {formattedVal} / {formattedGoal} {unit}
        </span>
      </div>
    </div>
  );
}
