import React, { useState } from 'react';
import {
  Footprints,
  Flame,
  Droplet,
  Moon,
  Target,
  Trophy
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/dashboard/StatCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import ActivityForm from '../components/progress/ActivityForm';
import ActivityHistory from '../components/progress/ActivityHistory';

export default function MyProgress({
  activities = [],
  summaryStats,
  enrolledChallengesWithProgress = [],
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onNavigateToChallenges
}) {
  const [editingRecord, setEditingRecord] = useState(null);
  const { avgSteps, totalActive, totalWater, avgSleep, last7Days } = summaryStats;

  function handleFormSubmit(record) {
    if (editingRecord) {
      onUpdateActivity(record);
      setEditingRecord(null);
    } else {
      onAddActivity(record);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Personal Activity & Progress Tracker"
        subtitle="Log your daily workouts, steps, hydration, and sleep. All entries instantly update your charts, enrolled challenge progress, and leaderboard standings."
        actions={
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
            {activities.length} Logged Entries
          </span>
        }
      />

      {/* 7-Day Summary Cards */}
      <section aria-label="7-Day Summary Performance">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Footprints}
            title="7-Day Avg Steps"
            value={avgSteps.toLocaleString()}
            unit="steps/day"
            subtitle="Rolling 7-day average"
            color="text-emerald-600 bg-emerald-50"
          />
          <StatCard
            icon={Flame}
            title="Total Active Cardio"
            value={totalActive.toLocaleString()}
            unit="mins"
            subtitle="Exercise duration this week"
            color="text-teal-600 bg-teal-50"
          />
          <StatCard
            icon={Droplet}
            title="Total Hydration"
            value={totalWater}
            unit="glasses"
            subtitle="Water consumption"
            color="text-sky-600 bg-sky-50"
          />
          <StatCard
            icon={Moon}
            title="Avg Nightly Rest"
            value={avgSleep}
            unit="hrs/night"
            subtitle="Recovery duration"
            color="text-purple-600 bg-purple-50"
          />
        </div>
      </section>

      {/* Enrolled Challenge Milestones Grid */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Enrolled Challenge Milestones</h3>
              <p className="text-xs text-slate-500 mt-0.5">Progress tracked against your active challenges</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToChallenges}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            Manage Challenges &rarr;
          </button>
        </div>

        {enrolledChallengesWithProgress.length === 0 ? (
          <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Trophy className="w-7 h-7 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 mb-2">No challenges joined yet.</p>
            <button
              type="button"
              onClick={onNavigateToChallenges}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Browse Catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {enrolledChallengesWithProgress.map(item => {
              const { challenge, progress } = item;
              return (
                <div
                  key={challenge.id}
                  className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl"
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800 truncate">{challenge.name}</span>
                    <span className="text-emerald-700">{progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mb-2">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{progress.current.toLocaleString()} / {challenge.target.toLocaleString()} {challenge.unit}</span>
                    <span>{progress.isCompleted ? '✓ Met' : challenge.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Two-Column Grid: Form & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <ActivityForm
            onSubmit={handleFormSubmit}
            editingRecord={editingRecord}
            onCancelEdit={() => setEditingRecord(null)}
          />
        </div>

        <div className="lg:col-span-7">
          <ActivityChart data={last7Days} />
        </div>
      </div>

      {/* Recent Activity Records Table */}
      <ActivityHistory
        activities={activities}
        onEdit={(record) => {
          setEditingRecord(record);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onDelete={onDeleteActivity}
      />
    </div>
  );
}
