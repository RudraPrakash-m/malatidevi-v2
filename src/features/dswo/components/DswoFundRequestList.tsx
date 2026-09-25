// src/features/dswo/components/DswoFundRequestList.tsx

import React, { useMemo, useState } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import {
  HandCoins,
  Eye,
  Filter,
  RotateCcw,
} from 'lucide-react';

import Card from '@/shared/components/layout/Card';
import Select from '@/shared/components/ui/Forms/Select';
import { ReusableTable } from '@/shared/components/ui/Table';
import Button from '@/shared/components/ui/Button';
import { DswoFundRequestDetailsModal } from './DswoFundRequestDetailsModal';
import {
  type FundRequestItem,
  formatStatusText,
  getDistrictInitialData,
} from '@/features/state/pages/FundRequestList';

/* ---------------------------------------------
   Filter Options for DSWO
--------------------------------------------- */
const FY_FILTER_OPTIONS = [
  { label: 'All Financial Years', value: 'all' },
  { label: '2025-26', value: '2025-26' },
  { label: '2026-27', value: '2026-27' },
  { label: '2027-28', value: '2027-28' },
  { label: '2024-25', value: '2024-25' },
  { label: '2023-24', value: '2023-24' },
];

const STATUS_FILTER_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'PENDING', value: 'PENDING' },
  { label: 'PARTIALLY PAID', value: 'PARTIALLY PAID' },
  { label: 'FULLY PAID', value: 'FULLY PAID' },
  { label: 'REJECTED', value: 'REJECTED' },
];

/* ---------------------------------------------
   Columns for DSWO Requested Fund List
--------------------------------------------- */
const getDswoFundRequestColumns = (
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

    /* 2. Financial Year */
    {
      accessorKey: 'financialYear',
      header: 'Financial Year',
      size: 110,
      minSize: 95,
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ cell }) => (
        <div className="w-full text-center font-semibold text-xs sm:text-sm text-foreground font-mono">
          {cell.getValue<string>()}
        </div>
      ),
    },

    /* 3. Application / Allocation Date */
    {
      accessorKey: 'allocationDate',
      header: 'Application Date',
      size: 120,
      minSize: 100,
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ row }) => {
        const date = row.original.applicationDate || row.original.allocationDate || '15/09/2026';
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
      size: 130,
      minSize: 100,
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
      size: 115,
      minSize: 100,
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
   Main DSWO Component
--------------------------------------------- */
export interface DswoFundRequestListProps {
  district: string;
  data?: FundRequestItem[];
  setData?: React.Dispatch<React.SetStateAction<FundRequestItem[]>>;
}

export const DswoFundRequestList: React.FC<DswoFundRequestListProps> = ({
  district,
  data: propData,
}) => {
  const [localData] = useState<FundRequestItem[]>(() =>
    getDistrictInitialData(district || 'Khordha')
  );

  const rawData = propData || localData;

  // Filter input states
  const [filterFyInput, setFilterFyInput] = useState<string>('all');
  const [filterStatusInput, setFilterStatusInput] = useState<string>('all');

  // Applied filter state
  const [appliedFilters, setAppliedFilters] = useState<{
    financialYear: string;
    status: string;
  }>({
    financialYear: 'all',
    status: 'all',
  });

  // Details Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<FundRequestItem | null>(null);

  const handleOpenDetails = (item: FundRequestItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Filter action handlers
  const handleApplyFilter = () => {
    setAppliedFilters({
      financialYear: filterFyInput,
      status: filterStatusInput,
    });
  };

  const handleResetFilter = () => {
    setFilterFyInput('all');
    setFilterStatusInput('all');
    setAppliedFilters({
      financialYear: 'all',
      status: 'all',
    });
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      // Financial Year Filter
      if (
        appliedFilters.financialYear &&
        appliedFilters.financialYear !== 'all' &&
        item.financialYear !== appliedFilters.financialYear
      ) {
        return false;
      }

      // Status Filter
      if (appliedFilters.status !== 'all') {
        const itemStatus = formatStatusText(item.status);
        if (itemStatus !== appliedFilters.status) {
          return false;
        }
      }

      return true;
    });
  }, [rawData, appliedFilters]);

  const isFilterActive =
    filterFyInput !== 'all' ||
    filterStatusInput !== 'all' ||
    appliedFilters.financialYear !== 'all' ||
    appliedFilters.status !== 'all';

  // Columns definition
  const columns = useMemo(
    () => getDswoFundRequestColumns(handleOpenDetails),
    []
  );

  return (
    <>
      <Card
        title="Requested Fund List"
        icon={HandCoins}
        action={
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 shadow-2xs">
              {filteredData.length} Request(s) Listed
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Top Filter Bar: Financial Year, Status, Filter & Reset */}
          <div className="grid grid-cols-12 gap-4 items-end pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Select
                id="dswo-fund-request-filter-fy"
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
                id="dswo-fund-request-filter-status"
                name="status"
                label="Status"
                options={STATUS_FILTER_OPTIONS}
                value={filterStatusInput}
                onChange={(e) => setFilterStatusInput(e.target.value)}
                placeholder="All Statuses"
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

          {/* Reusable Table */}
          <ReusableTable
            columns={columns}
            data={filteredData}
            enableRowActions={false}
            enableExport={true}
            exportFileName={`${district.toLowerCase()}_fund_requests`}
          />
        </div>
      </Card>

      {/* DSWO Details Modal */}
      <DswoFundRequestDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default DswoFundRequestList;
