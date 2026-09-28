// src/features/dswo/pages/RequisitionList.tsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PlusCircle, Send, RotateCcw, Check, Minus } from 'lucide-react';
import type { MRT_ColumnDef } from 'material-react-table';

import type { RootState } from '@/app/store';
import Card from '@/shared/components/layout/Card';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Forms/Select';
import Input from '@/shared/components/ui/Forms/Input';
import { ReusableTable } from '@/shared/components/ui/Table';
import { DswoRequisitionListTable } from '../components/DswoRequisitionListTable';
import {
  getDistrictInitialData,
  type FundRequestItem,
} from '@/features/state/pages/FundRequestList';

/* -------------------------------------------------------------
   Constants & Options
------------------------------------------------------------- */

const FINANCIAL_YEAR_OPTIONS = [
  { label: '2025-26', value: '2025-26' },
  { label: '2026-27', value: '2026-27' },
  { label: '2027-28', value: '2027-28' },
];

const ITEM_CATEGORY_OPTIONS = [
  { label: 'Uniform', value: 'Uniform' },
  { label: 'Sweater', value: 'Sweater' },
];

const ITEM_PRICES: Record<string, number> = {
  Uniform: 350,
  Sweater: 250,
};

/* -------------------------------------------------------------
   Project, Sector & AWC Row for Logged-in DSWO District
------------------------------------------------------------- */

export interface RequisitionAwcRow {
  id: string;
  project: string;
  sector: string;
  awcName: string;
  awcCode: string;
  totalChildren: number;
}

const getDistrictAwcList = (district: string, fy: string): RequisitionAwcRow[] => {
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
  const base = getDistrictInitialData(district);
  return base.map((item) => ({
    ...item,
    status:
      item.status === 'FULLY PAID' || item.status === 'PARTIALLY PAID' || item.status === 'PAID'
        ? 'PAID'
        : 'PENDING',
  }));
};

export const RequisitionList: React.FC = () => {
  // Get logged-in user and their respective district
  const authUser = useSelector((state: RootState) => state.auth.user);
  const currentDistrict = authUser?.district || 'Cuttack';

  // Form States
  const [financialYear, setFinancialYear] = useState<string>('');
  const [itemCategory, setItemCategory] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Requisition history / allocated data
  const [allocatedData, setAllocatedData] = useState<FundRequestItem[]>(() =>
    getRequisitionInitialData(currentDistrict)
  );

  // Sync data if user district changes
  useEffect(() => {
    setAllocatedData(getRequisitionInitialData(currentDistrict));
  }, [currentDistrict]);

  // Generate AWC List specifically for the logged-in DSWO's district
  const awcData = useMemo(() => {
    if (!financialYear || !itemCategory) return [];
    return getDistrictAwcList(currentDistrict, financialYear);
  }, [currentDistrict, financialYear, itemCategory]);

  // Default to unselected upon FY and Category change
  useEffect(() => {
    setSelectedIds([]);
  }, [financialYear, itemCategory]);

  // Dynamically compute totals from selected AWC rows
  const selectedRows = useMemo(() => {
    return awcData.filter((row) => selectedIds.includes(row.id));
  }, [awcData, selectedIds]);

  const selectedProjectsCount = useMemo(() => {
    return new Set(selectedRows.map((r) => r.project)).size;
  }, [selectedRows]);

  const selectedSectorsCount = useMemo(() => {
    return new Set(selectedRows.map((r) => r.sector)).size;
  }, [selectedRows]);

  const selectedAwcCount = selectedRows.length;

  const selectedTotalChildren = useMemo(() => {
    return selectedRows.reduce((sum, row) => sum + row.totalChildren, 0);
  }, [selectedRows]);

  // Handle Financial Year Change
  const handleFinancialYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFinancialYear(e.target.value);
  };

  // Handle Item Category Change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemCategory(e.target.value);
  };

  // Checkbox handlers
  const handleToggleSelectAll = useCallback(() => {
    if (selectedIds.length === awcData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(awcData.map((r) => r.id));
    }
  }, [selectedIds, awcData]);

  const handleToggleRow = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // Handle Reset Form & Selections
  const handleReset = () => {
    setFinancialYear('');
    setItemCategory('');
    setSelectedIds([]);
    toast.info('Form has been reset.');
  };

  // Handle Submit / Allocate Requisition
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!financialYear) {
      toast.warning('Please select Financial Year.');
      return;
    }

    if (!itemCategory) {
      toast.warning('Please select an Item Category.');
      return;
    }

    if (selectedIds.length === 0) {
      toast.warning('Please select at least one AWC row from the table.');
      return;
    }

    const unitPrice = ITEM_PRICES[itemCategory] || 0;
    const numAmount = unitPrice * selectedTotalChildren;

    const newRequest: FundRequestItem = {
      id: String(Date.now()).slice(-4),
      financialYear,
      district: currentDistrict,
      project: selectedProjectsCount.toString(),
      sectors: selectedSectorsCount,
      awcCount: selectedAwcCount,
      totalChildren: selectedTotalChildren,
      itemCategory: itemCategory,
      requestedAmt: numAmount,
      allocateAmount: 0,
      fundAllocated: 0,
      status: 'PENDING',
      applicationDate: new Date().toLocaleDateString('en-GB'),
      requestedBy: `DSWO ${currentDistrict}`,
      purpose: `Requisition demand for ${itemCategory} for ${selectedTotalChildren.toLocaleString('en-IN')} preschool children across ${selectedAwcCount} AWCs in ${currentDistrict} district [FY ${financialYear}]`,
    };

    setAllocatedData((prev) => [newRequest, ...prev]);
    toast.success(
      `Requisition for ${selectedAwcCount} AWCs with ${selectedTotalChildren.toLocaleString('en-IN')} children submitted successfully!`
    );

    // Reset inputs
    setFinancialYear('');
    setItemCategory('');
    setSelectedIds([]);
  };

  // Reusable Table Columns for DSWO (Project, Sector, AWC, Total Children - No Amount)
  const columns = useMemo<MRT_ColumnDef<RequisitionAwcRow>[]>(
    () => [
      /* 1. Selection Master / Row Checkbox */
      {
        id: 'selection',
        header: 'Select',
        Header: () => {
          const isAllSelected =
            awcData.length > 0 && selectedIds.length === awcData.length;
          const isSomeSelected =
            selectedIds.length > 0 && !isAllSelected;

          return (
            <div className="flex items-center justify-center gap-1.5 py-0.5">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                  isAllSelected || isSomeSelected
                    ? 'bg-primary border-primary text-white shadow-xs'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary'
                }`}
                title={isAllSelected ? 'Deselect All' : 'Select All'}
                aria-label={isAllSelected ? 'Deselect All' : 'Select All'}
              >
                {isAllSelected && <Check size={11} strokeWidth={3} />}
                {isSomeSelected && <Minus size={11} strokeWidth={3} />}
              </button>
              <span className="font-bold text-xs">Select</span>
            </div>
          );
        },
        size: 70,
        minSize: 60,
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: 'center',
          sx: {
            '& .Mui-TableHeadCell-Content': { justifyContent: 'center' },
            '& .Mui-TableHeadCell-Content-Labels': { justifyContent: 'center' },
          },
        },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          return (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleToggleRow(row.original.id)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary border-primary text-white shadow-xs'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary/60'
                }`}
                title={isSelected ? `Deselect ${row.original.awcName}` : `Select ${row.original.awcName}`}
                aria-label={`Select ${row.original.awcName}`}
              >
                {isSelected && <Check size={11} strokeWidth={3} />}
              </button>
            </div>
          );
        },
      },

      /* 2. Sl. No Column */
      {
        accessorKey: 'id',
        header: 'Sl. No',
        size: 60,
        minSize: 50,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <div className="w-full text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {row.index + 1}
          </div>
        ),
      },

      /* 3. Project Column */
      {
        accessorKey: 'project',
        header: 'Project',
        size: 160,
        minSize: 130,
        Cell: ({ cell, row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          return (
            <span
              className={`font-semibold text-xs sm:text-sm ${
                isSelected ? 'text-primary dark:text-primary-light font-bold' : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {cell.getValue<string>()}
            </span>
          );
        },
      },

      /* 4. Sector Column */
      {
        accessorKey: 'sector',
        header: 'Sector',
        size: 110,
        minSize: 95,
        Cell: ({ cell }) => (
          <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
            {cell.getValue<string>()}
          </span>
        ),
      },

      /* 5. AWC Column */
      {
        accessorKey: 'awcName',
        header: 'AWC',
        size: 240,
        minSize: 190,
        Cell: ({ row }) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 block text-xs sm:text-sm">
              {row.original.awcName}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {row.original.awcCode}
            </span>
          </div>
        ),
      },

      /* 6. Total Children Column */
      {
        accessorKey: 'totalChildren',
        header: 'Total Children',
        size: 110,
        minSize: 95,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell, row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          return (
            <div
              className={`w-full text-right font-mono text-xs sm:text-sm font-semibold ${
                isSelected ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {(cell.getValue<number>() ?? 0).toLocaleString('en-IN')}
            </div>
          );
        },
      },
    ],
    [awcData, selectedIds, handleToggleSelectAll, handleToggleRow]
  );

  return (
    <div className="space-y-6">
      <Card
        title={`Requisition - ${currentDistrict} District`}
        icon={PlusCircle}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields Grid */}
          <div className="grid grid-cols-12 gap-4">
            {/* 1. Financial Year */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Select
                id="requisition-financial-year"
                name="financialYear"
                label="Financial Year"
                required
                options={FINANCIAL_YEAR_OPTIONS}
                value={financialYear}
                onChange={handleFinancialYearChange}
                placeholder="Select Financial Year"
              />
            </div>

            {/* 2. Item Category (Just after Financial Year) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Select
                id="requisition-item-category"
                name="itemCategory"
                label="Item Category"
                placeholder="Select Category"
                options={ITEM_CATEGORY_OPTIONS}
                value={itemCategory}
                onChange={handleCategoryChange}
                required
              />
            </div>

            {/* 3. District (Fixed to DSWO district) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Input
                id="requisition-district"
                name="district"
                label="District"
                value={financialYear ? currentDistrict : ''}
                placeholder={financialYear ? currentDistrict : 'Auto-filled on FY select'}
                disabled
              />
            </div>

            {/* 4. Total Children (Dynamically computed sum of children from selected AWCs) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Input
                id="requisition-total-children"
                name="totalChildren"
                label="Total Children"
                value={
                  selectedTotalChildren > 0
                    ? selectedTotalChildren.toLocaleString('en-IN')
                    : ''
                }
                placeholder="Auto-calculated from selection"
                disabled
              />
            </div>
          </div>

          {/* DSWO Project, Sector & AWC Reusable Table (Shown once Financial Year and Category are selected) */}
          {financialYear && itemCategory && (
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
              <ReusableTable
                columns={columns}
                data={awcData}
                enableRowActions={false}
                enableExport={true}
                exportFileName={`${currentDistrict.toLowerCase()}_requisition_awc_breakdown`}
              />
            </div>
          )}

          {/* Action Buttons: Submit Requisition & Reset */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              label="Submit Requisition"
              size="md"
              icon={<Send size={16} />}
              disabled={!financialYear || !itemCategory || selectedIds.length === 0}
            />

            {(financialYear || itemCategory || selectedIds.length > 0) && (
              <Button
                type="button"
                variant="secondary"
                label="Reset"
                size="md"
                icon={<RotateCcw size={16} />}
                onClick={handleReset}
              />
            )}
          </div>
        </form>

        {/* Requisition Records List Table */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <DswoRequisitionListTable
            district={currentDistrict}
            data={allocatedData}
            setData={setAllocatedData}
          />
        </div>
      </Card>
    </div>
  );
};

export default RequisitionList;
