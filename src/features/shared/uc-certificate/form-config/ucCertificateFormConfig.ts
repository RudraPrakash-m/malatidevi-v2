// src/features/shared/uc-certificate/form-config/ucCertificateFormConfig.ts

import type { FormField } from '@/shared/components/ui/Forms/form.types';

export const ucCertificateFormConfig: FormField[] = [
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
    name: 'whomTo',
    label: 'Whom to',
    type: 'select',
    required: true,
    placeholder: 'Select',
    options: [
      {
        label: 'CDPO',
        value: 'CDPO',
      },
      {
        label: 'AWW',
        value: 'AWW',
      },
    ],
    gridColumn: 2,
  },
  {
    name: 'itemCategory',
    label: 'Item Category',
    type: 'select',
    required: true,
    placeholder: 'Select Item',
    options: [
      {
        label: 'Shoe',
        value: 'shoe',
      },
      {
        label: 'Sweater',
        value: 'sweater',
      },
      {
        label: 'Uniform',
        value: 'uniform',
      },
    ],
    gridColumn: 2,
  },
  {
    name: 'totalAwc',
    label: 'Total AWC',
    type: 'number',
    gridColumn: 2,
    readOnly: true,
    disabled: true,
  },
  {
    name: 'totalChildren',
    label: 'Total Children',
    type: 'number',
    gridColumn: 2,
    readOnly: true,
    disabled: true,
  },
  {
    name: 'totalBoys',
    label: 'Total Boys',
    type: 'number',
    gridColumn: 2,
    readOnly: true,
    disabled: true,
  },
  {
    name: 'totalGirls',
    label: 'Total Girls',
    type: 'number',
    gridColumn: 2,
    readOnly: true,
    disabled: true,
  },
];
