import React from 'react';
import { ArrowRight, Trophy } from 'lucide-react';
import Button from '../common/Button';

export default function ChallengePreview({
  enrolledChallenges = [],
  onNavigateToChallenges
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Active Enrolled Challenges</h3>
          <p className="text-xs text-slate-500 mt-0.5">Your personal milestones in progress</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateToChallenges}
          className="text-emerald-700 hover:text-emerald-800"
        >
          View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>

      {enrolledChallenges.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700 mb-1">No Active Challenges Yet</h4>
          <p className="text-xs text-slate-500 mb-3 max-w-xs mx-auto">
            Join a challenge from the catalogue to start earning bonus points and tracking habits.
          </p>
          <Button variant="primary" size="sm" onClick={onNavigateToChallenges}>
            Explore Catalogue
          </Button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {enrolledChallenges.slice(0, 4).map(item => {
            const { challenge, progress } = item;
            return (
              <div
                key={challenge.id}
                className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm text-slate-800">{challenge.name}</span>
                  <span className="text-xs font-bold text-emerald-700">
                    {progress.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress.isCompleted
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{progress.current.toLocaleString()} / {challenge.target.toLocaleString()} {challenge.unit}</span>
                  <span className="font-medium text-slate-600">
                    {progress.isCompleted ? '✓ Goal Met' : challenge.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
