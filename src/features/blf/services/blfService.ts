// src/features/blf/services/blfService.ts

import type { BlfMetrics } from '../types/blf.types';
import type { CheckItem } from '@/features/shared';

export const blfService = {
  getMetrics: (items: CheckItem[]): BlfMetrics => {
    let totalPendingScrutiny = 0;
    let totalForwardedToBlc = 0;
    let totalReverted = 0;
    let totalRejected = 0;

    items.forEach((item) => {
      if (item.status === 'pending_blf') {
        totalPendingScrutiny++;
      } else if (item.status === 'pending_blc' || item.status === 'pending_dswo' || item.status === 'approved') {
        totalForwardedToBlc++;
      } else if (item.status === 'reverted') {
        totalReverted++;
      } else if (item.status === 'rejected') {
        totalRejected++;
      }
    });

    return {
      totalPendingScrutiny,
      totalForwardedToBlc,
      totalReverted,
      totalRejected,
      totalRegisteredGroups: items.length,
    };
  },
};
