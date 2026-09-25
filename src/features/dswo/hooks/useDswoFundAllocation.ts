// src/features/dswo/hooks/useDswoFundAllocation.ts

import { useState, useMemo } from 'react';
import type { FundRequestItem } from '@/features/shared';
import { getDistrictInitialData } from '@/features/state/pages/FundRequestList';

export const useDswoFundAllocation = (districtName = 'Khordha') => {
  const [data, setData] = useState<FundRequestItem[]>(() =>
    getDistrictInitialData(districtName)
  );

  const totalRequested = useMemo(
    () => data.reduce((acc, curr) => acc + (curr.requestedAmt || 0), 0),
    [data]
  );

  const totalAllocated = useMemo(
    () =>
      data.reduce(
        (acc, curr) =>
          acc +
          (curr.fundAllocated ??
            (typeof curr.allocateAmount === 'number' ? curr.allocateAmount : 0)),
        0
      ),
    [data]
  );

  const submitFundRequest = (newRequest: FundRequestItem) => {
    setData((prev) => [newRequest, ...prev]);
  };

  return {
    data,
    totalRequested,
    totalAllocated,
    submitFundRequest,
  };
};

export default useDswoFundAllocation;
