// src/features/check/types/check.types.ts

export type CheckRole = 'BLF' | 'BLC' | 'DSWO';

export type CheckStatus =
  | 'pending_blf'
  | 'pending_blc'
  | 'pending_dswo'
  | 'approved'
  | 'reverted'
  | 'rejected';

export interface WorkflowRemarks {
  l1Remarks?: string;
  l1ActionDate?: string;
  l1ActionBy?: string;
  l2Remarks?: string;
  l2ActionDate?: string;
  l2ActionBy?: string;
  l3Remarks?: string;
  l3ActionDate?: string;
  l3ActionBy?: string;
}

export interface WshgCredentials {
  userId: string;
  temporaryPassword: string;
  mobileNumber: string;
  smsSentAt?: string;
  smsDeliveryStatus: 'Delivered' | 'Pending' | 'Failed';
}

export interface CheckItem {
  id: string;
  name: string;
  applicationId: string;
  code: string;
  financialYear: string;
  phase: 'Phase 1' | 'Phase 2';
  project: string;
  applyDate: string;
  status: CheckStatus;
  
  // Remarks
  l1Remarks?: string;
  l2Remarks?: string;
  l3Remarks?: string;
  revertReason?: string;
  revertedAtLevel?: CheckRole;
  rejectionReason?: string;
  rejectedBy?: string;

  // Documents & Photos
  wshgRegNo?: string;
  supportingDocName?: string;
  supportingDocType?: string;
  supportingDocSize?: string;
  documentName: string;
  documentType?: string;
  documentSize?: string;
  geoTagPhoto: string;
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy?: string;
  geoAddress?: string;
  geoTimestamp?: string;

  // Tag Existing details
  taggedExistingWshgId?: string;
  taggedExistingWshgName?: string;
  actionTypeTaken?: 'Forward' | 'Approve' | 'Tag Existing';

  // Credentials (when approved)
  credentials?: WshgCredentials;

  // Applicant Profile details for Read-only summary
  leaderName: string;
  contactNumber: string;
  email?: string;
  block: string;
  district: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  totalMembers: number;
  activityType: string;
  history?: Array<{
    action: string;
    role: CheckRole;
    date: string;
    remarks?: string;
    attachmentName?: string;
  }>;
}

export interface CheckFilterParams {
  financialYear: string;
  phase: string;
  project: string;
  searchQuery?: string;
}
