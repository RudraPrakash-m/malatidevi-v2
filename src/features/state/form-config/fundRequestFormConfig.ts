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
    gridColumn: 4,
    validation: {
      required: true,
      message: 'Please select Financial Year',
    },
  },

  {
    name: 'project',
    label: 'Project',
    type: 'select',
    placeholder: 'Select Project',
    options: [
      {
        label: 'Project 1',
        value: 'project_1',
      },
      {
        label: 'Project 2',
        value: 'project_2',
      },
      {
        label: 'Project 3',
        value: 'project_3',
      },
    ],
    gridColumn: 4,
    validation: {
      required: true,
      message: 'Please select Project',
    },
  },

  {
    name: 'phase',
    label: 'Phase',
    type: 'select',
    placeholder: 'Select Phase',
    options: [
      {
        label: 'Phase 1',
        value: 'phase_1',
      },
      {
        label: 'Phase 2',
        value: 'phase_2',
      },
    ],
    gridColumn: 4,
    validation: {
      required: true,
      message: 'Please select Phase',
    },
  },

  {
    name: 'childrenCount',
    label: 'Children Count',
    type: 'number',
    placeholder: '250',
    gridColumn: 6,
    readOnly: true,
  },

  {
    name: 'requestAmount',
    label: 'Amount',
    type: 'number',
    placeholder: 'Enter amount',
    gridColumn: 6,
    validation: {
      required: true,
      message: 'Amount is required',
    },
  },
];

