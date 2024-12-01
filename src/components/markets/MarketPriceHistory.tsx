import React, { useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { formatSOL } from '../../utils/format';
import { Clock, ArrowUpRight, ArrowDownRight, TrendingUp, Scale } from 'lucide-react';

interface PricePoint {
  timestamp: number;
  price: number;
  volume: number;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | 'ALL';
type ScaleType = 'linear' | 'log';

// Generate mock data for the last 90 days
const generateMockData = (): PricePoint[] => {
  const data: PricePoint[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  let lastPrice = 0.5;

  for (let i = 90; i >= 0; i--) {
    const timestamp = now - (i * dayMs);
    // Random walk for price
    lastPrice = Math.max(0.1, Math.min(0.9, lastPrice + (Math.random() - 0.5) * 0.1));
    data.push({
      timestamp,
      price: lastPrice,
      volume: Math.random() * 100,
    });
  }
  return data;
};

const MOCK_PRICE_HISTORY = generateMockData();

const TIME_RANGES: { label: TimeRange; days: number }[] = [
  { label: '1D', days: 1 },
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: 'ALL', days: Infinity },
];

interface MarketPriceHistoryProps {
  marketId: string;
}

export function MarketPriceHistory({ marketId }: MarketPriceHistoryProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');
  const [scaleType, setScaleType] = useState<ScaleType>('linear');

  const filteredData = useMemo(() => {
    const range = TIME_RANGES.find(r => r.label === selectedRange)!;
    if (range.label === 'ALL') return MOCK_PRICE_HISTORY;
    
    const cutoff = Date.now() - (range.days * 24 * 60 * 60 * 1000);
    return MOCK_PRICE_HISTORY.filter(point => point.timestamp >= cutoff);
  }, [selectedRange]);

  const priceStats = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    const currentPrice = filteredData[filteredData.length - 1].price;
    const startPrice = filteredData[0].price;
    const priceChange = currentPrice - startPrice;
    const percentChange = (priceChange / startPrice) * 100;
    
    const prices = filteredData.map(d => d.price);
    const highPrice = Math.max(...prices);
    const lowPrice = Math.min(...prices);
    
    const totalVolume = filteredData.reduce((sum, d) => sum + d.volume, 0);
    
    return {
      currentPrice,
      priceChange,
      percentChange,
      highPrice,
      lowPrice,
      totalVolume,
    };
  }, [filteredData]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (selectedRange === '1D') {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      ...(selectedRange === '3M' && { year: '2-digit' }),
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background-secondary p-3 rounded-lg border border-equinox-silver/10">
          <p className="text-sm font-medium">{formatDate(data.timestamp)}</p>
          <p className="text-sm text-equinox-green">
            Price: {(data.price * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-text-secondary">
            Volume: {formatSOL(data.volume)} SOL
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-heading">Price History</h3>
          {priceStats && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">{(priceStats.currentPrice * 100).toFixed(1)}%</span>
              <span className={`flex items-center ${
                priceStats.percentChange >= 0 ? 'text-success' : 'text-error'
              }`}>
                {priceStats.percentChange >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(priceStats.percentChange).toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setScaleType(s => s === 'linear' ? 'log' : 'linear')}
            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-background-primary
                     hover:bg-background-secondary transition-colors"
          >
            <Scale className="w-4 h-4" />
            <span className="text-sm">{scaleType === 'linear' ? 'Linear' : 'Log'}</span>
          </button>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-text-secondary" />
            <div className="flex bg-background-primary rounded-lg p-1">
              {TIME_RANGES.map(({ label }) => (
                <button
                  key={label}
                  onClick={() => setSelectedRange(label)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedRange === label
                      ? 'bg-equinox-green text-equinox-black'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {priceStats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-background-primary p-3 rounded-lg">
            <span className="text-sm text-text-secondary">24h High</span>
            <p className="text-lg font-medium">{(priceStats.highPrice * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-background-primary p-3 rounded-lg">
            <span className="text-sm text-text-secondary">24h Low</span>
            <p className="text-lg font-medium">{(priceStats.lowPrice * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-background-primary p-3 rounded-lg">
            <span className="text-sm text-text-secondary">24h Volume</span>
            <p className="text-lg font-medium">{formatSOL(priceStats.totalVolume)}</p>
          </div>
          <div className="bg-background-primary p-3 rounded-lg">
            <span className="text-sm text-text-secondary">Price Change</span>
            <p className={`text-lg font-medium ${
              priceStats.percentChange >= 0 ? 'text-success' : 'text-error'
            }`}>
              {priceStats.percentChange >= 0 ? '+' : ''}{priceStats.percentChange.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(38, 255, 177)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(38, 255, 177)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatDate}
                stroke="#8A95A5"
                fontSize={12}
              />
              <YAxis
                yAxisId="price"
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                domain={[0, 1]}
                stroke="#8A95A5"
                fontSize={12}
                scale={scaleType}
              />
              <YAxis
                yAxisId="volume"
                orientation="right"
                tickFormatter={(value) => `${formatSOL(value)}`}
                stroke="#8A95A5"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke="rgb(38, 255, 177)"
                fillOpacity={1}
                fill="url(#priceGradient)"
              />
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="rgba(38, 255, 177, 0.1)"
                stroke="rgba(38, 255, 177, 0.3)"
                strokeWidth={1}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}