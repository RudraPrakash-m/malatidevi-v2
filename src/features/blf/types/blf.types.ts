// src/features/blf/types/blf.types.ts


export interface BlfMetrics {
  totalPendingScrutiny: number;
  totalForwardedToBlc: number;
  totalReverted: number;
  totalRejected: number;
  totalRegisteredGroups: number;
}

export interface BlfActionFormData {
  actionType: 'Forward' | 'Tag Existing';
  taggedExistingWshgId?: string;
  l1Remarks: string;
  defectNoteFile?: File | null;
}
