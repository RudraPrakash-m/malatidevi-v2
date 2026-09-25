// src/features/wshg/hooks/useWshgRegistration.ts

import { useState, useEffect } from 'react';
import { wshgService } from '../services/wshgService';
import type { CheckItem } from '@/features/shared/types/shared.types';

export const useWshgRegistration = () => {
  const [applications, setApplications] = useState<CheckItem[]>(wshgService.getApplications);

  useEffect(() => {
    const refresh = () => setApplications(wshgService.getApplications());
    window.addEventListener('wcd-check-storage-updated', refresh);
    return () => window.removeEventListener('wcd-check-storage-updated', refresh);
  }, []);

  const registerWshg = (data: Record<string, any>) => {
    return wshgService.submitNewRegistration(data);
  };

  return {
    applications,
    registerWshg,
  };
};

export default useWshgRegistration;
