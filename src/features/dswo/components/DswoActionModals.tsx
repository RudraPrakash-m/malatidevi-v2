// src/features/dswo/components/DswoActionModals.tsx

import React from 'react';
import {
  ReadOnlySummaryModal,
  DocumentViewerModal,
  GeoTagPhotoModal,
  ActionWorkflowModal,
  RevertModal,
  RejectModal,
  CredentialsModal,
  type CheckItem,
} from '@/features/shared';

export interface DswoActionModalsProps {
  summaryItem: CheckItem | null;
  docItem: CheckItem | null;
  photoItem: CheckItem | null;
  workflowItem: CheckItem | null;
  revertItem: CheckItem | null;
  rejectItem: CheckItem | null;
  credentialsItem: CheckItem | null;
  onCloseSummary: () => void;
  onCloseDoc: () => void;
  onClosePhoto: () => void;
  onCloseWorkflow: () => void;
  onCloseRevert: () => void;
  onCloseReject: () => void;
  onCloseCredentials: () => void;
  onOpenDoc: (item: CheckItem) => void;
  onOpenPhoto: (item: CheckItem) => void;
  onOpenCredentials: (item: CheckItem) => void;
  onForwardFromSummary: (item: CheckItem) => void;
  onRevertFromSummary: (item: CheckItem) => void;
  onRejectFromSummary: (item: CheckItem) => void;
  onConfirmWorkflow: (
    remarks: string,
    actionType: 'Forward' | 'Approve' | 'Tag Existing',
    taggedId?: string,
    taggedName?: string,
    file?: File | null
  ) => void;
  onConfirmRevert: (remarks: string, targetLevel: 'BLC' | 'BLF') => void;
  onConfirmReject: (remarks: string) => void;
}

export const DswoActionModals: React.FC<DswoActionModalsProps> = ({
  summaryItem,
  docItem,
  photoItem,
  workflowItem,
  revertItem,
  rejectItem,
  credentialsItem,
  onCloseSummary,
  onCloseDoc,
  onClosePhoto,
  onCloseWorkflow,
  onCloseRevert,
  onCloseReject,
  onCloseCredentials,
  onOpenDoc,
  onOpenPhoto,
  onOpenCredentials,
  onForwardFromSummary,
  onRevertFromSummary,
  onRejectFromSummary,
  onConfirmWorkflow,
  onConfirmRevert,
  onConfirmReject,
}) => {
  return (
    <>
      <ReadOnlySummaryModal
        isOpen={Boolean(summaryItem)}
        onClose={onCloseSummary}
        item={summaryItem}
        currentRole="DSWO"
        onOpenDoc={() => summaryItem && onOpenDoc(summaryItem)}
        onOpenPhoto={() => summaryItem && onOpenPhoto(summaryItem)}
        onOpenCredentials={() => summaryItem && onOpenCredentials(summaryItem)}
        onForward={onForwardFromSummary}
        onRevert={onRevertFromSummary}
        onReject={onRejectFromSummary}
      />

      <DocumentViewerModal
        isOpen={Boolean(docItem)}
        onClose={onCloseDoc}
        item={docItem}
      />

      <GeoTagPhotoModal
        isOpen={Boolean(photoItem)}
        onClose={onClosePhoto}
        item={photoItem}
      />

      <ActionWorkflowModal
        isOpen={Boolean(workflowItem)}
        onClose={onCloseWorkflow}
        item={workflowItem}
        currentRole="DSWO"
        onConfirm={onConfirmWorkflow}
      />

      <RevertModal
        isOpen={Boolean(revertItem)}
        onClose={onCloseRevert}
        item={revertItem}
        currentRole="DSWO"
        onConfirm={onConfirmRevert}
      />

      <RejectModal
        isOpen={Boolean(rejectItem)}
        onClose={onCloseReject}
        item={rejectItem}
        currentRole="DSWO"
        onConfirm={onConfirmReject}
      />

      <CredentialsModal
        isOpen={Boolean(credentialsItem)}
        onClose={onCloseCredentials}
        item={credentialsItem}
      />
    </>
  );
};

export default DswoActionModals;
