// src/features/state/hooks/useStateFundAllocation.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { StateDistrictFundItem, StateFundSummaryMetrics } from '../types/state.types';
import { stateService } from '../services/stateService';

export const useStateFundAllocation = () => {
  const [items, setItems] = useState<StateDistrictFundItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    stateService.getFundRequests().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const metrics: StateFundSummaryMetrics = useMemo(() => {
    return stateService.getFundSummaryMetrics(items);
  }, [items]);

  const updateItem = useCallback((updated: StateDistrictFundItem) => {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  }, []);

  return {
    items,
    setItems,
    loading,
    metrics,
    updateItem,
  };
};

export default useStateFundAllocation;
