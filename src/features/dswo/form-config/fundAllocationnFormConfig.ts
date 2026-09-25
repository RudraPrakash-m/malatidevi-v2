// src/features/fund-allocation/form-config/fundAllocationnFormConfig.ts

import type { FormField } from '@/shared/components/ui/Forms/form.types';

export const fundAllocationnFormConfig: FormField[] = [
  {
    name: 'financialYear',
    label: 'Financial Year',
    type: 'select',
    required: true,
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
  },

  {
    name: 'project',
    label: 'Project',
    type: 'select',
    required: true,
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
    gridColumn: 2,
  },

  {
    name: 'phase',
    label: 'Phase',
    type: 'select',
    required: true,
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
    gridColumn: 2,
  },

  {
    name: 'category',
    label: 'Category',
    type: 'select',
    required: true,
    placeholder: 'Select Category',
    options: [
      {
        label: 'SW',
        value: 'sw',
      },
      {
        label: 'Uniform',
        value: 'uniform',
      },
      {
        label: 'Shoes & Socks',
        value: 'shoes_socks',
      },
    ],
    gridColumn: 2,
  },
];