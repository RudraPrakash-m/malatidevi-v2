// src/features/shared/verification-modals/ApproveModal.tsx

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '@/shared/components/ui/Modal/Modal';
import Button from '@/shared/components/ui/Button';
import TextArea from '@/shared/components/ui/Forms/TextArea';
import type { CheckItem, CheckRole } from '../types/shared.types';

export interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckItem | null;
  currentRole?: CheckRole;
  onConfirm: (remarks: string) => void;
}

export const ApproveModal: React.FC<ApproveModalProps> = ({
  isOpen,
  onClose,
  item,
  currentRole: _currentRole = 'BLC',
  onConfirm,
}) => {
  const [remarks, setRemarks] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!remarks.trim()) {
      toast.error('Please enter remarks.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      onConfirm(remarks.trim());
      setSubmitting(false);
      onClose();
      toast.success(`Application ${item.applicationId} has been approved successfully!`);
      setRemarks('');
    }, 250);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Approve Application - ${item.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextArea
          label="Remarks"
          required
          rows={4}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter remarks..."
        />

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
            label="Approve"
            size="md"
            icon={<Check size={15} />}
            disabled={submitting}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ApproveModal;
