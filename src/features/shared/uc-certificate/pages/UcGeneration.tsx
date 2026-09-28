// src/features/shared/uc-certificate/pages/UcGeneration.tsx
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store/store';
import type { MRT_ColumnDef } from 'material-react-table';
import {
  Award,
  Filter,
  RotateCcw,
  Users,
  FileCheck,
  Search,
} from 'lucide-react';
import { toast } from 'react-toastify';

import Card from '@/shared/components/layout/Card';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Forms/Select';
import Input from '@/shared/components/ui/Forms/Input';
import DatePicker from '@/shared/components/ui/Forms/DatePicker';
import { ReusableTable } from '@/shared/components/ui/Table';
import ActionButtons from '@/shared/components/ui/Actions/ActionButtons';
import { Modal } from '@/shared/components/ui/Modal/Modal';

/* -------------------------------------------------------------
   Types & Interfaces
------------------------------------------------------------- */

export interface AwwDetail {
  id: string;
  awwName: string;
  awcName: string;
  awcCode: string;
  childrenCount: number;
  deliveredQty: number;
  status: 'Distributed' | 'Verified';
}

export interface ShgUcRow {
  id: string;
  slNo: number;
  date: string;
  financialYear: string;
  category: string;
  sector: string;
  shgName: string;
  shgCode: string;
  presidentName: string;
  totalAmount: number;
  totalChildren: number;
  totalQuantity: number;
  awwList: AwwDetail[];
  ucStatus: 'UC Generated' | 'UC Pending';
  ucNumber?: string;
  ucGeneratedDate?: string;
}

/* -------------------------------------------------------------
   Constants & Initial Mock Dataset
------------------------------------------------------------- */

const FINANCIAL_YEAR_OPTIONS = [
  { label: 'All Financial Years', value: 'all' },
  { label: '2025-26', value: '2025-26' },
  { label: '2026-27', value: '2026-27' },
  { label: '2027-28', value: '2027-28' },
];

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'all' },
  { label: 'Uniform', value: 'Uniform' },
  { label: 'Sweater', value: 'Sweater' },
];

const SECTOR_OPTIONS = [
  { label: 'All Sectors', value: 'all' },
  { label: 'Sector 1 (Unit 8)', value: 'Sector 1 (Unit 8)' },
  { label: 'Sector 2 (Saheed Nagar)', value: 'Sector 2 (Saheed Nagar)' },
  { label: 'Sector 3 (Nayapalli)', value: 'Sector 3 (Nayapalli)' },
  { label: 'Sector 1 (Khandagiri)', value: 'Sector 1 (Khandagiri)' },
  { label: 'Sector 2 (Baramunda)', value: 'Sector 2 (Baramunda)' },
  { label: 'Sector 3 (Patia)', value: 'Sector 3 (Patia)' },
];

const INITIAL_UC_DATA: ShgUcRow[] = [
  {
    id: '1',
    slNo: 1,
    date: '18/09/2026',
    financialYear: '2025-26',
    category: 'Uniform',
    sector: 'Sector 1 (Unit 8)',
    shgName: 'Maa Tarini Self Help Group',
    shgCode: 'SHG-001',
    presidentName: 'Sunita Majhi',
    totalAmount: 437500,
    totalChildren: 1250,
    totalQuantity: 1250,
    ucStatus: 'UC Pending',
    awwList: [
      { id: 'aww-1', awwName: 'Pravasini Nayak', awcName: 'Unit-8 AWC 1', awcCode: 'AWC-211701', childrenCount: 420, deliveredQty: 420, status: 'Verified' },
      { id: 'aww-2', awwName: 'Minati Jena', awcName: 'Unit-8 AWC 2', awcCode: 'AWC-211702', childrenCount: 380, deliveredQty: 380, status: 'Distributed' },
      { id: 'aww-3', awwName: 'Sabita Mohanty', awcName: 'Unit-8 AWC 3', awcCode: 'AWC-211703', childrenCount: 450, deliveredQty: 450, status: 'Verified' },
    ],
  },
  {
    id: '2',
    slNo: 2,
    date: '17/09/2026',
    financialYear: '2025-26',
    category: 'Sweater',
    sector: 'Sector 2 (Saheed Nagar)',
    shgName: 'Sakhi Mahila Samiti',
    shgCode: 'SHG-002',
    presidentName: 'Pravasini Nayak',
    totalAmount: 355000,
    totalChildren: 1420,
    totalQuantity: 1420,
    ucStatus: 'UC Generated',
    ucNumber: 'UC/2025-26/CDPO/SHG-002',
    ucGeneratedDate: '19/09/2026',
    awwList: [
      { id: 'aww-4', awwName: 'Rashmita Behera', awcName: 'Saheed Nagar Center A', awcCode: 'AWC-211704', childrenCount: 480, deliveredQty: 480, status: 'Verified' },
      { id: 'aww-5', awwName: 'Geetanjali Sahoo', awcName: 'Saheed Nagar Center B', awcCode: 'AWC-211705', childrenCount: 520, deliveredQty: 520, status: 'Verified' },
      { id: 'aww-6', awwName: 'Namita Tripathy', awcName: 'Saheed Nagar Center C', awcCode: 'AWC-211706', childrenCount: 420, deliveredQty: 420, status: 'Verified' },
    ],
  },
  {
    id: '3',
    slNo: 3,
    date: '16/09/2026',
    financialYear: '2026-27',
    category: 'Uniform',
    sector: 'Sector 3 (Nayapalli)',
    shgName: 'Annapurna SHG',
    shgCode: 'SHG-003',
    presidentName: 'Minati Jena',
    totalAmount: 343000,
    totalChildren: 980,
    totalQuantity: 980,
    ucStatus: 'UC Pending',
    awwList: [
      { id: 'aww-7', awwName: 'Basanti Swain', awcName: 'Nayapalli Model AWC', awcCode: 'AWC-211707', childrenCount: 500, deliveredQty: 500, status: 'Verified' },
      { id: 'aww-8', awwName: 'Pratima Dash', awcName: 'Nayapalli Nuasahi AWC', awcCode: 'AWC-211708', childrenCount: 480, deliveredQty: 480, status: 'Distributed' },
    ],
  },
  {
    id: '4',
    slNo: 4,
    date: '15/09/2026',
    financialYear: '2025-26',
    category: 'Uniform',
    sector: 'Sector 1 (Khandagiri)',
    shgName: 'Maa Samaleswari Mahila Mandal',
    shgCode: 'SHG-004',
    presidentName: 'Geetanjali Sahoo',
    totalAmount: 472500,
    totalChildren: 1350,
    totalQuantity: 1350,
    ucStatus: 'UC Generated',
    ucNumber: 'UC/2025-26/CDPO/SHG-004',
    ucGeneratedDate: '18/09/2026',
    awwList: [
      { id: 'aww-9', awwName: 'Anusaya Rout', awcName: 'Khandagiri AWC 1', awcCode: 'AWC-211709', childrenCount: 450, deliveredQty: 450, status: 'Verified' },
      { id: 'aww-10', awwName: 'Puspalata Samal', awcName: 'Khandagiri AWC 2', awcCode: 'AWC-211710', childrenCount: 450, deliveredQty: 450, status: 'Verified' },
      { id: 'aww-11', awwName: 'Snehalata Pattnaik', awcName: 'Khandagiri AWC 3', awcCode: 'AWC-211711', childrenCount: 450, deliveredQty: 450, status: 'Verified' },
    ],
  },
  {
    id: '5',
    slNo: 5,
    date: '14/09/2026',
    financialYear: '2026-27',
    category: 'Sweater',
    sector: 'Sector 2 (Baramunda)',
    shgName: 'Radha Krishna SHG',
    shgCode: 'SHG-005',
    presidentName: 'Basanti Swain',
    totalAmount: 222500,
    totalChildren: 890,
    totalQuantity: 890,
    ucStatus: 'UC Pending',
    awwList: [
      { id: 'aww-12', awwName: 'Sasmita Sahoo', awcName: 'Baramunda Village AWC', awcCode: 'AWC-211712', childrenCount: 460, deliveredQty: 460, status: 'Distributed' },
      { id: 'aww-13', awwName: 'Kalyani Sahoo', awcName: 'Baramunda Colony AWC', awcCode: 'AWC-211713', childrenCount: 430, deliveredQty: 430, status: 'Distributed' },
    ],
  },
  {
    id: '6',
    slNo: 6,
    date: '12/09/2026',
    financialYear: '2025-26',
    category: 'Uniform',
    sector: 'Sector 3 (Patia)',
    shgName: 'Maa Mangala Mahila Samiti',
    shgCode: 'SHG-006',
    presidentName: 'Sabita Mohanty',
    totalAmount: 546000,
    totalChildren: 1560,
    totalQuantity: 1560,
    ucStatus: 'UC Pending',
    awwList: [
      { id: 'aww-14', awwName: 'Jayanti Nayak', awcName: 'Patia Station AWC', awcCode: 'AWC-211714', childrenCount: 520, deliveredQty: 520, status: 'Distributed' },
      { id: 'aww-15', awwName: 'Anita Panda', awcName: 'Patia Basti AWC', awcCode: 'AWC-211715', childrenCount: 500, deliveredQty: 500, status: 'Verified' },
      { id: 'aww-16', awwName: 'Sanghamitra Dash', awcName: 'Patia North AWC', awcCode: 'AWC-211716', childrenCount: 540, deliveredQty: 540, status: 'Distributed' },
    ],
  },
];

export const UcGeneration: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const userRole = (authUser?.primaryRoleCode || (authUser as any)?.role || authUser?.loginUserName || '').toUpperCase();
  const isState = userRole === 'STATE' || userRole.includes('STATE');
  const isDswo = userRole === 'DSWO' || userRole.includes('DSWO');
  const canGenerateUc = !isState && !isDswo;

  // Dataset state
  const [ucData, setUcData] = useState<ShgUcRow[]>(INITIAL_UC_DATA);

  // Filter input states
  const [filterFy, setFilterFy] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSector, setFilterSector] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Applied filter state
  const [appliedFilters, setAppliedFilters] = useState<{
    financialYear: string;
    category: string;
    sector: string;
    date: string;
  }>({
    financialYear: 'all',
    category: 'all',
    sector: 'all',
    date: '',
  });

  // Modal states
  const [selectedShgRow, setSelectedShgRow] = useState<ShgUcRow | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  // Handle opening modal
  const handleOpenModal = (row: ShgUcRow) => {
    setSelectedShgRow(row);
    setIsViewModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedShgRow(null);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      financialYear: filterFy,
      category: filterCategory,
      sector: filterSector,
      date: filterDate,
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterFy('all');
    setFilterCategory('all');
    setFilterSector('all');
    setFilterDate('');
    setSearchQuery('');
    setAppliedFilters({
      financialYear: 'all',
      category: 'all',
      sector: 'all',
      date: '',
    });
  };

  // Generate UC Action handler
  const handleGenerateUc = () => {
    if (!selectedShgRow) return;

    if (selectedShgRow.ucStatus === 'UC Generated') {
      toast.info('Utilization Certificate is already generated for this SHG.');
      return;
    }

    const generatedUcNum = `UC/${selectedShgRow.financialYear}/CDPO/${selectedShgRow.shgCode}`;
    const todayStr = new Date().toLocaleDateString('en-GB');

    // Update in dataset
    setUcData((prev) =>
      prev.map((item) =>
        item.id === selectedShgRow.id
          ? {
            ...item,
            ucStatus: 'UC Generated',
            ucNumber: generatedUcNum,
            ucGeneratedDate: todayStr,
          }
          : item
      )
    );

    // Update active modal row state
    setSelectedShgRow((prev) =>
      prev
        ? {
          ...prev,
          ucStatus: 'UC Generated',
          ucNumber: generatedUcNum,
          ucGeneratedDate: todayStr,
        }
        : null
    );

    toast.success(
      `Utilization Certificate (${generatedUcNum}) generated successfully for ${selectedShgRow.shgName}!`
    );
  };

  // Filtered dataset
  const filteredUcData = useMemo(() => {
    return ucData.filter((row) => {
      if (
        appliedFilters.financialYear !== 'all' &&
        row.financialYear !== appliedFilters.financialYear
      ) {
        return false;
      }
      if (
        appliedFilters.category !== 'all' &&
        row.category !== appliedFilters.category
      ) {
        return false;
      }
      if (
        appliedFilters.sector !== 'all' &&
        row.sector !== appliedFilters.sector
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
        const rowDate = (row.date || '').trim();
        if (rowDate !== filterDateNormalized && rowDate !== filterDateRaw) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesShg = row.shgName.toLowerCase().includes(q);
        const matchesSector = row.sector.toLowerCase().includes(q);
        const matchesCode = row.shgCode.toLowerCase().includes(q);
        if (!matchesShg && !matchesSector && !matchesCode) {
          return false;
        }
      }
      return true;
    });
  }, [ucData, appliedFilters, searchQuery]);

  // Modal's AWC breakdown table columns using ReusableTable
  const modalAwwColumns = useMemo<MRT_ColumnDef<AwwDetail>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Sl. No',
        size: 65,
        minSize: 55,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-medium">
            {row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: 'awcName',
        header: 'AWC Center Name',
        size: 200,
        minSize: 160,
        Cell: ({ row }) => (
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            {row.original.awcName}{' '}
            <span className="font-mono font-normal text-slate-400 text-[11px]">
              ({row.original.awcCode})
            </span>
          </span>
        ),
      },
      {
        accessorKey: 'awwName',
        header: 'AWW In-Charge',
        size: 160,
        minSize: 130,
        Cell: ({ cell }) => (
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'childrenCount',
        header: 'Children / Beneficiaries',
        size: 150,
        minSize: 120,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'deliveredQty',
        header: 'Delivered Qty',
        size: 120,
        minSize: 95,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs font-bold text-primary">
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 110,
        minSize: 90,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <div className="flex items-center justify-center">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cell.getValue<string>() === 'UC Generated'
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-amber-700 dark:text-amber-300'
              }`}>
              {cell.getValue<string>()}
            </span>
          </div>
        ),
      },
    ],
    []
  );

  // Main UC Generation table columns (without AWW column; AWW is shown in view modal)
  const mainTableColumns = useMemo<MRT_ColumnDef<ShgUcRow>[]>(
    () => [
      {
        accessorKey: 'slNo',
        header: 'Sl. No',
        size: 65,
        minSize: 55,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell, row }) => (
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-semibold">
            {cell.getValue<number>() || row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 110,
        minSize: 95,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-medium">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'sector',
        header: 'Sector',
        size: 180,
        minSize: 140,
        Cell: ({ cell }) => (
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'shgName',
        header: 'SHG Name',
        size: 260,
        minSize: 190,
        Cell: ({ cell }) => (
          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'ucStatus',
        header: 'Status for UC',
        size: 140,
        minSize: 120,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <div className="flex items-center justify-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cell.getValue<string>() === 'UC Generated'
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-amber-700 dark:text-amber-300'
              }`}>
              {cell.getValue<string>()}
            </span>
          </div>
        ),
      },
      {
        id: 'action',
        header: 'Action',
        size: 80,
        minSize: 75,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <ActionButtons
              actions={['view']}
              onAction={() => handleOpenModal(row.original)}
              actionTitles={{ view: 'View' }}
            />
          </div>
        ),
      },
    ],
    []
  );

  // Overall metrics summary
  const totalGeneratedCount = ucData.filter((r) => r.ucStatus === 'UC Generated').length;
  const totalPendingCount = ucData.filter((r) => r.ucStatus === 'UC Pending').length;

  return (
    <div className="space-y-6">
      {/* Main Card with Filters and ReusableTable */}
      <Card
        title={isDswo || isState ? "Utilization List" : "UC Generation"}
        icon={Award}
        action={
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="text-emerald-600 dark:text-emerald-400">
              UC Generated: <strong className="font-bold text-emerald-700 dark:text-emerald-300">{totalGeneratedCount}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-amber-600 dark:text-amber-400">
              UC Pending: <strong className="font-bold text-amber-700 dark:text-amber-300">{totalPendingCount}</strong>
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Filters: Financial Year, Category, Sector, Date */}
          <div className="grid grid-cols-12 gap-4 items-end pb-3 border-b border-slate-200 dark:border-slate-800">
            {/* Financial Year Filter */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2">
              <Select
                id="uc-filter-fy"
                name="ucFinancialYear"
                label="Financial Year"
                options={FINANCIAL_YEAR_OPTIONS}
                value={filterFy}
                onChange={(e) => setFilterFy(e.target.value)}
                placeholder="Select FY"
              />
            </div>

            {/* Category Filter */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2">
              <Select
                id="uc-filter-category"
                name="ucCategory"
                label="Category"
                options={CATEGORY_OPTIONS}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                placeholder="Select Category"
              />
            </div>

            {/* Sector Filter */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-3">
              <Select
                id="uc-filter-sector"
                name="ucSector"
                label="Sector"
                options={SECTOR_OPTIONS}
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
                placeholder="Select Sector"
              />
            </div>

            {/* Date Filter */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-3">
              <DatePicker
                id="uc-filter-date"
                name="ucFilterDate"
                label="Date"
                placeholder="dd/mm/yyyy"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                isClearable
              />
            </div>

            {/* Action Buttons */}
            <div className="col-span-12 sm:col-span-12 lg:col-span-12 xl:col-span-2 flex items-center gap-2">
              <Button
                type="button"
                variant="outline-primary"
                size="md"
                label="Filter"
                icon={<Filter size={15} />}
                onClick={handleApplyFilters}
              />
              {(filterFy !== 'all' ||
                filterCategory !== 'all' ||
                filterSector !== 'all' ||
                filterDate !== '' ||
                appliedFilters.financialYear !== 'all' ||
                appliedFilters.category !== 'all' ||
                appliedFilters.sector !== 'all' ||
                appliedFilters.date !== '') && (
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    label="Reset"
                    icon={<RotateCcw size={15} />}
                    onClick={handleResetFilters}
                  />
                )}
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="w-full max-w-xs">
              <Input
                id="uc-search-input"
                name="ucSearch"
                placeholder="Search SHG, Sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={15} />}
              />
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing {filteredUcData.length} records
            </span>
          </div>

          {/* Main ReusableTable */}
          <ReusableTable
            columns={mainTableColumns}
            data={filteredUcData}
            enableRowActions={false}
            enableExport
            exportFileName="uc_generation_records"
          />
        </div>
      </Card>

      {/* Clean UC View Modal */}
      {selectedShgRow && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={handleCloseModal}
          size="2xl"
          title="Utilization Certificate Details"
          subtitle={`${selectedShgRow.shgName} • ${selectedShgRow.sector}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${selectedShgRow.ucStatus === 'UC Generated'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                  }`}>
                  <span className={`size-1.5 rounded-full ${selectedShgRow.ucStatus === 'UC Generated' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {selectedShgRow.ucStatus}
                </span>

                {selectedShgRow.ucNumber && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Ref: {selectedShgRow.ucNumber}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  label="Close"
                  onClick={handleCloseModal}
                />

                {canGenerateUc && (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    label={selectedShgRow.ucStatus === 'UC Generated' ? 'UC Generated' : 'Generate UC'}
                    icon={<FileCheck size={16} />}
                    disabled={selectedShgRow.ucStatus === 'UC Generated'}
                    onClick={handleGenerateUc}
                  />
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Readonly Input Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Input
                id="modal-financial-year"
                name="modalFinancialYear"
                label="Financial Year"
                value={selectedShgRow.financialYear}
                readOnly
              />

              <Input
                id="modal-category"
                name="modalCategory"
                label="Category"
                value={selectedShgRow.category}
                readOnly
              />

              <Input
                id="modal-sector"
                name="modalSector"
                label="Sector"
                value={selectedShgRow.sector}
                readOnly
              />

              <Input
                id="modal-date"
                name="modalDate"
                label="Date"
                value={selectedShgRow.date}
                readOnly
              />

              <Input
                id="modal-shg-name"
                name="modalShgName"
                label="SHG Name"
                value={selectedShgRow.shgName}
                readOnly
              />

              <Input
                id="modal-shg-code"
                name="modalShgCode"
                label="SHG Code"
                value={selectedShgRow.shgCode}
                readOnly
              />

              <Input
                id="modal-president"
                name="modalPresident"
                label="President / Leader"
                value={selectedShgRow.presidentName}
                readOnly
              />

              <Input
                id="modal-quantity"
                name="modalQuantity"
                label="Quantity Supplied"
                value={String(selectedShgRow.totalQuantity)}
                readOnly
              />

              <Input
                id="modal-beneficiaries"
                name="modalBeneficiaries"
                label="Total Beneficiaries"
                value={String(selectedShgRow.totalChildren)}
                readOnly
              />

              <Input
                id="modal-total-amount"
                name="modalTotalAmount"
                label="Total Amount (₹)"
                value={`₹${selectedShgRow.totalAmount.toLocaleString('en-IN')}`}
                readOnly
              />
            </div>

            {/* Tagged Anganwadi Centers Table using ReusableTable */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users size={14} className="text-primary" />
                <span>Tagged Anganwadi Centers ({selectedShgRow.awwList.length})</span>
              </h4>

              <ReusableTable
                key={`modal-aww-table-${selectedShgRow.id}`}
                columns={modalAwwColumns}
                data={selectedShgRow.awwList}
                enableRowActions={false}
                enableExport={false}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UcGeneration;
