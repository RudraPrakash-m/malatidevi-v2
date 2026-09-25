import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Printer,
  FileText,
  Building2,
  Calendar,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import type { RootState } from '@/app/store';
import { useCheckItems } from '../state/checkState';
import type { CheckItem, CheckStatus } from '../types/check.types';
import Card from '@/shared/components/layout/Card';
import Button from '@/shared/components/ui/Button';

export const WshgTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const { items } = useCheckItems();
  const { user } = useSelector((state: RootState) => state.auth);

  const rawRole = String(
    user?.primaryRoleCode || user?.role || user?.loginUserName || ''
  ).toUpperCase();
  const isShg = rawRole.includes('SHG') || rawRole.includes('WSHG');

  const handleBack = () => {
    if (isShg) {
      navigate('/add-wshg');
    } else {
      navigate('/dashboard');
    }
  };

  const [searchInput, setSearchInput] = useState<string>('');
  const [activeAppId, setActiveAppId] = useState<string>('');

  // Find the selected application
  const selectedItem = useMemo<CheckItem | undefined>(() => {
    if (!activeAppId) return items[0];
    const cleanSearch = activeAppId.trim().toLowerCase();
    const digitsOnly = cleanSearch.replace(/\D/g, '');
    return items.find(
      (item) =>
        item.applicationId.toLowerCase() === cleanSearch ||
        item.name.toLowerCase().includes(cleanSearch) ||
        item.code?.toLowerCase() === cleanSearch ||
        (item.contactNumber && item.contactNumber.toLowerCase() === cleanSearch) ||
        (digitsOnly.length >= 10 && item.contactNumber && item.contactNumber.replace(/\D/g, '').includes(digitsOnly))
    );
  }, [items, activeAppId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveAppId(searchInput.trim());
    }
  };

  // Helper to calculate days elapsed
  const getDaysElapsed = (applyDateStr?: string) => {
    if (!applyDateStr) return '14 days';
    try {
      // Expecting DD/MM/YYYY
      const parts = applyDateStr.split('/');
      if (parts.length === 3) {
        const applyDate = new Date(
          parseInt(parts[2], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[0], 10)
        );
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - applyDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days elapsed`;
      }
    } catch {
      // fallback
    }
    return '18 days elapsed';
  };

  // Helper for color-coded status badge
  // Pending - Yellow / Approved - Green / Rejected - Red / Reverted - Orange
  const renderStatusBadge = (status?: CheckStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300 border border-green-300">
            <CheckCircle2 size={14} /> Approved
          </span>
        );
      case 'reverted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-300">
            <RotateCcw size={14} /> Reverted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border border-red-300">
            <XCircle size={14} /> Rejected
          </span>
        );
      case 'pending_blc':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300">
            <Clock size={14} /> Pending at BLC
          </span>
        );
      case 'pending_blf':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300">
            <Clock size={14} /> Pending at BLF
          </span>
        );
      case 'pending_dswo':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300">
            <Clock size={14} /> Pending
          </span>
        );
    }
  };

  // Determine stage progress (1 to 4)
  // Step 1: Application Submitted
  // Step 2: DSWO L1 Verification
  // Step 3: BLF L2 Verification
  // Step 4: Block Level Committee Final Decision
  const getTimelineSteps = (item: CheckItem) => {
    const isApproved = item.status === 'approved';
    const isReverted = item.status === 'reverted';
    const isRejected = item.status === 'rejected';

    const step1State: 'completed' | 'current' = 'completed';
    let step2State: 'completed' | 'current' | 'pending' | 'reverted' | 'rejected' = 'pending';
    let step3State: 'completed' | 'current' | 'pending' | 'reverted' | 'rejected' = 'pending';
    let step4State: 'completed' | 'current' | 'pending' | 'reverted' | 'rejected' = 'pending';

    let step2Date = '—';
    let step3Date = '—';
    let step4Date = '—';

    const step2Remarks = item.l1Remarks || '';
    const step3Remarks = item.l2Remarks || '';
    const step4Remarks = item.l3Remarks || '';

    // History search
    item.history?.forEach((h) => {
      if (h.role === 'DSWO' && h.date) step2Date = h.date;
      if (h.role === 'BLF' && h.date) step3Date = h.date;
      if (h.role === 'BLC' && h.date) step4Date = h.date;
    });

    if (item.status === 'pending_dswo') {
      step2State = 'current';
      step3State = 'pending';
      step4State = 'pending';
    } else if (item.status === 'pending_blf') {
      step2State = 'completed';
      step2Date = step2Date === '—' ? '21/08/2026' : step2Date;
      step3State = 'current';
      step4State = 'pending';
    } else if (item.status === 'pending_blc') {
      step2State = 'completed';
      step2Date = step2Date === '—' ? '21/08/2026' : step2Date;
      step3State = 'completed';
      step3Date = step3Date === '—' ? '23/08/2026' : step3Date;
      step4State = 'current';
    } else if (isApproved) {
      step2State = 'completed';
      step2Date = step2Date === '—' ? '12/08/2026' : step2Date;
      step3State = 'completed';
      step3Date = step3Date === '—' ? '18/08/2026' : step3Date;
      step4State = 'completed';
      step4Date = item.credentials?.smsSentAt || '25/08/2026';
    } else if (isReverted) {
      const level = item.revertedAtLevel;
      if (level === 'DSWO') step2State = 'reverted';
      else if (level === 'BLF') step3State = 'reverted';
      else step4State = 'reverted';
    } else if (isRejected) {
      step4State = 'rejected';
    }

    return [
      {
        number: '1',
        title: 'Application Submitted',
        subtext: 'Online Form Submission & Registration',
        status: step1State,
        date: item.applyDate,
        badgeText: 'Submitted',
        details: 'Self Help Group submitted registration credentials, bank details & live photo.',
      },
      {
        number: '2',
        title: 'DSWO L1 Verification',
        subtext: 'District Social Welfare Officer Scrutiny',
        status: step2State,
        date: step2Date,
        badgeText: step2State === 'completed' ? 'Verified' : step2State === 'current' ? 'In Progress' : 'Pending',
        remarks: step2Remarks,
        details: 'Level 1 document checks, compliance check, bank account verification.',
      },
      {
        number: '3',
        title: 'BLF L2 Verification',
        subtext: 'Block Level Federation Shortlisting',
        status: step3State,
        date: step3Date,
        badgeText: step3State === 'completed' ? 'Shortlisted' : step3State === 'current' ? 'In Progress' : 'Pending',
        remarks: step3Remarks,
        details: 'Level 2 field capacity check, physical registers scrutiny, eligibility recommendation.',
      },
      {
        number: '4',
        title: 'Block Level Committee Final Decision',
        subtext: 'Final Empanelment & Credentials Dispatch',
        status: step4State,
        date: step4Date,
        badgeText: step4State === 'completed' ? 'Approved & Empanelled' : step4State === 'current' ? 'Under Review' : 'Pending',
        remarks: step4Remarks,
        details: isApproved
          ? 'Final selection completed. Official user credentials dispatched via SMS to registered mobile.'
          : 'Final block-level committee decision on empanelment or block tagging.',
      },
    ];
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Navigation Bar / Public Header Link */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          label={isShg ? "Back to Registration" : "Back"}
          icon={<ArrowLeft size={14} />}
          onClick={handleBack}
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            label="Print Tracking Status"
            icon={<Printer size={14} />}
          />
        </div>
      </div>

      {/* Screen Title & Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 text-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-2">
              <Building2 size={13} /> SHG Application Tracking (SHG User View)
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Women Self Help Group Application Status
            </h1>
            <p className="text-xs text-orange-100 mt-1 max-w-2xl">
              Track your registration application across the multi-level scrutiny workflow in real time:
              DSWO Level 1 Verification → BLF Level 2 Verification → Block Level Committee Final Decision.
            </p>
          </div>

          {/* Quick Search Box */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white p-1.5 rounded-xl shadow-inner max-w-md w-full md:w-auto"
          >
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Application ID / Mobile Number"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Track
            </button>
          </form>
        </div>
      </div>

      {selectedItem ? (
        <div className="space-y-6">
          {/* Main Status & Application Summary Card */}
          <Card title="Application Summary" icon={FileText}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-sm font-mono font-bold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {selectedItem.applicationId}
                  </span>
                  {renderStatusBadge(selectedItem.status)}
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {getDaysElapsed(selectedItem.applyDate)}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedItem.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Registration Code: <span className="font-mono font-semibold">{selectedItem.code}</span> •
                  District: <strong className="text-slate-700 dark:text-slate-300">{selectedItem.district}</strong> •
                  Block: <strong className="text-slate-700 dark:text-slate-300">{selectedItem.block}</strong>
                </p>
              </div>

              {/* Status Notice if Approved */}
              {selectedItem.credentials && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs space-y-1 text-emerald-900 dark:text-emerald-200">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>Credentials Generated & Sent</span>
                  </div>
                  <p className="text-[11px]">
                    User ID: <strong className="font-mono">{selectedItem.credentials.userId}</strong>
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    SMS dispatched to: {selectedItem.contactNumber} ({selectedItem.credentials.smsDeliveryStatus})
                  </p>
                </div>
              )}
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Apply Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                  <Calendar size={13} className="text-orange-500" /> {selectedItem.applyDate}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Financial Year & Phase</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedItem.financialYear} • {selectedItem.phase}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Bank & Account</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5 truncate">
                  <CreditCard size={13} className="text-blue-500" /> {selectedItem.bankName}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Leader / Contact</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                  {selectedItem.leaderName} ({selectedItem.contactNumber})
                </span>
              </div>
            </div>
          </Card>

          {/* Revert or Reject Special Alert Banner (Shown only if Reverted/Rejected) */}
          {(selectedItem.status === 'reverted' ||
            selectedItem.status === 'rejected' ||
            selectedItem.revertReason ||
            selectedItem.rejectionReason) && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${selectedItem.status === 'reverted'
                    ? 'bg-orange-50 border-orange-300 text-orange-950 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-200'
                    : 'bg-red-50 border-red-300 text-red-950 dark:bg-red-950/40 dark:border-red-800 dark:text-red-200'
                  }`}
              >
                <AlertTriangle
                  size={20}
                  className={selectedItem.status === 'reverted' ? 'text-orange-600 shrink-0 mt-0.5' : 'text-red-600 shrink-0 mt-0.5'}
                />
                <div className="text-xs space-y-1 flex-1">
                  <div className="font-bold text-sm">
                    {selectedItem.status === 'reverted' ? 'Application Reverted with Remarks' : 'Application Rejected'}
                  </div>
                  <p>
                    <strong>Reason / Feedback:</strong>{' '}
                    {selectedItem.revertReason ||
                      selectedItem.rejectionReason ||
                      selectedItem.l1Remarks ||
                      selectedItem.l2Remarks ||
                      'Discrepancy noted during verification. Please contact your Block Level Federation (BLF) coordinator.'}
                  </p>
                  {selectedItem.revertedAtLevel && (
                    <p className="text-[11px] opacity-80">Reverted at: Level {selectedItem.revertedAtLevel}</p>
                  )}
                </div>
              </div>
            )}

          {/* Stepper / Timeline UI */}
          <Card title="Lifecycle Tracking Timeline" icon={Clock}>
            <div className="p-2 sm:p-4">
              <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-8">
                {getTimelineSteps(selectedItem).map((step, idx) => {
                  const isDone = step.status === 'completed';
                  const isCur = step.status === 'current';
                  const isRev = step.status === 'reverted';
                  const isRej = step.status === 'rejected';

                  let circleBg = 'bg-slate-200 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400';
                  let badgeBg = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';

                  if (isDone) {
                    circleBg = 'bg-green-600 text-white border-green-700 shadow-md ring-4 ring-green-100 dark:ring-green-950';
                    badgeBg = 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 font-bold';
                  } else if (isCur) {
                    circleBg = 'bg-amber-500 text-white border-amber-600 shadow-md ring-4 ring-amber-100 dark:ring-amber-950 animate-pulse';
                    badgeBg = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold';
                  } else if (isRev) {
                    circleBg = 'bg-orange-600 text-white border-orange-700 ring-4 ring-orange-100 dark:ring-orange-950';
                    badgeBg = 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-bold';
                  } else if (isRej) {
                    circleBg = 'bg-red-600 text-white border-red-700 ring-4 ring-red-100 dark:ring-red-950';
                    badgeBg = 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold';
                  }

                  return (
                    <div key={idx} className="relative group">
                      {/* Stepper Node Circle */}
                      <div
                        className={`absolute -left-[37px] sm:-left-[45px] top-0 size-8 sm:size-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${circleBg}`}
                      >
                        {isDone ? <CheckCircle2 size={16} /> : isRev ? <RotateCcw size={16} /> : isRej ? <XCircle size={16} /> : step.number}
                      </div>

                      {/* Step Content */}
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-colors space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {step.number}. {step.title}
                            </h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeBg}`}>
                              {step.badgeText}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Date: {step.date}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {step.details}
                        </p>

                        {/* Remarks if present */}
                        {step.remarks && (
                          <div className="mt-2 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300">Official Remarks:</span>{' '}
                            <span className="text-slate-600 dark:text-slate-400">{step.remarks}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card title="No Application Found" icon={AlertTriangle}>
          <div className="p-8 text-center space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No registration record matches application ID &ldquo;{activeAppId}&rdquo;.
            </p>
            <p className="text-xs text-slate-400">
              Please double-check the ID or try one of the sample buttons above.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WshgTrackingPage;
