import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'position' | 'stake_change';
  userAddress: string;
  amount: number;
  position?: boolean;
  timestamp: number;
}

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    type: 'position',
    userAddress: '8xj2...',
    amount: 2.5,
    position: true,
    timestamp: Date.now() - 3600000,
  },
  {
    id: '2',
    type: 'position',
    userAddress: '9yk3...',
    amount: 1.8,
    position: false,
    timestamp: Date.now() - 7200000,
  },
];

interface MarketActivityProps {
  marketId: string;
}

export function MarketActivity({ marketId }: MarketActivityProps) {
  return (
    <div className="space-y-4">
      {MOCK_ACTIVITY.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center justify-between p-3 bg-background-primary rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-1 rounded-full ${
              activity.position ? 'bg-success/20' : 'bg-error/20'
            }`}>
              {activity.position ? (
                <ArrowUpRight className="w-4 h-4 text-success" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-error" />
              )}
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium">{activity.userAddress}</span>
                <span className="text-text-secondary"> took a </span>
                <span className={activity.position ? 'text-success' : 'text-error'}>
                  {activity.position ? 'Yes' : 'No'}
                </span>
                <span className="text-text-secondary"> position</span>
              </p>
              <p className="text-xs text-text-secondary">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{activity.amount} SOL</p>
          </div>
        </div>
      ))}
    </div>
  );
}