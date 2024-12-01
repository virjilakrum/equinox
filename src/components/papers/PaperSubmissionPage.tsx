import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PaperSubmissionForm } from './PaperSubmissionForm';
import type { ResearchPaper } from '../../types/paper';

export function PaperSubmissionPage() {
  const { connected } = useWallet();

  const handleSubmit = (paper: Partial<ResearchPaper>) => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }
    // TODO: Implement submission logic when wallet integration is ready
    console.log('Submitting paper:', paper);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-heading mb-8">Submit Research Paper</h1>
      {!connected ? (
        <div className="card text-center py-12">
          <p className="text-text-secondary mb-4">
            Connect your wallet to submit a research paper
          </p>
          <p className="text-sm text-text-secondary">
            You'll need some SOL in your wallet for the submission stake
          </p>
        </div>
      ) : (
        <div className="card">
          <PaperSubmissionForm onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}