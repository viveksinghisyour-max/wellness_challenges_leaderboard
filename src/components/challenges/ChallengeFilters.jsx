import React from 'react';
import { Search } from 'lucide-react';

export default function ChallengeFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  difficultyFilter,
  onDifficultyChange
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Search Bar */}
      <div className="relative w-full md:w-80 flex-shrink-0">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search challenges by name..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          <option value="Steps">Steps</option>
          <option value="Activity">Active Cardio</option>
          <option value="Hydration">Hydration</option>
          <option value="Sleep">Sleep Routine</option>
          <option value="Streak">Streak</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          aria-label="Filter by enrollment status"
        >
          <option value="all">All Statuses</option>
          <option value="enrolled">Enrolled Only</option>
          <option value="available">Available to Join</option>
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          aria-label="Filter by difficulty"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
    </div>
  );
}
