// src/features/shared/uc-certificate/services/ucCertificateService.ts

import type { UcOversightItem } from '../types/uc-certificate.types';

const STATE_UC_STORAGE_KEY = 'wcd_state_uc_records_v1';

export const INITIAL_UC_RECORDS: UcOversightItem[] = [
  {
    id: 'UC-2026-001',
    district: 'Angul',
    project: 'Angul Sadar Project',
    financialYear: '2025-26',
    phase: 'Phase 1',
    allocatedAmount: 18542000,
    utilizedAmount: 18542000,
    unutilizedAmount: 0,
    submissionDate: '12/09/2026',
    status: 'VERIFIED',
    certificateDocName: 'angul_phase1_utilization_cert.pdf',
    auditRemarks: 'Physical verification and invoice reconciliation completed successfully.',
  },
  {
    id: 'UC-2026-002',
    district: 'Balangir',
    project: 'Balangir Rural Project',
    financialYear: '2025-26',
    phase: 'Phase 1',
    allocatedAmount: 30733000,
    utilizedAmount: 30733000,
    unutilizedAmount: 0,
    submissionDate: '10/09/2026',
    status: 'VERIFIED',
    certificateDocName: 'balangir_uc_signed.pdf',
    auditRemarks: 'Audited by State Accounts Officer.',
  },
  {
    id: 'UC-2026-003',
    district: 'Cuttack',
    project: 'Cuttack Urban Project',
    financialYear: '2025-26',
    phase: 'Phase 1',
    allocatedAmount: 35697000,
    utilizedAmount: 34200000,
    unutilizedAmount: 1497000,
    submissionDate: '08/09/2026',
    status: 'SUBMITTED',
    certificateDocName: 'cuttack_interim_uc_2026.pdf',
    auditRemarks: 'Interim certificate submitted. Final reconciliation under progress.',
  },
  {
    id: 'UC-2026-004',
    district: 'Puri',
    project: 'Puri Sadar Project',
    financialYear: '2026-27',
    phase: 'Phase 2',
    allocatedAmount: 15000000,
    utilizedAmount: 12000000,
    unutilizedAmount: 3000000,
    submissionDate: '01/09/2026',
    status: 'PENDING',
    certificateDocName: 'puri_interim_draft_uc.pdf',
  },
  {
    id: 'UC-2026-005',
    district: 'Bhadrak',
    project: 'Bhadrak Block 1',
    financialYear: '2025-26',
    phase: 'Phase 1',
    allocatedAmount: 18104000,
    utilizedAmount: 10000000,
    unutilizedAmount: 8104000,
    submissionDate: '25/08/2026',
    status: 'REVERTED',
    certificateDocName: 'bhadrak_defect_memo_uc.pdf',
    auditRemarks: 'Reverted back to DSWO due to invoice mismatch in Section 3.',
  },
];

export const ucCertificateService = {
  getUcRecords: async (): Promise<UcOversightItem[]> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STATE_UC_STORAGE_KEY);
        if (stored) {
          try {
            resolve(JSON.parse(stored));
            return;
          } catch {
            // fallback
          }
        }
      }
      resolve([...INITIAL_UC_RECORDS]);
    });
  },

  updateUcStatus: async (
    id: string,
    status: 'VERIFIED' | 'REVERTED',
    auditRemarks?: string
  ): Promise<UcOversightItem[]> => {
    const current = await ucCertificateService.getUcRecords();
    const updated = current.map((rec) =>
      rec.id === id ? { ...rec, status, auditRemarks: auditRemarks || rec.auditRemarks } : rec
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem(STATE_UC_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },
};
