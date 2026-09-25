// src/features/blc/hooks/useBlcVerification.ts

import { useMemo } from 'react';
import { useCheckItems } from '@/features/check/state/checkState';
import type { CheckFilterParams } from '@/features/shared';
import { blcService } from '../services/blcService';

export const useBlcVerification = (filters?: CheckFilterParams, activeTab = 'pending') => {
  const {
    items,
    forwardItem,
    finalApproveItem,
    revertItem,
    rejectItem,
  } = useCheckItems();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTab === 'pending') {
        if (item.status === 'reverted' || item.status === 'rejected' || item.status === 'approved') {
          return false;
        }
        const isPending =
          item.status === 'pending_dswo' ||
          item.status === 'pending_blf' ||
          item.status === 'pending_blc';
        if (!isPending) return false;
      } else if (activeTab === 'approve') {
        if (item.status !== 'approved') return false;
      } else if (activeTab === 'reject') {
        if (item.status !== 'rejected') return false;
      }

      if (filters?.financialYear && filters.financialYear !== 'all' && item.financialYear !== filters.financialYear) {
        return false;
      }
      if (filters?.phase && filters.phase !== 'all') {
        const f = filters.phase.toLowerCase().replace(/[^a-z0-9]/g, '');
        const it = item.phase.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (f !== it) return false;
      }
      if (filters?.project && filters.project !== 'all') {
        const f = filters.project.toLowerCase().replace(/[^a-z0-9]/g, '');
        const it = item.project.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (f !== it) return false;
      }
      return true;
    });
  }, [items, filters, activeTab]);

  const metrics = useMemo(() => {
    return blcService.getMetrics(items);
  }, [items]);

  return {
    items: filteredItems,
    allItems: items,
    metrics,
    forwardItem,
    finalApproveItem,
    revertItem,
    rejectItem,
  };
};

export default useBlcVerification;
