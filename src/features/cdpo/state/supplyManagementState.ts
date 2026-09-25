// src/features/cdpo/state/supplyManagementState.ts

import { useState, useEffect } from 'react';
import type { SupplyManagementItem } from '../types/supply-management.types';

const STORAGE_KEY = 'wcd_supply_management_items_v4';

export const INITIAL_SUPPLY_DATA: SupplyManagementItem[] = [
  {
    id: '1',
    slNo: 1,
    financialYear: '2025-26',
    project: 'Cuttack',
    sector: 'Sector 1 (Unit 8)',
    center: 'AWC Unit-8 A',
    shgName: 'Athmallik SHG',
    itemCategory: 'Sweater',
    quantity: 300,
    orderDate: '2026-09-17',
    status: 'pending',
    boysSizes: { size22: 30, size23: 45, size24: 40, size25: 25 },
    girlsSizes: { size22: 35, size23: 50, size24: 45, size25: 30 },
  },
  {
    id: '2',
    slNo: 2,
    financialYear: '2025-26',
    project: 'Puri',
    sector: 'Sector 2 (Saheed Nagar)',
    center: 'AWC Saheed Nagar B',
    shgName: 'SHG A',
    itemCategory: 'Uniform',
    quantity: 400,
    orderDate: '2026-09-15',
    status: 'pending',
    boysSizes: { size22: 35, size23: 40, size24: 35, size25: 30 },
    girlsSizes: { size22: 40, size23: 45, size24: 40, size25: 35 },
  },
  {
    id: '3',
    slNo: 3,
    financialYear: '2025-26',
    project: 'Angul',
    sector: 'Sector 3 (Nayapalli)',
    center: 'AWC Nayapalli Main',
    shgName: 'Angul SHG',
    itemCategory: 'Uniform',
    quantity: 250,
    orderDate: '2026-09-14',
    status: 'accepted',
    boysSizes: { size22: 25, size23: 30, size24: 30, size25: 30 },
    girlsSizes: { size22: 30, size23: 35, size24: 35, size25: 35 },
  },
  {
    id: '4',
    slNo: 4,
    financialYear: '2025-26',
    project: 'Talcher',
    sector: 'Sector 1 (Khandagiri)',
    center: 'AWC Khandagiri 1',
    shgName: 'Talcher SHG',
    itemCategory: 'Sweater',
    quantity: 340,
    orderDate: '2026-09-13',
    status: 'rejected',
    remarks: 'SHG requested capacity revision due to raw material delivery constraints',
    boysSizes: { size22: 35, size23: 45, size24: 45, size25: 35 },
    girlsSizes: { size22: 40, size23: 50, size24: 50, size25: 40 },
  },
  {
    id: '5',
    slNo: 5,
    financialYear: '2025-26',
    project: 'Cuttack',
    sector: 'Sector 2 (Baramunda)',
    center: 'AWC Baramunda Village',
    shgName: 'SHG B',
    itemCategory: 'Sweater',
    quantity: 400,
    orderDate: '2026-09-11',
    status: 'accepted',
    boysSizes: { size22: 40, size23: 50, size24: 50, size25: 40 },
    girlsSizes: { size22: 50, size23: 60, size24: 60, size25: 50 },
  },
  {
    id: '6',
    slNo: 6,
    financialYear: '2025-26',
    project: 'Chhendipada',
    sector: 'Sector 3 (Patia)',
    center: 'AWC Patia Station',
    shgName: 'Chhendipada SHG',
    itemCategory: 'Uniform',
    quantity: 270,
    orderDate: '2026-09-12',
    status: 'pending',
    boysSizes: { size22: 30, size23: 35, size24: 30, size25: 30 },
    girlsSizes: { size22: 35, size23: 40, size24: 35, size25: 35 },
  },
  {
    id: '7',
    slNo: 7,
    financialYear: '2025-26',
    project: 'Puri',
    sector: 'Sector 1 (Chandrasekharpur)',
    center: 'AWC CS Pur Model',
    shgName: 'Athmallik SHG',
    itemCategory: 'Uniform',
    quantity: 300,
    orderDate: '2026-09-10',
    status: 'rejected',
    remarks: 'Fabric dye shade did not meet quality benchmark for Winter 2026.',
    boysSizes: { size22: 35, size23: 40, size24: 35, size25: 30 },
    girlsSizes: { size22: 40, size23: 45, size24: 40, size25: 35 },
  },
  {
    id: '8',
    slNo: 8,
    financialYear: '2025-26',
    project: 'Angul',
    sector: 'Sector 2 (Sailashree Vihar)',
    center: 'AWC Sailashree 2',
    shgName: 'Angul SHG',
    itemCategory: 'Sweater',
    quantity: 250,
    orderDate: '2026-09-08',
    status: 'pending', // 10 days ago (>7 days) -> computes as expired
    boysSizes: { size22: 25, size23: 35, size24: 30, size25: 25 },
    girlsSizes: { size22: 30, size23: 40, size24: 35, size25: 30 },
  },
  {
    id: '9',
    slNo: 9,
    financialYear: '2025-26',
    project: 'Talcher',
    sector: 'Sector 3 (Infocity)',
    center: 'AWC Infocity Campus',
    shgName: 'Talcher SHG',
    itemCategory: 'Uniform',
    quantity: 340,
    orderDate: '2026-09-04',
    status: 'pending', // 14 days ago (>7 days) -> computes as expired
    boysSizes: { size22: 40, size23: 40, size24: 40, size25: 40 },
    girlsSizes: { size22: 45, size23: 45, size24: 45, size25: 45 },
  },
];

export const getSupplyManagementItems = (): SupplyManagementItem[] => {
  if (typeof window === 'undefined') return INITIAL_SUPPLY_DATA;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUPPLY_DATA));
      return INITIAL_SUPPLY_DATA;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all items have an orderDate, status, sector, and center
      return parsed.map((item, index) => {
        const fallback = INITIAL_SUPPLY_DATA[index % INITIAL_SUPPLY_DATA.length];
        return {
          ...item,
          sector: item.sector || fallback?.sector || 'Sector 1',
          center: item.center || fallback?.center || 'AWC Center 1',
          orderDate: item.orderDate || fallback?.orderDate || '2026-09-18',
          status: item.status || 'pending',
        };
      });
    }
    return INITIAL_SUPPLY_DATA;
  } catch {
    return INITIAL_SUPPLY_DATA;
  }
};

export const saveSupplyManagementItems = (items: SupplyManagementItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('wcd_supply_items_updated'));
  } catch (err) {
    console.error('Failed to save supply items to localStorage', err);
  }
};

export const addSupplyManagementItem = (newItem: Omit<SupplyManagementItem, 'slNo' | 'id'>) => {
  const current = getSupplyManagementItems();
  const nextSlNo = current.length > 0 ? Math.max(...current.map((i) => Number(i.slNo) || 0)) + 1 : 1;
  const itemToAdd: SupplyManagementItem = {
    orderDate: newItem.orderDate || new Date().toISOString().split('T')[0],
    status: newItem.status || 'pending',
    ...newItem,
    id: String(Date.now()),
    slNo: nextSlNo,
  };
  const updated = [itemToAdd, ...current];
  saveSupplyManagementItems(updated);
  return itemToAdd;
};

export const reallocateSupplyManagementItem = (id: string | number) => {
  const current = getSupplyManagementItems();
  const updated = current.map((item) => {
    if (String(item.id) === String(id)) {
      return {
        ...item,
        orderDate: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
    }
    return item;
  });
  saveSupplyManagementItems(updated);
  return updated;
};

export const useSupplyManagementItems = () => {
  const [items, setItems] = useState<SupplyManagementItem[]>(getSupplyManagementItems);

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getSupplyManagementItems());
    };
    window.addEventListener('wcd_supply_items_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('wcd_supply_items_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    items,
    addItem: addSupplyManagementItem,
    reallocateItem: reallocateSupplyManagementItem,
  };
};

export default useSupplyManagementItems;
