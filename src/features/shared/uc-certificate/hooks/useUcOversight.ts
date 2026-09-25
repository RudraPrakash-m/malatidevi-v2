// src/features/shared/uc-certificate/hooks/useUcOversight.ts

import { useState, useEffect, useCallback } from 'react';
import type { UcOversightItem } from '../types/uc-certificate.types';
import { ucCertificateService } from '../services/ucCertificateService';

export const useUcOversight = () => {
  const [ucRecords, setUcRecords] = useState<UcOversightItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    ucCertificateService.getUcRecords().then((data) => {
      setUcRecords(data);
      setLoading(false);
    });
  }, []);

  const verifyUc = useCallback(async (id: string, auditRemarks?: string) => {
    const updated = await ucCertificateService.updateUcStatus(id, 'VERIFIED', auditRemarks);
    setUcRecords(updated);
  }, []);

  const revertUc = useCallback(async (id: string, auditRemarks: string) => {
    const updated = await ucCertificateService.updateUcStatus(id, 'REVERTED', auditRemarks);
    setUcRecords(updated);
  }, []);

  return {
    ucRecords,
    loading,
    verifyUc,
    revertUc,
  };
};

export default useUcOversight;
