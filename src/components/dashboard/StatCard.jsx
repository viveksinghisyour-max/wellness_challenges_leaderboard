import React from 'react';

export default function StatCard({
  icon: Icon,
  title,
  value,
  unit = '',
  subtitle,
  color = 'text-emerald-600 bg-emerald-50'
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3.5 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">{title}</span>
          <div className="text-2xl font-black text-slate-900 leading-tight">
            {value} <span className="text-xs font-semibold text-slate-400">{unit}</span>
          </div>
        </div>
      </div>
      {subtitle && (
        <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
          {subtitle}
        </div>
      )}
    </div>
  );
}
