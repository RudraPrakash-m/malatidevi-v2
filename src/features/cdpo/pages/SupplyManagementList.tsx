// src/features/cdpo/pages/SupplyManagementList.tsx

import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import type { MRT_ColumnDef } from 'material-react-table';
import {
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageSquare,
  X,
} from 'lucide-react';

import { ReusableTable } from '@/shared/components/ui/Table';
import Card from '@/shared/components/layout/Card';

import type { SupplyManagementItem } from '../types/supply-management.types';
import { useSupplyManagementItems } from '../state/supplyManagementState';

// Helper to calculate 7-day validity and remaining days
export const calculateAllocationValidity = (
  orderDateStr?: string,
  rawStatus?: string
): { daysRemaining: number; isExpired: boolean; effectiveStatus: string } => {
  const normalizedStatus = (rawStatus || 'pending').toLowerCase();

  // If already explicitly accepted or rejected, validity timer is closed
  if (normalizedStatus === 'accepted' || normalizedStatus === 'rejected') {
    return { daysRemaining: 0, isExpired: false, effectiveStatus: normalizedStatus };
  }

  if (!orderDateStr) {
    return { daysRemaining: 7, isExpired: false, effectiveStatus: 'pending' };
  }

  const orderDate = new Date(orderDateStr);
  const currentDate = new Date();

  // Clear time components for pure date comparison
  orderDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  const diffTime = currentDate.getTime() - orderDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const daysRemaining = 7 - diffDays;
  const isExpired = daysRemaining <= 0;

  return {
    daysRemaining: Math.max(0, daysRemaining),
    isExpired,
    effectiveStatus: isExpired ? 'expired' : 'pending',
  };
};

export const SupplyManagementList: React.FC = () => {
  const { items } = useSupplyManagementItems();
  const [selectedRemarks, setSelectedRemarks] = useState<{ shgName: string; remarks: string } | null>(
    null
  );

  const authUser = useSelector((state: RootState) => state.auth.user);
  const isCdpo = authUser?.primaryRoleCode === 'CDPO' || authUser?.loginUserName === 'cdpo';

  const columns = useMemo<MRT_ColumnDef<SupplyManagementItem>[]>(() => {
    const baseCols: MRT_ColumnDef<SupplyManagementItem>[] = [
      {
        accessorKey: 'slNo',
        header: 'Sl. No',
        size: 65,
        minSize: 55,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell, row }) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-medium">
            {(cell.getValue() as number) || row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: 'financialYear',
        header: 'Financial Year',
        size: 130,
        minSize: 110,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-medium">
            {cell.getValue() as string}
          </span>
        ),
      },
    ];

    if (isCdpo) {
      baseCols.push(
        {
          accessorKey: 'sector',
          header: 'Sector',
          size: 150,
          minSize: 120,
          Cell: ({ cell }) => (
            <span className="font-medium text-xs text-slate-800 dark:text-slate-200">
              {(cell.getValue() as string) || 'Sector 1 (Unit 8)'}
            </span>
          ),
        },
        {
          accessorKey: 'center',
          header: 'Center',
          size: 150,
          minSize: 120,
          Cell: ({ cell }) => (
            <span className="font-medium text-xs text-slate-800 dark:text-slate-200">
              {(cell.getValue() as string) || 'AWC Unit-8 A'}
            </span>
          ),
        }
      );
    } else {
      baseCols.push({
        accessorKey: 'project',
        header: 'Project',
        size: 130,
        minSize: 110,
      });
    }

    baseCols.push(
      {
        accessorKey: 'shgName',
        header: 'SHG Name',
        size: 220,
        minSize: 170,
        Cell: ({ cell }) => <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">{cell.getValue() as string}</span>,
      },
      {
        accessorKey: 'itemCategory',
        header: 'Item Category',
        size: 130,
        minSize: 110,
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          return <span className="text-xs text-slate-700 dark:text-slate-300">{val}</span>;
        },
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        size: 100,
        minSize: 85,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-100">{Number(cell.getValue()).toLocaleString('en-IN')}</span>
        ),
      },
      {
        accessorKey: 'orderDate',
        header: 'Order Date',
        size: 120,
        minSize: 105,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => {
          const val = cell.getValue() as string;
          if (!val) return <span className="font-mono text-xs text-slate-400">18/09/2026</span>;
          
          // Format YYYY-MM-DD to DD/MM/YYYY if applicable
          if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            const [yyyy, mm, dd] = val.split('-');
            return <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">{`${dd}/${mm}/${yyyy}`}</span>;
          }
          return <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">{val}</span>;
        },
      },
      {
        accessorKey: 'status',
        header: 'Allocation Status',
        size: 150,
        minSize: 130,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => {
          const item = row.original;
          const { daysRemaining, isExpired, effectiveStatus } = calculateAllocationValidity(
            item.orderDate,
            item.status
          );

          if (effectiveStatus === 'accepted') {
            return (
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span>Accepted</span>
                </span>
              </div>
            );
          }

          if (effectiveStatus === 'rejected') {
            return (
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <XCircle size={15} className="shrink-0" />
                  <span>Rejected</span>
                </span>
              </div>
            );
          }

          if (isExpired) {
            return (
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <AlertTriangle size={15} className="shrink-0" />
                  <span>Expired</span>
                </span>
              </div>
            );
          }

          // Active countdown pending
          return (
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Clock size={15} className="shrink-0" />
                <span>
                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
                </span>
              </span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: 'Action',
        size: 80,
        minSize: 75,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => {
          const item = row.original;
          const hasRemarks = Boolean(item.remarks && item.remarks.trim());

          return (
            <div className="flex items-center justify-center">
              {/* Remarks Action */}
              <button
                type="button"
                disabled={!hasRemarks}
                onClick={() => {
                  if (hasRemarks) {
                    setSelectedRemarks({
                      shgName: item.shgName,
                      remarks: item.remarks || '',
                    });
                  }
                }}
                title={hasRemarks ? 'View Remarks' : 'No remarks available'}
                className={`p-1.5 rounded-lg transition-colors ${
                  hasRemarks
                    ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50 cursor-pointer'
                    : 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
                }`}
              >
                <MessageSquare size={16} />
              </button>
            </div>
          );
        },
      }
    );

    return baseCols;
  }, [isCdpo]);

  return (
    <>
      <Card title="Supply Management Details" icon={Layers}>
        <ReusableTable
          columns={columns}
          data={items}
          enableRowActions={false}
          enableExport={true}
          exportFileName="supply-management_records"
        />
      </Card>

      {/* Remarks Modal */}
      {selectedRemarks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <XCircle size={18} className="text-red-600 dark:text-red-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Rejection Remarks
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRemarks(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <strong>SHG:</strong> {selectedRemarks.shgName}
              </p>
              <div className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-200 leading-relaxed font-medium">
                {selectedRemarks.remarks}
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRemarks(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupplyManagementList;