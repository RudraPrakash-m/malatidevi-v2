// src/features/fund-allocation/types/fund-allocation.types.ts

// src/features/fund-allocation/types/fund-allocation.types.ts

export interface FundAllocationItem {
  id: string;
  financialYear?: string;
  district: string;
  project: string;
  phase: string;
  status: 'pending' | 'rejected' | 'reverted' | 'approved';
  childrenCount: number;
  requestedAmount: number;
  allocatedAmount: number;
  remarks?: string;
  revertRemarks?: string;
  rejectRemarks?: string;
}

export interface FundAllocationFormData {
  name: string;
  code: string;
  status: string;
  description?: string;
}
