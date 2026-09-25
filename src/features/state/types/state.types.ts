// src/features/state/types/state.types.ts

export type FundRequestStatus = 'PENDING' | 'PARTIALLY PAID' | 'FULLY PAID' | 'REJECTED' | string;

export interface StateDistrictFundItem {
  id: string;
  district: string;
  financialYear: string;
  allocationDate?: string;
  project: number | string;
  sectors: number;
  awcCount: number;
  totalChildren: number;
  itemCategory: string;
  requestedAmt: number;
  allocateAmount?: number | '';
  fundAllocated?: number;
  status: FundRequestStatus;
  requestedBy?: string;
  purpose?: string;
  rejectionRemarks?: string;
}

export interface StateFundSummaryMetrics {
  totalBudget: number;
  totalAllocated: number;
  totalPendingRequests: number;
  totalDistricts: number;
  totalBeneficiaries: number;
  fullyPaidDistricts: number;
  partiallyPaidDistricts: number;
  rejectedDistricts: number;
}

export interface StateFundAllocationFormData {
  financialYear: string;
  district: string;
  itemCategory: string;
  allocatedAmount: number;
  remarks?: string;
}
