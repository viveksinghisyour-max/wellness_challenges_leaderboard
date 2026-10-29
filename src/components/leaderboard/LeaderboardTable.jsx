import React, { useState } from 'react';
import { Trophy, Award, AlertCircle, CheckCircle2, X } from 'lucide-react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';

export default function LeaderboardTable({
  participants = [],
  onSeedDemoCompetitors
}) {
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  if (participants.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="Leaderboard Awaiting Participants"
        description="Log your daily activities or add demo competitors to view rankings, point calculations, and anti-cheat audit badges."
        actionLabel={onSeedDemoCompetitors ? "Seed 20 Demo Competitors (Optional)" : undefined}
        onAction={onSeedDemoCompetitors}
      />
    );
  }

  // Top 3 Podium
  const top3 = participants.slice(0, 3);

  return (
    <div>
      {/* Top 3 Podium Cards if at least 3 participants exist */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 items-end">
          {/* Silver #2 */}
          <div
            onClick={() => setSelectedParticipant(top3[1])}
            className="order-2 sm:order-1 bg-white border border-slate-200/80 rounded-2xl p-5 text-center shadow-xs hover:shadow-md cursor-pointer transition-all transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm mb-2 shadow-xs">
              {top3[1].avatar || 'P2'}
            </div>
            <span className="text-xl">🥈</span>
            <h4 className="font-bold text-slate-900 text-sm mt-1">
              {top3[1].name} {top3[1].isCurrentUser && '(You)'}
            </h4>
            <div className="text-base font-extrabold text-emerald-700 mt-1">
              {top3[1].score.toLocaleString()} pts
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {top3[1].steps.toLocaleString()} steps
            </div>
            <div className="mt-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
              Rank #2
            </div>
          </div>

          {/* Gold #1 */}
          <div
            onClick={() => setSelectedParticipant(top3[0])}
            className="order-1 sm:order-2 bg-gradient-to-b from-amber-50/70 to-white border-2 border-amber-300 rounded-2xl p-6 text-center shadow-md hover:shadow-lg cursor-pointer transition-all transform hover:-translate-y-1"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-white font-extrabold flex items-center justify-center text-base mb-2 shadow-md">
              {top3[0].avatar || 'P1'}
            </div>
            <span className="text-2xl">👑 🥇</span>
            <h4 className="font-extrabold text-slate-900 text-base mt-1">
              {top3[0].name} {top3[0].isCurrentUser && '(You)'}
            </h4>
            <div className="text-xl font-black text-emerald-800 mt-1">
              {top3[0].score.toLocaleString()} pts
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              {top3[0].steps.toLocaleString()} steps
            </div>
            <div className="mt-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg text-xs font-extrabold shadow-xs">
              Champion #1
            </div>
          </div>

          {/* Bronze #3 */}
          <div
            onClick={() => setSelectedParticipant(top3[2])}
            className="order-3 sm:order-3 bg-white border border-slate-200/80 rounded-2xl p-5 text-center shadow-xs hover:shadow-md cursor-pointer transition-all transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm mb-2 shadow-xs">
              {top3[2].avatar || 'P3'}
            </div>
            <span className="text-xl">🥉</span>
            <h4 className="font-bold text-slate-900 text-sm mt-1">
              {top3[2].name} {top3[2].isCurrentUser && '(You)'}
            </h4>
            <div className="text-base font-extrabold text-emerald-700 mt-1">
              {top3[2].score.toLocaleString()} pts
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {top3[2].steps.toLocaleString()} steps
            </div>
            <div className="mt-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-lg text-xs font-bold">
              Rank #3
            </div>
          </div>
        </div>
      )}

      {/* Standings Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Community Standings & Anomaly Audit</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click any participant to inspect their activity audit and points breakdown</p>
          </div>
          {onSeedDemoCompetitors && (
            <Button variant="ghost" size="sm" onClick={onSeedDemoCompetitors} className="text-emerald-700">
              + Seed Demo Competitors
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 w-16 text-center">Rank</th>
                <th className="px-5 py-3.5">Participant</th>
                <th className="px-5 py-3.5">Score</th>
                <th className="px-5 py-3.5">7-Day Steps</th>
                <th className="px-5 py-3.5">Active Cardio</th>
                <th className="px-5 py-3.5">Challenges</th>
                <th className="px-5 py-3.5 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {participants.map(p => {
                const report = p.anomalyReport || { isAnomaly: false, status: 'Normal', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' };

                let rankBadge = `#${p.rank}`;
                if (p.rank === 1) rankBadge = '🥇 #1';
                else if (p.rank === 2) rankBadge = '🥈 #2';
                else if (p.rank === 3) rankBadge = '🥉 #3';

                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedParticipant(p)}
                    className={`cursor-pointer transition-colors ${
                      p.isCurrentUser
                        ? 'bg-emerald-50/50 hover:bg-emerald-50 font-medium'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="px-5 py-3.5 text-center font-bold text-slate-700">
                      {rankBadge}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 text-white shadow-xs ${
                            p.isCurrentUser
                              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                              : 'bg-gradient-to-tr from-slate-600 to-slate-700'
                          }`}
                        >
                          {p.avatar || p.name?.substring(0, 2).toUpperCase() || 'PA'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {p.name}
                            {p.isCurrentUser && (
                              <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{p.city || 'Austin, TX'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-extrabold text-slate-900 text-base">
                        {p.score.toLocaleString()}
                      </span>{' '}
                      <span className="text-xs text-slate-500 font-normal">pts</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">
                      {(p.steps || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">
                      {p.activeMinutes || 0} mins
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline">
                        {p.completedChallenges || 0} completed
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${report.badgeColor}`}
                      >
                        {report.isAnomaly ? (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            {report.status}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Normal
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Details & Anomaly Audit Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {selectedParticipant.avatar || 'P'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {selectedParticipant.name} {selectedParticipant.isCurrentUser && '(You)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rank #{selectedParticipant.rank} &bull; {selectedParticipant.city || 'Austin, TX'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Score Summary */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">Total Verified Score</span>
                  <div className="text-2xl font-black text-emerald-950 mt-0.5">
                    {selectedParticipant.score.toLocaleString()} pts
                  </div>
                </div>
                <Badge variant="primary">Deterministic Formula</Badge>
              </div>

              {/* Anomaly Inspection Alert */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Anti-Cheat Heuristic Inspection
                </h4>
                {selectedParticipant.anomalyReport?.isAnomaly ? (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                      <span>Status: {selectedParticipant.anomalyReport.status}</span>
                      <span className="uppercase text-[11px] bg-rose-200/80 px-2 py-0.5 rounded-full">
                        {selectedParticipant.anomalyReport.severity} severity
                      </span>
                    </div>
                    <ul className="text-xs text-rose-800 list-disc list-inside space-y-1 mt-1">
                      {selectedParticipant.anomalyReport.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-rose-700/80 italic pt-1 border-t border-rose-200/60">
                      {selectedParticipant.anomalyReport.disclaimer}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>No statistical anomalies detected. All logged metrics conform to realistic human thresholds.</span>
                  </div>
                )}
              </div>

              {/* Daily breakdown if available */}
              {selectedParticipant.dailyActivities && selectedParticipant.dailyActivities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    7-Day Metric Snapshot
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 divide-y divide-slate-100 text-xs">
                    {selectedParticipant.dailyActivities.map((day, idx) => (
                      <div key={idx} className="py-1.5 flex items-center justify-between text-slate-700">
                        <span className="font-semibold text-slate-900">{day.date}</span>
                        <span>{(day.steps || 0).toLocaleString()} steps</span>
                        <span>{day.activeMinutes || 0}m active</span>
                        <span>{day.water || 0} glasses</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedParticipant(null)}>
                Close Audit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
