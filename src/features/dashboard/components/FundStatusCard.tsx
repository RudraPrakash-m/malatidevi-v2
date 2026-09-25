import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface FundStatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorVariant?: 'blue' | 'emerald' | 'amber' | 'indigo' | 'purple' | 'rose';
  trend?: {
    label: string;
    positive?: boolean;
  };
}

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900/60',
    iconText: 'text-blue-600 dark:text-blue-400',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    iconText: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-900/60',
    iconText: 'text-amber-600 dark:text-amber-400',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-200 dark:border-indigo-800',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/60',
    iconText: 'text-indigo-600 dark:text-indigo-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-900/60',
    iconText: 'text-purple-600 dark:text-purple-400',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    iconBg: 'bg-rose-100 dark:bg-rose-900/60',
    iconText: 'text-rose-600 dark:text-rose-400',
  },
};

export const FundStatusCard: React.FC<FundStatusCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorVariant = 'blue',
  trend,
}) => {
  const colors = COLOR_MAP[colorVariant] || COLOR_MAP.blue;

  return (
    <div
      className={`p-4 rounded-xl border ${colors.border} ${colors.bg} transition-all duration-200 shadow-2xs hover:shadow-xs`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
            {title}
          </span>
          <div className="text-xl md:text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {value}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`size-10 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <Icon size={20} />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
          <span
            className={`font-semibold ${
              trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
            }`}
          >
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default FundStatusCard;
