import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ClipboardPenLine,
  ShieldCheck,
  WalletCards,
  ClipboardList,
  ShoppingCart,
  HandCoins,
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  ShoppingBag,
  Award,
  ListChecks,
  Search,
  LogIn,
} from "lucide-react";
import { useLayout } from "../LayoutContext";
import type { RootState } from "@/app/store";
import { LOCAL_USERS } from "@/features/auth/localUsers";

interface MenuItem {
  icon?: React.ElementType;
  label: string;
  path: string;
  badge?: {
    text: string;
    variant: "danger-pill" | "danger-circle" | "primary";
  };
  submenu?: { label: string; path: string }[];
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export const Sidebar: React.FC = () => {
  const { isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen } = useLayout();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    Forms: true,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const { user: authUser, isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  const currentRoleCode = useMemo<string>(() => {
    // 1. Direct primaryRoleCode on authUser
    if (authUser?.primaryRoleCode) {
      return String(authUser.primaryRoleCode).trim().toUpperCase();
    }
    // 2. Direct roleCode or role
    if (authUser?.roleCode) {
      return String(authUser.roleCode).trim().toUpperCase();
    }
    if (authUser?.role) {
      return String(authUser.role).trim().toUpperCase();
    }
    // 3. Username matching in LOCAL_USERS
    const uname = (authUser?.loginUserName || authUser?.userName || authUser?.username || "").toLowerCase().trim();
    if (uname) {
      const matched = LOCAL_USERS.find((u) => u.loginUserName.toLowerCase() === uname);
      if (matched) return matched.primaryRoleCode.toUpperCase();
    }
    // 4. Token payload inspection (e.g. local.eyJzdWIiOiJkc3dvIiwicm9sZSI6IkRTV08ifQ==.session)
    if (token && typeof token === "string" && token.includes(".")) {
      try {
        const parts = token.split(".");
        if (parts.length >= 2) {
          const payloadStr = window.atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
          const decoded = JSON.parse(payloadStr);
          if (decoded?.role) return String(decoded.role).trim().toUpperCase();
          if (decoded?.primaryRoleCode) return String(decoded.primaryRoleCode).trim().toUpperCase();
          if (decoded?.sub) {
            const matched = LOCAL_USERS.find(
              (u) => u.loginUserName.toLowerCase() === String(decoded.sub).toLowerCase().trim()
            );
            if (matched) return matched.primaryRoleCode.toUpperCase();
          }
        }
      } catch {
        // ignore
      }
    }
    // 5. Check localStorage authUser
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("authUser");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.primaryRoleCode) return String(parsed.primaryRoleCode).trim().toUpperCase();
          if (parsed?.roleCode) return String(parsed.roleCode).trim().toUpperCase();
          if (parsed?.role) return String(parsed.role).trim().toUpperCase();
          if (parsed?.loginUserName) {
            const matched = LOCAL_USERS.find(
              (u) => u.loginUserName.toLowerCase() === String(parsed.loginUserName).toLowerCase().trim()
            );
            if (matched) return matched.primaryRoleCode.toUpperCase();
          }
        }
      } catch {
        // ignore
      }
    }

    return (isAuthenticated ? "ADMIN" : "GUEST").toUpperCase();
  }, [authUser, isAuthenticated, token]);

  useEffect(() => {
    if (location.pathname === "/form-elements") {
      setOpenSubmenus((prev) => ({ ...prev, Forms: true }));
    }
  }, [location.pathname]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  // Workflow-wise menu sections based on role
  const menuSections = useMemo<MenuSection[]>(() => {
    switch (currentRoleCode) {
      case "STATE":
        return [
          {
            title: "",
            items: [
              {
                icon: LayoutDashboard,
                label: "Dashboard",
                path: "/dashboard",
              },
            ],
          },
          {
            title: "Finance & Scheme Oversight",
            items: [
              // {
              //   icon: WalletCards,
              //   label: "Budget Allocation",
              //   path: "/budget-allocation",
              // },

              {
                icon: Wallet,
                label: "Fund Allocation",
                path: "/fund-allocation-field",
              },
              {
                icon: ClipboardList,
                label: "Requested Fund List",
                path: "/fund-request-list",
              },
              // {
              //   icon: FileCheck,
              //   label: "Procurement Audit",
              //   path: "/procurement-audit",
              // },
              {
                icon: Award,
                label: "Utilization List",
                path: "/uc-generation",
              },
            ],
          },
        ];

      case "DSWO":
        return [
          {
            title: "",
            items: [
              {
                icon: LayoutDashboard,
                label: "Dashboard",
                path: "/dashboard",
              },
            ],
          },
          {
            title: "Beneficiary & SHG Verification",
            items: [
              {
                icon: Users,
                label: "Beneficiary Distribution",
                path: "/add-beneficiary",
              },
              {
                icon: ShieldCheck,
                label: "SHG Application List",
                path: "/check/dswo",
              },
              {
                icon: Building2,
                label: "Eligible SHG List",
                path: "/eligible-shg-list",
              },
            ],
          },
          {
            title: "District Fund & Scheme Oversight",
            items: [
              {
                icon: HandCoins,
                label: "Request Fund",
                path: "/fund-allocation",
              },
              {
                icon: WalletCards,
                label: "Fund Allocation ",
                path: "/fund-allocationn",
              },
              {
                icon: Award,
                label: "Utilization List",
                path: "/uc-generation",
              },
            ],
          },
        ];

      case "CDPO":
        return [
          {
            title: "",
            items: [
              {
                icon: LayoutDashboard,
                label: "Dashboard",
                path: "/dashboard",
              },
            ],
          },
          {
            title: "Project Level Allocation",
            items: [
              {
                icon: ClipboardList,
                label: "Create Supply Order",
                path: "/add-supply",
              },
              {
                icon: Building2,
                label: "Eligible SHG List",
                path: "/eligible-shg-list",
              },
              {
                icon: Wallet,
                label: "Fund Allocation",
                path: "/fund-allocation-field",
              },
              {
                icon: Award,
                label: "UC Generation",
                path: "/uc-generation",
              },
              // {
              //   icon: Table,
              //   label: "Fund Allocation Table",
              //   path: "/fund-allocation-table",
              // },

              // {
              //   icon: Search,
              //   label: "WSHG Tracking",
              //   path: "/track-wshg",
              // },
              // {
              //   icon: Building2,
              //   label: "Registered WSHG List",
              //   path: "/wshg-list",
              // },
            ],
          },
          {
            title: "Indents & Supply",
            items: [
              // {
              //   icon: Package,
              //   label: "Supply Management",
              //   path: "/supply-management",
              // },
              {
                icon: ShoppingBag,
                label: "Delivery Catalogue",
                path: "/delivery-catalogue",
              },
              // {
              //   icon: ClipboardCheck,
              //   label: "Procurement Entry",
              //   path: "/procurement-entry",
              // },
            ],
          },
        ];

      case "BLF":
        return [
          {
            title: "",
            items: [
              {
                icon: LayoutDashboard,
                label: "Dashboard",
                path: "/dashboard",
              },
              {
                icon: Building2,
                label: "SHG Application List",
                path: "/check/blf",
              },
            ],
          },
        ];

      case "BLC":
        return [
          {
            title: "",
            items: [
              {
                icon: LayoutDashboard,
                label: "Dashboard",
                path: "/dashboard",
              },
              {
                icon: Building2,
                label: "SHG Application List",
                path: "/check/blc",
              },
            ],
          },
        ];

      case "AWW":
        return [
          {
            title: "",
            items: [
              {
                icon: LayoutDashboard,
                label: "Dashboard",
                path: "/dashboard",
              },
            ],
          },
          {
            title: "AWC Delivery & Distribution",
            items: [
              {
                icon: Users,
                label: "SHG Details",
                path: "/shg-details",
              },
              {
                icon: ShoppingBag,
                label: "Delivery Catalogue",
                path: "/delivery-catalogue",
              },
              {
                icon: Users,
                label: "Beneficiary Distribution",
                path: "/beneficiary-distribute",
              },
              // {
              //   icon: Search,
              //   label: "WSHG Tracking",
              //   path: "/track-wshg",
              // },
              // {
              //   icon: Award,
              //   label: "UC Certificate",
              //   path: "/uc-certificate",
              // },
            ],
          },
        ];

      case "WSHG":
      case "SHG":
        return [
          {
            title: "SHG Workflow (Step 1)",
            items: [
              {
                icon: ClipboardPenLine,
                label: "Step 1: SHG Registration",
                path: "/add-wshg",
                badge: { text: "Step 1", variant: "primary" },
              },
              {
                icon: Search,
                label: "Application Tracking",
                path: "/track-wshg",
                badge: { text: "Live", variant: "primary" },
              },
              {
                icon: Building2,
                label: "Registration Records",
                path: "/wshg-list",
              },
            ],
          },
        ];

      case "GUEST":
        return [
          {
            title: "Citizen Services",
            items: [
              {
                icon: Search,
                label: "SHG Tracking",
                path: "/track-wshg",
                badge: { text: "Live", variant: "primary" },
              },
              {
                icon: ClipboardPenLine,
                label: "SHG Registration",
                path: "/add-wshg",
                badge: { text: "Step 1", variant: "primary" },
              },
              {
                icon: LogIn,
                label: "Officer Login",
                path: "/login",
              },
            ],
          },
        ];

      case "ADMIN":
      default:
        return [
          {
            title: "",
            items: [
              {
                icon: LayoutDashboard,
                label: "Dashboard",
                path: "/dashboard",
              },
            ],
          },
          {
            title: "Procurement Operations",
            items: [
              // {
              //   icon: WalletCards,
              //   label: "Budget Allocation & Release",
              //   path: "/budget-allocation",
              // },
              {
                icon: ClipboardList,
                label: "Create Supply Order",
                path: "/add-supply",
              },
              {
                icon: Users,
                label: "SHG Details",
                path: "/shg-details",
              },

              {
                icon: ShoppingCart,
                label: "Delivery Catalogue",
                path: "/delivery-catalogue",
              },
              // {
              //   icon: ClipboardCheck,
              //   label: "Procurement Audit & Stocking",
              //   path: "/procurement-audit",
              // },
              {
                icon: HandCoins,
                label: "Fund Request",
                path: "/fund-allocation",
              },
              {
                icon: WalletCards,
                label: "Fund Allocation",
                path: "/fund-request",
              },

              {
                icon: ListChecks,
                label: "Fund Allocation List",
                path: "/fund-allocation-field",
              },
            ],
          },
          // {
          //   title: "Beneficiary & Settlement",
          //   items: [
          //     {
          //       icon: HandCoins,
          //       label: "Beneficiary Distribution",
          //       path: "/add-beneficiary",
          //     },
          //     {
          //       icon: FileCheck,
          //       label: "UC & Institutional Certificate",
          //       path: "/add-uc",
          //     },
          //     {
          //       icon: ReceiptIndianRupee,
          //       label: "Payment Settlement",
          //       path: "/payment-settlement",
          //     },
          //   ],
          // },
        ];
    }
  }, [currentRoleCode]);

  const sidebarWidthClass = isCollapsed ? "w-[76px]" : "w-[260px]";

  const renderItem = (item: MenuItem) => {
    const hasSubmenu = Boolean(item.submenu && item.submenu.length > 0);
    const isOpen = Boolean(openSubmenus[item.label]);
    const isChildActive = item.submenu?.some((sub) => sub.path === location.pathname);
    const isActive = location.pathname === item.path || isChildActive;

    const ItemIcon = item.icon;

    return (
      <div key={item.label} className="w-full mb-1">
        <button
          type="button"
          onClick={() => {
            if (hasSubmenu && !isCollapsed) {
              toggleSubmenu(item.label);
            } else {
              handleNavigate(item.path);
            }
          }}
          title={isCollapsed ? item.label : undefined}
          style={
            isActive
              ? {
                backgroundImage:
                  "linear-gradient(231.7deg, rgb(255 136 46) 30.62%, rgb(245 114 15) 96.67%)",
              }
              : undefined
          }
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer group relative ${isActive
            ? "text-white bg-white/70 shadow-sm ring-1 ring-white/70"
            : "text-slate-800 dark:text-gray-200 hover:bg-white/45 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-white"
            } ${isCollapsed ? "justify-center px-2" : ""}`}
        >
          {ItemIcon && (
            <ItemIcon
              size={18}
              className={`shrink-0 transition-colors ${isActive
                ? "text-white"
                : "text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white"
                }`}
            />
          )}

          {!isCollapsed && (
            <>
              <span className="truncate flex-1 text-start leading-tight">{item.label}</span>

              {item.badge && item.badge.variant === "danger-pill" && (
                <span className="bg-[#fe1c06] text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none uppercase">
                  {item.badge.text}
                </span>
              )}

              {item.badge && item.badge.variant === "primary" && (
                <span className="bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none uppercase">
                  {item.badge.text}
                </span>
              )}

              {item.badge && item.badge.variant === "danger-circle" && (
                <span className="size-5 rounded-full bg-[#fe1c06] text-white text-[11px] font-bold flex items-center justify-center leading-none">
                  {item.badge.text}
                </span>
              )}

              {hasSubmenu && (
                <ChevronRight
                  size={14}
                  className={`transition-transform duration-200 text-gray-400 ${isOpen ? "rotate-90" : "rotate-0"
                    }`}
                />
              )}
            </>
          )}
        </button>

        {/* Submenu with Bullet Points */}
        {!isCollapsed && hasSubmenu && isOpen && (
          <div className="mt-1 ml-4 pl-3 border-l border-border-color dark:border-gray-800 space-y-1">
            {item.submenu?.map((sub) => {
              const isSubActive = location.pathname === sub.path;
              return (
                <button
                  key={sub.label}
                  type="button"
                  onClick={() => handleNavigate(sub.path)}
                  className={`w-full text-start px-2 py-1.5 text-xs transition-colors cursor-pointer rounded flex items-center gap-2 ${isSubActive
                    ? "text-primary font-bold dark:text-primary-foreground"
                    : "text-gray-600 dark:text-gray-400 hover:text-primary"
                    }`}
                >
                  <span
                    className={`size-1.5 rounded-full shrink-0 ${isSubActive ? "bg-primary" : "bg-gray-400 dark:bg-gray-600"
                      }`}
                  />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-3 select-none overflow-x-hidden">
      <div className="min-h-0 flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header Strip */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/60 dark:border-white/10 shrink-0">
          <div
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
            onClick={() => handleNavigate("/dashboard")}
          >
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-base font-bold text-slate-950 dark:text-white tracking-tight truncate leading-tight">
                  Navigation
                </span>
                {/* <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold truncate leading-tight uppercase">
                  Role: {currentRoleCode === "GUEST" ? "GUEST / CITIZEN" : currentRoleCode}
                </span> */}
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex size-8 items-center justify-center rounded-full border border-white/70 dark:border-white/15 bg-white/35 dark:bg-white/10 text-slate-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/20 transition-colors cursor-pointer shrink-0"
            title="Toggle Sidebar"
          >
            {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-900 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu Sections with Workflow-Specific Navigation Data */}
        <div className="space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin pr-0.5">
          {menuSections.map((section, sIdx) => (
            <div key={section.title ? `${section.title}-${sIdx}` : `section-${sIdx}`}>
              {!isCollapsed && section.title ? (
                <p className="px-3 mb-1.5 text-[10.5px] font-bold tracking-wider text-slate-500 dark:text-gray-400 uppercase truncate">
                  {section.title}
                </p>
              ) : isCollapsed ? (
                <div className="h-px bg-border-color dark:bg-gray-800 my-2 mx-2" />
              ) : null}
              <div className="space-y-0.5">
                {section.items.map((item) => renderItem(item))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Floating Sidebar Card */}
      <aside
        className={`hidden lg:block shrink-0 h-[calc(100%-24px)] sticky top-3 my-3 ml-3 z-30 transition-all duration-300 ease-in-out ${sidebarWidthClass}`}
      >
        <div className="h-full bg-white/35 dark:bg-slate-950/35 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-white/15 shadow-[0_12px_40px_rgba(71,45,87,0.08)] overflow-hidden">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-[260px] max-w-full h-full p-2 z-10 animate-in slide-in-from-left duration-200">
            <div className="h-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-white/15 shadow-xl overflow-hidden">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
