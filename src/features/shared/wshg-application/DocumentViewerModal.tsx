// src/features/shared/wshg-application/DocumentViewerModal.tsx

import React from 'react';
import { FileText, Download, CheckCircle, ExternalLink } from 'lucide-react';
import Modal from '@/shared/components/ui/Modal/Modal';
import Button from '@/shared/components/ui/Button';
import type { CheckItem } from '../types/shared.types';

export interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckItem | null;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Document View - ${item.name}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Document Header Info */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <FileText size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {item.documentName}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{item.documentType || 'PDF Document'}</span>
                <span>•</span>
                <span>{item.documentSize || '2.1 MB'}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle size={12} /> Verified Upload
                </span>
              </div>
            </div>
          </div>

          <a
            href={`#download-${item.documentName}`}
            onClick={(e) => {
              e.preventDefault();
              alert(`Downloading ${item.documentName}...`);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg border border-slate-300 dark:border-slate-600 shadow-xs transition-colors"
          >
            <Download size={14} />
            <span>Download</span>
          </a>
        </div>

        {/* Mock Document Preview Box */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[260px] text-center">
          <div className="size-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <FileText size={32} />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Government of Odisha — Department of Women & Child Development
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-4">
            Official SHG Byelaws, Bank Passbook, and General Body Resolution Copy for{' '}
            <strong className="text-slate-700 dark:text-slate-300">{item.name}</strong> (App ID:{' '}
            {item.applicationId}).
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 shadow-2xs">
            <ExternalLink size={13} />
            <span>Digital Signature Verified: SHA-256 Valid</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="secondary"
            label="Close"
            size="sm"
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DocumentViewerModal;
