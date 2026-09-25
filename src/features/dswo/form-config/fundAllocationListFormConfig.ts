// src/features/fund-allocation/form-config/fundAllocationListConfig.ts

import type { FormField } from '@/shared/components/ui/Forms/form.types';

export const fundAllocationListConfig: FormField[] = [
   {
    name: 'financialYear',
    label: 'Financial Year',
    type: 'select',
    placeholder: 'Select Financial Year',
    options: [
      {
        label: '2025-26',
        value: '2025-26',
      },
      {
        label: '2026-27',
        value: '2026-27',
      },
      {
        label: '2027-28',
        value: '2027-28',
      },
    ],
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please select Financial Year',
    },
  },
  {
    name: 'district',
    label: 'District',
    type: 'select',
    required: true,
    placeholder: 'Select District',
    options: [
      {
        label: 'Angul',
        value: 'angul',
      },
      {
        label: 'Dhenkanal',
        value: 'dhenkanal',
      },
      {
        label: 'Cuttack',
        value: 'cuttack',
      },
      {
        label: 'Khordha',
        value: 'khordha',
      },
      {
        label: 'Sambalpur',
        value: 'sambalpur',
      },
    ],
    gridColumn: 2,
  },
];