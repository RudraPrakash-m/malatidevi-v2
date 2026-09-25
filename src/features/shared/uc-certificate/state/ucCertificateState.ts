// src/features/shared/uc-certificate/state/ucCertificateState.ts

import { useState, useEffect } from 'react';
import type { UcCertificateItem } from '../types/uc-certificate.types';

const STORAGE_KEY = 'wcd_uc_certificate_records_v1';

export const INITIAL_UC_DATA: UcCertificateItem[] = [
  {
    id: '1',
    slNo: 1,
    financialYear: '2025-26',
    project: 'Project 1',
    phase: 'Phase 1',
    whomTo: 'CDPO',
    itemCategory: 'Uniform',
    totalAwc: 15,
    totalChildren: 300,
    totalBoys: 140,
    totalGirls: 160,
    status: 'active',
  },
  {
    id: '2',
    slNo: 2,
    financialYear: '2025-26',
    project: 'Project 2',
    phase: 'Phase 1',
    whomTo: 'CDPO',
    itemCategory: 'Sweater',
    totalAwc: 18,
    totalChildren: 400,
    totalBoys: 180,
    totalGirls: 220,
    status: 'active',
  },
  {
    id: '3',
    slNo: 3,
    financialYear: '2025-26',
    project: 'Project 1',
    phase: 'Phase 2',
    whomTo: 'AWW',
    itemCategory: 'Shoe',
    totalAwc: 15,
    totalChildren: 300,
    totalBoys: 140,
    totalGirls: 160,
    status: 'active',
  },
  {
    id: '4',
    slNo: 4,
    financialYear: '2026-27',
    project: 'Project 3',
    phase: 'Phase 1',
    whomTo: 'CDPO',
    itemCategory: 'Uniform',
    totalAwc: 12,
    totalChildren: 250,
    totalBoys: 115,
    totalGirls: 135,
    status: 'active',
  },
];

export const getUcCertificateItems = (): UcCertificateItem[] => {
  if (typeof window === 'undefined') return INITIAL_UC_DATA;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_UC_DATA));
      return INITIAL_UC_DATA;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_UC_DATA;
  } catch {
    return INITIAL_UC_DATA;
  }
};

export const saveUcCertificateItems = (items: UcCertificateItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('wcd_uc_records_updated'));
  } catch (err) {
    console.error('Failed to save UC records to localStorage', err);
  }
};

export const addUcCertificateItem = (newItem: Omit<UcCertificateItem, 'slNo' | 'id'>) => {
  const current = getUcCertificateItems();
  const nextSlNo = current.length > 0 ? Math.max(...current.map((i) => Number(i.slNo) || 0)) + 1 : 1;
  const itemToAdd: UcCertificateItem = {
    ...newItem,
    id: String(Date.now()),
    slNo: nextSlNo,
    status: 'active',
  };
  const updated = [itemToAdd, ...current];
  saveUcCertificateItems(updated);
  return itemToAdd;
};

export const useUcCertificateItems = () => {
  const [items, setItems] = useState<UcCertificateItem[]>(getUcCertificateItems);

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getUcCertificateItems());
    };
    window.addEventListener('wcd_uc_records_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('wcd_uc_records_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    items,
    addItem: addUcCertificateItem,
  };
};
