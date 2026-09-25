// src/features/blf/components/BlfVerificationModal.tsx

import React from 'react';
import { toast } from 'react-toastify';
import { ReadOnlySummaryModal } from '@/features/shared';
import type { CheckItem } from '@/features/shared';

export interface BlfVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckItem | null;
  onForwardToBlc?: (item: CheckItem) => void;
  onReject?: (item: CheckItem) => void;
  onOpenDoc?: () => void;
  onOpenPhoto?: () => void;
}

export const BlfVerificationModal: React.FC<BlfVerificationModalProps> = ({
  isOpen,
  onClose,
  item,
  onForwardToBlc,
  onReject,
  onOpenDoc,
  onOpenPhoto,
}) => {
  return (
    <ReadOnlySummaryModal
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      currentRole="BLF"
      onOpenDoc={onOpenDoc}
      onOpenPhoto={onOpenPhoto}
      onForward={(it) => {
        if (onForwardToBlc) {
          onForwardToBlc(it);
        }
        toast.success('Application forwarded to BLC successfully');
        onClose();
      }}
      onReject={onReject}
    />
  );
};

export default BlfVerificationModal;
