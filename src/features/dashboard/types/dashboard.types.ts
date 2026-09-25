import type { LucideIcon } from 'lucide-react';

export type UserRoleType =
  | 'STATE'
  | 'ADMIN'
  | 'DSWO'
  | 'DISTRICT'
  | 'CDPO'
  | 'PROJECT'
  | 'BLC'
  | 'BLF'
  | 'AWW'
  | 'AWC'
  | 'WSHG'
  | 'SHG';

export interface DashboardMetricItem {
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

export interface QuickActionItem {
  title: string;
  description: string;
  link: string;
  icon: LucideIcon;
  badge?: string;
}
