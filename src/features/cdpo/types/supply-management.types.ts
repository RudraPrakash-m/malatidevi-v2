// src/features/cdpo/types/supply-management.types.ts

export interface SizeBreakdown {
  size22?: number;
  size23?: number;
  size24?: number;
  size25?: number;
}

export interface SupplyManagementItem {
  id?: string | number;
  slNo: number | string;
  financialYear: string;
  project?: string;
  sector?: string;
  center?: string;
  phase?: string;
  shgName: string;
  itemCategory: string;
  quantity: number | string;
  boysSizes?: SizeBreakdown;
  girlsSizes?: SizeBreakdown;
  name?: string;
  code?: string;
  orderId?: string;
  orderDate?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'expired' | string;
  remarks?: string;
  createdAt?: string;
}

export interface SupplyManagementFormData {
  name: string;
  code: string;
  status: string;
  description?: string;
}
