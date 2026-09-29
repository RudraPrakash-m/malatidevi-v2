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
import DatePicker from '@/shared/components/ui/Forms/DatePicker';
import Modal from '@/shared/components/ui/Modal';
import { ReusableTable } from '@/shared/components/ui/Table';
import { DswoRequisitionListTable } from '../components/DswoRequisitionListTable';
import {
  type FundRequestItem,
} from '@/features/state/pages/FundRequestList';
import {
  getDistrictAwcList,
  getRequisitionInitialData,
  type RequisitionAwcRow,
  type RequisitionProjectRow,
} from '../services/requisitionData';

export type { RequisitionAwcRow, RequisitionProjectRow };
export { getDistrictAwcList, getRequisitionInitialData };

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
  { label: 'Shoes & Socks', value: 'Shoes & Socks' },
];

const ITEM_PRICES: Record<string, number> = {
  Uniform: 350,
  Sweater: 250,
};

export const RequisitionList: React.FC = () => {
  // Get logged-in user and their respective district
  const authUser = useSelector((state: RootState) => state.auth.user);
  const currentDistrict = authUser?.district || 'Cuttack';

  // Form States
  const [financialYear, setFinancialYear] = useState<string>('');
  const [itemCategory, setItemCategory] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalProject, setModalProject] = useState<RequisitionProjectRow | null>(null);
  const isAwcModalOpen = Boolean(modalProject);

  // Today's date formatted as YYYY-MM-DD for DatePicker
  const todayIsoDate = useMemo(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }, []);

  // Requisition history / allocated data
  const [allocatedData, setAllocatedData] = useState<FundRequestItem[]>(() =>
    getRequisitionInitialData(currentDistrict)
  );

  // Sync data if user district changes
  useEffect(() => {
    setAllocatedData(getRequisitionInitialData(currentDistrict));
  }, [currentDistrict]);

  // Generate Project-wise summary rows for the logged-in DSWO's district
  const projectSummaryData = useMemo<RequisitionProjectRow[]>(() => {
    if (!financialYear || !itemCategory) return [];
    const list = getDistrictAwcList(currentDistrict, financialYear);

    const map = new Map<string, RequisitionAwcRow[]>();
    list.forEach((item) => {
      if (!map.has(item.project)) {
        map.set(item.project, []);
      }
      map.get(item.project)!.push(item);
    });

    return Array.from(map.entries()).map(([projectName, awcs], idx) => {
      const sectorCount = new Set(awcs.map((a) => a.sector)).size;
      const awcCount = awcs.length;
      const totalChildren = awcs.reduce((sum, a) => sum + a.totalChildren, 0);

      return {
        id: String(idx + 1),
        project: projectName,
        projectName,
        sectorCount,
        awcCount,
        totalChildren,
        awcs,
      };
    });
  }, [currentDistrict, financialYear, itemCategory]);

  // AWCs to display in the modal for the clicked project
  const modalAwcList = useMemo(() => {
    return modalProject ? modalProject.awcs : [];
  }, [modalProject]);

  // Modal Table Columns for AWC Centers breakdown
  const awcModalColumns = useMemo<MRT_ColumnDef<RequisitionAwcRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Sl. No',
        size: 70,
        minSize: 60,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <div className="w-full text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: 'project',
        header: 'Project',
        size: 160,
        minSize: 130,
        Cell: ({ cell }) => (
          <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'sector',
        header: 'Sector',
        size: 120,
        minSize: 100,
        Cell: ({ cell }) => (
          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'awcName',
        header: 'Anganwadi Center (AWC)',
        size: 240,
        minSize: 200,
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
      {
        accessorKey: 'totalChildren',
        header: 'Total Children',
        size: 130,
        minSize: 100,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <div className="w-full text-right font-mono text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            {(cell.getValue<number>() ?? 0).toLocaleString('en-IN')}
          </div>
        ),
      },
    ],
    []
  );

  // Default to unselected upon FY and Category change
  useEffect(() => {
    setSelectedIds([]);
  }, [financialYear, itemCategory]);

  // Selected project rows & dynamically computed totals
  const selectedRows = useMemo(() => {
    return projectSummaryData.filter((row) => selectedIds.includes(row.id));
  }, [projectSummaryData, selectedIds]);

  const selectedProjectsCount = selectedRows.length;

  const selectedSectorsCount = useMemo(() => {
    const allSectors = selectedRows.flatMap((r) => r.awcs.map((a) => a.sector));
    return new Set(allSectors).size;
  }, [selectedRows]);

  const selectedAwcCount = useMemo(() => {
    return selectedRows.reduce((sum, r) => sum + r.awcCount, 0);
  }, [selectedRows]);

  const selectedTotalChildren = useMemo(() => {
    return selectedRows.reduce((sum, r) => sum + r.totalChildren, 0);
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
    if (selectedIds.length === projectSummaryData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projectSummaryData.map((r) => r.id));
    }
  }, [selectedIds, projectSummaryData]);

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
      toast.warning('Please select at least one Project row from the table.');
      return;
    }

    const unitPrice = ITEM_PRICES[itemCategory] || 0;

    const newRequests: FundRequestItem[] = selectedRows.map((r, idx) => {
      const numAmount = unitPrice * r.totalChildren;
      return {
        id: `REQ-${String(Date.now() + idx).slice(-4)}`,
        financialYear,
        district: currentDistrict,
        project: r.projectName,
        sectors: r.sectorCount,
        awcCount: r.awcCount,
        totalChildren: r.totalChildren,
        itemCategory: itemCategory,
        requestedAmt: numAmount,
        allocateAmount: 0,
        fundAllocated: 0,
        status: 'PENDING',
        applicationDate: new Date().toLocaleDateString('en-GB'),
        requestedBy: `DSWO ${currentDistrict}`,
        purpose: `Requisition demand for ${itemCategory} for ${r.totalChildren.toLocaleString('en-IN')} preschool children under ${r.projectName} (${r.awcCount} AWCs) in ${currentDistrict} district [FY ${financialYear}]`,
      };
    });

    setAllocatedData((prev) => [...newRequests, ...prev]);
    toast.success(
      `Requisition for ${selectedProjectsCount} project(s) with ${selectedTotalChildren.toLocaleString('en-IN')} children submitted successfully!`
    );

    // Reset inputs
    setFinancialYear('');
    setItemCategory('');
    setSelectedIds([]);
  };

  // Table Columns for Project-wise Requisition (Project Name, Sectors count, AWCs count, Total Children)
  const columns = useMemo<MRT_ColumnDef<RequisitionProjectRow>[]>(
    () => [
      /* 1. Selection Master / Row Checkbox */
      {
        id: 'selection',
        header: 'Select',
        Header: () => {
          const isAllSelected =
            projectSummaryData.length > 0 && selectedIds.length === projectSummaryData.length;
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
                title={isSelected ? `Deselect ${row.original.projectName}` : `Select ${row.original.projectName}`}
                aria-label={`Select ${row.original.projectName}`}
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

      /* 3. Project Column (Project Name) */
      {
        accessorKey: 'projectName',
        header: 'Project',
        size: 220,
        minSize: 180,
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

      /* 4. Sector Column (Total sectors under this project) */
      {
        accessorKey: 'sectorCount',
        header: 'Sector',
        size: 110,
        minSize: 90,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <div className="w-full text-center font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {cell.getValue<number>()}
          </div>
        ),
      },

      /* 5. AWC Column (Total AWCs under this project - Hover blue & underline, Click opens modal) */
      {
        accessorKey: 'awcCount',
        header: 'AWC',
        size: 110,
        minSize: 90,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell, row }) => (
          <div className="w-full text-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setModalProject(row.original);
              }}
              className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-4 cursor-pointer transition-colors py-0.5 px-1 rounded inline-block"
              title={`Click to view AWCs under ${row.original.projectName}`}
            >
              {cell.getValue<number>()}
            </button>
          </div>
        ),
      },

      /* 6. Total Children Column */
      {
        accessorKey: 'totalChildren',
        header: 'Total Children',
        size: 130,
        minSize: 100,
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
    [projectSummaryData, selectedIds, handleToggleSelectAll, handleToggleRow]
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

            {/* 3. Requisition Date (Prefilled current date) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <DatePicker
                id="requisition-date"
                name="requisitionDate"
                label="Date"
                placeholder="DD/MM/YYYY"
                value={todayIsoDate}
                disabled
              />
            </div>

            {/* 4. Total Children (Dynamically computed sum of children from selected Projects) */}
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

          {/* DSWO Project-wise Requisition Reusable Table (Shown once Financial Year and Category are selected) */}
          {financialYear && itemCategory && (
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
              <ReusableTable
                columns={columns}
                data={projectSummaryData}
                enableRowActions={false}
                enableExport={true}
                exportFileName={`${currentDistrict.toLowerCase()}_requisition_project_breakdown`}
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

      {/* Anganwadi Centers (AWC) Breakdown Modal */}
      <Modal
        isOpen={isAwcModalOpen}
        onClose={() => setModalProject(null)}
        title={`Anganwadi Centers (${modalProject?.projectName || currentDistrict})`}
        subtitle={`Showing ${modalAwcList.length} AWCs across ${modalProject?.sectorCount || 0} sector(s) for FY ${financialYear || 'Selected FY'}`}
        size="3xl"
        footer={
          <div className="flex justify-end w-full">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setModalProject(null)}
            >
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <ReusableTable
            columns={awcModalColumns}
            data={modalAwcList}
            enableRowActions={false}
            enableExport={true}
            exportFileName={`${modalProject?.projectName.toLowerCase().replace(/\s+/g, '_') || currentDistrict.toLowerCase()}_awc_centers`}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RequisitionList;
