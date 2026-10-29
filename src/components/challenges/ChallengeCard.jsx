import React from 'react';
import {
  Footprints,
  Trophy,
  MapPin,
  Flame,
  Droplet,
  Droplets,
  Moon,
  Zap,
  Sparkles,
  Activity,
  CheckCircle2
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function ChallengeCard({
  challenge,
  isEnrolled,
  progress,
  onJoin,
  onLeave
}) {
  const iconMap = {
    Footprints,
    Trophy,
    MapPin,
    Flame,
    Droplet,
    Droplets,
    Moon,
    Zap,
    Sparkles,
    Activity
  };

  const Icon = iconMap[challenge.icon] || Trophy;

  const diffVariants = {
    Easy: 'easy',
    Medium: 'medium',
    Hard: 'hard'
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        isEnrolled
          ? 'border-emerald-300 shadow-sm shadow-emerald-500/5 ring-1 ring-emerald-400/30'
          : 'border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Top Banner / Badges */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={diffVariants[challenge.difficulty] || 'default'}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="outline">{challenge.category}</Badge>
            <Badge variant="default">{challenge.duration}</Badge>
          </div>

          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isEnrolled
                ? progress?.isCompleted
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {isEnrolled
              ? progress?.isCompleted
                ? '✓ Completed'
                : '● Enrolled'
              : 'Available'}
          </span>
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700 shadow-xs mt-0.5">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-snug">
              {challenge.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {challenge.description}
            </p>
          </div>
        </div>
      </div>

      {/* Target & Reward stats */}
      <div className="px-5 py-2.5">
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Goal</span>
            <span className="text-xs font-bold text-slate-800">
              {challenge.target.toLocaleString()} {challenge.unit}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Reward</span>
            <span className="text-xs font-bold text-emerald-700">
              +{challenge.pointsReward} pts
            </span>
          </div>
        </div>
      </div>

      {/* Progress Box if enrolled */}
      {isEnrolled && progress && (
        <div className="px-5 py-2">
          <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-emerald-950 font-semibold">Your Progress</span>
              <span className="font-bold text-emerald-800">
                {progress.current.toLocaleString()} / {challenge.target.toLocaleString()} {challenge.unit} ({progress.percentage}%)
              </span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-auto p-5 pt-3 border-t border-slate-100 flex items-center justify-end">
        {isEnrolled ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLeave(challenge.id, challenge.name)}
            className="text-slate-600 hover:text-rose-600 hover:border-rose-300"
          >
            Leave Challenge
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onJoin(challenge.id, challenge.name)}
          >
            Join Challenge
          </Button>
        )}
      </div>
    </div>
  );
}
