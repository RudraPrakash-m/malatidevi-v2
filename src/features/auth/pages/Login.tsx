import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User as UserIcon,
  Lock,
  RefreshCw,
  ClipboardPenLine,
  ShieldCheck,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setToken } from "../slice/authSlice";
import { IMAGES } from "@/assets/images";
import CommonButton from "@/shared/components/ui/Button";
import { routes } from "@/app/routes/routeConfig";
import { LOCAL_USERS, type LocalUser } from "../localUsers";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("dswo");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRoleCode, setSelectedRoleCode] = useState<string>("DSWO");

  // CAPTCHA STATES
  const [num1, setNum1] = useState<number>(() => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return (array[0] % 8) + 1;
  });
  const [num2, setNum2] = useState<number>(() => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return (array[0] % 8) + 1;
  });
  const [captchaInput, setCaptchaInput] = useState<string>(() => String(num1 + num2));
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Secure captcha generation
  const generateCaptcha = useCallback(() => {
    const array = new Uint32Array(2);
    window.crypto.getRandomValues(array);
    const n1 = (array[0] % 8) + 1;
    const n2 = (array[1] % 8) + 1;
    setNum1(n1);
    setNum2(n2);
    setCaptchaInput("");
  }, []);

  // One-click demo credential selector
  const handleQuickSelectRole = (user: LocalUser) => {
    setUsername(user.loginUserName);
    setPassword(user.password);
    setSelectedRoleCode(user.primaryRoleCode);
    setCaptchaInput(String(num1 + num2));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // CAPTCHA VALIDATION
    const parsedCaptcha = Number.parseInt(captchaInput, 10);
    if (Number.isNaN(parsedCaptcha) || parsedCaptcha !== num1 + num2) {
      setError("Invalid CAPTCHA result. Please solve the calculation again.");
      generateCaptcha();
      return;
    }

    const matchedUser = LOCAL_USERS.find(
      (localUser) =>
        localUser.loginUserName.toLowerCase() === username.trim().toLowerCase()
    );

    if (!matchedUser && password !== "123456") {
      setError("Invalid username or password. Please use a valid credential.");
      return;
    }

    const account: LocalUser = matchedUser || {
      userName: username.trim() || "Smt. Arundhati Ray",
      loginUserName: username.trim().toLowerCase() || "dswo",
      userDesignation: "District Social Welfare Officer (DSWO)",
      primaryRoleCode: "DSWO",
      roleTitle: "DSWO Officer (L1)",
      password: password,
      defaultPath: "/check/dswo",
    };

    const { password: _password, ...userPayload } = account;
    const tokenPayload = btoa(
      JSON.stringify({
        sub: account.loginUserName,
        role: account.primaryRoleCode,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      })
    );

    dispatch(setToken({ token: `local.${tokenPayload}.session`, user: userPayload }));

    const isShg =
      account.primaryRoleCode === "SHG" ||
      account.primaryRoleCode === "WSHG" ||
      account.loginUserName.toLowerCase() === "shg" ||
      account.loginUserName.toLowerCase() === "wshg" ||
      username.trim().toLowerCase() === "shg" ||
      username.trim().toLowerCase() === "wshg";

    // Navigate to role-specific route (SHG directly to tracking, others to dashboard)
    navigate(isShg ? routes.wshgTracking.path : routes.dashboard.path);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-100 via-orange-50/40 to-slate-100 text-slate-900">
      {/* Top Government Header Strip */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={IMAGES.ODISHA_LOGO}
              alt="Government of Odisha Logo"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Department of Women & Child Development
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Government of Odisha • e-Procurement Portal
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Card Header Banner */}
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 text-center">
            <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-white/15 backdrop-blur-xs mb-3 shadow-inner">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Official Portal Login</h2>
            <p className="text-xs text-orange-100 mt-1">
              Department of Women & Child Development, Odisha
            </p>
          </div>

          {/* Quick Workflow Role Selector */}
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Select Role (1-Click Auto-Fill)
              </span>
              <span className="text-[10px] text-orange-600 font-semibold">
                Default password: 123456
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {LOCAL_USERS.filter((u) => u.primaryRoleCode !== "ADMIN").map((u) => {
                const isSelected = selectedRoleCode === u.primaryRoleCode;
                return (
                  <button
                    key={u.primaryRoleCode}
                    type="button"
                    onClick={() => handleQuickSelectRole(u)}
                    className={`px-1.5 py-1.5 rounded-lg text-center transition-all cursor-pointer border ${isSelected
                      ? "bg-orange-600 text-white border-orange-700 shadow-xs font-bold ring-2 ring-orange-200"
                      : "bg-white text-slate-700 hover:bg-orange-50/70 border-slate-200 text-xs font-medium"
                      }`}
                    title={`${u.userDesignation} (${u.loginUserName})`}
                  >
                    <div className="text-[11px] truncate leading-tight font-semibold">
                      {u.primaryRoleCode}
                    </div>
                    <div
                      className={`text-[9px] truncate ${isSelected ? "text-orange-100" : "text-slate-400"
                        }`}
                    >
                      {u.loginUserName}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Username / Official User ID
              </label>
              <div className="relative">
                <UserIcon
                  className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="username"
                  type="text"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setSelectedRoleCode("");
                  }}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="text-xs font-bold text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Default demo password for all accounts is: password")}
                  className="text-[11px] text-orange-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* CAPTCHA Validation */}
            <div>
              <label
                htmlFor="captcha"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Security Verification
              </label>

              <div className="flex items-center gap-2">
                <div
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-slate-100 to-amber-50 rounded-lg border border-slate-200 font-mono font-bold text-sm tracking-widest text-slate-800 text-center select-none"
                  aria-live="polite"
                >
                  {num1} + {num2} = ?
                </div>

                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
                  title="Generate new calculation"
                >
                  <RefreshCw size={15} />
                </button>

                <input
                  id="captcha"
                  type="number"
                  className="w-28 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                  placeholder="Result"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer accent-orange-600"
              />
              <label
                htmlFor="rememberMe"
                className="text-xs text-slate-600 cursor-pointer select-none font-medium"
              >
                Keep me signed in for 7 days
              </label>
            </div>

            {/* Error Display */}
            {error && (
              <div
                className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <CommonButton
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Sign In to Portal
            </CommonButton>
          </form>

          {/* Direct Public Shortcuts Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center space-y-2">
            <p className="text-[11px] text-slate-500 font-medium">
              Applicant & Public Services
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-bold">
              <Link
                to="/add-wshg"
                className="text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1"
              >
                <ClipboardPenLine size={13} />
                SHG Registration & Tracking
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-3 text-[11px] text-slate-500 border-t border-slate-200 bg-white/60">
        <p>
          Department of Women & Child Development, Government of Odisha. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Login;