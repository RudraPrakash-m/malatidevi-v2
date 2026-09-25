// src/features/shared/wshg-application/CredentialsModal.tsx

import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff, Send, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '@/shared/components/ui/Modal/Modal';
import Button from '@/shared/components/ui/Button';
import type { CheckItem } from '../types/shared.types';

export interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckItem | null;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [resending, setResending] = useState<boolean>(false);

  if (!item || !item.credentials) return null;

  const credentials = item.credentials;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleResendSMS = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      toast.success(`Credentials SMS re-dispatched to ${credentials.mobileNumber} successfully!`);
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SHG Portal Login Credentials"
      size="md"
    >
      <div className="space-y-4">
        {/* Success Banner */}
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-3">
          <div className="size-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              Final Approval Granted — Credentials Active
            </h4>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
              Login credentials have been automatically provisioned. An SMS dispatch was initiated to the registered SHG mobile contact.
            </p>
          </div>
        </div>

        {/* Group & Application Details */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">SHG Name</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Application ID</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{item.applicationId}</span>
            </div>
          </div>
        </div>

        {/* Credentials Box */}
        <div className="space-y-3 p-4 bg-gradient-to-br from-amber-50/50 to-orange-50/40 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-amber-200/80 dark:border-slate-700 shadow-xs">
          {/* User ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Portal User ID
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 font-mono font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>{credentials.userId}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(credentials.userId, 'User ID')}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-orange-500 transition-colors cursor-pointer"
                title="Copy User ID"
              >
                {copiedField === 'User ID' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Temporary Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              System Generated Password
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 font-mono font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>{showPassword ? credentials.temporaryPassword : '••••••••••••••••'}</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer ml-2"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(credentials.temporaryPassword, 'Password')}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-orange-500 transition-colors cursor-pointer"
                title="Copy Password"
              >
                {copiedField === 'Password' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* SMS Notification Details */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Smartphone size={16} />
            </div>
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>Sent to: {credentials.mobileNumber}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  <CheckCircle2 size={10} /> {credentials.smsDeliveryStatus}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Dispatched at: {credentials.smsSentAt || item.applyDate}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={resending}
            onClick={handleResendSMS}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800 transition-colors cursor-pointer"
          >
            <Send size={12} className={resending ? 'animate-spin' : ''} />
            <span>{resending ? 'Sending...' : 'Resend SMS'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              const fullText = `SHG Portal Credentials\nGroup: ${item.name}\nUser ID: ${credentials.userId}\nPassword: ${credentials.temporaryPassword}\nLogin Portal: https://wcd.odisha.gov.in`;
              copyToClipboard(fullText, 'Complete Credentials');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <Copy size={14} />
            <span>Copy All Details</span>
          </button>

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

export default CredentialsModal;
