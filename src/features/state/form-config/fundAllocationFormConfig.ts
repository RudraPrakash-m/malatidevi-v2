// src/features/fund-allocation/form-config/fundAllocationFormConfig.ts

import type { FormField } from '@/shared/components/ui/Forms/form.types';

export const fundAllocationFormConfig: FormField[] = [
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
    type: 'text',
    placeholder: 'Cuttack',
    gridColumn: 2,
    disabled: true,
  },

  {
    name: 'amount',
    label: 'Amount',
    type: 'number',
    placeholder: 'Enter Amount',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please enter Amount',
    },
  },
];