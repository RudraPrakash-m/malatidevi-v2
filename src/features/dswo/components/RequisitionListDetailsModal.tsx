// src/features/dswo/components/RequisitionListDetailsModal.tsx

import React from 'react';
import {
  MapPin,
  Calendar,
  Layers,
  Users,
  IndianRupee,
  FileText,
  UserCheck,
} from 'lucide-react';
import Modal from '@/shared/components/ui/Modal/Modal';
import Button from '@/shared/components/ui/Button';
import type { FundRequestItem } from '@/features/state/pages/FundRequestList';

const formatRequisitionStatus = (status?: string): 'Pending' | 'Paid' => {
  const upper = String(status || '').toUpperCase();
  if (upper.includes('PAID') || upper === 'APPROVED') {
    return 'Paid';
  }
  return 'Pending';
};

export interface RequisitionListDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: FundRequestItem | null;
}

export const RequisitionListDetailsModal: React.FC<RequisitionListDetailsModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
}) => {
  if (!selectedItem) return null;

  const formattedStatus = formatRequisitionStatus(selectedItem.status);
  const requestedAmt = selectedItem.requestedAmt || 0;
  const alreadyAllocated =
    selectedItem.fundAllocated ??
    (typeof selectedItem.allocateAmount === 'number'
      ? selectedItem.allocateAmount
      : 0);
  const isPaid = formattedStatus === 'Paid';

  const modalFooter = (
    <div className="flex items-center justify-end w-full">
      <Button
        type="button"
        variant="secondary"
        size="md"
        label="Close"
        onClick={onClose}
      />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Requisition Details - ${selectedItem.district}`}
      size="lg"
      footer={modalFooter}
    >
      <div className="space-y-3.5">
        {/* Top Summary Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                ID: #{selectedItem.id}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                {formattedStatus}
              </span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{selectedItem.district} District</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({selectedItem.project} Projects)
              </span>
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isPaid ? 'Total Allocated' : 'Status'}
            </span>
            <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white font-mono">
              {isPaid ? `₹${alreadyAllocated.toLocaleString('en-IN')}` : formattedStatus}
            </span>
          </div>
        </div>

        {/* 3x4 Grid of Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {/* 1. Financial Year */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <Calendar size={12} className="text-blue-500" />
              <span>Financial Year</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
              {selectedItem.financialYear}
            </p>
          </div>

          {/* 2. District */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <MapPin size={12} className="text-blue-500" />
              <span>District</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              {selectedItem.district}
            </p>
          </div>

          {/* 3. Application Date */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <Calendar size={12} className="text-blue-500" />
              <span>Application Date</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
              {selectedItem.allocationDate || selectedItem.applicationDate || '15/09/2026'}
            </p>
          </div>

          {/* 4. Projects */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <Layers size={12} className="text-blue-500" />
              <span>Projects</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
              {selectedItem.project}
            </p>
          </div>

          {/* 5. Sectors */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <Layers size={12} className="text-blue-500" />
              <span>Sectors</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
              {selectedItem.sectors}
            </p>
          </div>

          {/* 6. AWCs */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <Layers size={12} className="text-blue-500" />
              <span>AWCs</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
              {selectedItem.awcCount.toLocaleString('en-IN')}
            </p>
          </div>

          {/* 7. Total Children */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <Users size={12} className="text-blue-500" />
              <span>Total Beneficiary Children</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
              {selectedItem.totalChildren.toLocaleString('en-IN')}
            </p>
          </div>

          {/* 8. Item Category */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <FileText size={12} className="text-blue-500" />
              <span>Item Category</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate" title={selectedItem.itemCategory}>
              {selectedItem.itemCategory}
            </p>
          </div>

          {/* 9. Fund Requested (Commented out) */}
          {/* <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <IndianRupee size={12} className="text-blue-500" />
              <span>Fund Requested</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white font-mono">
              ₹{requestedAmt.toLocaleString('en-IN')}
            </p>
          </div> */}

          {/* 9. Fund Allocated Amount */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <IndianRupee size={12} className="text-blue-500" />
              <span>Fund Allocated</span>
            </div>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
              ₹{alreadyAllocated.toLocaleString('en-IN')}
            </p>
          </div>

          {/* 10. Status */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <FileText size={12} className="text-blue-500" />
              <span>Status</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-900 dark:text-white font-mono">
              {formattedStatus}
            </p>
          </div>

          {/* 11. Requested By Authority (Side by side with Status) */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 col-span-1 sm:col-span-1 md:col-span-2">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <UserCheck size={12} className="text-blue-500" />
              <span>Requested By Authority</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              {selectedItem.requestedBy || `DSWO ${selectedItem.district}`}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RequisitionListDetailsModal;
