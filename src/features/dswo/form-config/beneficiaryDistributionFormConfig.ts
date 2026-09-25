// src/features/dswo/form-config/beneficiaryDistributionFormConfig.ts

import type { FormField } from '@/shared/components/ui/Forms/form.types';

export const beneficiaryDistributionFormConfig: FormField[] = [
 {
  name: 'district',
  label: 'District',
  type: 'select',
  placeholder: 'Select District',
  options: [
    {
      label: 'Sundargarh',
      value: 'sundargarh',
    },
    {
      label: 'Angul',
      value: 'angul',
    },
    {
      label: 'Khordha',
      value: 'khordha',
    },
    {
      label: 'Cuttack',
      value: 'cuttack',
    },
  ],
  gridColumn: 2,
  validation: {
    required: true,
    message: 'Please select a district',
  },
},
 
{
  name: 'project',
  label: 'Project',
  type: 'select',
  placeholder: 'Select Project',
  options: [
    {
      label: 'Hemgir',
      value: 'hemgir',
    },
    {
      label: 'Balisankara',
      value: 'balisankara',
    },
    {
      label: 'Biramitrapur',
      value: 'biramitrapur',
    },
    {
      label: 'Kutra',
      value: 'kutra',
    },
  ],
  gridColumn: 2,
  validation: {
    required: true,
    message: 'Please select a project',
  },
},

{
  name: 'sector',
  label: 'Sector',
  type: 'select',
  placeholder: 'Select Sector',
  options: [
    {
      label: 'Hemgir',
      value: 'hemgir',
    },
    {
      label: 'Balisankara',
      value: 'balisankara',
    },
    {
      label: 'Kutra',
      value: 'kutra',
    },
    {
      label: 'Lephripara',
      value: 'lephripara',
    },
  ],
  gridColumn: 2,
  validation: {
    required: true,
    message: 'Please select a sector',
  },
},

{
  name: 'anganwadiCentre',
  label: 'Anganwadi Centre',
  type: 'select',
  placeholder: 'Select Anganwadi Centre',
  options: [
    {
      label: 'AWC Hemgir-01',
      value: 'awc_hemgir_01',
    },
    {
      label: 'AWC Hemgir-02',
      value: 'awc_hemgir_02',
    },
    {
      label: 'AWC Hemgir-03',
      value: 'awc_hemgir_03',
    },
    {
      label: 'AWC Hemgir-04',
      value: 'awc_hemgir_04',
    },
  ],
  gridColumn: 2,
  validation: {
    required: true,
    message: 'Please select an Anganwadi Centre',
  },
},
  {
  name: 'fromDate',
  label: 'From Date',
  type: 'date',
  placeholder: 'Select From Date',
  gridColumn: 2,
  validation: {
    required: true,
    message: 'Please select From Date',
  },
},

  {
  name: 'toDate',
  label: 'To Date',
  type: 'date',
  placeholder: 'Select To Date',
  gridColumn: 2,
  validation: {
    required: true,
    message: 'Please select To Date',
  },
},
];