// src/features/cdpo/services/cdpoService.ts

import type { SupplyOrderItem, CdpoMetrics } from '../types/cdpo.types';

const CDPO_SUPPLY_ORDERS_KEY = 'wcd_cdpo_supply_orders_v1';

export const INITIAL_SUPPLY_ORDERS: SupplyOrderItem[] = [
  {
    id: 'SO-001',
    orderNumber: 'SO/KHD/BBSR/2026/001',
    financialYear: '2025-26',
    project: 'Bhubaneswar Urban Project',
    sector: 'Gopinathpur Sector',
    shgName: 'Maa Tarini Self Help Group',
    shgRegNo: 'WSHG-OD-001',
    itemCategory: 'Uniform',
    awcCount: 15,
    totalUnitsOrdered: 650,
    unitPrice: 350,
    totalAmount: 227500,
    orderDate: '25/08/2026',
    expectedDeliveryDate: '15/09/2026',
    status: 'DELIVERED',
    remarks: 'Phase 1 standard navy-blue uniforms supplied with quality certification.',
  },
  {
    id: 'SO-002',
    orderNumber: 'SO/KHD/JATNI/2026/002',
    financialYear: '2025-26',
    project: 'Jatni Project',
    sector: 'Khurda Road Sector',
    shgName: 'Sakhi Mahila Samiti',
    shgRegNo: 'WSHG-OD-002',
    itemCategory: 'Sweater',
    awcCount: 12,
    totalUnitsOrdered: 480,
    unitPrice: 250,
    totalAmount: 120000,
    orderDate: '01/09/2026',
    expectedDeliveryDate: '25/09/2026',
    status: 'IN_PRODUCTION',
    remarks: 'Winter package woollen sweaters in production at Jatni tailoring cluster.',
  },
  {
    id: 'SO-003',
    orderNumber: 'SO/KHD/BALIANTA/2026/003',
    financialYear: '2026-27',
    project: 'Balianta Project',
    sector: 'Prataprudrapur',
    shgName: 'Mission Shakti Federation Unit',
    shgRegNo: 'WSHG-OD-003',
    itemCategory: 'Shoes & Socks',
    awcCount: 18,
    totalUnitsOrdered: 720,
    unitPrice: 130,
    totalAmount: 93600,
    orderDate: '10/09/2026',
    expectedDeliveryDate: '30/09/2026',
    status: 'PENDING_INDENT',
    remarks: 'Indent generated for non-skid footwear distribution across 18 AWCs.',
  },
];

export const cdpoService = {
  // Fetch supply orders
  getSupplyOrders: async (): Promise<SupplyOrderItem[]> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(CDPO_SUPPLY_ORDERS_KEY);
        if (stored) {
          try {
            resolve(JSON.parse(stored));
            return;
          } catch {
            // fallback to default
          }
        }
      }
      resolve([...INITIAL_SUPPLY_ORDERS]);
    });
  },

  // Save new supply order
  createSupplyOrder: async (order: SupplyOrderItem): Promise<SupplyOrderItem[]> => {
    const current = await cdpoService.getSupplyOrders();
    const updated = [order, ...current];
    if (typeof window !== 'undefined') {
      localStorage.setItem(CDPO_SUPPLY_ORDERS_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  // Calculate CDPO metrics
  getMetrics: (orders: SupplyOrderItem[]): CdpoMetrics => {
    let totalUnitsSupplied = 0;
    let pendingDeliveries = 0;
    let completedDeliveries = 0;
    const awcSet = new Set<string>();
    const shgSet = new Set<string>();

    orders.forEach((o) => {
      totalUnitsSupplied += o.totalUnitsOrdered;
      shgSet.add(o.shgName);
      awcSet.add(`${o.project}-${o.sector}`);

      if (o.status === 'DELIVERED') {
        completedDeliveries++;
      } else {
        pendingDeliveries++;
      }
    });

    return {
      totalSupplyOrders: orders.length,
      totalActiveWshgs: shgSet.size || 3,
      totalAwcsCovered: 45,
      totalUnitsSupplied,
      pendingDeliveries,
      completedDeliveries,
    };
  },
};
