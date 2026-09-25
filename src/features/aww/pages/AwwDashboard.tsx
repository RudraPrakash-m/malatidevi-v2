// src/features/aww/pages/AwwDashboard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShoppingBag,
  Gift,
  Building2,
  Package,
} from 'lucide-react';
import Card from '@/shared/components/layout/Card';
import { FundStatusCard } from '@/features/state/components/FundStatusCard';

export const AwwDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950 via-amber-900 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-orange-500/30 text-orange-200 border border-orange-400/30 inline-block mb-3">
            Anganwadi Worker (AWW) Portal • AWC Delivery & Distribution
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Anganwadi Centre Operations
          </h1>
          <p className="mt-2 text-sm text-orange-100/80 leading-relaxed">
            Record WSHG supplier details, log uniform delivery catalogue consignments with geo-tagged verification, and manage distribution to registered children.
          </p>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FundStatusCard
          title="Assigned SHG Suppliers"
          value="4 Groups"
          subtitle="Empanelled Sewing WSHGs"
          icon={Building2}
          colorVariant="amber"
          trend={{ label: 'Active Supply Orders', positive: true }}
        />

        <FundStatusCard
          title="Consignments Received"
          value="12 Batches"
          subtitle="Pre-School Kits & Winter Sweaters"
          icon={Package}
          colorVariant="blue"
          trend={{ label: 'Verified at AWC', positive: true }}
        />

        <FundStatusCard
          title="Beneficiary Distributions"
          value="185 Kits"
          subtitle="Handed Over to Registered Children"
          icon={Gift}
          colorVariant="emerald"
          trend={{ label: '100% Phase 1 Complete', positive: true }}
        />
      </div>

      {/* AWC Delivery & Distribution Operations */}
      <Card title="AWC Delivery & Distribution Operations" icon={ShoppingBag}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* 1. SHG Details */}
          <button
            type="button"
            onClick={() => navigate('/shg-details')}
            className="p-5 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:bg-orange-50/40 dark:hover:bg-slate-800 transition-all group cursor-pointer"
          >
            <div className="size-11 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
              <Users size={22} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600">
              SHG Details
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Enter and track WSHG details, order IDs, allocated items, quantities, and due delivery dates.
            </p>
          </button>

          {/* 2. Delivery Catalogue */}
          <button
            type="button"
            onClick={() => navigate('/delivery-catalogue')}
            className="p-5 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-slate-800 transition-all group cursor-pointer"
          >
            <div className="size-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <ShoppingBag size={22} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
              Delivery Catalogue
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Log received uniform inventory, sizes, colours, upload delivery photo and verification sign.
            </p>
          </button>

          {/* 3. Beneficiary Distribution */}
          <button
            type="button"
            onClick={() => navigate('/beneficiary-distribute')}
            className="p-5 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-slate-800 transition-all group cursor-pointer"
          >
            <div className="size-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Gift size={22} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">
              Beneficiary Distribution
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Record phase-wise distribution of shoes, sweaters, and uniforms with photographic evidence.
            </p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AwwDashboard;
