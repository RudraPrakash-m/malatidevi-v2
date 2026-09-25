import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOCAL_USERS } from "@/features/auth/localUsers";
import {
  Globe,
  Moon,
  Sun,
  Bell,
  Search,
  CheckCheck,
  LogOut,
  Settings,
  User as UserIcon,
  Menu,
} from "lucide-react";
import {
  authApi,
  useGetUserProfileQuery,
  useLogoutMutation,
} from "@/features/auth/service/AuthService";
import { clearAuth, setToken } from "@/features/auth/slice/authSlice";
import { setJwtToken } from "@/shared/utils/cookieUtils";
import type { RootState } from "@/app/store";
import { useLayout } from "../LayoutContext";
import { IMAGES } from "@/assets/images";

export const Header: React.FC = () => {
  const { toggleMobileSidebar } = useLayout();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [isLanguageOpen, setIsLanguageOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<string>("ENG");

  const langRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isNoSidebarPage =
    location.pathname === "/add-wshg" ||
    location.pathname === "/track-wshg" ||
    location.pathname.startsWith("/track-wshg");

  const { token, isAuthenticated, user: authUser } = useSelector(
    (state: RootState) => state.auth
  );

  const isLocalToken = typeof token === "string" && token.startsWith("local.");

  const { data: profileResponse } = useGetUserProfileQuery(undefined, {
    skip: !token || !isAuthenticated || isLocalToken,
  });

  const [logoutMutation] = useLogoutMutation();
  const validProfile = (profileResponse && typeof profileResponse === "object" && !Array.isArray(profileResponse) && (profileResponse.userName || profileResponse.primaryRoleCode || profileResponse.data))
    ? (profileResponse.data || profileResponse)
    : null;
  const user = isLocalToken ? (authUser || validProfile) : (validProfile || authUser);

  const userRoleCode = useMemo<string>(() => {
    if (user?.primaryRoleCode) return String(user.primaryRoleCode).trim().toUpperCase();
    if (user?.roleCode) return String(user.roleCode).trim().toUpperCase();
    if (user?.role) return String(user.role).trim().toUpperCase();
    const uname = (user?.loginUserName || user?.userName || user?.username || "").toLowerCase().trim();
    if (uname) {
      const matched = LOCAL_USERS.find((u) => u.loginUserName.toLowerCase() === uname);
      if (matched) return matched.primaryRoleCode.toUpperCase();
    }
    if (token && typeof token === "string" && token.includes(".")) {
      try {
        const parts = token.split(".");
        if (parts.length >= 2) {
          const decoded = JSON.parse(window.atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
          if (decoded?.role) return String(decoded.role).trim().toUpperCase();
          if (decoded?.primaryRoleCode) return String(decoded.primaryRoleCode).trim().toUpperCase();
        }
      } catch {
        // ignore
      }
    }
    return "ADMIN";
  }, [user, token]);

  const handleRoleSwitch = (roleUser: (typeof LOCAL_USERS)[0]) => {
    try {
      const { password: _password, ...userPayload } = roleUser;
      const tokenPayload = btoa(
        JSON.stringify({
          sub: roleUser.loginUserName,
          role: roleUser.primaryRoleCode,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        })
      );
      const newToken = `local.${tokenPayload}.session`;

      const finalUser = {
        ...userPayload,
        loginUserName: roleUser.loginUserName,
        primaryRoleCode: roleUser.primaryRoleCode,
        userName: roleUser.userName,
        userDesignation: roleUser.userDesignation,
        roleTitle: roleUser.roleTitle,
        department: roleUser.department,
      };

      const isShg =
        roleUser.primaryRoleCode === "SHG" ||
        roleUser.primaryRoleCode === "WSHG" ||
        roleUser.loginUserName?.toLowerCase() === "shg" ||
        roleUser.loginUserName?.toLowerCase() === "wshg";

      // 1. Dispatch new auth state
      dispatch(
        setToken({
          token: newToken,
          user: finalUser,
        })
      );

      // 2. Set Cookie & LocalStorage
      setJwtToken(newToken);
      try {
        localStorage.setItem("authUser", JSON.stringify(finalUser));
      } catch (err) {
        console.error("Failed to write authUser to localStorage:", err);
      }

      setIsUserMenuOpen(false);

      // 3. Fast direct SPA navigation without page reload flash
      if (isShg) {
        navigate("/track-wshg", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Error switching role:", err);
    }
  };

  // Toggle dark mode
  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langRef.current && !langRef.current.contains(target)) {
        setIsLanguageOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotificationOpen(false);
      }
      if (userRef.current && !userRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      dispatch(clearAuth());
      dispatch(authApi.util.resetApiState());
      navigate("/login");
    }
  };

  return (
    <header className="w-full bg-header-bg text-black shadow-md px-3 sm:px-6 py-2.5 z-40 shrink-0 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left Branding: Mobile Toggle + Government of Odisha Emblem + Portal Titles */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          {/* Mobile menu toggle */}
          {!isNoSidebarPage && (
            <button
              type="button"
              onClick={toggleMobileSidebar}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-black/20 text-black shadow-2xs transition-colors cursor-pointer shrink-0"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          )}

          {/* Official Government of Odisha Emblem + Department Title */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none min-w-0"
            // onClick={() => navigate("/dashboard")}
            title="Department of Women & Child Development, Odisha - Anganwadi Engagement Portal"
          >
            <img
              src={IMAGES.ODISHA_LOGO}
              alt="Government of Odisha Emblem"
              className="h-13 w-13 object-contain  rounded-full"
             
            />

            <div className="flex flex-col justify-center min-w-0">
              <div className="inline-block border-b border-black pb-0.5 max-w-full">
                <h1 className="font-header text-[12px] sm:text-[15px] lg:text-[16.5px] font-bold text-black tracking-wide leading-tight truncate sm:whitespace-nowrap drop-shadow-xs">
                  Department of Women & Child Development, Odisha
                </h1>
              </div>
              <p className="font-header text-[11px] sm:text-[12.5px] lg:text-[13.5px] font-bold text-black leading-tight pt-0.5 tracking-tight truncate sm:whitespace-nowrap">
                e-Procurement Application
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto">
          {/* Search Box with ⌘K badge */}
          <div className="relative hidden xl:flex items-center">
            <Search size={14} className="absolute left-3 text-black/60 pointer-events-none" />
            <input
              type="text"
              placeholder="Search portal records..."
              className="h-9 bg-white/12 hover:bg-white/18 focus:bg-white/22 text-black placeholder:text-black/60 text-xs pl-8 pr-11 rounded-lg border border-black/20 focus:border-black/50 focus:outline-none w-44 lg:w-52 transition-all shadow-inner"
            />
            {/* <span className="absolute right-2 text-[10px] font-bold text-black bg-white/20 border border-black/30 rounded px-1.5 py-0.5 leading-none shadow-2xs">
              ⌘K
            </span> */}
          </div>

          {/* Language Selector */}
          <div className="relative hidden sm:block" ref={langRef}>
            <button
              type="button"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="size-8.5 rounded-lg bg-white/12 hover:bg-white/22 active:bg-white/30 border border-black/20 flex items-center justify-center text-black transition-colors shadow-2xs cursor-pointer"
              title="Language"
            >
              <Globe size={16} />
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 border border-border-color dark:border-gray-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 text-black">
                {["ENG", "ODI", "HIN"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setCurrentLang(lang);
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full text-start px-3 py-1.5 text-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 ${
                      currentLang === lang ? "font-bold text-black" : "text-black"
                    }`}
                  >
                    <span>{lang}</span>
                    {currentLang === lang && <span className="size-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle (Moon / Sun) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="size-8.5 rounded-lg bg-white/12 hover:bg-white/22 active:bg-white/30 border border-black/20 flex items-center justify-center text-black transition-colors shadow-2xs cursor-pointer"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={16} className="text-amber-300" /> : <Moon size={16} />}
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative size-8.5 rounded-lg bg-white/12 hover:bg-white/22 active:bg-white/30 border border-black/20 flex items-center justify-center text-black transition-colors shadow-2xs cursor-pointer"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 size-2 bg-amber-400 rounded-full ring-2 ring-[#680b13]" />
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-border-color dark:border-gray-800 rounded-xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 text-black">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-color dark:border-gray-800">
                  <span className="text-xs font-bold text-black">WCD Alerts</span>
                  <span className="text-[10px] text-black font-semibold flex items-center gap-1 cursor-pointer">
                    <CheckCheck size={12} /> Mark all read
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-gray-800">
                    <p className="font-semibold text-black">Batch Dispatched</p>
                    <p className="text-[11px] text-black/60">Uniform consignment #WCD-2026 dispatched.</p>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800">
                    <p className="font-semibold text-black">Verification Pending</p>
                    <p className="text-[11px] text-black/60">Maa Tarini SHG uploaded compliance files.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Guest Login */}
          <div className="relative ml-1" ref={userRef}>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/15 active:bg-white/22 transition-colors cursor-pointer"
              >
                <div className="text-end hidden xl:block">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs font-bold text-black leading-tight">
                      {user?.userName || "Officer"}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-600 text-white leading-tight">
                      {userRoleCode}
                    </span>
                  </div>
                  <p className="text-[10px] text-black/80 leading-tight mt-0.5">
                    {user?.userDesignation || user?.department || "WCD Department"}
                  </p>
                </div>
                <div className="size-9 rounded-full bg-white border border-white/30 flex items-center justify-center shadow-2xs">
                  <UserIcon size={20} className="text-black" aria-hidden="true" />
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <UserIcon size={14} />
                <span>Portal Login</span>
              </button>
            )}

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-slate-200/90 dark:border-gray-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 text-slate-800"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {/* User Info Header matching image */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-gray-800">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user?.userName || "Smt. Arundhati Ray"}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ea580c] text-white shrink-0 tracking-wide">
                      {userRoleCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-normal">
                    {user?.userDesignation || user?.department || "District Social Welfare Officer (DSWO)"}
                  </p>
                </div>

                {/* Standard Profile Options matching image */}
                <div className="py-1">
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <UserIcon size={16} className="text-slate-600 dark:text-slate-400" />
                    <span className="font-medium">My Profile</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <Settings size={16} className="text-slate-600 dark:text-slate-400" />
                    <span className="font-medium">System Settings</span>
                  </button>
                </div>

                {/* ========================================================================= */}
                {/* TEMPORARY ROLE SWITCHER (Comment out / remove this block for production)   */}
                {/* ========================================================================= */}
                <div className="border-t border-slate-100 dark:border-gray-800 pt-2 pb-1">
                  <div className="px-4 py-1.5">
                    <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                      SWITCH ROLE
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-0.5">
                    {LOCAL_USERS.filter((u) => u.primaryRoleCode !== "ADMIN").map((roleUser) => {
                      const isActive =
                        userRoleCode.toUpperCase() === roleUser.primaryRoleCode.toUpperCase();

                      const roleDisplayTitle =
                        roleUser.primaryRoleCode === "STATE"
                          ? "State"
                          : roleUser.primaryRoleCode === "DSWO"
                          ? "District Social Welfare Officer (DSWO)"
                          : roleUser.primaryRoleCode === "CDPO"
                          ? "Child Development Project Officer (CDPO)"
                          : roleUser.primaryRoleCode === "BLF"
                          ? "Block Level Federation (BLF)"
                          : roleUser.primaryRoleCode === "BLC"
                          ? "Block Level Committee (BLC)"
                          : roleUser.primaryRoleCode === "AWW"
                          ? "Anganwadi Worker (AWW)"
                          : roleUser.primaryRoleCode === "SHG"
                          ? "Self Help Group (SHG)"
                          : roleUser.roleTitle || roleUser.userName;

                      return (
                        <button
                          key={roleUser.loginUserName}
                          type="button"
                          onClick={() => handleRoleSwitch(roleUser)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left transition-colors cursor-pointer ${
                            isActive
                              ? "bg-amber-50/80 dark:bg-amber-950/40 text-orange-600 dark:text-orange-400 font-bold"
                              : "text-slate-700 dark:text-slate-300 font-normal hover:bg-slate-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <span className="truncate">{roleDisplayTitle}</span>
                          {isActive && (
                            <span className="size-2 rounded-full bg-orange-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* ========================================================================= */}
                {/* END TEMPORARY ROLE SWITCHER                                              */}
                {/* ========================================================================= */}

                {/* Sign Out matching image */}
                <div className="border-t border-slate-100 dark:border-gray-800 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer font-medium transition-colors"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
