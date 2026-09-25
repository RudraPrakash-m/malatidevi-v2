// src/features/wshg/types/wshg.types.ts

import type { CheckItem } from '@/features/shared/types/shared.types';

export interface WshgRegistrationFormData {
  financialYear: string;
  phase: string;
  project: string;
  sector: string;
  awcName: string;
  wshgName: string;
  presidentName: string;
  secretaryName: string;
  contactNumber: string;
  email?: string;
  block: string;
  district: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  totalMembers: number;
  activityType: string;
  documentFile?: File | null;
  geoPhotoFile?: File | null;
}

export type WshgApplicationRecord = CheckItem;

export interface WshgTrackingStep {
  stepNumber: number;
  role: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'rejected' | 'reverted';
  date?: string;
  remarks?: string;
}
