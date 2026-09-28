// src/features/state/validation/stateFundValidation.ts

import { z } from 'zod';

export const stateFundAllocationSchema = z.object({
  financialYear: z.string().min(1, 'Please select financial year'),
  district: z.string().min(1, 'Please select district'),
  itemCategory: z.string().min(1, 'Please select item category'),
  allocatedAmount: z
    .number({ message: 'Allocated amount must be a number' })
    .positive('Allocated amount must be greater than 0'),
  remarks: z.string().optional(),
});

export type StateFundAllocationFormValues = z.infer<typeof stateFundAllocationSchema>;

export const ucOversightFilterSchema = z.object({
  financialYear: z.string().optional(),
  district: z.string().optional(),
  status: z.string().optional(),
});
