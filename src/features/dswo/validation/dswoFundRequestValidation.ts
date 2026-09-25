// src/features/dswo/validation/dswoFundRequestValidation.ts

import { z } from 'zod';

export const dswoFundRequestSchema = z.object({
  financialYear: z.string().min(1, 'Financial Year is required'),
  district: z.string().min(1, 'District is required'),
  project: z.string().min(1, 'Project is required'),
  itemCategory: z.string().min(1, 'Item Category is required'),
  totalChildren: z.number().positive('Beneficiary count must be greater than 0'),
  requestedAmt: z.number().positive('Requested amount must be greater than 0'),
  purpose: z.string().min(5, 'Please provide detailed purpose'),
});

export const beneficiaryDistributionSchema = z.object({
  financialYear: z.string().min(1, 'Financial Year is required'),
  project: z.string().min(1, 'Project is required'),
  sector: z.string().min(1, 'Sector is required'),
  awcName: z.string().min(1, 'Anganwadi Centre Name is required'),
  itemCategory: z.string().min(1, 'Item Category is required'),
  totalEligibleChildren: z.number().min(1, 'Must have at least 1 eligible child'),
  distributedCount: z.number().min(0, 'Distributed count cannot be negative'),
  distributionDate: z.string().min(1, 'Distribution Date is required'),
});

export type DswoFundRequestFormValues = z.infer<typeof dswoFundRequestSchema>;
export type BeneficiaryDistributionFormValues = z.infer<typeof beneficiaryDistributionSchema>;
