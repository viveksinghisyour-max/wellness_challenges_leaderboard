import React, { useState, useEffect } from 'react';
import { User, MapPin, Target, Sparkles, X, Check } from 'lucide-react';
import Button from '../common/Button';

export default function ProfileModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile
}) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [avatarColor, setAvatarColor] = useState('emerald');
  const [stepGoal, setStepGoal] = useState(10000);
  const [activeGoal, setActiveGoal] = useState(45);
  const [waterGoal, setWaterGoal] = useState(8);
  const [sleepGoal, setSleepGoal] = useState(8);

  const colorOptions = [
    { id: 'emerald', label: 'Emerald', bg: 'from-emerald-600 to-teal-500' },
    { id: 'teal', label: 'Teal', bg: 'from-teal-600 to-cyan-500' },
    { id: 'indigo', label: 'Indigo', bg: 'from-indigo-600 to-purple-500' },
    { id: 'rose', label: 'Rose', bg: 'from-rose-500 to-pink-500' },
    { id: 'amber', label: 'Amber', bg: 'from-amber-500 to-orange-500' }
  ];

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setCity(userProfile.city || '');
      setBio(userProfile.bio || '');
      setAvatarColor(userProfile.avatarColor || 'emerald');
      setStepGoal(userProfile.stepGoal || 10000);
      setActiveGoal(userProfile.activeMinutesGoal || 45);
      setWaterGoal(userProfile.waterGoal || 8);
      setSleepGoal(userProfile.sleepGoal || 8);
    }
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  // Auto-generate initials
  const initials = (name.trim() || 'You')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const selectedGradient =
    colorOptions.find(c => c.id === avatarColor)?.bg || colorOptions[0].bg;

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = name.trim() || 'Visitor Participant';
    const updated = {
      ...userProfile,
      name: trimmedName,
      avatar: initials || 'VP',
      city: city.trim() || 'Community Member',
      bio: bio.trim(),
      avatarColor,
      stepGoal: Number(stepGoal) || 10000,
      activeMinutesGoal: Number(activeGoal) || 45,
      waterGoal: Number(waterGoal) || 8,
      sleepGoal: Number(sleepGoal) || 8
    };

    onSaveProfile(updated);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Participant Profile & Goals</h3>
              <p className="text-xs text-slate-500">Customize how you appear on the leaderboard & set your daily goals</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Live Avatar Preview Card */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedGradient} text-white font-extrabold text-lg flex items-center justify-center shadow-md flex-shrink-0`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 text-base truncate">
                {name.trim() || 'Your Name'}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                {city.trim() || 'Your Location'}
              </div>
            </div>
          </div>

          {/* Avatar Color Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Badge Color Theme
            </label>
            <div className="flex items-center gap-2">
              {colorOptions.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAvatarColor(c.id)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-tr ${c.bg} flex items-center justify-center text-white transition-transform ${
                    avatarColor === c.id ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110 shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.label}
                >
                  {avatarColor === c.id && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Participant Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera or your name"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City / Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Austin, TX"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Bio / Motivation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Personal Bio or Wellness Mantra
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Daily runner striving for consistency and mindfulness"
              maxLength={100}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Daily Goal Targets */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 mb-3">
              <Target className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Personal Daily Targets
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">Steps</span>
                <input
                  type="number"
                  value={stepGoal}
                  onChange={(e) => setStepGoal(e.target.value)}
                  min="1000"
                  step="500"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">Active Mins</span>
                <input
                  type="number"
                  value={activeGoal}
                  onChange={(e) => setActiveGoal(e.target.value)}
                  min="5"
                  step="5"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">Water (Glasses)</span>
                <input
                  type="number"
                  value={waterGoal}
                  onChange={(e) => setWaterGoal(e.target.value)}
                  min="1"
                  max="20"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">Sleep (Hours)</span>
                <input
                  type="number"
                  value={sleepGoal}
                  onChange={(e) => setSleepGoal(e.target.value)}
                  min="3"
                  max="14"
                  step="0.5"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" icon={Sparkles}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
