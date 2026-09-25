import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  HandCoins,
  Building2,
  Users,
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import Card from '@/shared/components/layout/Card';
import { FundStatusCard } from '../components/FundStatusCard';
import { useStateFundAllocation } from '../hooks/useStateFundAllocation';
import { useUcOversight } from '@/features/shared/uc-certificate';

export const StateDashboard: React.FC = () => {
  const { metrics } = useStateFundAllocation();
  const { ucRecords } = useUcOversight();

  const verifiedUcCount = ucRecords.filter((r) => r.status === 'VERIFIED').length;
  const pendingUcCount = ucRecords.filter((r) => r.status === 'PENDING' || r.status === 'SUBMITTED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 inline-block mb-3">
            State Level Administrative Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            State Welfare Scheme & Fund Oversight
          </h1>
          <p className="mt-2 text-sm text-blue-100/80 leading-relaxed">
            State-wide monitoring of Women Self Help Group entitlements, district budget disbursements, requested fund approvals, and Utilization Certificate (UC) compliance.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FundStatusCard
          title="Total Sanctioned Budget"
          value={`₹${(metrics.totalBudget / 10000000).toFixed(0)} Cr`}
          subtitle="State Annual Target (FY 2025-26)"
          icon={Wallet}
          colorVariant="blue"
          trend={{ label: '100% Budget Active', positive: true }}
        />

        <FundStatusCard
          title="Total Allocated Funds"
          value={`₹${(metrics.totalAllocated / 10000000).toFixed(2)} Cr`}
          subtitle={`Across ${metrics.fullyPaidDistricts + metrics.partiallyPaidDistricts} Active Districts`}
          icon={HandCoins}
          colorVariant="emerald"
          trend={{ label: `${((metrics.totalAllocated / metrics.totalBudget) * 100).toFixed(1)}% Disbursed`, positive: true }}
        />

        <FundStatusCard
          title="Total Beneficiary Children"
          value={metrics.totalBeneficiaries.toLocaleString('en-IN')}
          subtitle="Direct Entitlement Coverage"
          icon={Users}
          colorVariant="indigo"
          trend={{ label: '30 Odisha Districts', positive: true }}
        />

        <FundStatusCard
          title="UC Compliance Verified"
          value={`${verifiedUcCount} / ${ucRecords.length}`}
          subtitle={`${pendingUcCount} Pending Verification`}
          icon={Award}
          colorVariant="amber"
          trend={{ label: 'Audited & Validated', positive: true }}
        />
      </div>

      {/* District Progress Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card title="Fund Sanction Breakdown" icon={TrendingUp}>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Fully Disbursed Districts
                  </span>
                  <p className="text-[11px] text-slate-500">100% entitlement cleared</p>
                </div>
              </div>
              <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">
                {metrics.fullyPaidDistricts} Districts
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={18} className="text-amber-600 dark:text-amber-400" />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Partially Paid Districts
                  </span>
                  <p className="text-[11px] text-slate-500">Interim installments ongoing</p>
                </div>
              </div>
              <span className="text-base font-bold font-mono text-amber-700 dark:text-amber-400">
                {metrics.partiallyPaidDistricts} Districts
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Rejected / Deficient Requests
                  </span>
                  <p className="text-[11px] text-slate-500">Audit clarifications needed</p>
                </div>
              </div>
              <span className="text-base font-bold font-mono text-rose-700 dark:text-rose-400">
                {metrics.rejectedDistricts} Districts
              </span>
            </div>
          </div>
        </Card>

        <Card title="Quick Governance Links" icon={Building2} className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              to="/fund-request-list"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-all group"
            >
              <div className="size-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
                <HandCoins size={18} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                Requested Fund List
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Scrutinize district fund requisitions and authorize payments.
              </p>
            </Link>

            <Link
              to="/fund-allocation-field"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all group"
            >
              <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                <Wallet size={18} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">
                Fund Allocation
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Direct state allocation for uniform and winter packages.
              </p>
            </Link>

            <Link
              to="/state/uc-oversight"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-slate-800 transition-all group"
            >
              <div className="size-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
                <Award size={18} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600">
                UC Oversight
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Audit utilization certificates and expenditure receipts.
              </p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StateDashboard;
