// src/features/aww/types/aww.types.ts

export type UniformCategory = 'SW' | 'Uniform' | 'Shoes & Chocks';
export type GenderType = 'male' | 'female' | 'unisex';
export type DistributionStatus = 'pending' | 'in_progress' | 'completed';

export interface AwwShgDetailsFormData {
  orderId: string;
  shgId?: string;
  name: string;
  item: string;
  quantity: string | number;
  dueDate: string;
  deliveryDate: string;
}

export interface AwwDeliveryCatalogueFormData {
  orderId: string;
  shgName: string;
  awcName: string;
  deliveryDate: string;
  size: string;
  colour: string;
  gender: string;
  uniform: string;
  orderReceived: number | string;
  totalUnits: number | string;
  deliveryPhoto?: File | null;
  signature?: File | null;
}

export interface AwwBeneficiaryDistributionFormData {
  phase: string;
  date: string;
  shoe: number | string;
  sweater: number | string;
  uniform: number | string;
  uploadPhoto?: File | null;
}

export interface AwwChildRecord {
  id: string;
  childName: string;
  motherName: string;
  gender: 'male' | 'female';
  age: number;
  uniformDistributed: boolean;
  shoesDistributed: boolean;
  sweaterDistributed: boolean;
  distributionDate?: string;
}

export interface AwwStockReceiptItem {
  id: string;
  orderId: string;
  shgName: string;
  receivedDate: string;
  category: string;
  quantity: number;
  verified: boolean;
}

export interface AwwMetrics {
  assignedSuppliersCount: number;
  consignmentsReceivedCount: number;
  beneficiaryDistributionsCount: number;
}
