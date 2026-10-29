import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export default function ActivityChart({ data = [] }) {
  const [metric, setMetric] = useState('steps');

  const configs = {
    steps: {
      label: 'Steps',
      unit: 'steps',
      goal: 10000,
      color: '#059669', // Emerald
      dataKey: 'steps'
    },
    activeMinutes: {
      label: 'Active Minutes',
      unit: 'mins',
      goal: 45,
      color: '#0d9488', // Teal
      dataKey: 'activeMinutes'
    },
    water: {
      label: 'Hydration',
      unit: 'glasses',
      goal: 8,
      color: '#0284c7', // Sky Blue
      dataKey: 'water'
    },
    sleep: {
      label: 'Sleep Rest',
      unit: 'hours',
      goal: 8,
      color: '#7c3aed', // Purple
      dataKey: 'sleep'
    }
  };

  const currentConfig = configs[metric] || configs.steps;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-slate-700 pointer-events-none">
          <div className="font-bold text-emerald-400">{label} ({item.payload.date})</div>
          <div className="mt-1">
            {currentConfig.label}: <span className="font-bold">{item.value.toLocaleString()} {currentConfig.unit}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-bold text-slate-900 text-base">7-Day Activity Trend</h3>
          <p className="text-xs text-slate-500 mt-0.5">Daily logged performance vs your target baseline</p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {Object.keys(configs).map(key => {
            const conf = configs[key];
            const isActive = metric === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setMetric(key)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {conf.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="dayName"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={currentConfig.goal}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Bar
              dataKey={currentConfig.dataKey}
              fill={currentConfig.color}
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: currentConfig.color }}></span>
          <span>Logged {currentConfig.label}</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
          <span className="w-4 border-t-2 border-dashed border-amber-500"></span>
          <span>Target ({currentConfig.goal} {currentConfig.unit})</span>
        </div>
      </div>
    </div>
  );
}
