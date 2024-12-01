import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { MarketList } from './MarketList';
import { CreateMarketForm } from './CreateMarketForm';
import { MarketFilters, type SortOption, type StatusFilter, type StakeRange } from './MarketFilters';
import type { ValidationMarket } from '../../types/paper';

// Initial mock data
const INITIAL_MARKETS: ValidationMarket[] = [
  {
    marketId: 'market-1',
    paperId: 'paper-1',
    validationCriteria: 'Will this research methodology prove reproducible?',
    resolutionDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
    totalStaked: 50,
    votes: { valid: 30, invalid: 20 },
    validationMetrics: {
      methodology: 0.8,
      reproducibility: 0.7,
      significance: 0.9
    }
  },
  {
    marketId: 'market-2',
    paperId: 'paper-2',
    validationCriteria: 'Will the proposed method outperform current SOTA?',
    resolutionDate: Date.now() + 60 * 24 * 60 * 60 * 1000,
    totalStaked: 75,
    votes: { valid: 45, invalid: 30 },
    validationMetrics: {
      methodology: 0.9,
      reproducibility: 0.8,
      significance: 0.85
    }
  }
];

export function MarketsPage() {
  const { connected } = useWallet();
  const [markets, setMarkets] = useState<ValidationMarket[]>(INITIAL_MARKETS);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [stakeRange, setStakeRange] = useState<StakeRange>('all');
  const [showResolved, setShowResolved] = useState(false);

  const handleCreateMarket = async (newMarket: ValidationMarket) => {
    setLoading(true);
    try {
      // In a real implementation, this would call the Solana program
      setMarkets(prevMarkets => [newMarket, ...prevMarkets]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating market:', error);
      alert('Failed to create market. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (marketId: string, isValid: boolean) => {
    if (!connected) {
      alert('Please connect your wallet to validate papers');
      return;
    }

    setLoading(true);
    try {
      setMarkets(prevMarkets => prevMarkets.map(market => {
        if (market.marketId === marketId) {
          return {
            ...market,
            votes: {
              valid: isValid ? market.votes.valid + 1 : market.votes.valid,
              invalid: isValid ? market.votes.invalid : market.votes.invalid + 1
            }
          };
        }
        return market;
      }));
    } catch (error) {
      console.error('Error validating:', error);
      alert('Failed to validate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMarkets = markets
    .filter(market => {
      if (!showResolved && new Date(market.resolutionDate) < new Date()) {
        return false;
      }
      if (search) {
        return market.validationCriteria.toLowerCase().includes(search.toLowerCase()) ||
               market.paperId.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'stake':
          return b.totalStaked - a.totalStaked;
        case 'volume':
          return (b.votes.valid + b.votes.invalid) - (a.votes.valid + a.votes.invalid);
        case 'activity':
          return b.votes.valid - a.votes.valid;
        default:
          return b.resolutionDate - a.resolutionDate;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-heading">Research Validation Markets</h1>
        {connected && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create Validation Market
          </button>
        )}
      </div>

      <MarketFilters
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        status={status}
        onStatusChange={setStatus}
        stakeRange={stakeRange}
        onStakeRangeChange={setStakeRange}
        showResolved={showResolved}
        onShowResolvedChange={setShowResolved}
      />

      {showCreateForm ? (
        <div className="card animate-fadeIn">
          <CreateMarketForm
            onSubmit={handleCreateMarket}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      ) : (
        <MarketList
          markets={filteredMarkets}
          onTakePosition={handleValidate}
          loading={loading}
        />
      )}
    </div>
  );
}