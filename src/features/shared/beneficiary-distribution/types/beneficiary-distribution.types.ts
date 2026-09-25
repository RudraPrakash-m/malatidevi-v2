// src/features/shared/beneficiary-distribution/types/beneficiary-distribution.types.ts

export interface BeneficiaryDistributionItem {
  id: string;
  eventDate: string;
  project?: string;
  sector?: string;
  anganwadiCentre: string;
  villageWard: string;

  totalEligible: number;
  selectedChildren: number;

  shoes: number;
  sweaters: number;
  uniforms: number;

  eventPhoto: string;

  status: string;
}

export interface BeneficiaryDistributionFormData {
  name: string;
  code: string;
  status: string;
  description?: string;
}

export type BeneficiaryDistributionRecord = BeneficiaryDistributionItem;
