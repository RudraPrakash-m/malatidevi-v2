// src/components/ui/Badge/badge.styles.ts

export const baseBadgeStyle = 
  'inline-flex items-center justify-center transition-all duration-200 font-medium rounded-lg';

export const badgeVariants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
  outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700',
};

export const badgeSizes = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};
