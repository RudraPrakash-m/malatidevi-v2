// src/features/shared/uc-certificate/types/uc-certificate.types.ts

export interface UcCertificateItem {
  id: string | number;
  slNo: number;
  financialYear: string;
  project: string;
  phase: string;
  whomTo: string;
  itemCategory: string;
  totalAwc: number;
  totalChildren: number;
  totalBoys: number;
  totalGirls: number;
  status?: string;
  createdAt?: string;
}

export interface UcCertificateFormData {
  financialYear: string;
  project: string;
  phase: string;
  whomTo: string;
  itemCategory: string;
  totalAwc: number;
  totalChildren: number;
  totalBoys: number;
  totalGirls: number;
}

export interface UcOversightItem {
  id: string;
  district: string;
  project: string;
  financialYear: string;
  phase: string;
  allocatedAmount: number;
  utilizedAmount: number;
  unutilizedAmount: number;
  submissionDate: string;
  status: 'VERIFIED' | 'SUBMITTED' | 'PENDING' | 'REVERTED';
  certificateDocName: string;
  auditRemarks?: string;
}
