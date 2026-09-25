// src/features/blc/components/BlcInspectionModal.tsx

import React from 'react';
import { ApproveModal } from '@/features/shared';
import type { CheckItem } from '@/features/shared';

export interface BlcInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckItem | null;
  onConfirm: (remarks: string) => void;
}

export const BlcInspectionModal: React.FC<BlcInspectionModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirm,
}) => {
  return (
    <ApproveModal
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      currentRole="BLC"
      onConfirm={onConfirm}
    />
  );
};

export default BlcInspectionModal;
