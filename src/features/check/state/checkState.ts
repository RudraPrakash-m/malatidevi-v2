// src/features/check/state/checkState.ts

import { useState, useEffect } from 'react';
import type { CheckItem, CheckRole, CheckStatus } from '../types/check.types';

const STORAGE_KEY = 'wcd_wshg_check_items_v9';

// Clear legacy storage keys if present
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('wcd_wshg_check_items_v8');
    localStorage.removeItem('wcd_wshg_check_items_v7');
    localStorage.removeItem('wcd_wshg_check_items_v6');
    localStorage.removeItem('wcd_wshg_check_items_v5');
    localStorage.removeItem('wcd_wshg_check_items_v4');
    localStorage.removeItem('wcd_wshg_check_items_v3');
    localStorage.removeItem('wcd_wshg_check_items_v2');
    localStorage.removeItem('wcd_wshg_check_items_v1');
  } catch {
    // ignore
  }
}

export const INITIAL_CHECK_DATA: CheckItem[] = [
  {
    id: '1',
    name: 'Maa Tarini Self Help Group',
    applicationId: 'WSHG-2026-001',
    code: 'WSHG-OD-001',
    financialYear: '2025-26',
    phase: 'Phase 1',
    project: 'Project 1',
    applyDate: '18/08/2026',
    status: 'pending_dswo',
    leaderName: 'Sunita Majhi',
    contactNumber: '+91 98610 12345',
    email: 'tarini.shg@odisha.gov.in',
    block: 'Bhubaneswar',
    district: 'Khordha',
    bankName: 'State Bank of India',
    accountNumber: '32098457612',
    ifscCode: 'SBIN0001023',
    totalMembers: 12,
    activityType: 'Nutritious Meal Catering & Food Processing',
    documentName: 'maa_tarini_byelaws_bankbook.pdf',
    documentType: 'PDF Document',
    documentSize: '1.8 MB',
    geoTagPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    geoLatitude: 20.2961,
    geoLongitude: 85.8245,
    geoAccuracy: '3.4 meters',
    geoAddress: 'Plot 45, Gopinathpur, Bhubaneswar, Khordha, Odisha - 751002',
    geoTimestamp: '18/08/2026 11:34 AM',
    history: [
      {
        action: 'Application Submitted',
        role: 'BLF',
        date: '18/08/2026 10:15 AM',
        remarks: 'SHG registration application received online.',
      },
    ],
  },
  {
    id: '2',
    name: 'Sakhi Mahila Samiti',
    applicationId: 'WSHG-2026-002',
    code: 'WSHG-OD-002',
    financialYear: '2025-26',
    phase: 'Phase 1',
    project: 'Project 1',
    applyDate: '20/08/2026',
    status: 'pending_blf',
    l1Remarks: 'Physical verification conducted on 21/08/2026. Registers and bank passbook found satisfactory.',
    leaderName: 'Pravasini Nayak',
    contactNumber: '+91 94370 23456',
    email: 'sakhi.shg@odisha.gov.in',
    block: 'Jatni',
    district: 'Khordha',
    bankName: 'Odisha Gramya Bank',
    accountNumber: '44590123847',
    ifscCode: 'OGBA0001204',
    totalMembers: 15,
    activityType: 'Dry Ration Supply & Packaging',
    documentName: 'sakhi_inspection_audit_sheet.pdf',
    documentType: 'PDF Document',
    documentSize: '2.4 MB',
    geoTagPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    geoLatitude: 20.1654,
    geoLongitude: 85.7061,
    geoAccuracy: '2.1 meters',
    geoAddress: 'Ward 3, Main Market Road, Jatni, Khordha, Odisha - 752050',
    geoTimestamp: '21/08/2026 02:15 PM',
    history: [
      {
        action: 'Application Submitted',
        role: 'BLF',
        date: '20/08/2026 09:40 AM',
        remarks: 'Application logged with Aadhaar eKYC completed.',
      },
      {
        action: 'Forwarded to BLC',
        role: 'BLF',
        date: '21/08/2026 04:30 PM',
        remarks: 'Physical verification conducted. Registers and bank passbook found satisfactory.',
        attachmentName: 'blf_verification_checklist.pdf',
      },
    ],
  },
  {
    id: '3',
    name: 'Maa Mangala Women Group',
    applicationId: 'WSHG-2026-003',
    code: 'WSHG-OD-003',
    financialYear: '2026-27',
    phase: 'Phase 2',
    project: 'Project 2',
    applyDate: '22/08/2026',
    status: 'pending_blc',
    l1Remarks: 'BLF verified all 10 member Aadhaar cards and resolution copy.',
    l2Remarks: 'BLC Committee reviewed on 24/08/2026. Recommended for final DSWO sanction and onboarding.',
    leaderName: 'Anusaya Barik',
    contactNumber: '+91 97780 34567',
    email: 'mangala.shg@odisha.gov.in',
    block: 'Balianta',
    district: 'Khordha',
    bankName: 'UCO Bank',
    accountNumber: '11029837465',
    ifscCode: 'UCBA0000492',
    totalMembers: 10,
    activityType: 'Ready-to-Eat Food Formulation & Transport',
    documentName: 'blc_approval_resolution_copy.pdf',
    documentType: 'PDF Document',
    documentSize: '3.1 MB',
    geoTagPhoto: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=80',
    geoLatitude: 20.3128,
    geoLongitude: 85.8921,
    geoAccuracy: '4.0 meters',
    geoAddress: 'Village Purunapadhan, Balianta, Khordha - 752100',
    geoTimestamp: '23/08/2026 10:45 AM',
    history: [
      {
        action: 'Application Submitted',
        role: 'BLF',
        date: '22/08/2026 11:10 AM',
      },
      {
        action: 'Forwarded to BLC',
        role: 'BLF',
        date: '23/08/2026 03:00 PM',
        remarks: 'BLF verified all 10 member Aadhaar cards and resolution copy.',
      },
      {
        action: 'Forwarded to DSWO (Top Level)',
        role: 'BLC',
        date: '24/08/2026 05:20 PM',
        remarks: 'BLC Committee reviewed on 24/08/2026. Recommended for final DSWO sanction and onboarding.',
        attachmentName: 'blc_minutes_signed.pdf',
      },
    ],
  },
  {
    id: '4',
    name: 'Jay Maa Samaleswari SHG',
    applicationId: 'WSHG-2026-004',
    code: 'WSHG-OD-004',
    financialYear: '2025-26',
    phase: 'Phase 1',
    project: 'Project 1',
    applyDate: '10/08/2026',
    status: 'approved',
    l1Remarks: 'Pre-scrutiny completed with zero deviations.',
    l2Remarks: 'Approved for institutional procurement participation.',
    l3Remarks: 'Final approval accorded by DSWO. Official credentials generated and SMS dispatched.',
    actionTypeTaken: 'Approve',
    credentials: {
      userId: 'WSHG_SAMALESWARI_04',
      temporaryPassword: 'Wshg@2026#SecurePass',
      mobileNumber: '+91 98612 99887',
      smsSentAt: '25/08/2026 11:30 AM',
      smsDeliveryStatus: 'Delivered',
    },
    leaderName: 'Kalyani Sahu',
    contactNumber: '+91 98612 99887',
    email: 'samaleswari.shg@odisha.gov.in',
    block: 'Banapur',
    district: 'Khordha',
    bankName: 'Canara Bank',
    accountNumber: '55610293847',
    ifscCode: 'CNRB0002194',
    totalMembers: 14,
    activityType: 'Nutrition Supplement Processing',
    documentName: 'dswo_final_sanction_order_004.pdf',
    documentType: 'PDF Document',
    documentSize: '1.2 MB',
    geoTagPhoto: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&auto=format&fit=crop&q=80',
    geoLatitude: 19.7842,
    geoLongitude: 85.1789,
    geoAccuracy: '1.8 meters',
    geoAddress: 'Kacheri Road, Near Block Office, Banapur, Khordha - 752031',
    geoTimestamp: '12/08/2026 09:12 AM',
    history: [
      {
        action: 'Application Submitted',
        role: 'BLF',
        date: '10/08/2026 08:30 AM',
      },
      {
        action: 'Forwarded to BLC',
        role: 'BLF',
        date: '12/08/2026 12:00 PM',
        remarks: 'Pre-scrutiny completed with zero deviations.',
      },
      {
        action: 'Forwarded to DSWO',
        role: 'BLC',
        date: '18/08/2026 04:00 PM',
        remarks: 'Approved for institutional procurement participation.',
      },
      {
        action: 'Final Approved & Credentials Dispatched',
        role: 'DSWO',
        date: '25/08/2026 11:30 AM',
        remarks: 'Final approval accorded by DSWO. Official credentials generated and SMS dispatched.',
      },
    ],
  },

  {
    id: '5',
    name: 'Maa Saraswati Women SHG',
    applicationId: 'WSHG-2026-005',
    code: 'WSHG-OD-005',
    financialYear: '2025-26',
    phase: 'Phase 1',
    project: 'Project 1',
    applyDate: '15/08/2026',
    status: 'approved',
    l1Remarks: 'Physical verification completed and verified by BLF.',
    l2Remarks: 'Approved for institutional procurement participation.',
    l3Remarks: 'Final approval accorded by DSWO. Official credentials generated.',
    actionTypeTaken: 'Approve',
    credentials: {
      userId: 'WSHG_SARASWATI_05',
      temporaryPassword: 'Wshg@2026#Saraswati',
      mobileNumber: '+91 94370 11223',
      smsSentAt: '26/08/2026 10:15 AM',
      smsDeliveryStatus: 'Delivered',
    },
    leaderName: 'Minati Biswal',
    contactNumber: '+91 94370 11223',
    email: 'saraswati.shg@odisha.gov.in',
    block: 'Balianta',
    district: 'Khordha',
    bankName: 'UCO Bank',
    accountNumber: '11029837499',
    ifscCode: 'UCBA0000492',
    totalMembers: 12,
    activityType: 'Dry Ration & Uniform Supply',
    documentName: 'saraswati_approval_order.pdf',
    documentType: 'PDF Document',
    documentSize: '1.5 MB',
    geoTagPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    geoLatitude: 20.3150,
    geoLongitude: 85.8950,
    geoAccuracy: '2.5 meters',
    geoAddress: 'Balianta Block, Khordha - 752100',
    geoTimestamp: '15/08/2026 01:00 PM',
    history: [
      {
        action: 'Application Submitted',
        role: 'BLF',
        date: '15/08/2026 10:00 AM',
      },
      {
        action: 'Final Approved & Credentials Dispatched',
        role: 'DSWO',
        date: '26/08/2026 10:15 AM',
        remarks: 'Final approval accorded by DSWO.',
      },
    ],
  },

  {
    id: '6',
    name: 'Parijat Self Help Group',
    applicationId: 'WSHG-2026-006',
    code: 'WSHG-OD-006',
    financialYear: '2025-26',
    phase: 'Phase 2',
    project: 'Project 2',
    applyDate: '08/08/2026',
    status: 'rejected',
    rejectionReason: 'Duplicate bank account number in Khordha district. Ineligible under Phase 2 procurement guidelines.',
    rejectedBy: 'BLF',
    l1Remarks: 'Rejected by BLF: Duplicate bank account number in Khordha district. Ineligible under Phase 2 procurement guidelines.',
    leaderName: 'Basanti Rout',
    contactNumber: '+91 94371 88990',
    email: 'parijat.shg@odisha.gov.in',
    block: 'Jatni',
    district: 'Khordha',
    bankName: 'State Bank of India',
    accountNumber: '32098457612',
    ifscCode: 'SBIN0001023',
    totalMembers: 10,
    activityType: 'Dry Ration Supply',
    documentName: 'parijat_bank_passbook.pdf',
    documentType: 'PDF Document',
    documentSize: '2.0 MB',
    geoTagPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    geoLatitude: 20.1700,
    geoLongitude: 85.7100,
    geoAccuracy: '3.0 meters',
    geoAddress: 'Main Road, Jatni, Khordha - 752050',
    geoTimestamp: '08/08/2026 11:15 AM',
    history: [
      {
        action: 'Application Submitted',
        role: 'BLF',
        date: '08/08/2026 11:00 AM',
      },
      {
        action: 'Rejected by BLF',
        role: 'BLF',
        date: '14/08/2026 04:45 PM',
        remarks: 'Duplicate bank account number in Khordha district. Ineligible under Phase 2 procurement guidelines.',
      },
    ],
  },
  {
    id: '7',
    name: 'Bhabani Mahila Mandal',
    applicationId: 'WSHG-2026-007',
    code: 'WSHG-OD-007',
    financialYear: '2025-26',
    phase: 'Phase 1',
    project: 'Project 1',
    applyDate: '05/08/2026',
    status: 'rejected',
    rejectionReason: 'Discrepancy in bank passbook account number and IFSC code.',
    rejectedBy: 'BLF',
    l1Remarks: 'Rejected by BLF: Discrepancy in bank passbook account number and IFSC code.',
    leaderName: 'Sasmita Jena',
    contactNumber: '+91 98611 22334',
    email: 'bhabani.shg@odisha.gov.in',
    block: 'Bhubaneswar',
    district: 'Khordha',
    bankName: 'Odisha Gramya Bank',
    accountNumber: '44590123847',
    ifscCode: 'OGBA0001204',
    totalMembers: 11,
    activityType: 'Dry Ration Supply & Packaging',
    documentName: 'bhabani_passbook.pdf',
    documentType: 'PDF Document',
    documentSize: '1.6 MB',
    geoTagPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    geoLatitude: 20.2961,
    geoLongitude: 85.8245,
    geoAccuracy: '2.8 meters',
    geoAddress: 'Gopinathpur, Bhubaneswar, Khordha - 751002',
    geoTimestamp: '05/08/2026 02:20 PM',
    history: [
      {
        action: 'Application Submitted',
        role: 'BLF',
        date: '05/08/2026 10:30 AM',
      },
      {
        action: 'Rejected by BLF',
        role: 'BLF',
        date: '10/08/2026 03:30 PM',
        remarks: 'Discrepancy in bank passbook account number and IFSC code.',
      },
    ],
  },
];

// Helper to get stored items or initialize
export const getStoredCheckItems = (): CheckItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load check items from storage', e);
  }
  return INITIAL_CHECK_DATA;
};

// Global event bus for multi-tab / cross-component reactivity
const LISTENERS = new Set<() => void>();

export const saveStoredCheckItems = (items: CheckItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('wcd-check-storage-updated'));
    LISTENERS.forEach((listener) => listener());
  } catch (e) {
    console.error('Failed to save check items to storage', e);
  }
};

export const addCheckItem = (newItem: CheckItem) => {
  const current = getStoredCheckItems();
  saveStoredCheckItems([newItem, ...current]);
};

export const resetCheckDataToDefault = () => {
  saveStoredCheckItems(INITIAL_CHECK_DATA);
};

// React hook to use check items with reactive updates
export const useCheckItems = () => {
  const [items, setItems] = useState<CheckItem[]>(getStoredCheckItems);

  useEffect(() => {
    const refresh = () => setItems(getStoredCheckItems());

    LISTENERS.add(refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('wcd-check-storage-updated', refresh);

    return () => {
      LISTENERS.delete(refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('wcd-check-storage-updated', refresh);
    };
  }, []);

  // Action helpers
  const forwardItem = (
    id: string,
    currentRole: CheckRole,
    remarks: string,
    actionType: 'Forward' | 'Approve' | 'Tag Existing',
    taggedWshgId?: string,
    taggedWshgName?: string,
    attachmentFile?: File | null
  ) => {
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    const current = getStoredCheckItems();

    const updated = current.map((item) => {
      if (item.id !== id) return item;

      let nextStatus: CheckStatus = item.status;
      const targetRoleName = currentRole === 'DSWO' ? 'BLF' : currentRole === 'BLF' ? 'BLC' : 'Approved';
      const historyEntry = {
        action: currentRole === 'BLC' ? 'Final Selection Approved' : `Forwarded to ${targetRoleName}`,
        role: currentRole,
        date: nowStr,
        remarks,
        attachmentName: attachmentFile ? attachmentFile.name : undefined,
      };

      if (currentRole === 'DSWO') {
        nextStatus = 'pending_blf';
        return {
          ...item,
          status: nextStatus,
          l1Remarks: remarks,
          actionTypeTaken: actionType,
          taggedExistingWshgId: taggedWshgId,
          taggedExistingWshgName: taggedWshgName,
          history: [...(item.history || []), historyEntry],
        };
      } else if (currentRole === 'BLF') {
        nextStatus = 'pending_blc';
        return {
          ...item,
          status: nextStatus,
          l2Remarks: remarks,
          actionTypeTaken: actionType,
          taggedExistingWshgId: taggedWshgId,
          taggedExistingWshgName: taggedWshgName,
          history: [...(item.history || []), historyEntry],
        };
      } else if (currentRole === 'BLC') {
        if (actionType === 'Approve' || actionType === 'Tag Existing') {
          const cleanName = item.name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 8);
          const generatedUserId = `WSHG_${cleanName}_${item.id.padStart(2, '0')}`;
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          const generatedPassword = `Wshg@${new Date().getFullYear()}#${randomSuffix}`;

          return {
            ...item,
            status: 'approved' as CheckStatus,
            l3Remarks: remarks,
            actionTypeTaken: actionType,
            taggedExistingWshgId: taggedWshgId,
            taggedExistingWshgName: taggedWshgName,
            credentials: {
              userId: generatedUserId,
              temporaryPassword: generatedPassword,
              mobileNumber: item.contactNumber,
              smsSentAt: nowStr,
              smsDeliveryStatus: 'Delivered' as const,
            },
            history: [
              ...(item.history || []),
              {
                action: 'Final Selection Approved & Credentials Dispatched',
                role: 'BLC' as CheckRole,
                date: nowStr,
                remarks: remarks || 'Final empanelment approved by Block Level Committee. Official credentials generated and SMS notification dispatched.',
                attachmentName: attachmentFile ? attachmentFile.name : undefined,
              },
            ],
          };
        }
      }

      return item;
    });

    saveStoredCheckItems(updated);
  };

  const finalApproveItem = (
    id: string,
    remarks: string,
    actionType: 'Approve' | 'Tag Existing',
    taggedWshgId?: string,
    taggedWshgName?: string,
    attachmentFile?: File | null
  ) => {
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    const current = getStoredCheckItems();

    const updated = current.map((item): CheckItem => {
      if (item.id !== id) return item;

      // Auto-generate credentials
      const cleanName = item.name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 8);
      const generatedUserId = `WSHG_${cleanName}_${item.id.padStart(2, '0')}`;
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedPassword = `Wshg@${new Date().getFullYear()}#${randomSuffix}`;

      return {
        ...item,
        status: 'approved' as CheckStatus,
        l3Remarks: remarks,
        actionTypeTaken: actionType,
        taggedExistingWshgId: taggedWshgId,
        taggedExistingWshgName: taggedWshgName,
        credentials: {
          userId: generatedUserId,
          temporaryPassword: generatedPassword,
          mobileNumber: item.contactNumber,
          smsSentAt: nowStr,
          smsDeliveryStatus: 'Delivered' as const,
        },
        history: [
          ...(item.history || []),
          {
            action: 'Final Approved & Credentials Dispatched',
            role: 'DSWO' as CheckRole,
            date: nowStr,
            remarks: remarks || 'Final sanction granted. SMS notification with login credentials dispatched to SHG mobile number.',
            attachmentName: attachmentFile ? attachmentFile.name : undefined,
          },
        ],
      };
    });

    saveStoredCheckItems(updated);
  };

  const revertItem = (id: string, currentRole: CheckRole, remarks: string, _targetLevel?: CheckRole) => {
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    const current = getStoredCheckItems();

    const updated = current.map((item) => {
      if (item.id !== id) return item;

      return {
        ...item,
        status: 'reverted' as CheckStatus,
        revertReason: remarks,
        revertedAtLevel: currentRole,
        ...(currentRole === 'BLF' ? { l1Remarks: `Reverted: ${remarks}` } : {}),
        ...(currentRole === 'BLC' ? { l2Remarks: `Reverted: ${remarks}` } : {}),
        ...(currentRole === 'DSWO' ? { l3Remarks: `Reverted: ${remarks}` } : {}),
        history: [
          ...(item.history || []),
          {
            action: `Reverted by ${currentRole}`,
            role: currentRole,
            date: nowStr,
            remarks,
          },
        ],
      };
    });

    saveStoredCheckItems(updated);
  };

  const rejectItem = (id: string, currentRole: CheckRole, remarks: string, rejectedByDesignation?: string) => {
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    const current = getStoredCheckItems();
    const rejectedBy = rejectedByDesignation || (currentRole === 'DSWO' ? 'CDPO' : currentRole);

    const updated = current.map((item) => {
      if (item.id !== id) return item;

      return {
        ...item,
        status: 'rejected' as CheckStatus,
        rejectionReason: remarks,
        rejectedBy,
        ...(currentRole === 'BLF' ? { l1Remarks: `Rejected: ${remarks}` } : {}),
        ...(currentRole === 'BLC' ? { l2Remarks: `Rejected: ${remarks}` } : {}),
        ...(currentRole === 'DSWO' ? { l3Remarks: `Rejected: ${remarks}` } : {}),
        history: [
          ...(item.history || []),
          {
            action: `Rejected by ${rejectedBy}`,
            role: currentRole,
            date: nowStr,
            remarks,
          },
        ],
      };
    });

    saveStoredCheckItems(updated);
  };

  return {
    items,
    forwardItem,
    finalApproveItem,
    revertItem,
    rejectItem,
    resetData: resetCheckDataToDefault,
  };
};
