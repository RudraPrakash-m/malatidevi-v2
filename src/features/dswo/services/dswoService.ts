// src/features/dswo/services/dswoService.ts

import type {
  DswoMetrics,
  BeneficiaryDistributionItem,
} from '../types/dswo.types';
import type { CheckItem, FundRequestItem } from '@/features/shared';

const DSWO_BENEFICIARY_STORAGE_KEY = 'wcd_dswo_beneficiaries_v1';

export const INITIAL_BENEFICIARY_DATA: BeneficiaryDistributionItem[] = [
  {
    id: 'BEN-001',
    financialYear: '2025-26',
    district: 'Khordha',
    project: 'Bhubaneswar Urban',
    sector: 'Unit 1 Sector',
    awcName: 'Gopinathpur AWC 01',
    itemCategory: 'Uniform Pair (2 Sets)',
    totalEligibleChildren: 45,
    distributedCount: 45,
    distributionDate: '12/09/2026',
    status: 'COMPLETED',
    awwName: 'Puspanjali Sahoo',
    awwContact: '+91 94371 00214',
  },
  {
    id: 'BEN-002',
    financialYear: '2025-26',
    district: 'Khordha',
    project: 'Jatni Project',
    sector: 'Khurda Road Sector',
    awcName: 'Jatni Ward 4 AWC',
    itemCategory: 'Winter Sweater',
    totalEligibleChildren: 38,
    distributedCount: 30,
    distributionDate: '10/09/2026',
    status: 'IN_PROGRESS',
    awwName: 'Mamata Das',
    awwContact: '+91 98612 44321',
  },
  {
    id: 'BEN-003',
    financialYear: '2025-26',
    district: 'Khordha',
    project: 'Balianta Project',
    sector: 'Prataprudrapur',
    awcName: 'Balianta Main AWC',
    itemCategory: 'Uniform Pair (2 Sets)',
    totalEligibleChildren: 52,
    distributedCount: 0,
    distributionDate: 'Pending',
    status: 'PENDING',
    awwName: 'Snehalata Jena',
    awwContact: '+91 94380 99123',
  },
];

export const dswoService = {
  // Calculate summary metrics for DSWO
  getMetrics: (
    checkItems: CheckItem[],
    fundRequests: FundRequestItem[],
    districtName = 'Khordha'
  ): DswoMetrics => {
    let totalApproved = 0;
    let totalReverted = 0;
    let totalRejected = 0;
    let totalPendingVerification = 0;

    checkItems.forEach((item) => {
      if (item.status === 'approved') totalApproved++;
      else if (item.status === 'reverted') totalReverted++;
      else if (item.status === 'rejected') totalRejected++;
      else totalPendingVerification++;
    });

    let totalFundsRequested = 0;
    let totalFundsAllocated = 0;
    let totalBeneficiaries = 0;

    fundRequests.forEach((req) => {
      if (req.district === districtName) {
        totalFundsRequested += req.requestedAmt || 0;
        totalFundsAllocated +=
          req.fundAllocated ??
          (typeof req.allocateAmount === 'number' ? req.allocateAmount : 0);
        totalBeneficiaries += req.totalChildren || 0;
      }
    });

    return {
      totalPendingVerification,
      totalApproved,
      totalReverted,
      totalRejected,
      totalFundsRequested,
      totalFundsAllocated,
      totalBeneficiaries: totalBeneficiaries || 35700,
      activeProjects: 10,
    };
  },

  // Fetch beneficiary distributions
  getBeneficiaries: async (): Promise<BeneficiaryDistributionItem[]> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(DSWO_BENEFICIARY_STORAGE_KEY);
        if (stored) {
          try {
            resolve(JSON.parse(stored));
            return;
          } catch {
            // fallback to initial data
          }
        }
      }
      resolve([...INITIAL_BENEFICIARY_DATA]);
    });
  },

  // Save new beneficiary distribution
  addBeneficiaryDistribution: async (
    item: BeneficiaryDistributionItem
  ): Promise<BeneficiaryDistributionItem[]> => {
    const current = await dswoService.getBeneficiaries();
    const updated = [item, ...current];
    if (typeof window !== 'undefined') {
      localStorage.setItem(DSWO_BENEFICIARY_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },
};
