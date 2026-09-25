// src/features/blc/types/blc.types.ts


export interface BlcMetrics {
  totalPendingCommitteeReview: number;
  totalApproved: number;
  totalRevertedToBlf: number;
  totalRejected: number;
  totalInspectedGroups: number;
}

export interface BlcInspectionFormData {
  committeeResolutionNumber: string;
  meetingDate: string;
  l2Remarks: string;
  inspectionReportFile?: File | null;
}
