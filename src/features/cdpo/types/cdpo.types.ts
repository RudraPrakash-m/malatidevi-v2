// src/features/cdpo/types/cdpo.types.ts

export interface SupplyOrderItem {
  id: string;
  orderNumber: string;
  financialYear: string;
  project: string;
  sector: string;
  shgName: string;
  shgRegNo: string;
  itemCategory: 'Uniform' | 'Sweater' | string;
  awcCount: number;
  totalUnitsOrdered: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'PENDING_INDENT' | 'IN_PRODUCTION' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  remarks?: string;
}

export interface CdpoMetrics {
  totalSupplyOrders: number;
  totalActiveWshgs: number;
  totalAwcsCovered: number;
  totalUnitsSupplied: number;
  pendingDeliveries: number;
  completedDeliveries: number;
}

export interface SupplyItemDetail {
  itemType: string;
  size: string;
  gender: 'Boys' | 'Girls' | 'Unisex';
  quantity: number;
  unitRate: number;
  totalCost: number;
}
