import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';
import type { ValidationMarket } from '../../types/paper';
import { formatSOL, formatDate } from '../../utils/format';
import { AnimatedNumber } from '../animations/AnimatedNumber';
import { validatePaper } from '../../services/solana';

interface MarketCardProps {
  market: ValidationMarket;
  onValidate: (isValid: boolean) => void;
  onClick: () => void;
}

export function MarketCard({ market, onValidate, onClick }: MarketCardProps) {
  const { connected, publicKey, signTransaction } = useWallet();
  const [isValidating, setIsValidating] = useState(false);

  const handleValidateClick = async (e: React.MouseEvent, isValid: boolean) => {
    e.stopPropagation();
    if (!connected || !publicKey || !signTransaction) {
      alert('Please connect your wallet to validate papers');
      return;
    }

    setIsValidating(true);
    try {
      await validatePaper({
        publicKey,
        signTransaction,
        connected
      }, market.marketId, isValid);
      onValidate(isValid);
    } catch (error) {
      console.error('Validation error:', error);
      alert('Failed to validate. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const totalVotes = market.votes.valid + market.votes.invalid;
  const validPercentage = totalVotes > 0 
    ? (market.votes.valid / totalVotes) * 100 
    : 0;

  const isExpired = new Date(market.resolutionDate) < new Date();

  return (
    <div 
      onClick={onClick}
      className="card hover:scale-[1.02] transition-all duration-300 cursor-pointer
                hover:shadow-lg hover:shadow-equinox-green/5 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-lg group-hover:text-equinox-green transition-colors">
            {market.validationCriteria}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Paper ID: {market.paperId}</span>
            {isExpired && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                             bg-error/20 text-error">
                <AlertCircle className="w-3 h-3 mr-1" />
                Expired
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm bg-background-primary/50 
                      px-3 py-1 rounded-full">
          <Clock className="w-4 h-4 text-text-secondary" />
          <span>{formatDate(market.resolutionDate)}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-sm text-text-secondary">
            <TrendingUp className="w-4 h-4 text-equinox-green" />
            <span>Total Staked</span>
          </div>
          <div className="font-medium">
            <AnimatedNumber
              value={market.totalStaked}
              decimals={1}
              suffix=" SOL"
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-sm text-text-secondary">
            <Users className="w-4 h-4 text-info" />
            <span>Participants</span>
          </div>
          <div className="font-medium">
            <AnimatedNumber value={totalVotes} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-sm text-text-secondary">
            <AlertCircle className="w-4 h-4 text-warning" />
            <span>Validation Score</span>
          </div>
          <div className="font-medium">
            <AnimatedNumber
              value={validPercentage}
              decimals={1}
              suffix="%"
            />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="relative h-2 bg-background-primary rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-equinox-green to-equinox-green/80
                     transition-all duration-500 ease-out"
            style={{ width: `${validPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm mt-2 text-text-secondary">
          <span>Valid: {market.votes.valid}</span>
          <span>Invalid: {market.votes.invalid}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={(e) => handleValidateClick(e, true)}
          disabled={isExpired || isValidating}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center space-x-2 relative overflow-hidden"
        >
          {isValidating ? (
            <div className="animate-pulse">Validating...</div>
          ) : (
            <>
              <span>Validate</span>
              <span className="text-xs opacity-75">({formatSOL(0.05)} SOL)</span>
            </>
          )}
        </button>
        <button
          onClick={(e) => handleValidateClick(e, false)}
          disabled={isExpired || isValidating}
          className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center space-x-2 relative overflow-hidden"
        >
          {isValidating ? (
            <div className="animate-pulse">Flagging...</div>
          ) : (
            <>
              <span>Flag Issues</span>
              <span className="text-xs opacity-75">({formatSOL(0.03)} SOL)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}