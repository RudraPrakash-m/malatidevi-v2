// src/features/shared/wshg-application/ReadOnlySummaryModal.tsx

import React, { useState } from 'react';
import {
  FileText,
  MapPin,
  Building2,
  ShieldCheck,
  Calendar,
  CreditCard,
  Phone,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Hash,
  Layers,
  Forward,
  Check,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Modal from '@/shared/components/ui/Modal/Modal';
import Button from '@/shared/components/ui/Button';
import type { CheckItem, CheckRole } from '../types/shared.types';
import { RejectModal } from '../verification-modals/RejectModal';
import { RevertModal } from '../verification-modals/RevertModal';

export interface ReadOnlySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckItem | null;
  currentRole?: CheckRole;
  onOpenDoc?: () => void;
  onOpenPhoto?: () => void;
  onOpenCredentials?: () => void;
  onForward?: (item: CheckItem) => void;
  onRevert?: (item: CheckItem) => void;
  onReject?: (item: CheckItem) => void;
}

/* -------------------------------------------------------------
   Reusable Label & Value Detail Item
------------------------------------------------------------- */
interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  mono?: boolean;
  className?: string;
  badge?: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  icon: Icon,
  mono = false,
  className = '',
  badge,
}) => (
  <div
    className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 transition-all ${className}`}
  >
    <div className="flex items-center justify-between gap-1 mb-1">
      <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
        {Icon && <Icon size={13} className="text-blue-500 shrink-0" />}
        <span>{label}</span>
      </span>
      {badge && <div>{badge}</div>}
    </div>
    <div
      className={`text-sm font-semibold text-slate-900 dark:text-white break-words ${
        mono ? 'font-mono' : ''
      }`}
    >
      {value !== undefined && value !== null && value !== '' ? value : '—'}
    </div>
  </div>
);

/* -------------------------------------------------------------
   Section Header with Icon & Optional Action/Badge
------------------------------------------------------------- */
const SectionHeader: React.FC<{
  title: string;
  icon: LucideIcon;
  colorClass?: string;
  action?: React.ReactNode;
}> = ({ title, icon: Icon, colorClass = 'text-blue-600 dark:text-blue-400', action }) => (
  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
      <Icon size={15} className={colorClass} />
      <span>{title}</span>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const ReadOnlySummaryModal: React.FC<ReadOnlySummaryModalProps> = ({
  isOpen,
  onClose,
  item,
  currentRole,
  onOpenDoc,
  onOpenPhoto: _onOpenPhoto,
  onOpenCredentials: _onOpenCredentials,
  onForward,
  onRevert,
  onReject,
}) => {
  const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false);
  const [isRevertOpen, setIsRevertOpen] = useState<boolean>(false);

  if (!item) return null;

  const renderStatusBadge = () => {
    switch (item.status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
            <XCircle size={12} /> Rejected
          </span>
        );
      case 'reverted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
            <RotateCcw size={12} /> Reverted
          </span>
        );
      case 'pending_blf':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            Pending at BLF
          </span>
        );
      case 'pending_blc':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            Pending at BLC
          </span>
        );
      case 'pending_dswo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            Pending at DSWO
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {item.status}
          </span>
        );
    }
  };

  const isPending =
    item.status === 'pending_dswo' ||
    item.status === 'pending_blf' ||
    item.status === 'pending_blc';

  const isActionDisabled = currentRole !== 'BLC' && item.status === 'pending_blc';

  const modalFooter = (
    <div className="flex justify-end items-center gap-2.5 w-full">
      <Button
        type="button"
        variant="secondary"
        label="Close"
        size="md"
        icon={<X size={15} />}
        onClick={onClose}
      />

      {/* Revert Action Button - shown only for State / oversight */}
      {isPending && currentRole !== 'BLF' && currentRole !== 'BLC' && currentRole !== 'DSWO' && (
        <Button
          type="button"
          variant="warning"
          label="Revert"
          size="md"
          icon={<RotateCcw size={15} />}
          onClick={() => {
            if (onRevert) {
              onRevert(item);
            } else {
              setIsRevertOpen(true);
            }
          }}
        />
      )}

      {/* Reject Action Button */}
      {isPending && (
        <Button
          type="button"
          variant="danger"
          label="Reject"
          size="md"
          icon={<XCircle size={15} />}
          disabled={isActionDisabled}
          onClick={() => {
            if (onReject) {
              onReject(item);
            } else {
              setIsRejectOpen(true);
            }
          }}
        />
      )}

      {/* Forward / Final Approve Action Button */}
      {onForward && isPending && (
        <Button
          type="button"
          variant={currentRole === 'BLC' ? 'primary' : 'warning'}
          label={
            currentRole === 'BLC'
              ? 'Final Approve'
              : currentRole === 'BLF'
                ? 'Forward to BLC'
                : 'Forward to BLF'
          }
          size="md"
          icon={currentRole === 'BLC' ? <Check size={16} /> : <Forward size={16} />}
          disabled={isActionDisabled}
          onClick={() => onForward(item)}
        />
      )}
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`SHG Details ${item.name}`}
        subtitle="Complete application, leadership, bank account, verification remarks and document details"
        size="2xl"
        footer={modalFooter}
      >
        <div className="space-y-6">
          {/* Application Details */}
          <div className="space-y-3">
            <SectionHeader
              title="Application Details"
              icon={Layers}
              colorClass="text-blue-600 dark:text-blue-400"
              action={currentRole !== 'BLC' ? renderStatusBadge() : undefined}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <DetailItem
                label="Application ID"
                value={item.applicationId}
                icon={Hash}
                mono
              />
              <DetailItem
                label="SHG Registration No"
                value={item.code}
                icon={Hash}
                mono
              />
              <DetailItem
                label="Apply Date"
                value={item.applyDate}
                icon={Calendar}
              />
              <DetailItem
                label="Financial Year"
                value={item.financialYear}
                icon={Calendar}
                mono
              />

              {/* Submitted Document Card */}
              <div className="sm:col-span-2 md:col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                    <FileText size={13} className="text-blue-500" />
                    <span>Submitted Document</span>
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate font-mono">
                    {item.documentName}
                  </p>
                  {item.documentSize && (
                    <span className="text-[11px] text-slate-400">
                      {item.documentType || 'Document'} • {item.documentSize}
                    </span>
                  )}
                </div>
                {onOpenDoc && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    label="View"
                    icon={<FileText size={13} />}
                    onClick={onOpenDoc}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Location & Administrative Details */}
          <div className="space-y-3">
            <SectionHeader
              title="Location & Administration"
              icon={MapPin}
              colorClass="text-indigo-600 dark:text-indigo-400"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <DetailItem
                label="District"
                value={item.district}
                icon={MapPin}
              />
              <DetailItem
                label="Project"
                value={item.project}
                icon={Building2}
              />
              {item.geoAddress && (
                <div className="sm:col-span-3">
                  <DetailItem
                    label="Registered Geo Address"
                    value={item.geoAddress}
                    icon={MapPin}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bank & Financial Account Details */}
          <div className="space-y-3">
            <SectionHeader
              title="Bank Account Details"
              icon={CreditCard}
              colorClass="text-emerald-600 dark:text-emerald-400"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <DetailItem
                label="Bank Name"
                value={item.bankName}
                icon={CreditCard}
              />
              <DetailItem
                label="Branch Name"
                value={`${item.block} Branch`}
                icon={Building2}
              />
              <DetailItem
                label="Account Number"
                value={item.accountNumber}
                icon={CreditCard}
                mono
              />
              <DetailItem
                label="IFSC Code"
                value={item.ifscCode}
                icon={Hash}
                mono
              />
            </div>
          </div>

          {/* Verification Remarks & Workflow Feedback */}
          <div className="space-y-3">
            <SectionHeader
              title="Verification Remarks"
              icon={AlertCircle}
              colorClass="text-amber-600 dark:text-amber-400"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <DetailItem
                label="L1 Remarks (BLF)"
                value={item.l1Remarks || 'None'}
                icon={AlertCircle}
                className={item.l1Remarks ? 'border-amber-200 bg-amber-50/40 dark:bg-slate-800' : ''}
              />
              <DetailItem
                label="L2 Remarks (BLC)"
                value={item.l2Remarks || 'None'}
                icon={AlertCircle}
                className={item.l2Remarks ? 'border-blue-200 bg-blue-50/40 dark:bg-slate-800' : ''}
              />
              <DetailItem
                label="L3 Remarks (DSWO)"
                value={item.l3Remarks || 'None'}
                icon={AlertCircle}
                className={item.l3Remarks ? 'border-purple-200 bg-purple-50/40 dark:bg-slate-800' : ''}
              />

              {/* Rejection Remarks if rejected */}
              {(item.status === 'rejected' || item.rejectionReason) && (
                <div className="sm:col-span-3">
                  <DetailItem
                    label={`Rejection Remarks (${item.rejectedBy ? `Rejected by ${item.rejectedBy}` : 'Rejected'})`}
                    value={item.rejectionReason || item.l1Remarks || item.l2Remarks || 'Ineligible under scheme guidelines.'}
                    icon={XCircle}
                    className="border-rose-300 bg-rose-50/60 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
                  />
                </div>
              )}

              {/* Revert Remarks if reverted */}
              {(item.status === 'reverted' || item.revertReason) && (
                <div className="sm:col-span-3">
                  <DetailItem
                    label={`Revert Reason (${item.revertedAtLevel ? `Reverted to ${item.revertedAtLevel}` : 'Reverted'})`}
                    value={item.revertReason || 'Clarification required regarding beneficiary count and documents.'}
                    icon={RotateCcw}
                    className="border-orange-300 bg-orange-50/60 text-orange-900 dark:bg-orange-950/40 dark:text-orange-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Credentials (if approved) */}
          {item.credentials && (
            <div className="space-y-3">
              <SectionHeader
                title="Portal Credentials"
                icon={ShieldCheck}
                colorClass="text-emerald-600 dark:text-emerald-400"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <DetailItem
                  label="Portal User ID"
                  value={item.credentials.userId}
                  icon={Hash}
                  mono
                />
                <DetailItem
                  label="Temporary Password"
                  value={item.credentials.temporaryPassword}
                  icon={ShieldCheck}
                  mono
                />
                <DetailItem
                  label="SMS Delivery Status"
                  value={
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 size={13} /> {item.credentials.smsDeliveryStatus}
                    </span>
                  }
                  icon={Phone}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Revert Modal */}
      <RevertModal
        isOpen={isRevertOpen}
        onClose={() => setIsRevertOpen(false)}
        item={item}
        currentRole={currentRole || 'BLF'}
        onConfirm={() => {
          setIsRevertOpen(false);
          onClose();
        }}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        item={item}
        currentRole={currentRole || 'BLF'}
        onConfirm={() => {
          setIsRejectOpen(false);
          onClose();
        }}
      />
    </>
  );
};

export default ReadOnlySummaryModal;
