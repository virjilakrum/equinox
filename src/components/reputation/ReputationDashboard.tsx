import React from 'react';
import { TrendingUp, Award, BookOpen, Target } from 'lucide-react';
import { ReputationStats } from './ReputationStats';
import { PredictionHistory } from './PredictionHistory';
import { StakeDistribution } from './StakeDistribution';
import type { ReputationScore } from '../../types/paper';

const MOCK_REPUTATION: ReputationScore = {
  publicKey: '8xj2...',
  score: 156,
  paperCount: 3,
  successfulPredictions: 12,
  totalPredictions: 15,
};

export function ReputationDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-heading">Researcher Dashboard</h1>
        <div className="flex items-center space-x-2 bg-background-secondary px-4 py-2 rounded-lg">
          <Award className="w-5 h-5 text-equinox-green" />
          <span className="text-sm">Reputation Score: {MOCK_REPUTATION.score}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <ReputationStats reputation={MOCK_REPUTATION} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-heading">Prediction History</h2>
            <Target className="w-5 h-5 text-equinox-green" />
          </div>
          <PredictionHistory />
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-heading">Stake Distribution</h2>
            <TrendingUp className="w-5 h-5 text-equinox-green" />
          </div>
          <StakeDistribution />
        </div>
      </div>
    </div>
  );
}