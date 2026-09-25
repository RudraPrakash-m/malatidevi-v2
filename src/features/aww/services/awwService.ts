// src/features/aww/services/awwService.ts

import type {
  AwwShgDetailsFormData,
  AwwDeliveryCatalogueFormData,
  AwwBeneficiaryDistributionFormData,
  AwwChildRecord,
  AwwMetrics,
} from '../types/aww.types';

const MOCK_CHILD_RECORDS: AwwChildRecord[] = [
  {
    id: 'CH-001',
    childName: 'Aarav Pattnaik',
    motherName: 'Sunita Pattnaik',
    gender: 'male',
    age: 4,
    uniformDistributed: true,
    shoesDistributed: true,
    sweaterDistributed: false,
    distributionDate: '2026-09-18',
  },
  {
    id: 'CH-002',
    childName: 'Priyanka Mohanty',
    motherName: 'Rashmita Mohanty',
    gender: 'female',
    age: 5,
    uniformDistributed: true,
    shoesDistributed: true,
    sweaterDistributed: true,
    distributionDate: '2026-09-19',
  },
  {
    id: 'CH-003',
    childName: 'Rohan Jena',
    motherName: 'Kalyani Jena',
    gender: 'male',
    age: 3,
    uniformDistributed: false,
    shoesDistributed: false,
    sweaterDistributed: false,
  },
];

export const awwService = {
  getMetrics: (): AwwMetrics => ({
    assignedSuppliersCount: 4,
    consignmentsReceivedCount: 12,
    beneficiaryDistributionsCount: 185,
  }),

  getChildrenList: (): AwwChildRecord[] => {
    return MOCK_CHILD_RECORDS;
  },

  saveShgDetails: (data: AwwShgDetailsFormData) => {
    console.log('Saving SHG Details:', data);
    return { success: true, data };
  },

  saveDeliveryCatalogue: (data: AwwDeliveryCatalogueFormData) => {
    console.log('Saving Delivery Catalogue:', data);
    return { success: true, data };
  },

  saveBeneficiaryDistribution: (data: AwwBeneficiaryDistributionFormData) => {
    console.log('Saving Beneficiary Distribution:', data);
    return { success: true, data };
  },
};
