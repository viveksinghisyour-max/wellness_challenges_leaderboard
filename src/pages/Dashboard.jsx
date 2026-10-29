import React from 'react';
import {
  Footprints,
  Flame,
  Droplet,
  Moon,
  Trophy,
  Activity,
  Flame as BurnIcon,
  Award,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import ChallengePreview from '../components/dashboard/ChallengePreview';
import ProgressRing from '../components/progress/ProgressRing';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function Dashboard({
  userProfile,
  summaryStats,
  enrolledChallengesWithProgress = [],
  recentActivities = [],
  topLeaderboard = [],
  onNavigate,
  onOpenQuickLog
}) {
  const { today, burnedCalories, last7Days } = summaryStats;

  // Time-aware greeting
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  if (hour >= 17) greeting = 'Good evening';

  const completedCount = enrolledChallengesWithProgress.filter(
    item => item.progress.isCompleted
  ).length;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-900/10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-emerald-100 mb-3 border border-white/10">
            🔥 {userProfile?.streakDays || 0}-Day Wellness Streak Active
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
            {greeting}, {userProfile?.name || 'Alex'}! 🌟
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Track your habits, crush your enrolled goals, and watch your progress update in real time.
          </p>

          <div className="flex items-center gap-3 mt-6 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              icon={PlusCircle}
              onClick={onOpenQuickLog}
              className="bg-white text-emerald-800 hover:bg-emerald-50 border-transparent font-bold shadow-sm"
            >
              Log Today's Activity
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('challenges')}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Browse Challenges &rarr;
            </Button>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute right-24 bottom-0 -mb-10 w-48 h-48 rounded-full bg-teal-400/10 pointer-events-none blur-xl" />
      </div>

      {/* 4 Circular Animated Progress Rings */}
      <section aria-labelledby="rings-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="rings-heading" className="text-lg font-bold text-slate-900">
            Today's Progress & Rings
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            Target Goals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Daily Steps */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col items-center text-center">
            <div className="flex items-center justify-between w-full mb-3 text-xs">
              <span className="font-bold text-slate-700">Daily Steps</span>
              <Badge variant="easy">Steps</Badge>
            </div>
            <ProgressRing
              size={115}
              strokeWidth={9}
              value={today.steps}
              goal={10000}
              unit="steps"
              label="Daily Steps"
              color="#059669"
            />
            <span className="text-xs text-slate-500 mt-3 font-medium">Target: 10,000 steps</span>
          </div>

          {/* 2. Active Cardio */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col items-center text-center">
            <div className="flex items-center justify-between w-full mb-3 text-xs">
              <span className="font-bold text-slate-700">Active Cardio</span>
              <Badge variant="teal">Activity</Badge>
            </div>
            <ProgressRing
              size={115}
              strokeWidth={9}
              value={today.activeMinutes}
              goal={45}
              unit="mins"
              label="Active Minutes"
              color="#0d9488"
            />
            <span className="text-xs text-slate-500 mt-3 font-medium">Target: 45 minutes</span>
          </div>

          {/* 3. Hydration */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col items-center text-center">
            <div className="flex items-center justify-between w-full mb-3 text-xs">
              <span className="font-bold text-slate-700">Hydration</span>
              <Badge variant="easy">Water</Badge>
            </div>
            <ProgressRing
              size={115}
              strokeWidth={9}
              value={today.water}
              goal={8}
              unit="glasses"
              label="Hydration"
              color="#0284c7"
            />
            <span className="text-xs text-slate-500 mt-3 font-medium">Target: 8 glasses (~2L)</span>
          </div>

          {/* 4. Sleep */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col items-center text-center">
            <div className="flex items-center justify-between w-full mb-3 text-xs">
              <span className="font-bold text-slate-700">Rest & Sleep</span>
              <Badge variant="medium">Rest</Badge>
            </div>
            <ProgressRing
              size={115}
              strokeWidth={9}
              value={today.sleep}
              goal={8.0}
              unit="hrs"
              label="Sleep Rest"
              color="#7c3aed"
            />
            <span className="text-xs text-slate-500 mt-3 font-medium">Target: 8.0 hours</span>
          </div>
        </div>
      </section>

      {/* KPI Cards Row */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Footprints}
            title="Today's Steps"
            value={today.steps.toLocaleString()}
            unit="steps"
            subtitle="Goal: 10,000"
            color="text-emerald-600 bg-emerald-50"
          />
          <StatCard
            icon={Flame}
            title="Active Cardio"
            value={today.activeMinutes}
            unit="mins"
            subtitle="Goal: 45m"
            color="text-teal-600 bg-teal-50"
          />
          <StatCard
            icon={BurnIcon}
            title="Burned Calories"
            value={burnedCalories.toLocaleString()}
            unit="kcal"
            subtitle="Estimated energy output"
            color="text-amber-600 bg-amber-50"
          />
          <StatCard
            icon={Trophy}
            title="Goals Met"
            value={completedCount}
            unit="challenges"
            subtitle={`${enrolledChallengesWithProgress.length} challenges active`}
            color="text-purple-600 bg-purple-50"
          />
        </div>
      </section>

      {/* 2-Column Grid: Recharts Trend & Enrolled Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart data={last7Days} />
        </div>
        <div>
          <ChallengePreview
            enrolledChallenges={enrolledChallengesWithProgress}
            onNavigateToChallenges={() => onNavigate('challenges')}
          />
        </div>
      </div>

      {/* Secondary 2-Column Grid: Recent Activities & Top Leaderboard Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Activity Records</h3>
              <p className="text-xs text-slate-500 mt-0.5">Latest measurements logged by you</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('progress')}
              className="text-emerald-700"
            >
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {recentActivities.length === 0 ? (
            <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 mb-2">No activity records logged yet.</p>
              <Button variant="primary" size="sm" onClick={onOpenQuickLog}>
                Log First Record
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.slice(0, 4).map(act => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center text-xs font-bold">
                      {act.type === 'steps' && '🏃'}
                      {act.type === 'active-minutes' && '🔥'}
                      {act.type === 'water' && '💧'}
                      {act.type === 'sleep' && '🌙'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {Number(act.value).toLocaleString()} {act.unit}
                      </div>
                      <div className="text-[11px] text-slate-400">{act.date}</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 max-w-[140px] truncate">
                    {act.notes || 'Logged'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Competitors Preview */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Leaderboard Standings</h3>
              <p className="text-xs text-slate-500 mt-0.5">Top performing wellness competitors</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('leaderboard')}
              className="text-emerald-700"
            >
              Full Standings <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {topLeaderboard.length === 0 ? (
            <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 mb-2">No leaderboard competitors active yet.</p>
              <Button variant="outline" size="sm" onClick={() => onNavigate('leaderboard')}>
                Open Leaderboard
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {topLeaderboard.slice(0, 4).map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    p.isCurrentUser
                      ? 'bg-emerald-50/70 border-emerald-200 font-medium'
                      : 'bg-slate-50/60 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm w-5 text-center text-slate-600">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center">
                      {p.avatar || p.name?.substring(0, 2).toUpperCase() || 'P'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {p.name} {p.isCurrentUser && '(You)'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {(p.steps || 0).toLocaleString()} steps
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-slate-900">
                      {p.score.toLocaleString()}
                    </span>{' '}
                    <span className="text-[10px] text-slate-400">pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
