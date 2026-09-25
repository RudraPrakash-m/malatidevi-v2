// src/features/state/services/stateService.ts

import type {
  StateDistrictFundItem,
  StateFundSummaryMetrics,
} from '../types/state.types';
import { ODISHA_ALL_DISTRICTS_REQUEST_DATA } from '../pages/FundRequestList';

export const stateService = {
  // Fetch state district fund records
  getFundRequests: async (): Promise<StateDistrictFundItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...ODISHA_ALL_DISTRICTS_REQUEST_DATA]);
      }, 150);
    });
  },

  // Calculate summary metrics for state dashboard
  getFundSummaryMetrics: (items: StateDistrictFundItem[]): StateFundSummaryMetrics => {
    let totalAllocated = 0;
    let totalPendingRequests = 0;
    let totalBeneficiaries = 0;
    let fullyPaidDistricts = 0;
    let partiallyPaidDistricts = 0;
    let rejectedDistricts = 0;

    items.forEach((item) => {
      const allocated =
        item.fundAllocated ??
        (typeof item.allocateAmount === 'number' ? item.allocateAmount : 0);
      totalAllocated += allocated;
      totalBeneficiaries += item.totalChildren || 0;

      const upperStatus = String(item.status || '').toUpperCase();
      if (upperStatus === 'FULLY PAID' || upperStatus === 'TOTALLY PAID') {
        fullyPaidDistricts++;
      } else if (upperStatus === 'PARTIALLY PAID' || upperStatus === 'PARTIAL PAID') {
        partiallyPaidDistricts++;
      } else if (upperStatus === 'REJECTED') {
        rejectedDistricts++;
      } else {
        totalPendingRequests += item.requestedAmt || 0;
      }
    });

    const totalBudget = 1000000000; // 100 Crore total state allocation budget

    return {
      totalBudget,
      totalAllocated,
      totalPendingRequests,
      totalDistricts: items.length,
      totalBeneficiaries,
      fullyPaidDistricts,
      partiallyPaidDistricts,
      rejectedDistricts,
    };
  },
};
