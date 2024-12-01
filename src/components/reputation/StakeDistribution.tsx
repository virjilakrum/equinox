import React from 'react';

const MOCK_DISTRIBUTION = [
  { category: 'AI/ML', percentage: 40 },
  { category: 'Blockchain', percentage: 25 },
  { category: 'Quantum Computing', percentage: 20 },
  { category: 'Other', percentage: 15 },
];

export function StakeDistribution() {
  return (
    <div className="space-y-4">
      {MOCK_DISTRIBUTION.map((item) => (
        <div key={item.category} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{item.category}</span>
            <span className="text-text-secondary">{item.percentage}%</span>
          </div>
          <div className="h-2 bg-background-primary rounded-full overflow-hidden">
            <div
              className="h-full bg-equinox-green"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}