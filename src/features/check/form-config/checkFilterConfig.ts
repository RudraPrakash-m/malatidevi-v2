// src/features/check/form-config/checkFilterConfig.ts

import type { FormField } from '@/shared/components/ui/Forms/form.types';

export type WshgVerificationRole = 'DSWO' | 'BLF' | 'BLC';

export const checkFilterConfig: FormField[] = [
  {
    name: 'financialYear',
    label: 'Financial Year',
    type: 'select',
    required: true,
    placeholder: 'Select FY',
    options: [
      { label: '2025-26', value: '2025-26' },
      { label: '2026-27', value: '2026-27' },
    ],
    gridColumn: 2,
  },
  {
    name: 'project',
    label: 'Project',
    required: true,
    type: 'select',
    placeholder: 'Select Project',
    options: [
      { label: 'Athmallik', value: 'athmallik' },
      { label: 'Angul', value: 'angul' },
      { label: 'Banarpal', value: 'banarpal' },
      { label: 'Chhendipada', value: 'chhendipada' },
      { label: 'Talcher', value: 'talcher' },
    ],
    gridColumn: 2,
  },
];

export const wshgVerificationFormConfig = checkFilterConfig;
