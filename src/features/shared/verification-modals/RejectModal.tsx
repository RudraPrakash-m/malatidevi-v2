// src/features/shared/verification-modals/RejectModal.tsx

import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '@/shared/components/ui/Modal/Modal';
import Button from '@/shared/components/ui/Button';
import TextArea from '@/shared/components/ui/Forms/TextArea';
import type { CheckItem, CheckRole } from '../types/shared.types';

export interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckItem | null;
  currentRole?: CheckRole;
  onConfirm: (remarks: string) => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  item,
  currentRole = 'BLF',
  onConfirm,
}) => {
  const [reason, setReason] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error('Please enter a reason for rejection.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      onConfirm(reason.trim());
      setSubmitting(false);
      onClose();
      toast.error(`Application ${item.applicationId} has been rejected by ${currentRole}.`);
      setReason('');
    }, 250);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reject Application - ${item.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextArea
          label="Reason for Rejection"
          required
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for rejection..."
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
            variant="danger"
            label="Reject"
            size="md"
            icon={<XCircle size={15} />}
            disabled={submitting}
          />
        </div>
      </form>
    </Modal>
  );
};

export default RejectModal;
