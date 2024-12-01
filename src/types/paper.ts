export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  contentHash: string;
  authorPublicKey: string;
  timestamp: number;
  stakeAmount: number;
  methodology: string;
  results: string;
  conclusion: string;
}

export interface ValidationMarket {
  marketId: string;
  paperId: string;
  validationCriteria: string;
  resolutionDate: number;
  totalStaked: number;
  votes: {
    valid: number;
    invalid: number;
  };
  validationMetrics: {
    methodology: number;
    reproducibility: number;
    significance: number;
  };
}

export interface ReputationScore {
  publicKey: string;
  score: number;
  paperCount: number;
  successfulValidations: number;
  totalValidations: number;
  expertiseAreas: string[];
}