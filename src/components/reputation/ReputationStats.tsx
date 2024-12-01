import React from 'react';
import { Award, Target, BookOpen, TrendingUp } from 'lucide-react';
import type { ReputationScore } from '../../types/paper';

interface ReputationStatsProps {
  reputation: ReputationScore;
}

export function ReputationStats({ reputation }: ReputationStatsProps) {
  const predictionAccuracy = (reputation.successfulPredictions / reputation.totalPredictions) * 100;

  const stats = [
    {
      label: 'Reputation Score',
      value: reputation.score,
      icon: Award,
      color: 'text-equinox-green',
    },
    {
      label: 'Papers Published',
      value: reputation.paperCount,
      icon: BookOpen,
      color: 'text-info',
    },
    {
      label: 'Prediction Accuracy',
      value: `${predictionAccuracy.toFixed(1)}%`,
      icon: Target,
      color: 'text-success',
    },
    {
      label: 'Total Predictions',
      value: reputation.totalPredictions,
      icon: TrendingUp,
      color: 'text-warning',
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <div key={stat.label} className="card">
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-text-secondary text-sm">{stat.label}</span>
          </div>
          <div className="text-2xl font-bold font-heading">{stat.value}</div>
        </div>
      ))}
    </>
  );
}