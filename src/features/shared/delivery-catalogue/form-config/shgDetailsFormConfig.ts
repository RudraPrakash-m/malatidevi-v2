// src/features/shared/delivery-catalogue/form-config/shgDetailsFormConfig.ts

import type { FormField } from '@/shared/components/ui/Forms/form.types';

export const shgDetailsFormConfig: FormField[] = [
  {
    name: 'orderId',
    label: 'Order ID',
    type: 'text',
    placeholder: 'Auto-generated Order ID',
    gridColumn: 2,
    readOnly: true,
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter Name',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Name is required',
    },
  },
  {
    name: 'item',
    label: 'Item',
    type: 'select',
    placeholder: 'Select Item',
    options: [
      { label: 'SW', value: 'sw' },
      { label: 'Uniform', value: 'uniform' },
      { label: 'Shoes & Chocks', value: 'shoes_chocks' },
    ],
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please select an item',
    },
  },
  {
    name: 'quantity',
    label: 'Quantity',
    type: 'select',
    placeholder: 'Select Quantity',
    options: [
      { label: '10', value: '10' },
      { label: '20', value: '20' },
      { label: '30', value: '30' },
      { label: '40', value: '40' },
      { label: '50', value: '50' },
      { label: '100', value: '100' },
    ],
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please select quantity',
    },
  },
  {
    name: 'dueDate',
    label: 'Due Date',
    type: 'date',
    placeholder: 'Select Due Date',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Due Date is required',
    },
  },
  {
    name: 'deliveryDate',
    label: 'Delivery Date',
    type: 'date',
    placeholder: 'Select Delivery Date',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Delivery Date is required',
    },
  },
];
