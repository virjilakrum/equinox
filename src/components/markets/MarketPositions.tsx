import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface MarketPositionsProps {
  trueCount: number;
  falseCount: number;
  onTakePosition: (position: boolean) => void;
}

export function MarketPositions({ trueCount, falseCount, onTakePosition }: MarketPositionsProps) {
  const total = trueCount + falseCount;
  const truePercentage = total > 0 ? (trueCount / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Yes ({trueCount} positions)</span>
          <span>{truePercentage.toFixed(1)}%</span>
        </div>
        <div className="relative h-2 bg-background-primary rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-equinox-green"
            style={{ width: `${truePercentage}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={() => onTakePosition(true)}
          className="flex items-center justify-center space-x-2 btn-primary"
        >
          <ThumbsUp className="w-5 h-5" />
          <span>Take Yes Position</span>
        </button>
        <button
          onClick={() => onTakePosition(false)}
          className="flex items-center justify-center space-x-2 btn-secondary"
        >
          <ThumbsDown className="w-5 h-5" />
          <span>Take No Position</span>
        </button>
      </div>
    </div>
  );
}