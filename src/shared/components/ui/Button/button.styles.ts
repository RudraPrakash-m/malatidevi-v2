import type { ButtonVariant, ButtonSize } from "./button.types";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-hover text-white shadow-xs focus:ring-2 focus:ring-primary/20",
  secondary:
    "bg-secondary hover:bg-secondary/90 text-white shadow-xs focus:ring-2 focus:ring-secondary/20",
  success:
    "bg-success hover:bg-success/90 text-white shadow-xs focus:ring-2 focus:ring-success/20",
  danger:
    "bg-danger hover:bg-danger/90 text-white shadow-xs focus:ring-2 focus:ring-danger/20",
  warning:
    "bg-warning hover:bg-warning/90 text-white shadow-xs focus:ring-2 focus:ring-warning/20",
  dark:
    "bg-gray-900 hover:bg-black text-white shadow-xs focus:ring-2 focus:ring-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700",
  light:
    "bg-slate-100 hover:bg-slate-200 text-gray-800 shadow-2xs dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200",
  info:
    "bg-sky-50 dark:bg-sky-950/40 border border-sky-400 dark:border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/60 font-semibold shadow-2xs focus:ring-2 focus:ring-sky-400/20",
  error:
    "bg-rose-50 dark:bg-rose-950/40 border border-rose-400 dark:border-rose-500 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-semibold shadow-2xs focus:ring-2 focus:ring-rose-400/20",
  outline:
    "bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 font-semibold shadow-2xs focus:ring-2 focus:ring-slate-400/20",
  "outline-primary":
    "bg-blue-50 dark:bg-blue-950/40 border border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold shadow-2xs focus:ring-2 focus:ring-blue-400/20",
  "outline-secondary":
    "bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 font-semibold shadow-2xs focus:ring-2 focus:ring-slate-400/20",
  "outline-success":
    "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-semibold shadow-2xs focus:ring-2 focus:ring-emerald-400/20",
  "outline-danger":
    "bg-rose-50 dark:bg-rose-950/40 border border-rose-400 dark:border-rose-500 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-semibold shadow-2xs focus:ring-2 focus:ring-rose-400/20",
  "outline-warning":
    "bg-amber-50 dark:bg-amber-950/40 border border-amber-400 dark:border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60 font-semibold shadow-2xs focus:ring-2 focus:ring-amber-400/20",
  "outline-info":
    "bg-sky-50 dark:bg-sky-950/40 border border-sky-400 dark:border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/60 font-semibold shadow-2xs focus:ring-2 focus:ring-sky-400/20",
  "outline-error":
    "bg-rose-50 dark:bg-rose-950/40 border border-rose-400 dark:border-rose-500 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-semibold shadow-2xs focus:ring-2 focus:ring-rose-400/20",
  ghost:
    "hover:bg-slate-100 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800",
  soft:
    "bg-primary/10 text-primary hover:bg-primary hover:text-white dark:bg-primary/20 dark:text-primary-foreground",
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-9.5 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-6 text-base gap-2.5 rounded-xl",
};

export const baseButtonStyle =
  "inline-flex items-center justify-center font-medium whitespace-nowrap transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer select-none outline-none";
