// src/features/blc/services/blcService.ts

import type { BlcMetrics } from '../types/blc.types';
import type { CheckItem } from '@/features/shared';

export const blcService = {
  getMetrics: (items: CheckItem[]): BlcMetrics => {
    let totalPendingCommitteeReview = 0;
    let totalApproved = 0;
    let totalRevertedToBlf = 0;
    let totalRejected = 0;

    items.forEach((item) => {
      if (item.status === 'pending_blc') {
        totalPendingCommitteeReview++;
      } else if (item.status === 'approved') {
        totalApproved++;
      } else if (item.status === 'reverted' && item.revertedAtLevel === 'BLF') {
        totalRevertedToBlf++;
      } else if (item.status === 'rejected') {
        totalRejected++;
      }
    });

    return {
      totalPendingCommitteeReview,
      totalApproved,
      totalRevertedToBlf,
      totalRejected,
      totalInspectedGroups: items.length,
    };
  },
};
