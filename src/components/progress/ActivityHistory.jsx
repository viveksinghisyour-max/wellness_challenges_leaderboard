import React from 'react';
import {
  Footprints,
  Flame,
  Droplet,
  Moon,
  Edit2,
  Trash2,
  Calendar,
  ClipboardList
} from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function ActivityHistory({
  activities = [],
  onEdit,
  onDelete
}) {
  const iconMap = {
    steps: Footprints,
    'active-minutes': Flame,
    water: Droplet,
    sleep: Moon
  };

  const labelMap = {
    steps: 'Steps',
    'active-minutes': 'Active Cardio',
    water: 'Hydration',
    sleep: 'Sleep Rest'
  };

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No Activity Records Yet"
        description="Log your daily steps, cardio workout, water, or sleep using the form to track progress and see trends."
      />
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Activity Log History</h3>
          <p className="text-xs text-slate-500 mt-0.5">Chronological record of user-logged measurements</p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {activities.length} {activities.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Notes</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activities.map(record => {
              const Icon = iconMap[record.type] || Footprints;
              const dateObj = new Date(record.date + 'T00:00:00');
              const formattedDate = isNaN(dateObj.getTime())
                ? record.date
                : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-700 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formattedDate}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      <Icon className="w-3.5 h-3.5 text-emerald-600" />
                      {labelMap[record.type] || record.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="font-bold text-slate-900">
                      {Number(record.value).toLocaleString()}
                    </span>{' '}
                    <span className="text-xs text-slate-500">{record.unit}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 text-xs max-w-xs truncate">
                    {record.notes ? record.notes : <span className="text-slate-400 italic">No notes</span>}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(record)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Entry"
                        aria-label="Edit Entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(record.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Entry"
                        aria-label="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
