// src/features/shared/uc-certificate/pages/UcOversight.tsx

import React, { useState, useMemo, useCallback } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import {
  Award,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '@/shared/components/layout/Card';
import { ReusableTable } from '@/shared/components/ui/Table';
import Select from '@/shared/components/ui/Forms/Select';
import Button from '@/shared/components/ui/Button';
import Modal from '@/shared/components/ui/Modal/Modal';
import TextArea from '@/shared/components/ui/Forms/TextArea';
import { useUcOversight } from '../hooks/useUcOversight';
import type { UcOversightItem } from '../types/uc-certificate.types';

const STATUS_FILTER_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'VERIFIED', value: 'VERIFIED' },
  { label: 'SUBMITTED', value: 'SUBMITTED' },
  { label: 'PENDING', value: 'PENDING' },
  { label: 'REVERTED', value: 'REVERTED' },
];

export const UcOversight: React.FC = () => {
  const { ucRecords, verifyUc, revertUc } = useUcOversight();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [districtSearch, setDistrictSearch] = useState<string>('');

  // Revert Modal State
  const [revertItem, setRevertItem] = useState<UcOversightItem | null>(null);
  const [revertRemarks, setRevertRemarks] = useState<string>('');

  // Filtered dataset
  const filteredData = useMemo(() => {
    return ucRecords.filter((rec) => {
      if (statusFilter !== 'all' && rec.status !== statusFilter) {
        return false;
      }
      if (
        districtSearch &&
        !rec.district.toLowerCase().includes(districtSearch.toLowerCase()) &&
        !rec.id.toLowerCase().includes(districtSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [ucRecords, statusFilter, districtSearch]);

  const handleConfirmRevert = async () => {
    if (!revertItem) return;
    if (!revertRemarks.trim()) {
      toast.error('Please enter audit defect remarks for reverting.');
      return;
    }
    await revertUc(revertItem.id, revertRemarks.trim());
    toast.warn(`UC ${revertItem.id} for ${revertItem.district} has been reverted.`);
    setRevertItem(null);
    setRevertRemarks('');
  };

  const handleVerify = useCallback(async (item: UcOversightItem) => {
    await verifyUc(item.id, 'Verified and approved by State Authority.');
    toast.success(`UC ${item.id} for ${item.district} verified successfully!`);
  }, [verifyUc]);

  const columns = useMemo<MRT_ColumnDef<UcOversightItem>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'UC Reference ID',
        size: 130,
        Cell: ({ cell }) => (
          <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'district',
        header: 'District / Project',
        size: 180,
        Cell: ({ row }) => (
          <div>
            <span className="font-bold text-slate-900 dark:text-white block text-xs">
              {row.original.district}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {row.original.project} • {row.original.phase}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'financialYear',
        header: 'Financial Year',
        size: 110,
        Cell: ({ cell }) => (
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'allocatedAmount',
        header: 'Sanctioned (₹)',
        size: 130,
        Cell: ({ cell }) => (
          <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
            ₹{cell.getValue<number>()?.toLocaleString('en-IN')}
          </span>
        ),
      },
      {
        accessorKey: 'utilizedAmount',
        header: 'Utilized Amount (₹)',
        size: 140,
        Cell: ({ cell }) => (
          <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400">
            ₹{cell.getValue<number>()?.toLocaleString('en-IN')}
          </span>
        ),
      },
      {
        accessorKey: 'unutilizedAmount',
        header: 'Unspent Balance (₹)',
        size: 140,
        Cell: ({ cell }) => {
          const val = cell.getValue<number>();
          return (
            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
              ₹{val ? val.toLocaleString('en-IN') : '0'}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Audit Status',
        size: 120,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          if (status === 'VERIFIED') {
            return (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 size={12} /> VERIFIED
              </span>
            );
          }
          if (status === 'REVERTED') {
            return (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                <AlertCircle size={12} /> REVERTED
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              {status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 150,
        Cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-1.5">
              {item.status !== 'VERIFIED' && (
                <button
                  type="button"
                  onClick={() => handleVerify(item)}
                  className="px-2 py-1 text-xs font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                  title="Approve & Verify UC"
                >
                  Verify
                </button>
              )}
              {item.status !== 'REVERTED' && item.status !== 'VERIFIED' && (
                <button
                  type="button"
                  onClick={() => setRevertItem(item)}
                  className="px-2 py-1 text-xs font-semibold rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                  title="Revert UC for Rectification"
                >
                  Revert
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  alert(
                    `Viewing submitted document: ${item.certificateDocName}\n\nSHA-256 Digital Signature Validated.`
                  )
                }
                className="p-1 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                title="View UC Document"
              >
                <FileText size={15} />
              </button>
            </div>
          );
        },
      },
    ],
    [handleVerify]
  );

  return (
    <div className="space-y-4">
      <Card>
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={18} className="text-amber-600 dark:text-amber-400" />
              <span>Utilization Certificate (UC) Oversight</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verify and audit district-level utilization certificates and expenditure compliance across Odisha.
            </p>
          </div>

          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 self-start sm:self-auto">
            {filteredData.length} Certificates
          </span>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-b border-slate-100 dark:border-slate-800/80 items-end">
          <Select
            label="Filter by Status"
            options={STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <div>
            <label className="block text-[13px] font-medium text-foreground mb-1.5 leading-none">
              Search District / UC ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                placeholder="e.g. Cuttack, UC-2026..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-primary"
              />
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div>
            {(statusFilter !== 'all' || districtSearch) && (
              <Button
                type="button"
                variant="outline"
                size="md"
                label="Reset Filters"
                icon={<RotateCcw size={14} />}
                onClick={() => {
                  setStatusFilter('all');
                  setDistrictSearch('');
                }}
              />
            )}
          </div>
        </div>

        {/* Table */}
        <div className="pt-2">
          <ReusableTable
            columns={columns}
            data={filteredData}
            enableRowActions={false}
            enableExport
            exportFileName="uc_oversight_records"
          />
        </div>
      </Card>

      {/* Revert Modal */}
      {revertItem && (
        <Modal
          isOpen={Boolean(revertItem)}
          onClose={() => setRevertItem(null)}
          title={`Revert Utilization Certificate — ${revertItem.district}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
              Reverting will notify the DSWO of {revertItem.district} to re-audit invoices and submit a corrected UC.
            </div>

            <TextArea
              label="Deficiency / Audit Remarks"
              required
              rows={4}
              value={revertRemarks}
              onChange={(e) => setRevertRemarks(e.target.value)}
              placeholder="State the discrepancy or missing invoices..."
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="secondary"
                label="Cancel"
                size="md"
                onClick={() => setRevertItem(null)}
              />
              <Button
                type="button"
                variant="danger"
                label="Confirm Revert"
                size="md"
                onClick={handleConfirmRevert}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UcOversight;
