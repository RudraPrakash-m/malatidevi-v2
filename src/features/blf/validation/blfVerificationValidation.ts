// src/features/blf/validation/blfVerificationValidation.ts

import { z } from 'zod';

export const blfRemarksSchema = z.object({
  actionType: z.enum(['Forward', 'Tag Existing']),
  taggedExistingWshgId: z.string().optional(),
  l1Remarks: z.string().min(5, 'Ground scrutiny remarks must be at least 5 characters long'),
  defectNoteFile: z.any().optional(),
});

export const blfFilterSchema = z.object({
  financialYear: z.string().optional(),
  phase: z.string().optional(),
  project: z.string().optional(),
  searchQuery: z.string().optional(),
});

export type BlfRemarksFormValues = z.infer<typeof blfRemarksSchema>;
export type BlfFilterValues = z.infer<typeof blfFilterSchema>;
