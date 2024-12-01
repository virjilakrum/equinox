import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import type { ResearchPaper } from '../../types/paper';

interface PaperSubmissionFormProps {
  onSubmit: (paper: Partial<ResearchPaper>) => void;
}

export function PaperSubmissionForm({ onSubmit }: PaperSubmissionFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    stakeAmount: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Paper Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 bg-background-primary border border-equinox-silver/20 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="abstract" className="block text-sm font-medium">
          Abstract
        </label>
        <textarea
          id="abstract"
          value={formData.abstract}
          onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
          className="w-full h-32 px-3 py-2 bg-background-primary border border-equinox-silver/20 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="stake" className="block text-sm font-medium">
          Stake Amount (SOL)
        </label>
        <input
          type="number"
          id="stake"
          min="1"
          step="0.1"
          value={formData.stakeAmount}
          onChange={(e) => setFormData({ ...formData, stakeAmount: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 bg-background-primary border border-equinox-silver/20 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Paper PDF</label>
        <div className="border-2 border-dashed border-equinox-silver/20 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-text-secondary" />
          <p className="mt-2 text-sm text-text-secondary">
            Drag and drop your paper PDF here, or click to select
          </p>
          <input type="file" className="hidden" accept=".pdf" />
        </div>
      </div>

      <button type="submit" className="btn-primary w-full">
        Submit Paper
      </button>
    </form>
  );
}