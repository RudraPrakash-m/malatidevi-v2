// src/features/shared/wshg-application/ActionWorkflowModal.tsx

import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  Info,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '@/shared/components/ui/Modal/Modal';
import Button from '@/shared/components/ui/Button';
import TextArea from '@/shared/components/ui/Forms/TextArea';
import Select from '@/shared/components/ui/Forms/Select';
import type { CheckItem, CheckRole } from '../types/shared.types';

export interface ActionWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckItem | null;
  currentRole: CheckRole;
  onConfirm: (
    remarks: string,
    actionType: 'Forward' | 'Approve' | 'Tag Existing',
    taggedWshgId?: string,
    taggedWshgName?: string,
    file?: File | null
  ) => void;
}

const EXISTING_SHG_OPTIONS = [
  { value: 'WSHG-EXIST-01', label: 'Maa Durga SHG (Registered 2023 - Khordha)' },
  { value: 'WSHG-EXIST-02', label: 'Shakti Mahila Mandal (Registered 2024 - Jatni)' },
  { value: 'WSHG-EXIST-03', label: 'Jagannath SHG Cluster (Registered 2022 - Balianta)' },
  { value: 'WSHG-EXIST-04', label: 'Prerana Women Self Help Group (Registered 2023 - Banapur)' },
];

export const ActionWorkflowModal: React.FC<ActionWorkflowModalProps> = ({
  isOpen,
  onClose,
  item,
  currentRole,
  onConfirm,
}) => {
  const [actionType, setActionType] = useState<'Forward' | 'Tag Existing'>('Forward');
  const [selectedExistingWshg, setSelectedExistingWshg] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!item) return null;

  const isFinalApprove = currentRole === 'BLC';

  const nextTargetRole =
    currentRole === 'DSWO'
      ? 'BLF (Block Level Federation)'
      : currentRole === 'BLF'
        ? 'Block Level Committee (BLC)'
        : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (actionType === 'Tag Existing' && !selectedExistingWshg) {
      toast.error('Please select an existing registered SHG to tag.');
      return;
    }

    if (!remarks.trim()) {
      toast.error('Please enter mandatory remarks.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const selectedShgObj = EXISTING_SHG_OPTIONS.find(
        (opt) => opt.value === selectedExistingWshg
      );
      const effectiveAction = isFinalApprove ? 'Approve' : actionType;

      onConfirm(
        remarks.trim(),
        effectiveAction,
        selectedExistingWshg || undefined,
        selectedShgObj?.label || undefined,
        file
      );

      setSubmitting(false);
      onClose();
      toast.success(
        isFinalApprove
          ? `Application ${item.applicationId} approved successfully!`
          : `Application ${item.applicationId} forwarded successfully!`
      );
      setRemarks('');
      setFile(null);
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isFinalApprove
          ? `Final Approval — ${item.name}`
          : `Application Action Workflow — ${item.name}`
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info Box */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300">
          <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {isFinalApprove
                ? 'Final Committee Approval'
                : `Role: ${currentRole} Verification & Recommendation`}
            </span>
            <p className="mt-0.5 text-[11px] text-blue-700 dark:text-blue-400">
              {isFinalApprove
                ? 'Approving will grant final clearance and generate login credentials.'
                : `Submitting will forward this verified record to ${nextTargetRole}.`}
            </p>
          </div>
        </div>

        {/* Action Type Selection (for BLF & DSWO) */}
        {!isFinalApprove && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Processing Action <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setActionType('Forward')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  actionType === 'Forward'
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-950 dark:text-orange-200 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">
                  {currentRole === 'DSWO' ? 'Forward to BLF' : 'Forward to BLC'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Proceed along standard approval ladder
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActionType('Tag Existing')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  actionType === 'Tag Existing'
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-950 dark:text-orange-200 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">Tag Existing SHG</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Link with existing registered group
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Existing WSHG Dropdown if Tag Existing */}
        {actionType === 'Tag Existing' && !isFinalApprove && (
          <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl space-y-2">
            <Select
              label="Select Existing Registered SHG to Tag"
              required
              options={EXISTING_SHG_OPTIONS}
              value={selectedExistingWshg}
              onChange={(e) => setSelectedExistingWshg(e.target.value)}
            />
          </div>
        )}

        {/* Mandatory Remarks */}
        <TextArea
          label={
            isFinalApprove
              ? 'BLC Final Committee Remarks'
              : `${currentRole} Verification Remarks`
          }
          required
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter detailed verification / scrutiny remarks..."
        />

        {/* Upload Attachment */}
        <div>
          <label className="block text-[13px] font-medium text-foreground mb-1.5 leading-none">
            Attach Inspection Report / Memo <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center">
            <input
              type="file"
              id="workflowFile"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText size={15} className="text-orange-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label htmlFor="workflowFile" className="cursor-pointer flex items-center justify-center gap-2 text-xs text-slate-500">
                <UploadCloud size={16} />
                <span>Upload supporting PDF or document</span>
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="secondary"
            label="Cancel"
            size="md"
            onClick={onClose}
          />
          <Button
            type="submit"
            variant="primary"
            label={isFinalApprove ? 'Confirm Approval' : 'Submit & Forward'}
            size="md"
            disabled={submitting}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ActionWorkflowModal;
