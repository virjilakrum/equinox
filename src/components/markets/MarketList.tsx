import React, { useState } from 'react';
import { MarketCard } from './MarketCard';
import { MarketDetails } from './MarketDetails';
import { MarketSkeleton } from './MarketSkeleton';
import type { ValidationMarket } from '../../types/paper';

interface MarketListProps {
  markets: ValidationMarket[];
  onTakePosition: (marketId: string, isValid: boolean) => void;
  loading?: boolean;
}

export function MarketList({ markets, onTakePosition, loading = false }: MarketListProps) {
  const [selectedMarket, setSelectedMarket] = useState<ValidationMarket | null>(null);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <MarketSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No active markets found</p>
      </div>
    );
  }

  if (selectedMarket) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedMarket(null)}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Back to Markets
        </button>
        <MarketDetails
          market={selectedMarket}
          onTakePosition={(isValid) => {
            onTakePosition(selectedMarket.marketId, isValid);
            setSelectedMarket(null);
          }}
          onClose={() => setSelectedMarket(null)}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {markets.map((market) => (
        <MarketCard
          key={market.marketId}
          market={market}
          onValidate={(isValid) => onTakePosition(market.marketId, isValid)}
          onClick={() => setSelectedMarket(market)}
        />
      ))}
    </div>
  );
}