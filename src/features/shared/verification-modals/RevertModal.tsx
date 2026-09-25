// src/features/shared/verification-modals/RevertModal.tsx

import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, FileText, UploadCloud, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '@/shared/components/ui/Modal/Modal';
import Button from '@/shared/components/ui/Button';
import TextArea from '@/shared/components/ui/Forms/TextArea';
import Select from '@/shared/components/ui/Forms/Select';
import type { CheckItem, CheckRole } from '../types/shared.types';

export interface RevertModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckItem | null;
  currentRole: CheckRole;
  onConfirm: (remarks: string, targetLevel: CheckRole) => void;
}

const REVERT_TARGET_OPTIONS = [
  { value: 'BLC', label: 'BLC (Block Level Committee)' },
  { value: 'BLF', label: 'BLF (Block Level Facilitator / Initial Applicant)' },
];

export const RevertModal: React.FC<RevertModalProps> = ({
  isOpen,
  onClose,
  item,
  currentRole,
  onConfirm,
}) => {
  const [remarks, setRemarks] = useState<string>('');
  const [targetLevel, setTargetLevel] = useState<CheckRole>(
    currentRole === 'DSWO' ? 'BLC' : 'BLF'
  );
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!remarks.trim()) {
      toast.error('Please state the specific reason or deficiencies for reverting.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      onConfirm(remarks.trim(), targetLevel);
      setSubmitting(false);
      onClose();
      toast.warn(`Application ${item.applicationId} reverted back to ${targetLevel} with remarks.`);
      setRemarks('');
      setFile(null);
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Revert Application - ${item.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Warning Banner */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Reverting Application for Correction</span>
            <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400">
              The application will be sent back to the selected level or applicant for deficiency clarification and re-upload.
            </p>
          </div>
        </div>

        {/* Revert Target Selection */}
        {currentRole === 'DSWO' && (
          <Select
            label="Revert Back To"
            required
            options={REVERT_TARGET_OPTIONS}
            value={targetLevel}
            onChange={(e) => setTargetLevel(e.target.value as CheckRole)}
          />
        )}

        {/* TextArea component */}
        <TextArea
          label="Revert Reason / Deficiency Remarks"
          required
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Specify reason for revert (e.g. Bank passbook stamp unclear, Member signature mismatch)..."
        />

        {/* Optional File Attachment */}
        <div>
          <label className="block text-[13px] font-medium text-foreground mb-1.5 leading-none">
            Attach Defect Memo / Notes <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center">
            <input
              type="file"
              id="revertFile"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText size={15} className="text-amber-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label htmlFor="revertFile" className="cursor-pointer flex items-center justify-center gap-2 text-xs text-slate-500">
                <UploadCloud size={16} />
                <span>Upload supporting defect note (Optional)</span>
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
            variant="warning"
            label="Confirm Revert"
            size="md"
            icon={<RotateCcw size={14} />}
            disabled={submitting}
          />
        </div>
      </form>
    </Modal>
  );
};

export default RevertModal;
