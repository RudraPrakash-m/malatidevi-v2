// src/features/shared/delivery-catalogue/form-config/deliveryCatalogueFormConfig.ts

import type { FormField } from '@/shared/components/ui/Forms/form.types';

export const deliveryCatalogueFormConfig: FormField[] = [
  {
    name: 'orderId',
    label: 'Order ID',
    type: 'text',
    placeholder: 'Auto-generated Order ID',
    gridColumn: 2,
    readOnly: true,
  },
  {
    name: 'shgName',
    label: 'SHG Name',
    type: 'text',
    placeholder: 'Enter SHG Name',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'SHG Name is required',
    },
  },
  {
    name: 'awcName',
    label: 'AWC Name',
    type: 'text',
    placeholder: 'Enter AWC Name',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'AWC Name is required',
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
  {
    name: 'size',
    label: 'Size',
    type: 'select',
    placeholder: 'Select Size',
    options: [
      { label: 'S', value: 's' },
      { label: 'M', value: 'm' },
      { label: 'L', value: 'l' },
      { label: 'XL', value: 'xl' },
    ],
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please select a size',
    },
  },
  {
    name: 'colour',
    label: 'Colour',
    type: 'select',
    placeholder: 'Select Colour',
    options: [
      { label: 'Blue', value: 'blue' },
      { label: 'White', value: 'white' },
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
    ],
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please select a colour',
    },
  },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    placeholder: 'Select Gender',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Unisex', value: 'unisex' },
    ],
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please select gender',
    },
  },
  {
    name: 'uniform',
    label: 'Uniform',
    type: 'select',
    placeholder: 'Select Uniform',
    options: [
      { label: 'Regular Uniform', value: 'regular_uniform' },
      { label: 'School Uniform', value: 'school_uniform' },
      { label: 'Sports Uniform', value: 'sports_uniform' },
    ],
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Please select uniform',
    },
  },
  {
    name: 'orderReceived',
    label: 'Order Received',
    type: 'number',
    placeholder: 'Enter quantity',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Order Received is required',
    },
  },
  {
    name: 'totalUnits',
    label: 'Total Units',
    type: 'number',
    placeholder: 'Enter total units',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Total Units is required',
    },
  },
  {
    name: 'deliveryPhoto',
    label: 'Upload Delivery Photo',
    type: 'file',
    placeholder: 'Upload delivery photo',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Delivery Photo is required',
    },
  },
  {
    name: 'signature',
    label: 'Upload Sign',
    type: 'file',
    placeholder: 'Upload signature',
    gridColumn: 2,
    validation: {
      required: true,
      message: 'Signature is required',
    },
  },
];
