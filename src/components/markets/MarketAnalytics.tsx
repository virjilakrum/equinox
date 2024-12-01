import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, AlertCircle } from 'lucide-react';
import { formatSOL } from '../../utils/format';

interface MarketAnalyticsProps {
  marketId: string;
}

const MOCK_TRADER_STATS = {
  totalTraders: 156,
  avgStakeSize: 2.5,
  successRate: 68,
  avgHoldTime: '4.2 days',
};

const MOCK_STAKE_DISTRIBUTION = [
  { name: 'Small Stakes (<10 SOL)', value: 45 },
  { name: 'Medium Stakes (10-50 SOL)', value: 35 },
  { name: 'Large Stakes (>50 SOL)', value: 20 },
];

const COLORS = ['#26FFB1', '#60A5FA', '#FBBF24'];

export function MarketAnalytics({ marketId }: MarketAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-equinox-green" />
            <span className="text-sm text-text-secondary">Total Traders</span>
          </div>
          <span className="text-2xl font-bold">{MOCK_TRADER_STATS.totalTraders}</span>
        </div>

        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-info" />
            <span className="text-sm text-text-secondary">Avg Stake Size</span>
          </div>
          <span className="text-2xl font-bold">{formatSOL(MOCK_TRADER_STATS.avgStakeSize)}</span>
        </div>

        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-success" />
            <span className="text-sm text-text-secondary">Success Rate</span>
          </div>
          <span className="text-2xl font-bold">{MOCK_TRADER_STATS.successRate}%</span>
        </div>

        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <span className="text-sm text-text-secondary">Avg Hold Time</span>
          </div>
          <span className="text-2xl font-bold">{MOCK_TRADER_STATS.avgHoldTime}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-bold font-heading mb-4">Stake Distribution</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_STAKE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_STAKE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background-secondary p-3 rounded-lg border border-equinox-silver/10">
                          <p className="text-sm font-medium">{data.name}</p>
                          <p className="text-sm text-equinox-green">{data.value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {MOCK_STAKE_DISTRIBUTION.map((item, index) => (
              <div key={item.name} className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm">{item.value}%</span>
                </div>
                <span className="text-xs text-text-secondary">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold font-heading mb-4">Trading Activity</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generateActivityData()}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#26FFB1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#26FFB1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#8A95A5"
                  fontSize={12}
                />
                <YAxis
                  stroke="#8A95A5"
                  fontSize={12}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background-secondary p-3 rounded-lg border border-equinox-silver/10">
                          <p className="text-sm font-medium">{data.time}:00</p>
                          <p className="text-sm text-equinox-green">
                            {data.trades} trades
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="trades"
                  stroke="#26FFB1"
                  fillOpacity={1}
                  fill="url(#activityGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateActivityData() {
  return Array.from({ length: 24 }, (_, i) => ({
    time: i,
    trades: Math.floor(Math.random() * 50) + 10,
  }));
}