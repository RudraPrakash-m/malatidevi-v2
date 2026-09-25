// src/features/cdpo/form-config/supplyManagementFormConfig.ts

import type { FormField } from '@/shared/components/ui/Forms/form.types';

export const supplyManagementFormConfig: FormField[] = [
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
    name: 'shgName',
    label: 'SHG Name',
    type: 'select',
    placeholder: 'Select SHG',
    options: [
      {
        label: 'SHG A',
        value: 'shg_a',
      },
      {
        label: 'SHG B',
        value: 'shg_b',
      },
      {
        label: 'Athmallik SHG',
        value: 'athmallik_shg',
      },
      {
        label: 'Angul SHG',
        value: 'angul_shg',
      },
      {
        label: 'Talcher SHG',
        value: 'talcher_shg',
      },
      {
        label: 'Chhendipada SHG',
        value: 'chhendipada_shg',
      },
    ],
    gridColumn: 4,
    validation: {
      required: true,
      message: 'Please select an SHG',
    },
  },

  {
    name: 'itemCategory',
    label: 'Item Category',
    type: 'select',
    placeholder: 'Select Item Category',
    options: [
      {
        label: 'SW',
        value: 'sw',
      },
      {
        label: 'Uniform',
        value: 'uniform',
      },
     
    ],
    gridColumn: 4,
    validation: {
      required: true,
      message: 'Please select an item category',
    },
  },

  // {
  //   name: 'deliveryDeadline',
  //   label: 'Delivery Deadline',
  //   type: 'date',
  //   placeholder: 'Delivery Deadline',
  //   gridColumn: 2,
  //   readOnly: true,
  // },

  // {
  //   name: 'unitPrice',
  //   label: 'Unit Price',
  //   type: 'number',
  //   placeholder: 'Enter Unit Price',
  //   gridColumn: 2,
  //   validation: {
  //     required: true,
  //     message: 'Please enter unit price',
  //   },
  // },

  // {
  //   name: 'totalEstimatedAmount',
  //   label: 'Total Estimated Amount',
  //   type: 'number',
  //   placeholder: 'Auto calculated',
  //   gridColumn: 2,
  //   readOnly: true,
  // },

  // {
  //   name: 'attachment',
  //   label: 'Attach Document',
  //   type: 'file',
  //   placeholder: 'Upload Document',
  //   gridColumn: 2,
  //   validation: {
  //     required: true,
  //     message: 'Please attach a document',
  //   },
  // },
];