// src/features/state/pages/FundRequestList.tsx

import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import type { MRT_ColumnDef } from 'material-react-table';
import {
  HandCoins,
  Eye,
  Filter,
  RotateCcw,
} from 'lucide-react';

import Card from '@/shared/components/layout/Card';
import Select from '@/shared/components/ui/Forms/Select';
import DatePicker from '@/shared/components/ui/Forms/DatePicker';
import { ReusableTable } from '@/shared/components/ui/Table';
import Button from '@/shared/components/ui/Button';
import { FundRequestDetailsModal } from '../components/FundRequestDetailsModal';
import type { FundRequestStatus } from '../types/state.types';

export interface FundRequestItem {
  id: string;
  financialYear: string;
  district: string;
  project: number | string;
  sectors: number;
  awcCount: number;
  totalChildren: number;
  itemCategory: string;
  requestedAmt: number;
  allocateAmount?: number | '';
  fundAllocated?: number;
  status: FundRequestStatus;
  applicationDate?: string;
  allocationDate?: string;
  requestedBy?: string;
  purpose?: string;
  rejectionRemarks?: string;
}

export const ODISHA_DISTRICT_STATS: Record<
  string,
  { projects: number; sectors: number; awcCount: number; totalChildren: number }
> = {
  Angul: { projects: 8, sectors: 42, awcCount: 380, totalChildren: 25400 },
  Balangir: { projects: 14, sectors: 78, awcCount: 690, totalChildren: 42100 },
  Balasore: { projects: 12, sectors: 64, awcCount: 580, totalChildren: 38600 },
  Bargarh: { projects: 12, sectors: 60, awcCount: 540, totalChildren: 34200 },
  Bhadrak: { projects: 7, sectors: 39, awcCount: 360, totalChildren: 24800 },
  Boudh: { projects: 3, sectors: 18, awcCount: 170, totalChildren: 11500 },
  Cuttack: { projects: 15, sectors: 82, awcCount: 750, totalChildren: 48900 },
  Deogarh: { projects: 3, sectors: 16, awcCount: 150, totalChildren: 9800 },
  Dhenkanal: { projects: 8, sectors: 44, awcCount: 410, totalChildren: 27300 },
  Gajapati: { projects: 7, sectors: 36, awcCount: 340, totalChildren: 21700 },
  Ganjam: { projects: 23, sectors: 120, awcCount: 1150, totalChildren: 74500 },
  Jagatsinghpur: { projects: 8, sectors: 40, awcCount: 370, totalChildren: 23600 },
  Jajpur: { projects: 10, sectors: 55, awcCount: 510, totalChildren: 33400 },
  Jharsuguda: { projects: 5, sectors: 26, awcCount: 240, totalChildren: 15200 },
  Kalahandi: { projects: 13, sectors: 68, awcCount: 620, totalChildren: 39800 },
  Kandhamal: { projects: 12, sectors: 62, awcCount: 570, totalChildren: 36400 },
  Kendrapara: { projects: 9, sectors: 48, awcCount: 450, totalChildren: 29100 },
  Kendujhar: { projects: 13, sectors: 70, awcCount: 650, totalChildren: 41500 },
  Khordha: { projects: 10, sectors: 56, awcCount: 520, totalChildren: 35700 },
  Koraput: { projects: 14, sectors: 76, awcCount: 710, totalChildren: 44200 },
  Malkangiri: { projects: 7, sectors: 38, awcCount: 350, totalChildren: 22900 },
  Mayurbhanj: { projects: 26, sectors: 138, awcCount: 1280, totalChildren: 82300 },
  Nabarangpur: { projects: 10, sectors: 54, awcCount: 500, totalChildren: 32800 },
  Nayagarh: { projects: 8, sectors: 42, awcCount: 390, totalChildren: 25600 },
  Nuapada: { projects: 5, sectors: 28, awcCount: 260, totalChildren: 16700 },
  Puri: { projects: 11, sectors: 58, awcCount: 540, totalChildren: 35100 },
  Rayagada: { projects: 11, sectors: 59, awcCount: 550, totalChildren: 35800 },
  Sambalpur: { projects: 9, sectors: 47, awcCount: 430, totalChildren: 28400 },
  Subarnapur: { projects: 6, sectors: 31, awcCount: 290, totalChildren: 18900 },
  Sundargarh: { projects: 17, sectors: 89, awcCount: 820, totalChildren: 53600 },
};

/* ---------------------------------------------
   30 Odisha Districts All Requests Dataset
--------------------------------------------- */
export const ODISHA_ALL_DISTRICTS_REQUEST_DATA: FundRequestItem[] = [
  { id: '1', district: 'Angul', financialYear: '2025-26', allocationDate: '15/09/2026', project: 8, sectors: 42, awcCount: 380, totalChildren: 25400, requestedAmt: 18542000, allocateAmount: 18542000, fundAllocated: 18542000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Angul', purpose: 'Procurement of uniforms for Anganwadi children across 8 projects in Angul' },
  { id: '2', district: 'Balangir', financialYear: '2025-26', allocationDate: '12/09/2026', project: 14, sectors: 78, awcCount: 690, totalChildren: 42100, requestedAmt: 30733000, allocateAmount: 30733000, fundAllocated: 30733000, status: 'FULLY PAID', itemCategory: 'Sweater', requestedBy: 'DSWO Balangir', purpose: 'Sweater allocation for Anganwadi beneficiaries in Balangir' },
  { id: '3', district: 'Balasore', financialYear: '2026-27', allocationDate: '', project: 12, sectors: 64, awcCount: 580, totalChildren: 38600, requestedAmt: 28178000, allocateAmount: 0, fundAllocated: 0, status: 'PENDING', itemCategory: 'Uniform', requestedBy: 'DSWO Balasore', purpose: 'Uniform kit procurement sanction for Balasore district' },
  { id: '4', district: 'Cuttack', financialYear: '2025-26', allocationDate: '08/09/2026', project: 15, sectors: 82, awcCount: 750, totalChildren: 48900, requestedAmt: 35697000, allocateAmount: 35697000, fundAllocated: 35697000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Cuttack', purpose: 'Uniform distribution by local SHGs in Cuttack' },
  { id: '5', district: 'Ganjam', financialYear: '2026-27', allocationDate: '05/09/2026', project: 23, sectors: 120, awcCount: 1150, totalChildren: 74500, requestedAmt: 54385000, allocateAmount: 54385000, fundAllocated: 54385000, status: 'FULLY PAID', itemCategory: 'Sweater', requestedBy: 'DSWO Ganjam', purpose: 'Comprehensive sweater distribution for 23 projects in Ganjam' },
  { id: '6', district: 'Khordha', financialYear: '2025-26', allocationDate: '', project: 10, sectors: 56, awcCount: 520, totalChildren: 35700, requestedAmt: 26061000, allocateAmount: 0, fundAllocated: 0, status: 'PENDING', itemCategory: 'Uniform', requestedBy: 'DSWO Khordha', purpose: 'Second pair uniform stitching and distribution across Khordha AWCs' },
  { id: '7', district: 'Mayurbhanj', financialYear: '2025-26', allocationDate: '28/08/2026', project: 26, sectors: 138, awcCount: 1280, totalChildren: 82300, requestedAmt: 60079000, allocateAmount: 60079000, fundAllocated: 60079000, status: 'FULLY PAID', itemCategory: 'Sweater', requestedBy: 'DSWO Mayurbhanj', purpose: 'Winter package allocation sanction for Mayurbhanj tribal projects' },
  { id: '8', district: 'Puri', financialYear: '2026-27', allocationDate: '25/08/2026', project: 11, sectors: 58, awcCount: 540, totalChildren: 35100, requestedAmt: 25623000, allocateAmount: 15000000, fundAllocated: 15000000, status: 'PARTIALLY PAID', itemCategory: 'Sweater', requestedBy: 'DSWO Puri', purpose: 'Winter wear sweater requisition for 540 AWCs in Puri district' },
  { id: '9', district: 'Sambalpur', financialYear: '2025-26', allocationDate: '20/08/2026', project: 9, sectors: 47, awcCount: 430, totalChildren: 28400, requestedAmt: 20732000, allocateAmount: 20732000, fundAllocated: 20732000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Sambalpur', purpose: 'Uniform fund disbursement for Anganwadi beneficiaries in Sambalpur' },
  { id: '10', district: 'Sundargarh', financialYear: '2027-28', allocationDate: '15/08/2026', project: 17, sectors: 89, awcCount: 820, totalChildren: 53600, requestedAmt: 39128000, allocateAmount: 39128000, fundAllocated: 39128000, status: 'FULLY PAID', itemCategory: 'Sweater', requestedBy: 'DSWO Sundargarh', purpose: 'Winter uniform allocation for 820 AWCs in Sundargarh' },
  { id: '11', district: 'Bargarh', financialYear: '2025-26', allocationDate: '10/08/2026', project: 12, sectors: 60, awcCount: 540, totalChildren: 34200, requestedAmt: 24966000, allocateAmount: 24966000, fundAllocated: 24966000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Bargarh', purpose: 'Uniform procurement for Bargarh AWCs' },
  { id: '12', district: 'Bhadrak', financialYear: '2025-26', allocationDate: '', project: 7, sectors: 39, awcCount: 360, totalChildren: 24800, requestedAmt: 18104000, allocateAmount: 0, fundAllocated: 0, status: 'REJECTED', itemCategory: 'Uniform', requestedBy: 'DSWO Bhadrak', purpose: 'Uniform stitching requisition for Bhadrak district', rejectionRemarks: 'Audit discrepancies found in previous cycle utilization certificate.' },
  { id: '13', district: 'Boudh', financialYear: '2026-27', allocationDate: '01/08/2026', project: 3, sectors: 18, awcCount: 170, totalChildren: 11500, requestedAmt: 8395000, allocateAmount: 8395000, fundAllocated: 8395000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Boudh', purpose: 'Entitlement grant for 3 projects in Boudh' },
  { id: '14', district: 'Deogarh', financialYear: '2025-26', allocationDate: '28/07/2026', project: 3, sectors: 16, awcCount: 150, totalChildren: 9800, requestedAmt: 7154000, allocateAmount: 7154000, fundAllocated: 7154000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Deogarh', purpose: 'Uniform allocation for Deogarh children' },
  { id: '15', district: 'Dhenkanal', financialYear: '2025-26', allocationDate: '', project: 8, sectors: 44, awcCount: 410, totalChildren: 27300, requestedAmt: 19929000, allocateAmount: 0, fundAllocated: 0, status: 'PENDING', itemCategory: 'Uniform', requestedBy: 'DSWO Dhenkanal', purpose: 'Annual procurement sanction for Dhenkanal AWCs' },
  { id: '16', district: 'Gajapati', financialYear: '2026-27', allocationDate: '18/07/2026', project: 7, sectors: 36, awcCount: 340, totalChildren: 21700, requestedAmt: 15841000, allocateAmount: 15841000, fundAllocated: 15841000, status: 'FULLY PAID', itemCategory: 'Sweater', requestedBy: 'DSWO Gajapati', purpose: 'Full package allocation for tribal AWCs in Gajapati' },
  { id: '17', district: 'Jagatsinghpur', financialYear: '2025-26', allocationDate: '12/07/2026', project: 8, sectors: 40, awcCount: 370, totalChildren: 23600, requestedAmt: 17228000, allocateAmount: 17228000, fundAllocated: 17228000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Jagatsinghpur', purpose: 'Uniform sanction for Jagatsinghpur coastal projects' },
  { id: '18', district: 'Jajpur', financialYear: '2025-26', allocationDate: '08/07/2026', project: 10, sectors: 55, awcCount: 510, totalChildren: 33400, requestedAmt: 24382000, allocateAmount: 24382000, fundAllocated: 24382000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Jajpur', purpose: 'Child welfare entitlement distribution for Jajpur district' },
  { id: '19', district: 'Jharsuguda', financialYear: '2026-27', allocationDate: '', project: 5, sectors: 26, awcCount: 240, totalChildren: 15200, requestedAmt: 11096000, allocateAmount: 0, fundAllocated: 0, status: 'PENDING', itemCategory: 'Sweater', requestedBy: 'DSWO Jharsuguda', purpose: 'Winter sweater distribution in Jharsuguda AWCs' },
  { id: '20', district: 'Kalahandi', financialYear: '2025-26', allocationDate: '27/06/2026', project: 13, sectors: 68, awcCount: 620, totalChildren: 39800, requestedAmt: 29054000, allocateAmount: 29054000, fundAllocated: 29054000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Kalahandi', purpose: 'KBK entitlement fund disbursement for Kalahandi' },
  { id: '21', district: 'Kandhamal', financialYear: '2025-26', allocationDate: '20/06/2026', project: 12, sectors: 62, awcCount: 570, totalChildren: 36400, requestedAmt: 26572000, allocateAmount: 26572000, fundAllocated: 26572000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Kandhamal', purpose: 'Winter wear & uniform sanction for Kandhamal hill tracts' },
  { id: '22', district: 'Kendrapara', financialYear: '2026-27', allocationDate: '15/06/2026', project: 9, sectors: 48, awcCount: 450, totalChildren: 29100, requestedAmt: 21243000, allocateAmount: 12000000, fundAllocated: 12000000, status: 'PARTIALLY PAID', itemCategory: 'Sweater', requestedBy: 'DSWO Kendrapara', purpose: 'Interim sweater requisition for Kendrapara' },
  { id: '23', district: 'Kendujhar', financialYear: '2025-26', allocationDate: '10/06/2026', project: 13, sectors: 70, awcCount: 650, totalChildren: 41500, requestedAmt: 30295000, allocateAmount: 30295000, fundAllocated: 30295000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Kendujhar', purpose: 'Comprehensive entitlement kit sanction for Kendujhar' },
  { id: '24', district: 'Koraput', financialYear: '2025-26', allocationDate: '05/06/2026', project: 14, sectors: 76, awcCount: 710, totalChildren: 44200, requestedAmt: 32266000, allocateAmount: 32266000, fundAllocated: 32266000, status: 'FULLY PAID', itemCategory: 'Sweater', requestedBy: 'DSWO Koraput', purpose: 'Southern Odisha child welfare allocation for Koraput' },
  { id: '25', district: 'Malkangiri', financialYear: '2026-27', allocationDate: '', project: 7, sectors: 38, awcCount: 350, totalChildren: 22900, requestedAmt: 16717000, allocateAmount: 0, fundAllocated: 0, status: 'PENDING', itemCategory: 'Uniform', requestedBy: 'DSWO Malkangiri', purpose: 'Remote area Anganwadi welfare requisition for Malkangiri' },
  { id: '26', district: 'Nabarangpur', financialYear: '2025-26', allocationDate: '26/05/2026', project: 10, sectors: 54, awcCount: 500, totalChildren: 32800, requestedAmt: 23944000, allocateAmount: 23944000, fundAllocated: 23944000, status: 'FULLY PAID', itemCategory: 'Sweater', requestedBy: 'DSWO Nabarangpur', purpose: 'Uniform and winter wear sanction for Nabarangpur' },
  { id: '27', district: 'Nayagarh', financialYear: '2025-26', allocationDate: '20/05/2026', project: 8, sectors: 42, awcCount: 390, totalChildren: 25600, requestedAmt: 18688000, allocateAmount: 18688000, fundAllocated: 18688000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Nayagarh', purpose: 'Annual procurement grant for Nayagarh AWCs' },
  { id: '28', district: 'Nuapada', financialYear: '2026-27', allocationDate: '', project: 5, sectors: 28, awcCount: 260, totalChildren: 16700, requestedAmt: 12191000, allocateAmount: 0, fundAllocated: 0, status: 'REJECTED', itemCategory: 'Sweater', requestedBy: 'DSWO Nuapada', purpose: 'Winter wear allocation for Nuapada beneficiaries', rejectionRemarks: 'Non-submission of previous year expenditure utilization certificates.' },
  { id: '29', district: 'Rayagada', financialYear: '2025-26', allocationDate: '10/05/2026', project: 11, sectors: 59, awcCount: 550, totalChildren: 35800, requestedAmt: 26134000, allocateAmount: 26134000, fundAllocated: 26134000, status: 'FULLY PAID', itemCategory: 'Sweater', requestedBy: 'DSWO Rayagada', purpose: 'Comprehensive kit allocation for Rayagada district' },
  { id: '30', district: 'Subarnapur', financialYear: '2025-26', allocationDate: '05/05/2026', project: 6, sectors: 31, awcCount: 290, totalChildren: 18900, requestedAmt: 13797000, allocateAmount: 13797000, fundAllocated: 13797000, status: 'FULLY PAID', itemCategory: 'Uniform', requestedBy: 'DSWO Subarnapur', purpose: 'Footwear & uniform grant for Subarnapur AWCs' },
];

export const getDistrictInitialData = (districtName: string): FundRequestItem[] => {
  const stat = ODISHA_DISTRICT_STATS[districtName] || ODISHA_DISTRICT_STATS['Khordha'] || ODISHA_DISTRICT_STATS['Cuttack'];
  const p = stat.projects;
  const s = stat.sectors;
  const awc = stat.awcCount;
  const tc = stat.totalChildren;

  const dName = districtName || 'Khordha';

  return [
    {
      id: 'REQ-01',
      financialYear: '2026-27',
      district: dName,
      project: p,
      sectors: s,
      awcCount: awc,
      totalChildren: Math.round(tc * 1.026),
      itemCategory: 'Uniform',
      requestedAmt: Math.round(tc * 1.026 * 350),
      allocateAmount: 0,
      fundAllocated: 0,
      status: 'PENDING',
      allocationDate: '',
      applicationDate: '10/09/2026',
      requestedBy: `DSWO ${dName}`,
      purpose: `Preschool child uniform supply requisition for 1st cycle in ${dName} district`,
    },
    {
      id: 'REQ-02',
      financialYear: '2026-27',
      district: dName,
      project: p,
      sectors: s,
      awcCount: awc,
      totalChildren: Math.round(tc * 1.026),
      itemCategory: 'Sweater',
      requestedAmt: Math.round(tc * 1.026 * 250),
      allocateAmount: Math.round(tc * 1.026 * 120),
      fundAllocated: Math.round(tc * 1.026 * 120),
      status: 'PARTIALLY PAID',
      allocationDate: '25/08/2026',
      applicationDate: '20/08/2026',
      requestedBy: `DSWO ${dName}`,
      purpose: `Preschool winter wear sweater procurement grant across ${p} projects`,
    },
    {
      id: 'REQ-03',
      financialYear: '2025-26',
      district: dName,
      project: p,
      sectors: s,
      awcCount: awc,
      totalChildren: tc,
      itemCategory: 'Uniform',
      requestedAmt: tc * 350,
      allocateAmount: tc * 350,
      fundAllocated: tc * 350,
      status: 'FULLY PAID',
      allocationDate: '15/06/2025',
      applicationDate: '01/06/2025',
      requestedBy: `DSWO ${dName}`,
      purpose: `Annual uniform distribution grant for ${dName}`,
    },
    {
      id: 'REQ-04',
      financialYear: '2025-26',
      district: dName,
      project: p,
      sectors: s,
      awcCount: awc,
      totalChildren: tc,
      itemCategory: 'Sweater',
      requestedAmt: tc * 250,
      allocateAmount: tc * 250,
      fundAllocated: tc * 250,
      status: 'FULLY PAID',
      allocationDate: '10/11/2025',
      applicationDate: '02/11/2025',
      requestedBy: `DSWO ${dName}`,
      purpose: `Winter wear thermal sweater allocation for preschool children`,
    },
    {
      id: 'REQ-05',
      financialYear: '2024-25',
      district: dName,
      project: p,
      sectors: s,
      awcCount: awc,
      totalChildren: Math.round(tc * 0.96),
      itemCategory: 'Uniform',
      requestedAmt: Math.round(tc * 0.96 * 350),
      allocateAmount: Math.round(tc * 0.96 * 350),
      fundAllocated: Math.round(tc * 0.96 * 350),
      status: 'FULLY PAID',
      allocationDate: '20/07/2024',
      applicationDate: '05/07/2024',
      requestedBy: `DSWO ${dName}`,
      purpose: `Uniform stitching and distribution via local SHGs in ${dName}`,
    },
    {
      id: 'REQ-06',
      financialYear: '2024-25',
      district: dName,
      project: p,
      sectors: s,
      awcCount: awc,
      totalChildren: Math.round(tc * 0.96),
      itemCategory: 'Sweater',
      requestedAmt: Math.round(tc * 0.96 * 250),
      allocateAmount: 0,
      fundAllocated: 0,
      status: 'REJECTED',
      allocationDate: '15/12/2024',
      applicationDate: '28/11/2024',
      requestedBy: `DSWO ${dName}`,
      purpose: `Supplementary winter sweater grant requisition for remote sectors`,
      rejectionRemarks: 'Non-submission of previous cycle utilization certificate and physical audit verification report.',
    },
    {
      id: 'REQ-07',
      financialYear: '2023-24',
      district: dName,
      project: p,
      sectors: s,
      awcCount: awc,
      totalChildren: Math.round(tc * 0.92),
      itemCategory: 'Uniform',
      requestedAmt: Math.round(tc * 0.92 * 350),
      allocateAmount: Math.round(tc * 0.92 * 350),
      fundAllocated: Math.round(tc * 0.92 * 350),
      status: 'FULLY PAID',
      allocationDate: '18/08/2023',
      applicationDate: '01/08/2023',
      requestedBy: `DSWO ${dName}`,
      purpose: `Comprehensive uniform kit allocation for preschool beneficiaries in ${dName}`,
    },
  ];
};

/* ---------------------------------------------
   Status Formatter (Uppercase & No colors/borders)
--------------------------------------------- */
export const formatStatusText = (status?: string): string => {
  if (!status) return 'PENDING';
  const norm = String(status).trim().toUpperCase().replace(/[\s_-]+/g, ' ');
  if (norm.includes('REJECT')) return 'REJECTED';
  if (norm.includes('ALLOCATED') || norm.includes('TOTAL') || norm.includes('FULL') || norm === 'PAID') return 'FULLY PAID';
  if (norm.includes('PARTIAL')) return 'PARTIALLY PAID';
  if (norm.includes('NOT') || norm.includes('PENDING') || norm.includes('UNPAID')) return 'PENDING';
  return norm;
};

/* ---------------------------------------------
   Filter Options
--------------------------------------------- */
const FY_FILTER_OPTIONS = [
  { label: 'All Financial Years', value: 'all' },
  { label: '2025-26', value: '2025-26' },
  { label: '2026-27', value: '2026-27' },
  { label: '2027-28', value: '2027-28' },
  { label: '2024-25', value: '2024-25' },
  { label: '2023-24', value: '2023-24' },
];

const DISTRICT_FILTER_OPTIONS = [
  { label: 'All Districts', value: 'all' },
  ...Object.keys(ODISHA_DISTRICT_STATS).map((d) => ({
    label: d,
    value: d,
  })),
];

/* ---------------------------------------------
   Columns (Matching Requested Fund List Table)
--------------------------------------------- */
const getFundRequestColumns = (
  handleOpenDetails: (item: FundRequestItem) => void
): MRT_ColumnDef<FundRequestItem>[] => [
    /* 1. Sl. No */
    {
      accessorKey: 'id',
      header: 'Sl. No',
      size: 55,
      minSize: 45,
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ row }) => (
        <div className="w-full text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
          {row.index + 1}
        </div>
      ),
    },

    /* 2. District */
    {
      accessorKey: 'district',
      header: 'District',
      size: 110,
      minSize: 90,
      Cell: ({ cell }) => (
        <span className="font-semibold text-xs sm:text-sm text-foreground">
          {cell.getValue<string>()}
        </span>
      ),
    },

    /* 3. Allocation Date */
    {
      accessorKey: 'allocationDate',
      header: 'Allocation Date',
      size: 120,
      minSize: 100,
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ row }) => {
        const isPending = formatStatusText(row.original.status) === 'PENDING';
        if (isPending) {
          return (
            <div className="w-full text-center font-mono text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium">
              —
            </div>
          );
        }
        const date = row.original.allocationDate || row.original.applicationDate || '—';
        return (
          <div className="w-full text-center font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
            {date}
          </div>
        );
      },
    },

    /* 4. Project */
    {
      accessorKey: 'project',
      header: 'Project',
      size: 65,
      minSize: 50,
      muiTableHeadCellProps: { align: 'right' },
      muiTableBodyCellProps: { align: 'right' },
      Cell: ({ cell }) => (
        <div className="w-full text-right font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {cell.getValue<number | string>()}
        </div>
      ),
    },

    /* 5. Sector */
    {
      accessorKey: 'sectors',
      header: 'Sector',
      size: 65,
      minSize: 50,
      muiTableHeadCellProps: { align: 'right' },
      muiTableBodyCellProps: { align: 'right' },
      Cell: ({ cell }) => (
        <div className="w-full text-right font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {cell.getValue<number>()}
        </div>
      ),
    },

    /* 6. AWC */
    {
      accessorKey: 'awcCount',
      header: 'AWC',
      size: 70,
      minSize: 55,
      muiTableHeadCellProps: { align: 'right' },
      muiTableBodyCellProps: { align: 'right' },
      Cell: ({ cell }) => (
        <div className="w-full text-right font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {(cell.getValue<number>() ?? 0).toLocaleString('en-IN')}
        </div>
      ),
    },

    /* 7. Total Children */
    {
      accessorKey: 'totalChildren',
      header: 'Total Children',
      size: 95,
      minSize: 80,
      muiTableHeadCellProps: { align: 'right' },
      muiTableBodyCellProps: { align: 'right' },
      Cell: ({ cell }) => (
        <div className="w-full text-right font-mono text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
          {(cell.getValue<number>() ?? 0).toLocaleString('en-IN')}
        </div>
      ),
    },

    /* 8. Item Category */
    {
      accessorKey: 'itemCategory',
      header: 'Item Category',
      size: 140,
      minSize: 110,
      Cell: ({ cell }) => {
        const val = cell.getValue<string>() || '';
        const formatted = val
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .join(', ');
        return (
          <span className="text-xs w-full flex items-center justify-center sm:text-sm text-slate-700 dark:text-slate-300">
            {formatted || '—'}
          </span>
        );
      },
    },

    /* 9. Fund Requested (₹) */
    {
      accessorKey: 'requestedAmt',
      header: 'Fund Requested (₹)',
      size: 135,
      minSize: 110,
      muiTableHeadCellProps: { align: 'right' },
      muiTableBodyCellProps: { align: 'right' },
      Cell: ({ row }) => {
        const amount = row.original.requestedAmt ?? 0;
        return (
          <div className="w-full text-right font-mono text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
            {amount.toLocaleString('en-IN')}
          </div>
        );
      },
    },

    /* 10. Fund Allocated (₹) */
    {
      accessorKey: 'fundAllocated',
      header: 'Fund Allocated (₹)',
      size: 135,
      minSize: 110,
      muiTableHeadCellProps: { align: 'right' },
      muiTableBodyCellProps: { align: 'right' },
      Cell: ({ row }) => {
        const amount =
          row.original.fundAllocated ??
          (typeof row.original.allocateAmount === 'number'
            ? row.original.allocateAmount
            : 0);
        return (
          <div className="w-full text-right font-mono text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400">
            {(amount ?? 0).toLocaleString('en-IN')}
          </div>
        );
      },
    },

    /* 11. Status (Plain uppercase text without color or borders) */
    {
      accessorKey: 'status',
      header: 'Status',
      size: 110,
      minSize: 95,
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ row }) => {
        const formattedStatus = formatStatusText(row.original.status);
        return (
          <div className="w-full text-center font-medium text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            {formattedStatus}
          </div>
        );
      },
    },

    /* 12. Action: View Icon (Eye) */
    {
      id: 'action',
      header: 'Action',
      size: 65,
      minSize: 55,
      enableSorting: false,
      enableColumnFilter: false,
      enableColumnActions: false,
      enableColumnOrdering: false,
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => handleOpenDetails(row.original)}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 transition-colors cursor-pointer border border-blue-200 shadow-2xs"
              title="View Fund Request Details"
              aria-label="View Fund Request Details"
            >
              <Eye size={14} />
            </button>
          </div>
        );
      },
    },
  ];

/* ---------------------------------------------
   Main Component
--------------------------------------------- */

interface FundRequestListProps {
  hideCard?: boolean;
  district?: string;
  data?: FundRequestItem[];
  setData?: React.Dispatch<React.SetStateAction<FundRequestItem[]>>;
}

const FundRequestList: React.FC<FundRequestListProps> = ({
  hideCard = false,
  district: propDistrict,
  data: propData,
  setData: propSetData,
}) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const isStateOrAdmin = !authUser?.district || authUser?.primaryRoleCode === 'STATE' || authUser?.primaryRoleCode === 'ADMIN';

  // Initial base dataset: All 30 districts for State/Admin or district-specific for district roles
  const [localData, setLocalData] = useState<FundRequestItem[]>(() => {
    if (propDistrict) {
      return getDistrictInitialData(propDistrict);
    }
    if (isStateOrAdmin) {
      return ODISHA_ALL_DISTRICTS_REQUEST_DATA;
    }
    return getDistrictInitialData(authUser?.district || 'Cuttack');
  });

  const rawData = propData || localData;
  const setData = propSetData || setLocalData;

  // Filter input states
  const [filterFyInput, setFilterFyInput] = useState<string>('all');
  const [filterDistrictInput, setFilterDistrictInput] = useState<string>(
    propDistrict || 'all'
  );
  const [filterDateInput, setFilterDateInput] = useState<string>('');

  // Applied filter state
  const [appliedFilters, setAppliedFilters] = useState<{
    financialYear: string;
    district: string;
    date: string;
  }>({
    financialYear: 'all',
    district: propDistrict || 'all',
    date: '',
  });

  const handleApplyFilter = () => {
    setAppliedFilters({
      financialYear: filterFyInput,
      district: filterDistrictInput,
      date: filterDateInput,
    });
  };

  const handleResetFilter = () => {
    setFilterFyInput('all');
    setFilterDistrictInput('all');
    setFilterDateInput('');
    setAppliedFilters({
      financialYear: 'all',
      district: 'all',
      date: '',
    });
  };

  // Filtered dataset based on applied filters
  const filteredData = useMemo(() => {
    return rawData.filter((row) => {
      if (
        appliedFilters.financialYear &&
        appliedFilters.financialYear !== 'all' &&
        row.financialYear !== appliedFilters.financialYear
      ) {
        return false;
      }
      if (
        appliedFilters.district &&
        appliedFilters.district !== 'all' &&
        row.district.toLowerCase() !== appliedFilters.district.toLowerCase()
      ) {
        return false;
      }
      if (appliedFilters.date && appliedFilters.date.trim()) {
        const filterDateRaw = appliedFilters.date.trim();
        let filterDateNormalized = filterDateRaw;
        if (filterDateRaw.includes('-')) {
          const [y, m, d] = filterDateRaw.split('-');
          if (y && m && d) {
            filterDateNormalized = `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
          }
        }
        const allocDate = (row.allocationDate || '').trim();
        const appDate = (row.applicationDate || '').trim();
        const matchesDate =
          allocDate === filterDateNormalized ||
          allocDate === filterDateRaw ||
          appDate === filterDateNormalized ||
          appDate === filterDateRaw;
        if (!matchesDate) {
          return false;
        }
      }
      return true;
    });
  }, [rawData, appliedFilters]);

  const [selectedItem, setSelectedItem] = useState<FundRequestItem | null>(null);

  const handleOpenDetails = useCallback((item: FundRequestItem) => {
    setSelectedItem(item);
  }, []);

  const handleUpdateItem = useCallback((updatedItem: FundRequestItem) => {
    setData((prev) =>
      prev.map((row) => (row.id === updatedItem.id ? updatedItem : row))
    );
    setSelectedItem(null);
  }, [setData]);

  const columns = useMemo(
    () => getFundRequestColumns(handleOpenDetails),
    [handleOpenDetails]
  );

  const isFilterActive =
    filterFyInput !== 'all' ||
    filterDistrictInput !== 'all' ||
    filterDateInput !== '' ||
    appliedFilters.financialYear !== 'all' ||
    appliedFilters.district !== 'all' ||
    appliedFilters.date !== '';

  const tableElement = (
    <div className="space-y-4">
      {/* Top Filter Bar: Financial Year, District, Date, Filter & Reset */}
      <div className="grid grid-cols-12 gap-4 items-end pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Select
            id="fund-request-filter-fy"
            name="financialYear"
            label="Financial Year"
            options={FY_FILTER_OPTIONS}
            value={filterFyInput}
            onChange={(e) => setFilterFyInput(e.target.value)}
            placeholder="All Financial Years"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Select
            id="fund-request-filter-district"
            name="district"
            label="District"
            options={DISTRICT_FILTER_OPTIONS}
            value={filterDistrictInput}
            onChange={(e) => setFilterDistrictInput(e.target.value)}
            placeholder="All Districts"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <DatePicker
            id="fund-request-filter-date"
            name="requestDate"
            label="Filter by Date"
            placeholder="dd/mm/yyyy"
            value={filterDateInput}
            onChange={(e) => setFilterDateInput(e.target.value)}
            isClearable
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex items-center gap-2">
          <Button
            type="button"
            variant="outline-primary"
            size="md"
            label="Filter"
            icon={<Filter size={15} />}
            onClick={handleApplyFilter}
          />
          {isFilterActive && (
            <Button
              type="button"
              variant="outline"
              size="md"
              label="Reset"
              icon={<RotateCcw size={15} />}
              onClick={handleResetFilter}
            />
          )}
        </div>
      </div>

      <ReusableTable
        key={`fund-request-table-${appliedFilters.financialYear}-${appliedFilters.district}-${filteredData.length}`}
        columns={columns}
        data={filteredData}
        enableRowActions={false}
        enableExport={true}
        exportFileName="requested_fund_list_records"
      />

      {/* View Details Modal Component */}
      <FundRequestDetailsModal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        selectedItem={selectedItem}
        onUpdateItem={handleUpdateItem}
      />
    </div>
  );

  if (hideCard) {
    return (
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        {tableElement}
      </div>
    );
  }

  return (
    <Card
      title="Requested Fund List"
      icon={HandCoins}
      action={
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 shadow-2xs">
            {filteredData.length} District(s) Listed
          </span>
        </div>
      }
    >
      {tableElement}
    </Card>
  );
};

export default FundRequestList;