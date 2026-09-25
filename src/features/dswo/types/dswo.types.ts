// src/features/dswo/types/dswo.types.ts

export interface DswoMetrics {
  totalPendingVerification: number;
  totalApproved: number;
  totalReverted: number;
  totalRejected: number;
  totalFundsRequested: number;
  totalFundsAllocated: number;
  totalBeneficiaries: number;
  activeProjects: number;
}

export interface BeneficiaryDistributionItem {
  id: string;
  financialYear: string;
  district: string;
  project: string;
  sector: string;
  awcName: string;
  itemCategory: string;
  totalEligibleChildren: number;
  distributedCount: number;
  distributionDate: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  awwName: string;
  awwContact: string;
}

export interface DswoFundRequestFormData {
  financialYear: string;
  district: string;
  project: string;
  itemCategory: string;
  totalChildren: number;
  requestedAmt: number;
  purpose: string;
  remarks?: string;
}
