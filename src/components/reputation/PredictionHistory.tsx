import React from 'react';
import { Check, X } from 'lucide-react';

const MOCK_PREDICTIONS = [
  { id: 1, market: 'Will Paper A be cited 100+ times?', outcome: true, stake: 5, return: 8.5 },
  { id: 2, market: 'Method outperforms SOTA?', outcome: true, stake: 3, return: 4.8 },
  { id: 3, market: 'Reproducibility validated?', outcome: false, stake: 2, return: 0 },
  { id: 4, market: 'Conference acceptance?', outcome: true, stake: 4, return: 7.2 },
];

export function PredictionHistory() {
  return (
    <div className="space-y-4">
      {MOCK_PREDICTIONS.map((prediction) => (
        <div
          key={prediction.id}
          className="flex items-center justify-between p-3 bg-background-primary rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-1 rounded-full ${prediction.outcome ? 'bg-success/20' : 'bg-error/20'}`}>
              {prediction.outcome ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <X className="w-4 h-4 text-error" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{prediction.market}</p>
              <p className="text-xs text-text-secondary">Stake: {prediction.stake} SOL</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${prediction.return > 0 ? 'text-success' : 'text-error'}`}>
              {prediction.return > 0 ? `+${prediction.return}` : prediction.return} SOL
            </p>
            <p className="text-xs text-text-secondary">Return</p>
          </div>
        </div>
      ))}
    </div>
  );
}