// src/features/aww/form-config/beneficiaryDistributeFormConfig.ts

import type { FormField } from '@/shared/components/ui/Forms/form.types';

export const beneficiaryDistributeFormConfig: FormField[] = [
  {
    name: 'phase',
    label: 'Phase',
    type: 'select',
    placeholder: 'Select Phase',
    options: [
      { label: 'Phase 1', value: 'phase-1' },
      { label: 'Phase 2', value: 'phase-2' },
      { label: 'Phase 3', value: 'phase-3' },
    ],
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please select Phase',
    },
  },
  {
    name: 'date',
    label: 'Date',
    type: 'date',
    placeholder: 'Select Date',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please select Date',
    },
  },
  {
    name: 'shoe',
    label: 'Shoe',
    type: 'number',
    placeholder: 'Enter Shoe Quantity',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please enter Shoe quantity',
    },
  },
  {
    name: 'sweater',
    label: 'Sweater',
    type: 'number',
    placeholder: 'Enter Sweater Quantity',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please enter Sweater quantity',
    },
  },
  {
    name: 'uniform',
    label: 'Uniform',
    type: 'number',
    placeholder: 'Enter Uniform Quantity',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please enter Uniform quantity',
    },
  },
  {
    name: 'uploadPhoto',
    label: 'Upload Photo',
    type: 'file',
    placeholder: 'Upload Photo',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please upload photo',
    },
  },
];
