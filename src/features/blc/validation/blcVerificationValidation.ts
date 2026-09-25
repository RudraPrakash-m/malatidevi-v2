// src/features/blc/validation/blcVerificationValidation.ts

import { z } from 'zod';

export const blcInspectionSchema = z.object({
  committeeResolutionNumber: z.string().min(1, 'Resolution number is required'),
  meetingDate: z.string().min(1, 'Meeting date is required'),
  l2Remarks: z.string().min(5, 'Committee remarks must be at least 5 characters long'),
  inspectionReportFile: z.any().optional(),
});

export const blcFilterSchema = z.object({
  financialYear: z.string().optional(),
  phase: z.string().optional(),
  project: z.string().optional(),
  searchQuery: z.string().optional(),
});

export type BlcInspectionFormValues = z.infer<typeof blcInspectionSchema>;
export type BlcFilterValues = z.infer<typeof blcFilterSchema>;
