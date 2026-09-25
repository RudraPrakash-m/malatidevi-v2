// src/features/blf/pages/BlfDashboard.tsx

import React from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Forward,
} from 'lucide-react';
import Card from '@/shared/components/layout/Card';
import { FundStatusCard } from '@/features/state/components/FundStatusCard';
import { useBlfVerification } from '../hooks/useBlfVerification';

export const BlfDashboard: React.FC = () => {
  const { metrics } = useBlfVerification();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-sky-900 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30 inline-block mb-3">
            Block Level Federation (BLF) Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            SHG First-Tier Scrutiny & Field Inspection
          </h1>
          <p className="mt-2 text-sm text-sky-100/80 leading-relaxed">
            Conduct on-ground physical scrutiny of newly registered Women Self Help Groups, verify byelaws & bank passbooks, check GPS premises photos, and recommend to Block Level Committee (BLC).
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FundStatusCard
          title="Pending Ground Scrutiny"
          value={metrics.totalPendingScrutiny}
          subtitle="Awaiting Initial Verification"
          icon={AlertCircle}
          colorVariant="amber"
          trend={{ label: 'Action Required' }}
        />

        <FundStatusCard
          title="Forwarded to BLC"
          value={metrics.totalForwardedToBlc}
          subtitle="Under Committee Inspection"
          icon={Forward}
          colorVariant="blue"
          trend={{ label: 'Recommended', positive: true }}
        />

        <FundStatusCard
          title="Reverted for Deficiencies"
          value={metrics.totalReverted}
          subtitle="Pending Group Clarifications"
          icon={RotateCcw}
          colorVariant="rose"
          trend={{ label: 'Clarifications Ongoing' }}
        />

        <FundStatusCard
          title="Total Registered SHGs"
          value={metrics.totalRegisteredGroups}
          subtitle="Block Cluster Scope"
          icon={Users}
          colorVariant="emerald"
          trend={{ label: 'Active Pipeline', positive: true }}
        />
      </div>

      {/* Quick Action Navigation */}
      <Card title="Quick Scrutiny Actions" icon={ShieldCheck}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <a
            href="/check/blf"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-all group"
          >
            <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
              SHG Application Scrutiny List
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verify applications, review geotagged site photos, and forward to BLC.
            </p>
          </a>

          <a
            href="/track-wshg"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all group"
          >
            <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
              <CheckCircle2 size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">
              Live Application Tracking
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track multi-level approval stages for any registered SHG application ID.
            </p>
          </a>
        </div>
      </Card>
    </div>
  );
};

export default BlfDashboard;
