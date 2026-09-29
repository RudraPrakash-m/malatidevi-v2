// src/features/dswo/components/DswoRequisitionListTable.tsx

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
import Modal from '@/shared/components/ui/Modal';
import { RequisitionListDetailsModal } from './RequisitionListDetailsModal';
import {
  type FundRequestItem,
} from '@/features/state/pages/FundRequestList';
import {
  getDistrictAwcList,
  getRequisitionInitialData,
  type RequisitionAwcRow,
} from '../services/requisitionData';

/* ---------------------------------------------
   Filter Options for DSWO Requisition List
--------------------------------------------- */
const FY_FILTER_OPTIONS = [
  { label: 'All Financial Years', value: 'all' },
  { label: '2025-26', value: '2025-26' },
  { label: '2026-27', value: '2026-27' },
  { label: '2027-28', value: '2027-28' },
  { label: '2024-25', value: '2024-25' },
  { label: '2023-24', value: '2023-24' },
];

export const formatRequisitionStatus = (status?: string): 'Pending' | 'Paid' => {
  const upper = String(status || '').toUpperCase();
  if (upper.includes('PAID') || upper === 'APPROVED') {
    return 'Paid';
  }
  return 'Pending';
};

const STATUS_FILTER_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Paid', value: 'Paid' },
];

/* ---------------------------------------------
   Columns for DSWO Requisition List
--------------------------------------------- */
const getRequisitionListColumns = (
  handleOpenDetails: (item: FundRequestItem) => void,
  handleOpenAwcModal: (item: FundRequestItem) => void
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

    /* 3. Item Category */
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

    /* 4. Application / Allocation Date */
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

    /* 5. Project */
    {
      accessorKey: 'project',
      header: 'Project',
      size: 190,
      minSize: 150,
      Cell: ({ cell }) => {
        const val = cell.getValue<string | number>();
        const formatted =
          typeof val === 'string' && val.startsWith('Project')
            ? val
            : `Project ${String(val).padStart(2, '0')}`;
        return (
          <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {formatted}
          </span>
        );
      },
    },

    /* 6. Sector */
    {
      accessorKey: 'sectors',
      header: 'Sector',
      size: 80,
      minSize: 65,
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ cell }) => (
        <div className="w-full text-center font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
          {cell.getValue<number>()}
        </div>
      ),
    },

    /* 7. AWC (Clickable with blue hover & underline) */
    {
      accessorKey: 'awcCount',
      header: 'AWC',
      size: 85,
      minSize: 70,
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ cell, row }) => (
        <div className="w-full text-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenAwcModal(row.original);
            }}
            className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-4 cursor-pointer transition-colors py-0.5 px-1 rounded inline-block font-mono"
            title={`Click to view AWCs under ${row.original.project}`}
          >
            {(cell.getValue<number>() ?? 0).toLocaleString('en-IN')}
          </button>
        </div>
      ),
    },

    /* 8. Total Children */
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

    /* 9. Fund Allocated (₹) */
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

    /* 11. Status (Only Pending or Paid) */
    {
      accessorKey: 'status',
      header: 'Status',
      size: 115,
      minSize: 100,
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ row }) => {
        const formattedStatus = formatRequisitionStatus(row.original.status);
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
              title="View Requisition Details"
              aria-label="View Requisition Details"
            >
              <Eye size={14} />
            </button>
          </div>
        );
      },
    },
  ];

/* ---------------------------------------------
   Main DSWO Requisition List Table Component
--------------------------------------------- */
export interface DswoRequisitionListTableProps {
  district?: string;
  districtName?: string;
  data?: FundRequestItem[];
  setData?: React.Dispatch<React.SetStateAction<FundRequestItem[]>>;
}

export const DswoRequisitionListTable: React.FC<DswoRequisitionListTableProps> = ({
  district,
  districtName,
  data: propData,
}) => {
  const activeDistrict = district || districtName || 'Khordha';
  const [localData] = useState<FundRequestItem[]>(() =>
    getRequisitionInitialData(activeDistrict)
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

  // AWC Centers Breakdown Modal State
  const [selectedAwcModalItem, setSelectedAwcModalItem] = useState<{
    projectName: string;
    financialYear: string;
    awcs: RequisitionAwcRow[];
  } | null>(null);

  const handleOpenDetails = (item: FundRequestItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Open AWC Modal for project
  const handleOpenAwcModal = (item: FundRequestItem) => {
    const list = getDistrictAwcList(item.district || activeDistrict, item.financialYear || '2026-27');
    const projectStr = String(item.project || '');

    const filtered = list.filter((a) => {
      if (projectStr.includes('Project 01') || projectStr === '1') return a.project.includes('Project 01');
      if (projectStr.includes('Project 02') || projectStr === '2') return a.project.includes('Project 02');
      if (projectStr.includes('Project 03') || projectStr === '3') return a.project.includes('Project 03');
      return true;
    });

    const displayProjectName =
      typeof item.project === 'string' && item.project.startsWith('Project')
        ? item.project
        : `Project ${String(item.project).padStart(2, '0')} (${item.district || activeDistrict})`;

    setSelectedAwcModalItem({
      projectName: displayProjectName,
      financialYear: item.financialYear,
      awcs: filtered.length > 0 ? filtered : list,
    });
  };

  const handleCloseAwcModal = () => {
    setSelectedAwcModalItem(null);
  };

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
        const itemStatus = formatRequisitionStatus(item.status);
        if (itemStatus.toLowerCase() !== appliedFilters.status.toLowerCase()) {
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
    () => getRequisitionListColumns(handleOpenDetails, handleOpenAwcModal),
    [handleOpenDetails, handleOpenAwcModal]
  );

  return (
    <>
      <Card
        title="Requisition List"
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
                id="requisition-filter-fy"
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
                id="requisition-filter-status"
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
            exportFileName={`${activeDistrict.toLowerCase()}_requisition_records`}
          />
        </div>
      </Card>

      {/* Details Modal */}
      <RequisitionListDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
        selectedItem={selectedItem}
      />

      {/* Anganwadi Centers (AWC) Breakdown Modal */}
      <Modal
        isOpen={Boolean(selectedAwcModalItem)}
        onClose={handleCloseAwcModal}
        title={`Anganwadi Centers (${selectedAwcModalItem?.projectName || activeDistrict})`}
        subtitle={`Showing ${selectedAwcModalItem?.awcs.length || 0} AWCs for FY ${selectedAwcModalItem?.financialYear || 'Selected FY'}`}
        size="3xl"
        footer={
          <div className="flex justify-end w-full">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleCloseAwcModal}
            >
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <ReusableTable
            columns={awcModalColumns}
            data={selectedAwcModalItem?.awcs || []}
            enableRowActions={false}
            enableExport={true}
            exportFileName={`${selectedAwcModalItem?.projectName.toLowerCase().replace(/\s+/g, '_') || activeDistrict.toLowerCase()}_awc_centers`}
          />
        </div>
      </Modal>
    </>
  );
};

export default DswoRequisitionListTable;
