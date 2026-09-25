// src/features/wshg/services/wshgService.ts

import { getStoredCheckItems, saveStoredCheckItems } from '@/features/check/state/checkState';
import type { CheckItem, CheckStatus } from '@/features/shared/types/shared.types';

export const wshgService = {
  getApplications: (): CheckItem[] => {
    return getStoredCheckItems();
  },

  getApplicationById: (idOrCodeOrPhone: string): CheckItem | undefined => {
    const items = getStoredCheckItems();
    const query = idOrCodeOrPhone.trim().toLowerCase();
    return items.find(
      (item) =>
        item.applicationId.toLowerCase() === query ||
        item.code.toLowerCase() === query ||
        item.id === query ||
        (item.contactNumber && item.contactNumber.replace(/\D/g, '').includes(query.replace(/\D/g, '')))
    );
  },

  submitNewRegistration: (data: Record<string, any>): CheckItem => {
    const items = getStoredCheckItems();
    const nextIndex = items.length + 1;
    const applicationId = `WSHG-2026-${String(nextIndex).padStart(3, '0')}`;
    const code = `WSHG-OD-${String(nextIndex).padStart(3, '0')}`;
    const nowStr = new Date().toLocaleDateString('en-GB');

    const newItem: CheckItem = {
      id: String(Date.now()),
      name: data.wshgName || 'Self Help Group',
      applicationId,
      code,
      financialYear: '2025-26',
      phase: 'Phase 1',
      project: data.project || 'Project 1',
      applyDate: nowStr,
      status: 'pending_dswo' as CheckStatus,
      leaderName: data.accountHolderName || data.wshgName || 'SHG Leader',
      contactNumber: data.contact ? `+91 ${data.contact}` : '+91 98610 12345',
      email: data.email || 'wshg@odisha.gov.in',
      block: 'Bhubaneswar',
      district: data.district || 'Khordha',
      bankName: data.bankName || 'State Bank of India',
      accountNumber: data.bankAccountNo || '32098457612',
      ifscCode: data.ifsc || 'SBIN0001023',
      totalMembers: 12,
      activityType: 'Nutritious Meal Catering & Food Processing',
      documentName: data.supportingDocument?.name || 'wshg_byelaws_bankbook.pdf',
      documentType: 'PDF Document',
      documentSize: '1.8 MB',
      geoAddress: data.address || 'Plot 45, Bhubaneswar, Khordha, Odisha',
      geoLatitude: 20.2961,
      geoLongitude: 85.8245,
      history: [
        {
          action: 'Application Submitted Online',
          role: 'BLF',
          date: new Date().toLocaleString('en-IN'),
          remarks: 'SHG registration application received with OTP-verified mobile number and bank details.',
        },
      ],
    };

    saveStoredCheckItems([newItem, ...items]);
    return newItem;
  },
};
