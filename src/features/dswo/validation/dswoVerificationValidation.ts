// src/features/dswo/validation/dswoVerificationValidation.ts

import { z } from 'zod';

export const dswoVerificationFilterSchema = z.object({
  financialYear: z.string().optional(),
  phase: z.string().optional(),
  project: z.string().optional(),
  searchQuery: z.string().optional(),
});

export const dswoActionSchema = z.object({
  remarks: z.string().min(3, 'Remarks must be at least 3 characters long'),
  actionType: z.enum(['Forward', 'Approve', 'Tag Existing']),
  taggedExistingWshgId: z.string().optional(),
  revertTargetLevel: z.enum(['BLC', 'BLF']).optional(),
});

export type DswoVerificationFilterValues = z.infer<typeof dswoVerificationFilterSchema>;
export type DswoActionValues = z.infer<typeof dswoActionSchema>;
