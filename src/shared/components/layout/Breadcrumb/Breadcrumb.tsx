import React from "react";
import { ArrowRight, Clock, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export type BreadcrumbVariant =
  | "primary"
  | "info"
  | "dark"
  | "warning"
  | "success"
  | "danger";

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  variant?: BreadcrumbVariant;
  className?: string;
  showHomeIcon?: boolean;
}

const ROUTE_MAP: Record<string, { section?: string; label: string }> = {
  "/dashboard": { label: "Dashboard" },
  "/fund-allocation-field": { section: "Finance & Scheme Oversight", label: "Fund Allocation" },
  "/fund-allocation": { section: "Fund Operations", label: "Fund Allocation" },
  "/fund-allocationn": { section: "Fund Operations", label: "Fund Allocation" },
  "/fund-allocation-list": { section: "Fund Operations", label: "Fund Allocation List" },
  "/fund-request": { section: "Fund Operations", label: "Fund Request" },
  "/fund-request-list": { section: "Finance & Scheme Oversight", label: "Requested Fund List" },
  "/track-wshg": { section: "SHG Tracking", label: "Application Tracking" },
  "/check/dswo": { section: "SHG Verification", label: "DSWO Verification" },
  "/check/blf": { section: "SHG Verification", label: "SHG Application List" },
  "/check/blc": { section: "SHG Verification", label: "BLC Final Selection" },
  "/check/state": { section: "SHG Verification", label: "State Verification" },
  "/add-wshg": { section: "SHG Management", label: "SHG Registration" },
  "/wshg-list": { section: "SHG Management", label: "SHG List" },
  "/wshg-verification": { section: "SHG Management", label: "SHG Verification" },
  "/verification-list": { section: "SHG Management", label: "Verification List" },
  "/add-supply": { section: "Supply Management", label: "Create Supply Order" },
  "/supply-management": { section: "Supply Management", label: "Supply Management List" },
  "/shg-details": { section: "AWC Delivery & Distribution", label: "SHG Details" },
  "/delivery-catalogue": { section: "AWC Delivery & Distribution", label: "Delivery Catalogue" },
  "/beneficiary-distribute": { section: "AWC Delivery & Distribution", label: "Beneficiary Distribution" },
  "/add-beneficiary": { section: "Beneficiary & Settlement", label: "Beneficiary Distribution" },
  "/beneficiary-distribution": { section: "Beneficiary & Settlement", label: "Beneficiary Distribution List" },
  "/add-uc": { section: "Finance & Scheme Oversight", label: "Utilization Certificate" },
  "/uc-certificate": { section: "Finance & Scheme Oversight", label: "UC Certificate List" },
};

const VARIANT_STYLES: Record<BreadcrumbVariant, string> = {
  primary:
    "border-[#efdadd] bg-[#FFF0EE] dark:border-blue-600 dark:bg-blue-950/30",
  info:
    "border-[#06b6d4] bg-[#ecfeff] dark:border-cyan-600 dark:bg-cyan-950/30",
  dark:
    "border-[#374151] bg-[#f9fafb] dark:border-gray-600 dark:bg-gray-900/60",
  warning:
    "border-[#f59e0b] bg-[#fffbeb] dark:border-amber-600 dark:bg-amber-950/30",
  success:
    "border-[#10b981] bg-[#ecfdf5] dark:border-emerald-600 dark:bg-emerald-950/30",
  danger:
    "border-[#ef4444] bg-[#fef2f2] dark:border-red-600 dark:bg-red-950/30",
};

export const Breadcrumb: React.FC<Readonly<BreadcrumbProps>> = ({
  items,
  variant = "primary",
  className = "",
  showHomeIcon = true,
}) => {
  const location = useLocation();

  // Auto-generate items if not explicitly provided
  const resolvedItems: BreadcrumbItem[] = React.useMemo(() => {
    if (items && items.length > 0) return items;

    const currentPath = location.pathname;
    const matched = ROUTE_MAP[currentPath];

    if (matched) {
      const trail: BreadcrumbItem[] = [];
      if (matched.section) {
        trail.push({ label: matched.section });
      }
      trail.push({ label: matched.label });
      return trail;
    }

    // Fallback: segment pathname
    const segments = currentPath.split("/").filter(Boolean);
    return segments.map((seg, idx) => {
      const path = "/" + segments.slice(0, idx + 1).join("/");
      const formatted = seg
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        label: formatted,
        path: idx < segments.length - 1 ? path : undefined,
      };
    });
  }, [items, location.pathname]);

  const containerClasses = `${VARIANT_STYLES[variant]} border p-3 px-4 rounded-xl mb-5 flex flex-wrap items-center whitespace-nowrap gap-2 text-sm shadow-2xs transition-colors ${className}`;

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className={containerClasses}>
        {/* Home Item */}
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="flex w-full items-center text-gray-700 dark:text-gray-200 hover:text-primary transition-colors font-normal"
          >
            {showHomeIcon && (
              <Home
                size={15}
                className="mr-2 shrink-0 text-gray-600 dark:text-gray-300"
              />
            )}
            <span>Home</span>
          </Link>
        </li>

        {/* Trail Items */}
        {resolvedItems.map((item, index) => {
          const isLast = index === resolvedItems.length - 1;

          return (
            <React.Fragment key={item.path || `${item.label}-${index}`}>
              <li
                className="inline-flex items-center text-gray-500 dark:text-gray-400"
                aria-hidden="true"
              >
                <ArrowRight size={13} className="shrink-0" />
              </li>

              <li className="inline-flex items-center">
                {isLast ? (
                  <span
                    className="font-bold text-gray-900 dark:text-white"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.path ? (
                  <Link
                    to={item.path}
                    className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors font-normal"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-700 dark:text-gray-200 font-normal">
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}

        <li className="ml-auto inline-flex items-center shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <Clock size={14} className="shrink-0" aria-hidden="true" />
            <span>Current Login Session :</span>
            <span className="inline-flex items-center justify-center rounded-full py-0.5 text-[11px] font-bold leading-none text-amber-700 dark:bg-amber-600">
              2 hr 30 min
            </span>
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
