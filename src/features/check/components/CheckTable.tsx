// src/features/check/components/CheckTable.tsx

import React, { useMemo } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import {
  Forward,
  Check,
  FileText,
  Camera,
} from 'lucide-react';
import { ReusableTable } from '@/shared/components/ui/Table';
import ActionButtons from '@/shared/components/ui/Actions/ActionButtons';
import type { CheckItem, CheckRole, CheckStatus } from '../types/check.types';

interface CheckTableProps {
  data: CheckItem[];
  currentRole: CheckRole;
  activeTab?: string;
  hideStatusColumn?: boolean;
  onView: (item: CheckItem) => void;
  onViewDoc: (item: CheckItem) => void;
  onViewPhoto: (item: CheckItem) => void;
  onForward: (item: CheckItem) => void;
  onRevert: (item: CheckItem) => void;
  onReject: (item: CheckItem) => void;
  onViewCredentials: (item: CheckItem) => void;
  onBulkForward?: (selectedItems: CheckItem[]) => void;
  onBulkApprove?: (selectedItems: CheckItem[]) => void;
}

export const CheckTable: React.FC<CheckTableProps> = ({
  data,
  currentRole,
  activeTab,
  hideStatusColumn = false,
  onView,
  onViewDoc,
  onViewPhoto,
  onForward,
}) => {
  const renderStatusBadge = (status: CheckStatus, role?: CheckRole) => {
    // Specialized display for BLC login
    if (role === 'BLC') {
      if (status === 'rejected') {
        return (
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            Rejected
          </span>
        );
      }
      if (status === 'approved') {
        return (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Approved
          </span>
        );
      }
      return (
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
          Pending
        </span>
      );
    }

    // Specialized 2-status display for BLF login on Pending tab
    if (role === 'BLF') {
      if (status === 'pending_blc') {
        return (
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Pending at BLC
          </span>
        );
      }
      return (
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
          Pending
        </span>
      );
    }

    // Default status display for DSWO and other logins
    switch (status) {
      case 'approved':
        return (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            Rejected
          </span>
        );
      case 'pending_blf':
        return (
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Pending at BLF
          </span>
        );
      case 'pending_blc':
        return (
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Pending at BLC
          </span>
        );
      case 'pending_dswo':
        return (
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Pending
          </span>
        );
      default:
        return (
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {status}
          </span>
        );
    }
  };

  // Material React Table columns definition using common MRT_ColumnDef
  const columns = useMemo<MRT_ColumnDef<CheckItem>[]>(
    () => [
      // 1. SHG Name
      {
        accessorKey: 'name',
        header: 'SHG Name',
        size: 220,
        minSize: 190,
        Cell: ({ row }) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 block">
              {row.original.name}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {row.original.code} • {row.original.block}
            </span>
          </div>
        ),
      },

      // 2. Application ID
      {
        accessorKey: 'applicationId',
        header: 'Application ID',
        size: 150,
        minSize: 130,
        Cell: ({ row }) => (
          <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
            {row.original.applicationId}
          </span>
        ),
      },

      // 3. Status (shown in Pending tab, kept before Apply Date)
      ...(!hideStatusColumn
        ? [
          {
            id: 'status',
            accessorKey: 'status' as const,
            header: 'Status',
            size: 160,
            minSize: 140,
            Cell: ({ row }: any) => renderStatusBadge(row.original.status, currentRole),
          },
        ]
        : []),

      // 4. Apply Date (kept after Status column)
      {
        accessorKey: 'applyDate',
        header: 'Apply Date',
        size: 120,
        minSize: 100,
      },

      // 5. Remarks Column: In Reject tab show badge and reason, in Pending tab show L1/L2 Remarks
      {
        id: 'remarks',
        header: activeTab === 'reject' ? 'Remarks' : 'L1/L2 Remarks',
        size: 250,
        minSize: 210,
        Cell: ({ row }) => {
          const item = row.original;
          const isRejectedTab = activeTab === 'reject' || item.status === 'rejected';

          if (isRejectedTab) {
            let badgeText = 'Rejected';
            if (currentRole === 'BLF') {
              badgeText = 'Rejected by BLC';
            } else if (currentRole === 'DSWO') {
              const who = (item.rejectedBy === 'CDPO' ? 'BLF' : item.rejectedBy) || 'BLF';
              badgeText = `Rejected by ${who}`;
            } else if (currentRole === 'BLC') {
              badgeText = 'Rejected';
            }

            const reason =
              item.rejectionReason ||
              item.l1Remarks ||
              item.l2Remarks ||
              item.l3Remarks ||
              'Ineligible under guidelines';

            return (
              <div className="flex flex-col gap-1 max-w-[260px]">
                <span className="inline-flex items-center w-fit text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-2xs">
                  {badgeText}
                </span>
                <span
                  className="text-xs text-rose-700 dark:text-rose-400 font-medium truncate"
                  title={reason}
                >
                  {reason}
                </span>
              </div>
            );
          }

          if (item.l2Remarks) {
            return (
              <span
                className="text-xs text-blue-700 dark:text-blue-300 block truncate max-w-[200px]"
                title={`L2: ${item.l2Remarks}`}
              >
                <strong>L2:</strong> {item.l2Remarks}
              </span>
            );
          }
          if (item.l1Remarks) {
            return (
              <span
                className="text-xs text-amber-700 dark:text-amber-300 block truncate max-w-[200px]"
                title={`L1: ${item.l1Remarks}`}
              >
                <strong>L1:</strong> {item.l1Remarks}
              </span>
            );
          }
          return <span className="text-slate-400">—</span>;
        },
      },

      // 6. Document View & 7. GeoTag Photo:
      // Removed in Pending and Reject tabs (available inside View Details modal)
      ...(!['pending', 'reject'].includes(activeTab || '')
        ? [
          {
            id: 'documentView',
            header: 'Document View',
            size: 130,
            minSize: 110,
            Cell: ({ row }: any) => (
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onViewDoc(row.original)}
                  className="w-7 h-7 rounded-full bg-action-primary-bg text-action-primary-text hover:opacity-80 transition-all inline-flex items-center justify-center hover:shadow-sm cursor-pointer"
                  title="View Document"
                  aria-label="View Document"
                >
                  <FileText size={14} />
                </button>
              </div>
            ),
          },
          {
            id: 'geoTagPhoto',
            header: 'GeoTag Photo',
            size: 130,
            minSize: 110,
            Cell: ({ row }: any) => (
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onViewPhoto(row.original)}
                  className="w-7 h-7 rounded-full bg-action-primary-bg text-action-primary-text hover:opacity-80 transition-all inline-flex items-center justify-center hover:shadow-sm cursor-pointer"
                  title="View GeoTag Photo"
                  aria-label="View GeoTag Photo"
                >
                  <Camera size={14} />
                </button>
              </div>
            ),
          },
        ]
        : []),

      // 8. Action Column - in Approve and Reject tabs: ONLY keep the view icon!
      {
        id: 'actions',
        header: 'Action',
        size: 90,
        minSize: 80,
        Cell: ({ row }) => {
          const item = row.original;
          const isBlc = currentRole === 'BLC';
          const isApproveOrRejectTab =
            activeTab === 'approve' ||
            activeTab === 'reject' ||
            item.status === 'approved' ||
            item.status === 'rejected';

          // In Approve tab and Reject tab: ONLY keep the view icon!
          if (isApproveOrRejectTab) {
            return (
              <div className="flex items-center justify-center">
                <ActionButtons
                  actions={['view']}
                  onAction={() => onView(item)}
                  actionTitles={{
                    view: 'View Application Summary',
                  }}
                />
              </div>
            );
          }

          const isForwardDisabled = item.status === 'pending_blc';
          const actionTooltip =
            currentRole === 'DSWO'
              ? 'Forward to BLF'
              : currentRole === 'BLF'
                ? 'Forward to BLC'
                : 'Final Approve';

          return (
            <div className="flex items-center justify-center">
              {isBlc ? (
                /* BLC: Final Approve icon in single consistent success style */
                <button
                  type="button"
                  disabled={item.status === 'approved' || item.status === 'rejected'}
                  onClick={() => onForward(item)}
                  className="w-7 h-7 rounded-full bg-action-success-bg text-action-success-text hover:opacity-80 transition-all inline-flex items-center justify-center hover:shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title={actionTooltip}
                  aria-label={actionTooltip}
                >
                  <Check size={14} />
                </button>
              ) : (
                /* DSWO & BLF: One Forward Icon kept consistent across pages in a single color */
                <button
                  type="button"
                  disabled={isForwardDisabled}
                  onClick={() => onForward(item)}
                  className={`w-7 h-7 rounded-full inline-flex items-center justify-center transition-all duration-200 shadow-2xs ${
                    isForwardDisabled
                      ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 opacity-50 cursor-not-allowed'
                      : 'bg-orange-100 hover:bg-orange-200 active:bg-orange-300 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300 hover:shadow-xs cursor-pointer'
                  }`}
                  title={isForwardDisabled ? 'Already forwarded to BLC' : actionTooltip}
                  aria-label={isForwardDisabled ? 'Already forwarded to BLC' : actionTooltip}
                >
                  <Forward size={14} />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [
      currentRole,
      activeTab,
      hideStatusColumn,
      onView,
      onViewDoc,
      onViewPhoto,
      onForward,
    ]
  );

  return (
    <div className="space-y-3">
      {/* Table Container with single scrollbar managed by ReusableTable */}
      <div className="rounded-xl overflow-hidden">
        <ReusableTable
          key={`${currentRole}-${activeTab || 'all'}`}
          columns={columns}
          data={data}
          enableRowActions={false}
          enableExport
          exportFileName={`wshg_${currentRole.toLowerCase()}_verification_records`}
        />
      </div>
    </div>
  );
};
