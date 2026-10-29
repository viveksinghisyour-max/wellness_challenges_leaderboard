import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import LeaderboardFilters from '../components/leaderboard/LeaderboardFilters';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import EmptyState from '../components/common/EmptyState';
import { Trophy } from 'lucide-react';

export default function Leaderboard({
  rankedParticipants = [],
  onSeedDemoCompetitors
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter & Sort
  const filtered = rankedParticipants.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name?.toLowerCase().includes(q) && !p.city?.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (statusFilter === 'anomalies' && !p.anomalyReport?.isAnomaly) {
      return false;
    }
    if (statusFilter === 'clean' && p.anomalyReport?.isAnomaly) {
      return false;
    }

    return true;
  });

  // Re-sort based on selected criteria
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'steps') {
      if ((b.steps || 0) !== (a.steps || 0)) return (b.steps || 0) - (a.steps || 0);
    } else if (sortBy === 'activeMinutes') {
      if ((b.activeMinutes || 0) !== (a.activeMinutes || 0)) return (b.activeMinutes || 0) - (a.activeMinutes || 0);
    } else if (sortBy === 'challenges') {
      if ((b.completedChallenges || 0) !== (a.completedChallenges || 0)) return (b.completedChallenges || 0) - (a.completedChallenges || 0);
    }
    // Default score tie-breaker
    return (b.score || 0) - (a.score || 0);
  });

  return (
    <div>
      <PageHeader
        title="Community Wellness Standings"
        subtitle="Transparent rankings calculated dynamically from 7-day verified activities, challenge completion bonuses, and active streaks. Rule-based heuristic engines audit for physiological consistency."
        actions={
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
            {rankedParticipants.length} Competitors Tracked
          </span>
        }
      />

      <LeaderboardFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Participants Match Filter"
          description="Try adjusting your search criteria or resetting filters to see active standings."
          actionLabel="Reset Search & Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setSortBy('score');
          }}
        />
      ) : (
        <LeaderboardTable
          participants={sorted}
          onSeedDemoCompetitors={onSeedDemoCompetitors}
        />
      )}
    </div>
  );
}
