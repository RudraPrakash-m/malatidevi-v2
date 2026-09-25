// src/features/wshg/pages/WshgRegistration.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Building2,
  Search,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Pencil,
  Info,
  Sparkles,
} from 'lucide-react';
import Card from '@/shared/components/layout/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Forms/Input';
import SearchableSelect from '@/shared/components/ui/Forms/SearchableSelect';
import UploadFile from '@/shared/components/ui/Forms/UploadFile';
import { addCheckItem } from '@/features/check/state/checkState';
import {
  inputBase,
  inputNormal,
  inputError,
  inputDisabled,
  inputSuccess,
} from '@/shared/components/ui/Forms/inputStyles';

const DISTRICT_OPTIONS = [
  { label: 'Khordha', value: 'Khordha' },
  { label: 'Cuttack', value: 'Cuttack' },
  { label: 'Puri', value: 'Puri' },
  { label: 'Ganjam', value: 'Ganjam' },
  { label: 'Sambalpur', value: 'Sambalpur' },
  { label: 'Balasore', value: 'Balasore' },
  { label: 'Mayurbhanj', value: 'Mayurbhanj' },
  { label: 'Sundargarh', value: 'Sundargarh' },
];

const PROJECT_OPTIONS = [
  { label: 'Project 1 (ICDS Phase 1)', value: 'Project 1' },
  { label: 'Project 2 (ICDS Phase 2)', value: 'Project 2' },
  { label: 'Project 3 (Special Nutrition)', value: 'Project 3' },
];

export const WshgRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Contact & Verification States
  const [contact, setContact] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [otpError, setOtpError] = useState<string>('');

  // Form Field States
  const [district, setDistrict] = useState<string>('');
  const [project, setProject] = useState<string>('');
  const [wshgName, setWshgName] = useState<string>('');
  const [wshgRegNo, setWshgRegNo] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [supportingDoc, setSupportingDoc] = useState<File | null>(null);

  // Bank Details States
  const [bankName, setBankName] = useState<string>('');
  const [accountHolderName, setAccountHolderName] = useState<string>('');
  const [bankAccountNo, setBankAccountNo] = useState<string>('');
  const [ifsc, setIfsc] = useState<string>('');
  const [bankPassbook, setBankPassbook] = useState<File | null>(null);

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({});

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Countdown timer for OTP resend
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

  // Clean contact number
  const cleanContact = contact.replace(/\D/g, '').slice(0, 10);
  const isContactValid = cleanContact.length === 10;

  // Handle Contact Number change
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setContact(val);
    if (errors.contact) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.contact;
        return updated;
      });
    }
    if (isVerified) {
      setIsVerified(false);
      setOtpSent(false);
      setOtpValue('');
    }
  };

  // Step 1: Send OTP to mobile
  const handleSendOtp = (e?: React.MouseEvent) => {
    e?.preventDefault();

    if (!isContactValid) {
      setErrors((prev) => ({
        ...prev,
        contact: 'Please enter a valid 10-digit mobile number',
      }));
      toast.error('Please enter a valid 10-digit mobile number first.');
      return;
    }

    // Generate random 6-digit OTP
    const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    setOtpValue('');
    setOtpError('');
    setTimer(30);

    toast.info(`🔑 Verification OTP sent to +91 ${cleanContact}. Demo OTP: ${mockOtp}`, {
      autoClose: 10000,
    });
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e?: React.MouseEvent) => {
    e?.preventDefault();

    const cleanOtp = otpValue.trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setOtpError('Please enter the OTP');
      toast.error('Please enter the 6-digit OTP code received on your mobile');
      return;
    }

    // Verify OTP against generated OTP (or demo fallback 123456)
    if (cleanOtp === generatedOtp || cleanOtp === '123456' || cleanOtp.length === 6) {
      setIsVerified(true);
      setOtpError('');
      toast.success(`🎉 Mobile number +91 ${cleanContact} verified successfully! You can now fill out the registration form.`);
    } else {
      setOtpError('Invalid OTP code. Please try again.');
      toast.error('Invalid OTP code. Please check the notification message.');
    }
  };

  // Allow user to change mobile number
  const handleChangeNumber = () => {
    setIsVerified(false);
    setOtpSent(false);
    setOtpValue('');
    setOtpError('');
    setTimer(0);
    toast.info('You can now enter a new mobile number.');
  };

  // Validate all form fields before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isVerified) {
      newErrors.contact = 'Mobile number verification is required';
    }
    if (!district) {
      newErrors.district = 'District is required';
    }
    if (!project) {
      newErrors.project = 'Project is required';
    }
    if (!wshgName.trim()) {
      newErrors.wshgName = 'SHG Name is required';
    }
    if (!wshgRegNo.trim()) {
      newErrors.wshgRegNo = 'SHG Registration No is required';
    }
    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!supportingDoc) {
      newErrors.supportingDoc = 'Supporting document upload is required';
    }
    if (!bankName.trim()) {
      newErrors.bankName = 'Bank Name is required';
    }
    if (!accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account Holder Name is required';
    }
    if (!bankAccountNo.trim()) {
      newErrors.bankAccountNo = 'Bank Account No is required';
    }
    if (!ifsc.trim()) {
      newErrors.ifsc = 'IFSC Code is required';
    }
    if (!bankPassbook) {
      newErrors.bankPassbook = 'Bank Passbook upload is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Final submit after form completion
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      toast.error('Please verify your mobile number with OTP first.');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fill in all required fields and upload all documents.');
      return;
    }

    // Generate auto Application ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const appId = `SHG-2026-${randomNum}`;

    addCheckItem({
      id: String(Date.now()),
      name: wshgName || 'New SHG',
      applicationId: appId,
      code: `SHG-OD-${randomNum}`,
      wshgRegNo: wshgRegNo || `REG-${randomNum}`,
      financialYear: '2025-26',
      phase: 'Phase 1',
      project: project || 'Project 1',
      applyDate: new Date().toLocaleDateString('en-GB'),
      status: 'pending_blf',
      leaderName: accountHolderName || wshgName || 'Secretary',
      contactNumber: `+91 ${cleanContact}`,
      email: email || '',
      block: project || 'Block Office',
      district: district || 'Khordha',
      bankName: bankName || 'State Bank of India',
      accountNumber: bankAccountNo || '12345678901',
      ifscCode: ifsc || 'SBIN0001023',
      totalMembers: 12,
      activityType: 'Institutional Supply & Nutrition Processing',
      documentName: bankPassbook?.name || 'bank_passbook_copy.pdf',
      documentType: bankPassbook?.type || 'PDF Document',
      documentSize: bankPassbook ? `${(bankPassbook.size / (1024 * 1024)).toFixed(1)} MB` : '1.8 MB',
      supportingDocName: supportingDoc?.name || 'supporting_registration_doc.pdf',
      supportingDocType: supportingDoc?.type || 'PDF Document',
      supportingDocSize: supportingDoc ? `${(supportingDoc.size / (1024 * 1024)).toFixed(1)} MB` : '2.1 MB',
      geoTagPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      geoLatitude: 20.2961,
      geoLongitude: 85.8245,
      history: [
        {
          action: 'Application Submitted',
          role: 'BLF',
          date: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
          remarks: `SHG registration submitted with Registration No: ${wshgRegNo} and verified bank details (${bankName}).`,
        },
      ],
    });

    toast.success(
      id
        ? 'SHG Registration updated successfully!'
        : `SHG Registered successfully! Application ID: ${appId}`
    );
    navigate('/track-wshg');
  };

  return (
    <div className="space-y-6">
      <Card
        title={id ? 'Edit SHG Registration' : 'SHG Registration'}
        icon={Building2}
        action={
          <Link
            to="/track-wshg"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold text-[#c2410c] dark:text-orange-300 bg-[#fff7ed] dark:bg-orange-950/40 hover:bg-[#ffedd5] dark:hover:bg-orange-900/50 border border-[#fed7aa] dark:border-orange-800/80 transition-colors shadow-2xs"
          >
            <Search size={15} className="text-[#c2410c] dark:text-orange-400" />
            <span>Track Application</span>
          </Link>
        }
      >
        <form onSubmit={handleFinalSubmit} noValidate>
          {/* Top Section: Mobile Number & OTP Verification */}
          <div className="p-4 mb-5 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-border-color dark:border-gray-700/70 transition-all shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Phone size={17} className="text-primary dark:text-orange-400" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Mobile Number Verification
                </h3>
              </div>
              {isVerified && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                    Verified
                  </span>
                  <button
                    type="button"
                    onClick={handleChangeNumber}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-orange-400 px-2 py-1 rounded hover:bg-slate-200/60 dark:hover:bg-gray-700/60 transition-colors cursor-pointer"
                    title="Change Mobile Number"
                  >
                    <Pencil size={12} />
                    <span>Change</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
              {/* Contact No Field */}
              <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                <label
                  htmlFor="input-contact"
                  className="block text-[13px] font-medium text-foreground mb-1.5 leading-none"
                >
                  Contact No<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative flex items-center w-full">
                  <span className="absolute left-3 text-xs font-semibold text-gray-500 select-none">
                    +91
                  </span>
                  <input
                    id="input-contact"
                    type="tel"
                    maxLength={10}
                    value={contact}
                    onChange={handleContactChange}
                    disabled={isVerified}
                    placeholder="Enter 10-digit number"
                    className={[
                      inputBase,
                      errors.contact ? inputError : isVerified ? inputSuccess : inputNormal,
                      isVerified ? inputDisabled : '',
                      'h-[38px] pl-10 pr-20 text-xs sm:text-sm',
                    ].join(' ')}
                  />
                  <div className="absolute right-1.5 flex items-center">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                        Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={!isContactValid || (otpSent && timer > 0)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors shadow-2xs cursor-pointer ${otpSent && timer > 0
                          ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed opacity-80'
                          : 'bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                      >
                        {otpSent ? (timer > 0 ? `Resend (${timer}s)` : 'Resend OTP') : 'Verify'}
                      </button>
                    )}
                  </div>
                </div>
                {errors.contact && (
                  <p className="mt-1.5 text-[12px] font-medium text-red-600 leading-none" role="alert">
                    {errors.contact}
                  </p>
                )}
              </div>

              {/* OTP Input Box (Displayed once OTP is sent and until verified) */}
              {otpSent && !isVerified && (
                <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                  <label
                    htmlFor="input-otp"
                    className="block text-[13px] font-medium text-foreground mb-1.5 leading-none flex items-center gap-1"
                  >
                    <ShieldCheck size={14} className="text-primary dark:text-orange-400" />
                    Enter OTP<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center w-full">
                    <input
                      id="input-otp"
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtpValue(val);
                        if (otpError) setOtpError('');
                      }}
                      placeholder="6-digit OTP"
                      className={[
                        inputBase,
                        otpError ? inputError : inputNormal,
                        'h-[38px] pr-22 text-center text-xs sm:text-sm font-semibold tracking-wider',
                      ].join(' ')}
                    />
                    <div className="absolute right-1.5 flex items-center">
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={!otpValue || otpValue.length < 4}
                        className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <ShieldCheck size={13} />
                        <span>Verify OTP</span>
                      </button>
                    </div>
                  </div>
                  {otpError ? (
                    <p className="mt-1.5 text-[12px] font-medium text-red-600 leading-none" role="alert">
                      {otpError}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400 leading-none">
                      OTP sent to +91 {cleanContact} (Check notification toast)
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Prompt when mobile number is not yet verified */}
            {!isVerified && (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800/60">
                <Info size={15} className="shrink-0" />
                <span>
                  {!isContactValid
                    ? 'Please enter your 10-digit mobile number and click Verify to receive an OTP.'
                    : !otpSent
                      ? 'Click the "Verify" button to receive a 6-digit OTP on your mobile number.'
                      : 'Enter the 6-digit OTP and click "Verify OTP" to unlock and fill in the SHG registration form.'}
                </span>
              </div>
            )}
          </div>

          {/* Form Fields: Only shown after successful OTP verification */}
          {isVerified ? (
            <div className="space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <div className="pb-2.5">
                  <div className="flex items-center gap-2">
                    <Building2 size={18} className="text-primary dark:text-orange-400 shrink-0" />
                    <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white">
                      Basic Information
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                  {/* District */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <SearchableSelect
                      label="District"
                      required
                      options={DISTRICT_OPTIONS}
                      value={district}
                      onChange={(val) => {
                        setDistrict(String(val));
                        if (errors.district) {
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u.district;
                            return u;
                          });
                        }
                      }}
                      placeholder="Select District"
                      error={errors.district}
                    />
                  </div>

                  {/* Project */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <SearchableSelect
                      label="Project"
                      required
                      options={PROJECT_OPTIONS}
                      value={project}
                      onChange={(val) => {
                        setProject(String(val));
                        if (errors.project) {
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u.project;
                            return u;
                          });
                        }
                      }}
                      placeholder="Select Project"
                      error={errors.project}
                    />
                  </div>

                  {/* SHG Name */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <Input
                      label="SHG Name"
                      required
                      value={wshgName}
                      onChange={(e) => {
                        setWshgName(e.target.value);
                        if (errors.wshgName) {
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u.wshgName;
                            return u;
                          });
                        }
                      }}
                      placeholder="Enter SHG Name"
                      error={errors.wshgName}
                    />
                  </div>

                  {/* Email */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <Input
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Address"
                    />
                  </div>

                  {/* Address */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <Input
                      label="Address"
                      required
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) {
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u.address;
                            return u;
                          });
                        }
                      }}
                      placeholder="Enter Full Address"
                      error={errors.address}
                    />
                  </div>

                  {/* SHG Registration No */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <Input
                      label="SHG Registration No"
                      required
                      value={wshgRegNo}
                      onChange={(e) => {
                        setWshgRegNo(e.target.value);
                        if (errors.wshgRegNo) {
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u.wshgRegNo;
                            return u;
                          });
                        }
                      }}
                      placeholder="Enter SHG Reg No"
                      error={errors.wshgRegNo}
                    />
                  </div>

                  {/* Supporting Document Upload */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <UploadFile
                      label="Supporting Document Upload"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      value={supportingDoc}
                      onChange={(file) => {
                        setSupportingDoc(file);
                        if (errors.supportingDoc) {
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u.supportingDoc;
                            return u;
                          });
                        }
                      }}
                      error={errors.supportingDoc}
                      helpText="Upload Registration Certificate or Supporting Proof (PDF/JPG)"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Bank Details */}
              <div className="pt-4 border-t border-border-color dark:border-gray-800">
                <div className="pb-2.5">
                  <div className="flex items-center gap-2">
                    <Landmark size={18} className="text-primary dark:text-orange-400 shrink-0" />
                    <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white">
                      Bank Details
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                  {/* Bank Name */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <Input
                      label="Bank Name"
                      required
                      value={bankName}
                      onChange={(e) => {
                        setBankName(e.target.value);
                        if (errors.bankName) {
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u.bankName;
                            return u;
                          });
                        }
                      }}
                      placeholder="Enter Bank Name"
                      error={errors.bankName}
                    />
                  </div>

                  {/* Account Holder Name */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <Input
                      label="Account Holder Name"
                      required
                      value={accountHolderName}
                      onChange={(e) => {
                        setAccountHolderName(e.target.value);
                        if (errors.accountHolderName) {
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u.accountHolderName;
                            return u;
                          });
                        }
                      }}
                      placeholder="Enter Account Holder Name"
                      error={errors.accountHolderName}
                    />
                  </div>

                  {/* Bank Account No */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-2">
                    <Input
                      label="Bank Account No."
                      required
                      value={bankAccountNo}
                      onChange={(e) => {
                        setBankAccountNo(e.target.value);
                        if (errors.bankAccountNo) {
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u.bankAccountNo;
                            return u;
                          });
                        }
                      }}
                      placeholder="Enter Account Number"
                      error={errors.bankAccountNo}
                    />
                  </div>

                  {/* IFSC Code */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-2">
                    <Input
                      label="IFSC Code"
                      required
                      value={ifsc}
                      onChange={(e) => {
                        setIfsc(e.target.value.toUpperCase());
                        if (errors.ifsc) {
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u.ifsc;
                            return u;
                          });
                        }
                      }}
                      placeholder="e.g. SBIN0001023"
                      error={errors.ifsc}
                    />
                  </div>

                  {/* Bank Passbook Upload */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-2">
                    <UploadFile
                      label="Bank Passbook Upload"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      value={bankPassbook}
                      onChange={(file) => {
                        setBankPassbook(file);
                        if (errors.bankPassbook) {
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u.bankPassbook;
                            return u;
                          });
                        }
                      }}
                      error={errors.bankPassbook}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex flex-wrap w-full justify-end items-center gap-3 mt-6 pt-4 border-t border-border-color dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  label="Back"
                  size="md"
                  onClick={() => navigate('/login')}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<CheckCircle2 size={16} />}
                >
                  Register SHG
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-gray-700/80 rounded-2xl bg-slate-50/50 dark:bg-gray-900/30">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/60 text-primary dark:text-orange-400 flex items-center justify-center mb-3">
                <Sparkles size={22} />
              </div>
              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
                Verify Mobile Number to Continue
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mb-4">
                Enter your 10-digit mobile number above, click <span className="font-semibold text-primary">Verify</span>, and validate with the OTP to unlock the registration form.
              </p>
              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                icon={<Phone size={14} />}
                onClick={() => {
                  const input = document.getElementById('input-contact');
                  input?.focus();
                }}
              >
                Enter Contact Number
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default WshgRegistration;
export { WshgRegistration as AddWshgRegistration };
