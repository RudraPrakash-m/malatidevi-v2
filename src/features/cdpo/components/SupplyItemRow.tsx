// src/features/cdpo/components/SupplyItemRow.tsx

import React from 'react';
import type { SupplyOrderItem } from '../types/cdpo.types';
import { Package, Clock, CheckCircle2, Truck } from 'lucide-react';

export interface SupplyItemRowProps {
  order: SupplyOrderItem;
  onViewDetails?: (order: SupplyOrderItem) => void;
}

export const SupplyItemRow: React.FC<SupplyItemRowProps> = ({ order, onViewDetails }) => {
  const renderStatusBadge = (status: SupplyOrderItem['status']) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 size={12} /> DELIVERED
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <Truck size={12} /> DISPATCHED
          </span>
        );
      case 'IN_PRODUCTION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock size={12} /> IN PRODUCTION
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
          <Package size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
              {order.orderNumber}
            </span>
            {renderStatusBadge(order.status)}
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {order.shgName}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {order.project} • {order.sector} • Category:{' '}
            <strong className="text-slate-700 dark:text-slate-300">{order.itemCategory}</strong>
          </p>
        </div>
      </div>

      <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-700">
        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-medium">
            {order.totalUnitsOrdered} Units Ordered
          </span>
          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        {onViewDetails && (
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default SupplyItemRow;
