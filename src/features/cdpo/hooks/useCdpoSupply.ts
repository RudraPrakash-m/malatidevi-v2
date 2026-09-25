// src/features/cdpo/hooks/useCdpoSupply.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { SupplyOrderItem, CdpoMetrics } from '../types/cdpo.types';
import { cdpoService } from '../services/cdpoService';

export const useCdpoSupply = () => {
  const [orders, setOrders] = useState<SupplyOrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    cdpoService.getSupplyOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const metrics: CdpoMetrics = useMemo(() => {
    return cdpoService.getMetrics(orders);
  }, [orders]);

  const addOrder = useCallback(async (newOrder: SupplyOrderItem) => {
    const updated = await cdpoService.createSupplyOrder(newOrder);
    setOrders(updated);
  }, []);

  return {
    orders,
    loading,
    metrics,
    addOrder,
  };
};

export default useCdpoSupply;
