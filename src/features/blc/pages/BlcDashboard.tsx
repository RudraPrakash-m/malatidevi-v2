// src/features/blc/pages/BlcDashboard.tsx

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Users,
  Award,
  ClipboardCheck,
} from 'lucide-react';
import Card from '@/shared/components/layout/Card';
import { FundStatusCard } from '@/features/state/components/FundStatusCard';
import { useBlcVerification } from '../hooks/useBlcVerification';

export const BlcDashboard: React.FC = () => {
  const { metrics } = useBlcVerification();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950 via-cyan-900 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 inline-block mb-3">
            Block Level Committee (BLC) Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            BLC Committee Review & Final Approval
          </h1>
          <p className="mt-2 text-sm text-cyan-100/80 leading-relaxed">
            Review ground scrutiny reports submitted by BLFs, examine resolution registers, pass committee inspection orders, and accord final clearance with instant SMS credential provisioning.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FundStatusCard
          title="Pending Committee Review"
          value={metrics.totalPendingCommitteeReview}
          subtitle="Forwarded by BLF"
          icon={AlertCircle}
          colorVariant="amber"
          trend={{ label: 'Ready for Meeting Action' }}
        />

        <FundStatusCard
          title="Committee Approved"
          value={metrics.totalApproved}
          subtitle="SMS Credentials Dispatched"
          icon={CheckCircle2}
          colorVariant="emerald"
          trend={{ label: 'Sanctioned Groups', positive: true }}
        />

        <FundStatusCard
          title="Reverted Back to BLF"
          value={metrics.totalRevertedToBlf}
          subtitle="Deficiency Memos Issued"
          icon={RotateCcw}
          colorVariant="rose"
          trend={{ label: 'Clarifications Ongoing' }}
        />

        <FundStatusCard
          title="Total Groups Inspected"
          value={metrics.totalInspectedGroups}
          subtitle="Block Jurisdiction"
          icon={Users}
          colorVariant="indigo"
          trend={{ label: 'Total App Count', positive: true }}
        />
      </div>

      {/* Quick Action Navigation */}
      <Card title="Committee Operations" icon={ClipboardCheck}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <a
            href="/check/blc"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:bg-cyan-50/50 dark:hover:bg-slate-800 transition-all group"
          >
            <div className="size-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2.5">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600">
              BLC Verification & Approval List
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Scrutinize BLF inspection notes, grant committee approval, and revert deficient files.
            </p>
          </a>

          <a
            href="/track-wshg"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all group"
          >
            <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
              <Award size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">
              Live Application Tracking & Credentials
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verify credentials status, SMS delivery timestamps, and multi-tier resolution histories.
            </p>
          </a>
        </div>
      </Card>
    </div>
  );
};

export default BlcDashboard;
