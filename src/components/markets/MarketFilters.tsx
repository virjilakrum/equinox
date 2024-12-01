import React from 'react';
import { Search, Filter, SortAsc, AlertCircle } from 'lucide-react';

export type SortOption = 'newest' | 'stake' | 'volume' | 'activity';
export type StatusFilter = 'all' | 'active' | 'resolved' | 'pending';
export type StakeRange = 'all' | 'small' | 'medium' | 'large';

interface MarketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  stakeRange: StakeRange;
  onStakeRangeChange: (value: StakeRange) => void;
  showResolved: boolean;
  onShowResolvedChange: (value: boolean) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'stake', label: 'Highest Stake' },
  { value: 'volume', label: 'Highest Volume' },
  { value: 'activity', label: 'Most Active' },
];

const STAKE_RANGES: { value: StakeRange; label: string }[] = [
  { value: 'all', label: 'All Stakes' },
  { value: 'small', label: '< 10 SOL' },
  { value: 'medium', label: '10-50 SOL' },
  { value: 'large', label: '> 50 SOL' },
];

export function MarketFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  status,
  onStatusChange,
  stakeRange,
  onStakeRangeChange,
  showResolved,
  onShowResolvedChange,
}: MarketFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search markets..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-background-secondary border border-equinox-silver/20 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-text-secondary" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 bg-background-secondary border border-equinox-silver/20 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2 min-w-[200px]">
          <AlertCircle className="w-5 h-5 text-text-secondary" />
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
            className="flex-1 px-3 py-2 bg-background-secondary border border-equinox-silver/20 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending Resolution</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 min-w-[200px]">
          <SortAsc className="w-5 h-5 text-text-secondary" />
          <select
            value={stakeRange}
            onChange={(e) => onStakeRangeChange(e.target.value as StakeRange)}
            className="flex-1 px-3 py-2 bg-background-secondary border border-equinox-silver/20 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
          >
            {STAKE_RANGES.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center space-x-2 px-3 py-2 bg-background-secondary rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => onShowResolvedChange(e.target.checked)}
            className="w-4 h-4 rounded border-equinox-silver/20 text-equinox-green 
                     focus:ring-2 focus:ring-equinox-green/50"
          />
          <span className="text-sm">Show Resolved Markets</span>
        </label>
      </div>

      {search && (
        <div className="flex items-center justify-between py-2 px-4 bg-background-secondary rounded-lg">
          <span className="text-sm text-text-secondary">
            Showing results for "{search}"
          </span>
          <button
            onClick={() => onSearchChange('')}
            className="text-sm text-equinox-green hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}