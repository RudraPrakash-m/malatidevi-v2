// src/features/fund-allocation/pages/FundAllocationList.tsx

import React, { useCallback, useMemo, useState } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import {
  Layers,
  Eye,
} from 'lucide-react';

import { ReusableTable } from '@/shared/components/ui/Table';
import Modal from '@/shared/components/ui/Modal/Modal';
import Card from '@/shared/components/layout/Card';
import Button from '@/shared/components/ui/Button';

import type { FundAllocationItem } from '../types/fund-allocation.types';

const INITIAL_DATA: FundAllocationItem[] = [
  {
    id: '1',
    financialYear: '2025-26',
    district: 'Angul',
    project: 'Project 1',
    phase: 'Phase 1',
    status: 'pending',
    childrenCount: 250,
    requestedAmount: 8500000,
    allocatedAmount: 8500000,
  },
  {
    id: '2',
    financialYear: '2025-26',
    district: 'Dhenkanal',
    project: 'Project 2',
    phase: 'Phase 2',
    status: 'approved',
    childrenCount: 180,
    requestedAmount: 6500000,
    allocatedAmount: 6500000,
  },
  {
    id: '3',
    financialYear: '2025-26',
    district: 'Cuttack',
    project: 'Project 1',
    phase: 'Phase 1',
    status: 'rejected',
    childrenCount: 320,
    requestedAmount: 10000000,
    allocatedAmount: 10000000,
    rejectRemarks: '[Non-compliance with scheme guidelines] Requested budget exceeds approved ceiling limits for Phase 1.',
  },
  {
    id: '4',
    financialYear: '2025-26',
    district: 'Khordha',
    project: 'Project 3',
    phase: 'Phase 2',
    status: 'reverted',
    childrenCount: 210,
    requestedAmount: 7200000,
    allocatedAmount: 7200000,
    revertRemarks: 'Clarification required regarding actual beneficiary count and unit cost calculation.',
  },
];

/* ---------------------------------------------
   Action Cell (View Only)
--------------------------------------------- */

const FundAllocationActionCell: React.FC<{
  item: FundAllocationItem;
  onView: (item: FundAllocationItem) => void;
}> = ({ item, onView }) => {
  return (
    <div className="flex items-center gap-1.5">
      {/* 1. View */}
      <button
        type="button"
        onClick={() => onView(item)}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer border border-blue-200 shadow-2xs"
        title="View Details"
        aria-label="View Details"
      >
        <Eye size={14} />
      </button>
    </div>
  );
};

/* ---------------------------------------------
   Columns Definition
--------------------------------------------- */

const getFundAllocationColumns = (
  handleView: (item: FundAllocationItem) => void,
): MRT_ColumnDef<FundAllocationItem>[] => [
  /* 1. Sl No (Serial Wise) */
  {
    accessorKey: 'id',
    header: 'Sl No',
    size: 70,
    minSize: 60,
    Cell: ({ row }) => (
      <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
        {row.index + 1}
      </span>
    ),
  },

  /* 2. Financial Year */
  {
    accessorKey: 'financialYear',
    header: 'Financial Year',
    size: 130,
    minSize: 110,
    Cell: ({ cell }) => (
      <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
        {cell.getValue<string>() || '2025-26'}
      </span>
    ),
  },

  /* 3. District */
  {
    accessorKey: 'district',
    header: 'District',
    size: 140,
    minSize: 120,
    Cell: ({ cell }) => (
      <span className="font-medium text-sm text-foreground">
        {cell.getValue<string>()}
      </span>
    ),
  },

  /* 4. Children Count */
  {
    accessorKey: 'childrenCount',
    header: 'Children Count',
    size: 130,
    minSize: 110,
  },

  /* 5. Requested Amt */
  {
    accessorKey: 'requestedAmount',
    header: 'Requested Amt',
    size: 160,
    minSize: 130,
    Cell: ({ cell }) => {
      const value = cell.getValue<number>();
      return value.toLocaleString('en-IN');
    },
  },

  /* 6. Allocated Amt: Auto come (read-only, auto calculated) */
  {
    accessorKey: 'allocatedAmount',
    header: 'Allocated Amt',
    size: 160,
    minSize: 130,
    Cell: ({ row }) => {
      const item = row.original;
      const val =
        item.allocatedAmount > 0
          ? item.allocatedAmount
          : item.requestedAmount;
      return (
        <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
          {val.toLocaleString('en-IN')}
        </span>
      );
    },
  },

  /* 7. Action: View Only */
  {
    id: 'action',
    header: 'Action',
    size: 90,
    minSize: 80,
    Cell: ({ row }) => (
      <FundAllocationActionCell
        item={row.original}
        onView={handleView}
      />
    ),
  },
];

/* ---------------------------------------------
   Main Component
--------------------------------------------- */

export interface FundAllocationListProps {
  filterFinancialYear?: string;
  filterDistrict?: string;
  filterPhase?: string;
  customRequestedAmount?: number;
  customChildrenCount?: number;
}

export const FundAllocationList: React.FC<FundAllocationListProps> = ({
  filterFinancialYear,
  filterDistrict,
  filterPhase,
  customRequestedAmount,
  customChildrenCount,
}) => {
  const [data] = useState<FundAllocationItem[]>(INITIAL_DATA);

  // Filter and update requested amount and children count when filters are passed from FundAllocationField
  const displayedData = useMemo(() => {
    if (!filterDistrict && !filterPhase && !filterFinancialYear) {
      return data;
    }

    let list = data.filter((item) => {
      const matchDistrict =
        !filterDistrict ||
        item.district.toLowerCase() === filterDistrict.toLowerCase();
      const normPhase = filterPhase
        ? filterPhase.toLowerCase().replace('_', ' ')
        : '';
      const matchPhase =
        !filterPhase ||
        item.phase.toLowerCase() === normPhase ||
        item.phase.toLowerCase() === filterPhase.toLowerCase();
      return matchDistrict && matchPhase;
    });

    if (list.length === 0 && filterDistrict) {
      const districtLabel =
        filterDistrict.charAt(0).toUpperCase() + filterDistrict.slice(1);
      const phaseLabel = filterPhase
        ? filterPhase.toLowerCase().includes('2')
          ? 'Phase 2'
          : 'Phase 1'
        : 'Phase 1';
      const fyLabel = filterFinancialYear || '2025-26';
      const count =
        customChildrenCount !== undefined
          ? customChildrenCount
          : filterDistrict.toLowerCase() === 'dhenkanal'
          ? 180
          : filterDistrict.toLowerCase() === 'cuttack'
          ? 320
          : filterDistrict.toLowerCase() === 'khordha'
          ? 210
          : filterDistrict.toLowerCase() === 'sambalpur'
          ? 200
          : 250;
      const reqAmt =
        customRequestedAmount !== undefined
          ? customRequestedAmount
          : count * 900;
      list = [
        {
          id: '5',
          financialYear: fyLabel,
          district: districtLabel,
          project: 'Project 1',
          phase: phaseLabel,
          status: 'pending',
          childrenCount: count,
          requestedAmount: reqAmt,
          allocatedAmount: reqAmt,
        },
      ];
    } else {
      if (customRequestedAmount !== undefined || customChildrenCount !== undefined || filterFinancialYear) {
        list = list.map((item) => {
          const newReq = customRequestedAmount !== undefined ? customRequestedAmount : item.requestedAmount;
          return {
            ...item,
            ...(filterFinancialYear ? { financialYear: filterFinancialYear } : {}),
            ...(customRequestedAmount !== undefined ? { requestedAmount: newReq, allocatedAmount: newReq } : {}),
            ...(customChildrenCount !== undefined ? { childrenCount: customChildrenCount } : {}),
          };
        });
      }
    }

    return list;
  }, [data, filterFinancialYear, filterDistrict, filterPhase, customRequestedAmount, customChildrenCount]);

  // Selected item for View Modal
  const [viewItem, setViewItem] = useState<FundAllocationItem | null>(null);

  /* ---------------------------------------------
     Action: View Details
  --------------------------------------------- */

  const handleView = useCallback((item: FundAllocationItem) => {
    setViewItem(item);
  }, []);

  /* ---------------------------------------------
     Columns
  --------------------------------------------- */

  const columns = useMemo(
    () =>
      getFundAllocationColumns(
        handleView,
      ),
    [handleView],
  );

  return (
    <>
      <Card
        title="Requested Fund  List"
        icon={Layers}
      >
        <ReusableTable
          key="fund-allocation-table-v2"
          columns={columns}
          data={displayedData}
          enableRowActions={false}
          enableExport={true}
          exportFileName="fund-allocation_records"
        />
      </Card>

      {/* ---------------------------------------------
         1. View Details Modal
      --------------------------------------------- */}
      <Modal
        isOpen={Boolean(viewItem)}
        onClose={() => setViewItem(null)}
        title={
          viewItem
            ? `Fund Allocation Details - ${viewItem.district} (${viewItem.phase})`
            : 'Fund Allocation Details'
        }
        size="lg"
      >
        {viewItem && (
          <div className="space-y-4 p-2">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-b pb-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Financial Year
                  </span>
                  <p className="mt-1 text-sm font-medium font-mono text-foreground">
                    {viewItem.financialYear || '2025-26'}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    District
                  </span>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {viewItem.district}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Project
                  </span>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {viewItem.project}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Phase
                  </span>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {viewItem.phase}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Children Count (Auto-filled)
                  </span>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {viewItem.childrenCount}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Requested Amount
                  </span>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    ₹{viewItem.requestedAmount.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Allocated Amount
                  </span>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">
                    {viewItem.allocatedAmount > 0
                      ? `₹${viewItem.allocatedAmount.toLocaleString('en-IN')}`
                      : 'Not Allocated (₹0)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-slate-800">
              <Button
                type="button"
                variant="secondary"
                label="Close"
                size="md"
                onClick={() => setViewItem(null)}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default FundAllocationList;