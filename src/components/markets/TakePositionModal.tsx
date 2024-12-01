import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { formatSOL } from '../../utils/format';

interface TakePositionModalProps {
  isOpen: boolean;
  position: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  minStake?: number;
}

export function TakePositionModal({
  isOpen,
  position,
  onClose,
  onConfirm,
  minStake = 1,
}: TakePositionModalProps) {
  const [stakeAmount, setStakeAmount] = useState(minStake);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-equinox-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-background-secondary rounded-xl max-w-md w-full p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            position ? 'bg-success/20' : 'bg-error/20'
          }`}>
            {position ? (
              <ThumbsUp className="w-6 h-6 text-success" />
            ) : (
              <ThumbsDown className="w-6 h-6 text-error" />
            )}
          </div>
          <h3 className="text-xl font-bold font-heading">
            Take {position ? 'Yes' : 'No'} Position
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="stakeAmount" className="block text-sm font-medium">
              Stake Amount (SOL)
            </label>
            <input
              type="number"
              id="stakeAmount"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Math.max(minStake, parseFloat(e.target.value)))}
              min={minStake}
              step="0.1"
              className="w-full px-3 py-2 bg-background-primary border border-equinox-silver/20 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
            />
            <p className="text-xs text-text-secondary">
              Minimum stake: {formatSOL(minStake)} SOL
            </p>
          </div>

          <div className="bg-background-primary rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Important</p>
              <p className="text-text-secondary mt-1">
                Positions cannot be modified after confirmation. Ensure the stake amount is correct.
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => onConfirm(stakeAmount)}
            className="flex-1 btn-primary"
          >
            Confirm Position
          </button>
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}