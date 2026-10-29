import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import ChallengeFilters from '../components/challenges/ChallengeFilters';
import ChallengeCard from '../components/challenges/ChallengeCard';
import EmptyState from '../components/common/EmptyState';
import { Trophy } from 'lucide-react';

export default function Challenges({
  challenges = [],
  enrollments = [],
  challengeProgressMap = {},
  onJoinChallenge,
  onLeaveChallenge
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filtered = challenges.filter(ch => {
    const isEnrolled = enrollments.some(e => e.challengeId === ch.id);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!ch.name.toLowerCase().includes(q) && !ch.description.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (categoryFilter !== 'all' && ch.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }

    if (difficultyFilter !== 'all' && ch.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
      return false;
    }

    if (statusFilter === 'enrolled' && !isEnrolled) return false;
    if (statusFilter === 'available' && isEnrolled) return false;

    return true;
  });

  return (
    <div>
      <PageHeader
        title="Wellness Challenge Catalogue"
        subtitle="Explore habit-building challenges across daily steps, cardio intensity, hydration, and sleep. Join challenges to track milestones and boost your leaderboard score."
        actions={
          <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
            {enrollments.length} Active Challenges Enrolled
          </span>
        }
      />

      <ChallengeFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        difficultyFilter={difficultyFilter}
        onDifficultyChange={setDifficultyFilter}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Matching Challenges"
          description="Try adjusting or clearing your search term and filters to see available wellness challenges."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setCategoryFilter('all');
            setStatusFilter('all');
            setDifficultyFilter('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(ch => {
            const isEnrolled = enrollments.some(e => e.challengeId === ch.id);
            const progress = challengeProgressMap[ch.id];
            return (
              <ChallengeCard
                key={ch.id}
                challenge={ch}
                isEnrolled={isEnrolled}
                progress={progress}
                onJoin={onJoinChallenge}
                onLeave={onLeaveChallenge}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
