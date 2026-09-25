// src/features/cdpo/pages/CdpoDashboard.tsx

import React from 'react';
import {
  Package,
  ClipboardList,
  Users,
  Building2,
  PlusCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '@/shared/components/layout/Card';
import Button from '@/shared/components/ui/Button';
import { FundStatusCard } from '@/features/state/components/FundStatusCard';
import { useCdpoSupply } from '../hooks/useCdpoSupply';
import { SupplyItemRow } from '../components/SupplyItemRow';

export const CdpoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, metrics } = useCdpoSupply();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 inline-block mb-3">
            CDPO Project Administration
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Child Development Project Officer Dashboard
          </h1>
          <p className="mt-2 text-sm text-emerald-100/80 leading-relaxed">
            Project-level management for generating SHG work supply orders, tracking production indents, and managing child uniform & sweater delivery catalogues.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FundStatusCard
          title="Total Supply Orders"
          value={metrics.totalSupplyOrders}
          subtitle="Generated Work Orders"
          icon={ClipboardList}
          colorVariant="emerald"
          trend={{ label: 'Active Project Contracts', positive: true }}
        />

        <FundStatusCard
          title="Assigned SHGs"
          value={metrics.totalActiveWshgs}
          subtitle="Registered Suppliers"
          icon={Users}
          colorVariant="blue"
          trend={{ label: 'Active Production Units' }}
        />

        <FundStatusCard
          title="AWCs Covered"
          value={metrics.totalAwcsCovered}
          subtitle="Anganwadi Distribution"
          icon={Building2}
          colorVariant="indigo"
          trend={{ label: 'Sector Spread' }}
        />

        <FundStatusCard
          title="Total Kits Produced"
          value={metrics.totalUnitsSupplied.toLocaleString('en-IN')}
          subtitle={`${metrics.completedDeliveries} Orders Completed`}
          icon={Package}
          colorVariant="amber"
          trend={{ label: 'Delivery Verified', positive: true }}
        />
      </div>

      {/* Action Header & Live Orders */}
      <Card
        title="Active Supply Orders & Indents"
        icon={Package}
        action={
          <Button
            type="button"
            variant="primary"
            size="sm"
            label="Create New Supply Order"
            icon={<PlusCircle size={15} />}
            onClick={() => navigate('/add-supply')}
          />
        }
      >
        <div className="space-y-3 pt-2">
          {orders.map((order) => (
            <SupplyItemRow
              key={order.id}
              order={order}
              onViewDetails={(ord) =>
                alert(
                  `Order: ${ord.orderNumber}\nSHG: ${ord.shgName}\nTotal Amount: ₹${ord.totalAmount}\nStatus: ${ord.status}`
                )
              }
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CdpoDashboard;
