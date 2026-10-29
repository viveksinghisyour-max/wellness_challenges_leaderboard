import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertTriangle, Save, X } from 'lucide-react';
import Button from '../common/Button';
import { ACTIVITY_UNITS, validateActivityInput } from '../../utils/validation';
import { inspectIndividualRecord } from '../../utils/anomalyDetection';
import { getTodayDateString } from '../../utils/progress';

export default function ActivityForm({
  onSubmit,
  editingRecord = null,
  onCancelEdit
}) {
  const [type, setType] = useState('steps');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [anomalyWarning, setAnomalyWarning] = useState(null);

  useEffect(() => {
    if (editingRecord) {
      setType(editingRecord.type);
      setValue(editingRecord.value);
      setDate(editingRecord.date);
      setNotes(editingRecord.notes || '');
    } else {
      setType('steps');
      setValue('');
      setDate(getTodayDateString());
      setNotes('');
      setErrors({});
      setAnomalyWarning(null);
    }
  }, [editingRecord]);

  // Real-time anomaly inspection
  useEffect(() => {
    if (value && Number(value) > 0) {
      const check = inspectIndividualRecord(type, Number(value));
      if (check.hasWarning) {
        setAnomalyWarning(check.warnings.join(' '));
      } else {
        setAnomalyWarning(null);
      }
    } else {
      setAnomalyWarning(null);
    }
  }, [type, value]);

  function handleSubmit(e) {
    e.preventDefault();

    const validation = validateActivityInput(type, value, date);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit({
      id: editingRecord ? editingRecord.id : `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      value: Number(value),
      unit: ACTIVITY_UNITS[type] || 'units',
      date,
      notes: notes.trim(),
      source: 'manual',
      createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString()
    });

    if (!editingRecord) {
      setValue('');
      setNotes('');
      setAnomalyWarning(null);
    }
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">
            {editingRecord ? 'Edit Activity Record' : 'Log Daily Activity'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {editingRecord ? 'Modify the selected activity milestone' : 'Add your steps, active workout, hydration, or sleep'}
          </p>
        </div>
        {editingRecord && (
          <Button variant="ghost" size="sm" onClick={onCancelEdit} icon={X}>
            Cancel
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Activity Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Activity Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="steps">Steps (steps)</option>
              <option value="active-minutes">Active Cardio (minutes)</option>
              <option value="water">Hydration (glasses of water)</option>
              <option value="sleep">Rest & Sleep (hours)</option>
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Activity Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {errors.date && <p className="text-xs text-rose-600 mt-1">{errors.date}</p>}
          </div>
        </div>

        {/* Value Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Logged Value ({ACTIVITY_UNITS[type] || 'units'})
          </label>
          <div className="relative">
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 8500"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
              {ACTIVITY_UNITS[type]}
            </span>
          </div>
          {errors.value && <p className="text-xs text-rose-600 mt-1">{errors.value}</p>}
        </div>

        {/* Real-Time Heuristic Anomaly Warning */}
        {anomalyWarning && (
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Statistical Warning: </span>
              {anomalyWarning}
              <div className="text-[11px] text-amber-700 mt-0.5">
                This record will be flagged under Anomaly Detection for review.
              </div>
            </div>
          </div>
        )}

        {/* Notes Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Workout Notes / Description (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Morning jog, campus stair walk, post-workout hydration..."
            maxLength={120}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end gap-2.5">
          {editingRecord && (
            <Button variant="secondary" size="md" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={editingRecord ? Save : PlusCircle}
          >
            {editingRecord ? 'Save Changes' : 'Log Activity'}
          </Button>
        </div>
      </form>
    </div>
  );
}
