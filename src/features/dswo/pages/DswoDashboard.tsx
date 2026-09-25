// src/features/dswo/pages/DswoDashboard.tsx

import React, { useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  XCircle,
  Users,
  HandCoins,
  Building2,
} from 'lucide-react';
import Card from '@/shared/components/layout/Card';
import { FundStatusCard } from '@/features/state/components/FundStatusCard';
import { useCheckItems } from '@/features/check/state/checkState';
import { dswoService } from '../services/dswoService';
import { ODISHA_ALL_DISTRICTS_REQUEST_DATA } from '@/features/state/pages/FundRequestList';

export const DswoDashboard: React.FC<{ districtName?: string }> = ({
  districtName = 'Khordha',
}) => {
  const { items } = useCheckItems();

  const metrics = useMemo(() => {
    return dswoService.getMetrics(items, ODISHA_ALL_DISTRICTS_REQUEST_DATA, districtName);
  }, [items, districtName]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950 via-amber-900 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/30 inline-block mb-3">
            District Portal • {districtName} District
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            DSWO District Social Welfare Dashboard
          </h1>
          <p className="mt-2 text-sm text-amber-100/80 leading-relaxed">
            District-level authority for final approval of SHG registrations, beneficiary distribution monitoring, and state fund requisition management.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FundStatusCard
          title="Pending Verification"
          value={metrics.totalPendingVerification}
          subtitle="Awaiting District Action"
          icon={AlertCircle}
          colorVariant="amber"
          trend={{ label: 'Active Pipeline' }}
        />

        <FundStatusCard
          title="Approved Registrations"
          value={metrics.totalApproved}
          subtitle="Credentials Active & Dispatched"
          icon={CheckCircle2}
          colorVariant="emerald"
          trend={{ label: 'Fully Sanctioned', positive: true }}
        />

        <FundStatusCard
          title="Allocated District Funds"
          value={`₹${(metrics.totalFundsAllocated / 100000).toFixed(2)} L`}
          subtitle={`Requested: ₹${(metrics.totalFundsRequested / 100000).toFixed(2)} L`}
          icon={HandCoins}
          colorVariant="blue"
          trend={{ label: 'State Sanctioned', positive: true }}
        />

        <FundStatusCard
          title="Child Beneficiaries"
          value={metrics.totalBeneficiaries.toLocaleString('en-IN')}
          subtitle={`Across ${metrics.activeProjects} District Projects`}
          icon={Users}
          colorVariant="indigo"
          trend={{ label: 'Registered AWCs' }}
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card title="Application Scrutiny Summary" icon={ShieldCheck}>
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Approved & Dispatched
                </span>
              </div>
              <span className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400">
                {metrics.totalApproved} Groups
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2.5">
                <RotateCcw size={18} className="text-orange-600 dark:text-orange-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Reverted for Deficiencies
                </span>
              </div>
              <span className="text-sm font-bold font-mono text-orange-700 dark:text-orange-400">
                {metrics.totalReverted} Groups
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
              <div className="flex items-center gap-2.5">
                <XCircle size={18} className="text-rose-600 dark:text-rose-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Rejected Ineligible Applications
                </span>
              </div>
              <span className="text-sm font-bold font-mono text-rose-700 dark:text-rose-400">
                {metrics.totalRejected} Groups
              </span>
            </div>
          </div>
        </Card>

        <Card title="District Operations" icon={Building2} className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <a
              href="/check/dswo"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-slate-800 transition-all group"
            >
              <div className="size-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
                <ShieldCheck size={18} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600">
                SHG Application List
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Final approval, rejection, and credential provisioning.
              </p>
            </a>

            <a
              href="/add-beneficiary"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all group"
            >
              <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                <Users size={18} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">
                Beneficiary Distribution
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                AWC-wise child uniform and sweater distributions.
              </p>
            </a>

            <a
              href="/fund-allocation"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-all group"
            >
              <div className="size-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
                <HandCoins size={18} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                Request District Funds
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Submit annual and interim fund requests to State.
              </p>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DswoDashboard;
