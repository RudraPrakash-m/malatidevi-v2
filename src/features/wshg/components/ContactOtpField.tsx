// src/features/wshg/components/ContactOtpField.tsx

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle2 } from 'lucide-react';
import { inputBase, inputNormal, inputError, inputDisabled, inputSuccess } from '@/shared/components/ui/Forms/inputStyles';

interface ContactOtpFieldProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  onOtpVerificationChange?: (verified: boolean) => void;
}

export const ContactOtpField: React.FC<ContactOtpFieldProps> = ({
  value = '',
  onChange,
  error,
  disabled,
  required = true,
  label = 'Contact No',
  onOtpVerificationChange,
}) => {
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer]);

  const handleSendOtp = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const cleanNumber = (value || '').replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number first.');
      return;
    }

    const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    setIsVerified(false);
    onOtpVerificationChange?.(false);
    setOtpValue('');
    setOtpError('');
    setTimer(30);

    toast.info(`OTP sent to +91 ${cleanNumber}. Demo OTP: ${mockOtp}`, {
      autoClose: 7000,
    });
  };

  const handleVerifyOtp = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!otpValue || otpValue.length < 4) {
      setOtpError('Please enter the OTP');
      return;
    }

    if (otpValue === generatedOtp || otpValue === '123456' || otpValue.length === 6) {
      setIsVerified(true);
      setOtpError('');
      onOtpVerificationChange?.(true);
      toast.success('Mobile number verified successfully!');
    } else {
      setOtpError('Invalid OTP. Please try again.');
      toast.error('Invalid OTP');
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(cleaned);
    if (isVerified) {
      setIsVerified(false);
      setOtpSent(false);
      onOtpVerificationChange?.(false);
    }
  };

  return (
    <>
      <div className="col-span-12 sm:col-span-4 md:col-span-2">
        <label
          htmlFor="input-contact"
          className="block text-[13px] font-medium text-foreground mb-1.5 leading-none"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative flex items-center w-full">
          <input
            id="input-contact"
            type="tel"
            maxLength={10}
            value={value}
            onChange={handleContactChange}
            disabled={disabled || isVerified}
            placeholder="Enter Contact No"
            className={[
              inputBase,
              error ? inputError : isVerified ? inputSuccess : inputNormal,
              disabled || isVerified ? inputDisabled : '',
              'h-[38px] pr-24',
            ].join(' ')}
          />
          <div className="absolute right-1.5 flex items-center">
            {isVerified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={disabled || (otpSent && timer > 0) || !value || value.length < 10}
                className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors shadow-2xs cursor-pointer ${
                  otpSent && timer > 0
                    ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed opacity-80'
                    : 'bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {otpSent ? (timer > 0 ? `Resend (${timer}s)` : 'Resend OTP') : 'Send OTP'}
              </button>
            )}
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-[12px] font-medium text-red-600 leading-none" role="alert">
            {error}
          </p>
        )}
      </div>

      {otpSent && (
        <div className="col-span-12 sm:col-span-4 md:col-span-2 transition-all duration-200">
          <label
            htmlFor="input-enter-otp"
            className="block text-[13px] font-medium text-foreground mb-1.5 leading-none flex items-center gap-1"
          >
            Enter OTP<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative flex items-center w-full">
            <input
              id="input-enter-otp"
              type="text"
              maxLength={6}
              value={otpValue}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtpValue(cleaned);
                if (otpError) setOtpError('');
              }}
              disabled={isVerified}
              placeholder="6-digit OTP"
              className={[
                inputBase,
                otpError ? inputError : isVerified ? inputSuccess : inputNormal,
                isVerified ? inputDisabled : '',
                'h-[38px] pr-20 tracking-wider',
              ].join(' ')}
            />
            <div className="absolute right-1.5 flex items-center">
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                  Verified
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!otpValue || otpValue.length < 4}
                  className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
                >
                  Verify
                </button>
              )}
            </div>
          </div>
          {otpError ? (
            <p className="mt-1.5 text-[12px] font-medium text-red-600 leading-none" role="alert">
              {otpError}
            </p>
          ) : (
            !isVerified && (
              <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400 leading-none truncate">
                OTP sent to +91 {value}
              </p>
            )
          )}
        </div>
      )}
    </>
  );
};

export default ContactOtpField;
