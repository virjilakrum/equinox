import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createMarket } from '../../services/solana';
import type { ValidationMarket } from '../../types/paper';

interface CreateMarketFormProps {
  onSubmit: (market: ValidationMarket) => void;
  onCancel: () => void;
}

interface CreateMarketFormData {
  paperId: string;
  validationCriteria: string;
  resolutionDate: string;
  initialStake: number;
}

export function CreateMarketForm({ onSubmit, onCancel }: CreateMarketFormProps) {
  const wallet = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateMarketFormData>({
    paperId: '',
    validationCriteria: '',
    resolutionDate: '',
    initialStake: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createMarket(wallet, {
        paperId: formData.paperId,
        question: formData.validationCriteria,
        resolutionDate: new Date(formData.resolutionDate).getTime(),
        initialStake: formData.initialStake,
      });

      const newMarket: ValidationMarket = {
        marketId: result.marketId,
        paperId: formData.paperId,
        validationCriteria: formData.validationCriteria,
        resolutionDate: new Date(formData.resolutionDate).getTime(),
        totalStaked: formData.initialStake,
        votes: { valid: 0, invalid: 0 },
        validationMetrics: {
          methodology: 0,
          reproducibility: 0,
          significance: 0,
        },
      };

      onSubmit(newMarket);
    } catch (error) {
      console.error('Error creating market:', error);
      alert('Failed to create market. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="paperId" className="block text-sm font-medium">
          Paper ID
        </label>
        <input
          type="text"
          id="paperId"
          value={formData.paperId}
          onChange={(e) => setFormData({ ...formData, paperId: e.target.value })}
          className="w-full px-3 py-2 bg-background-primary border border-equinox-silver/20 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="validationCriteria" className="block text-sm font-medium">
          Validation Criteria
        </label>
        <textarea
          id="validationCriteria"
          value={formData.validationCriteria}
          onChange={(e) => setFormData({ ...formData, validationCriteria: e.target.value })}
          className="w-full h-32 px-3 py-2 bg-background-primary border border-equinox-silver/20 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="resolutionDate" className="block text-sm font-medium">
          Resolution Date
        </label>
        <input
          type="date"
          id="resolutionDate"
          value={formData.resolutionDate}
          onChange={(e) => setFormData({ ...formData, resolutionDate: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 bg-background-primary border border-equinox-silver/20 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="initialStake" className="block text-sm font-medium">
          Initial Stake (SOL)
        </label>
        <input
          type="number"
          id="initialStake"
          min="1"
          step="0.1"
          value={formData.initialStake}
          onChange={(e) => setFormData({ ...formData, initialStake: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 bg-background-primary border border-equinox-silver/20 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
          required
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Market'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}