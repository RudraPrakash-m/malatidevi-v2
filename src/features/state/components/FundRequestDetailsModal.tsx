// src/features/state/components/FundRequestDetailsModal.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Calendar,
  Layers,
  Users,
  IndianRupee,
  FileText,
  UserCheck,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '@/shared/components/ui/Modal/Modal';
import Button from '@/shared/components/ui/Button';
import type { FundRequestItem } from '../pages/FundRequestList';
import { formatStatusText } from '../pages/FundRequestList';

export interface FundRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: FundRequestItem | null;
  onUpdateItem?: (updatedItem: FundRequestItem) => void;
}

export const FundRequestDetailsModal: React.FC<FundRequestDetailsModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  onUpdateItem,
}) => {
  const [allocateInput, setAllocateInput] = useState<string>('');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [rejectionRemarksInput, setRejectionRemarksInput] = useState<string>('');

  const formattedStatus = selectedItem ? formatStatusText(selectedItem.status) : 'PENDING';
  const requestedAmt = selectedItem?.requestedAmt || 0;
  const alreadyAllocated =
    selectedItem?.fundAllocated ??
    (typeof selectedItem?.allocateAmount === 'number'
      ? selectedItem.allocateAmount
      : 0);
  const pendingAmt = Math.max(0, requestedAmt - alreadyAllocated);

  const isPartial = formattedStatus === 'PARTIALLY PAID' || formattedStatus === 'PARTIAL PAID';
  const isPending = formattedStatus === 'PENDING' || formattedStatus === 'NOT PAID';
  const isRejected = formattedStatus === 'REJECTED';
  const isFullyPaid = formattedStatus === 'FULLY PAID' || formattedStatus === 'TOTALLY PAID';
  const canAllocateOrReject = isPartial || isPending;

  // Initialize or reset input values whenever modal opens or selected item changes
  useEffect(() => {
    if (selectedItem) {
      const remaining = Math.max(
        0,
        selectedItem.requestedAmt -
          (selectedItem.fundAllocated ??
            (typeof selectedItem.allocateAmount === 'number'
              ? selectedItem.allocateAmount
              : 0))
      );
      setAllocateInput(remaining > 0 ? String(remaining) : String(selectedItem.requestedAmt));
      setIsRejecting(false);
      setRejectionRemarksInput('');
    }
  }, [selectedItem, isOpen]);

  // Handle fund allocation
  const handleConfirmAllocation = useCallback(() => {
    if (!selectedItem) return;

    const amountToAdd = parseFloat(allocateInput);
    if (!allocateInput || isNaN(amountToAdd) || amountToAdd <= 0) {
      toast.error('Please enter a valid positive allocation amount.');
      return;
    }

    if (amountToAdd > pendingAmt) {
      toast.error(
        `Allocation amount cannot exceed the pending balance of ₹${pendingAmt.toLocaleString('en-IN')}.`
      );
      return;
    }

    const newTotalAllocated = alreadyAllocated + amountToAdd;
    const nextStatus = newTotalAllocated >= requestedAmt ? 'FULLY PAID' : 'PARTIALLY PAID';

    const updated: FundRequestItem = {
      ...selectedItem,
      fundAllocated: newTotalAllocated,
      allocateAmount: newTotalAllocated,
      status: nextStatus,
    };

    if (onUpdateItem) {
      onUpdateItem(updated);
    }

    toast.success(
      `Successfully allocated ₹${amountToAdd.toLocaleString(
        'en-IN'
      )} for ${selectedItem.district} District (${nextStatus})!`
    );
    onClose();
  }, [selectedItem, allocateInput, pendingAmt, alreadyAllocated, requestedAmt, onUpdateItem, onClose]);

  // Handle rejection
  const handleConfirmRejection = useCallback(() => {
    if (!selectedItem) return;

    if (!rejectionRemarksInput.trim()) {
      toast.error('Please provide a reason or remarks for rejection.');
      return;
    }

    const updated: FundRequestItem = {
      ...selectedItem,
      status: 'REJECTED',
      rejectionRemarks: rejectionRemarksInput.trim(),
    };

    if (onUpdateItem) {
      onUpdateItem(updated);
    }

    toast.warn(`Fund Request for ${selectedItem.district} District has been REJECTED.`);
    onClose();
  }, [selectedItem, rejectionRemarksInput, onUpdateItem, onClose]);

  if (!selectedItem) return null;

  // Fixed Bottom Action Footer (Same compact height for all statuses)
  const modalFooter = (
    <div className="w-full">
      {canAllocateOrReject && !isRejecting && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-[200px]">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                ₹
              </span>
              <input
                type="number"
                min="1"
                max={pendingAmt}
                value={allocateInput}
                onChange={(e) => setAllocateInput(e.target.value)}
                placeholder={`Pending: ${pendingAmt}`}
                className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none shadow-2xs"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              label="Allocate Amount"
              icon={<CheckCircle2 size={14} />}
              onClick={handleConfirmAllocation}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              label="Reject"
              icon={<XCircle size={14} className="text-rose-600" />}
              onClick={() => setIsRejecting(true)}
            />
          </div>

          <div className="flex items-center justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              label="Close"
              onClick={onClose}
            />
          </div>
        </div>
      )}

      {canAllocateOrReject && isRejecting && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
          <div className="flex-1">
            <input
              type="text"
              value={rejectionRemarksInput}
              onChange={(e) => setRejectionRemarksInput(e.target.value)}
              placeholder="Enter rejection remarks / justification..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-300 dark:border-rose-900/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              label="Cancel"
              onClick={() => {
                setIsRejecting(false);
                setRejectionRemarksInput('');
              }}
            />
            <button
              type="button"
              onClick={handleConfirmRejection}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 transition-colors shadow-2xs cursor-pointer"
            >
              <XCircle size={13} />
              <span>Confirm Reject</span>
            </button>
          </div>
        </div>
      )}

      {(isFullyPaid || isRejected) && (
        <div className="flex items-center justify-end w-full">
          <Button
            type="button"
            variant="secondary"
            size="md"
            label="Close"
            onClick={onClose}
          />
        </div>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Fund Request Details - ${selectedItem.district}`}
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
              {/* <span className="text-[11px] font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                {formattedStatus}
              </span> */}
            </div>
            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{selectedItem.district} District</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({selectedItem.project} Projects)
              </span>
            </h3>
          </div>

          {/* <div className="text-right">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isFullyPaid
                ? 'Total Allocated'
                : isPartial
                ? `Pending: ₹${pendingAmt.toLocaleString('en-IN')}`
                : 'Fund Requested'}
            </span>
            <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white font-mono">
              ₹{(isFullyPaid ? alreadyAllocated : requestedAmt).toLocaleString('en-IN')}
            </span>
          </div> */}
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

          {/* 3. Allocation Date */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <Calendar size={12} className="text-blue-500" />
              <span>Allocation Date</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
              {isPending ? '—' : (selectedItem.allocationDate || '—')}
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

          {/* 9. Fund Requested */}
          {/* <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <IndianRupee size={12} className="text-blue-500" />
              <span>Fund Requested</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white font-mono">
              ₹{requestedAmt.toLocaleString('en-IN')}
            </p>
          </div> */}

          {/* 10. Fund Allocated Amount */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <IndianRupee size={12} className="text-blue-500" />
              <span>Fund Allocated</span>
            </div>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
              ₹{alreadyAllocated.toLocaleString('en-IN')}
            </p>
          </div>

          {/* 11. Status (Plain uppercase text) */}
          {/* <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <FileText size={12} className="text-blue-500" />
              <span>Status</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-900 dark:text-white font-mono">
              {formattedStatus}
            </p>
          </div> */}

          {/* 12. Requested By */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 col-span-1 sm:col-span-2 md:col-span-3">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
              <UserCheck size={12} className="text-blue-500" />
              <span>Requested By Authority</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              {selectedItem.requestedBy || `DSWO ${selectedItem.district}`}
            </p>
          </div>
        </div>

        {/* Rejected: Prominently Show Remarks Data */}
        {isRejected && (
          <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
              <XCircle size={15} className="text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Reason for Rejection / Remarks</span>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-rose-200/80 dark:border-rose-900/40 shadow-2xs">
              <p className="text-xs text-rose-900 dark:text-rose-200 font-medium leading-relaxed">
                {selectedItem.rejectionRemarks ||
                  'Request was rejected due to non-compliance with scheme expenditure guidelines and ceiling limits for the selected phase.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FundRequestDetailsModal;
