// src/features/dswo/services/requisitionData.ts

import type { FundRequestItem } from '@/features/state/pages/FundRequestList';

export interface RequisitionAwcRow {
  id: string;
  project: string;
  sector: string;
  awcName: string;
  awcCode: string;
  totalChildren: number;
}

export interface RequisitionProjectRow {
  id: string;
  project: string;
  projectName: string;
  sectorCount: number;
  awcCount: number;
  totalChildren: number;
  awcs: RequisitionAwcRow[];
}

export const getDistrictAwcList = (district: string, fy: string): RequisitionAwcRow[] => {
  const codePrefix = district.slice(0, 3).toUpperCase();
  let multiplier = 1.0;
  if (fy === '2026-27') multiplier = 1.026;
  if (fy === '2027-28') multiplier = 1.059;

  const baseItems = [
    { project: `Project 01 (${district} Urban)`, sector: 'Sector 01', awcName: `AWW Center 01 - Main Ward, ${district}`, code: `AWC-${codePrefix}-001`, children: 50 },
    { project: `Project 01 (${district} Urban)`, sector: 'Sector 01', awcName: `AWW Center 02 - North Colony, ${district}`, code: `AWC-${codePrefix}-002`, children: 40 },
    { project: `Project 01 (${district} Urban)`, sector: 'Sector 02', awcName: `AWW Center 03 - Market Chowk, ${district}`, code: `AWC-${codePrefix}-003`, children: 65 },
    { project: `Project 01 (${district} Urban)`, sector: 'Sector 02', awcName: `AWW Center 04 - Station Road, ${district}`, code: `AWC-${codePrefix}-004`, children: 55 },
    { project: `Project 02 (${district} Rural)`, sector: 'Sector 03', awcName: `AWW Center 05 - Gram Panchayat West, ${district}`, code: `AWC-${codePrefix}-005`, children: 35 },
    { project: `Project 02 (${district} Rural)`, sector: 'Sector 03', awcName: `AWW Center 06 - Hill Top Village, ${district}`, code: `AWC-${codePrefix}-006`, children: 45 },
    { project: `Project 02 (${district} Rural)`, sector: 'Sector 04', awcName: `AWW Center 07 - Riverside Basti, ${district}`, code: `AWC-${codePrefix}-007`, children: 58 },
    { project: `Project 02 (${district} Rural)`, sector: 'Sector 04', awcName: `AWW Center 08 - Industrial Belt, ${district}`, code: `AWC-${codePrefix}-008`, children: 50 },
    { project: `Project 03 (${district} Sadar)`, sector: 'Sector 05', awcName: `AWW Center 09 - Model Anganwadi, ${district}`, code: `AWC-${codePrefix}-009`, children: 62 },
    { project: `Project 03 (${district} Sadar)`, sector: 'Sector 05', awcName: `AWW Center 10 - Central Ward, ${district}`, code: `AWC-${codePrefix}-010`, children: 48 },
  ];

  return baseItems.map((item, idx) => ({
    id: String(idx + 1),
    project: item.project,
    sector: item.sector,
    awcName: item.awcName,
    awcCode: item.code,
    totalChildren: Math.round(item.children * multiplier),
  }));
};

export const getRequisitionInitialData = (district: string): FundRequestItem[] => {
  const dName = district || 'Khordha';
  return [
    {
      id: 'REQ-101',
      financialYear: '2026-27',
      district: dName,
      project: `Project 01 (${dName} Urban)`,
      sectors: 2,
      awcCount: 4,
      totalChildren: 215,
      itemCategory: 'Uniform',
      requestedAmt: 215 * 350,
      allocateAmount: 0,
      fundAllocated: 0,
      status: 'PENDING',
      allocationDate: '',
      applicationDate: '20/09/2026',
      requestedBy: `DSWO ${dName}`,
      purpose: `Uniform supply requisition for preschool children under Project 01 (${dName} Urban)`,
    },
    {
      id: 'REQ-102',
      financialYear: '2026-27',
      district: dName,
      project: `Project 02 (${dName} Rural)`,
      sectors: 2,
      awcCount: 4,
      totalChildren: 193,
      itemCategory: 'Sweater',
      requestedAmt: 193 * 250,
      allocateAmount: 193 * 250,
      fundAllocated: 193 * 250,
      status: 'FULLY PAID',
      allocationDate: '15/09/2026',
      applicationDate: '10/09/2026',
      requestedBy: `DSWO ${dName}`,
      purpose: `Winter wear sweater procurement for Project 02 (${dName} Rural)`,
    },
    {
      id: 'REQ-103',
      financialYear: '2025-26',
      district: dName,
      project: `Project 03 (${dName} Sadar)`,
      sectors: 1,
      awcCount: 2,
      totalChildren: 110,
      itemCategory: 'Uniform',
      requestedAmt: 110 * 350,
      allocateAmount: 110 * 350,
      fundAllocated: 110 * 350,
      status: 'FULLY PAID',
      allocationDate: '20/06/2025',
      applicationDate: '10/06/2025',
      requestedBy: `DSWO ${dName}`,
      purpose: `Preschool uniform distribution for Project 03 (${dName} Sadar)`,
    },
    {
      id: 'REQ-104',
      financialYear: '2025-26',
      district: dName,
      project: `Project 01 (${dName} Urban)`,
      sectors: 2,
      awcCount: 4,
      totalChildren: 210,
      itemCategory: 'Sweater',
      requestedAmt: 210 * 250,
      allocateAmount: 210 * 250,
      fundAllocated: 210 * 250,
      status: 'FULLY PAID',
      allocationDate: '18/06/2025',
      applicationDate: '05/06/2025',
      requestedBy: `DSWO ${dName}`,
      purpose: `Sweater supply package for Project 01 (${dName} Urban)`,
    },
  ];
};
