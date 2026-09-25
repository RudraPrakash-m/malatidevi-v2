import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { routes } from "./routeConfig";

const ProtectedRoute = () => {
    const { token, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!token || !isAuthenticated) {
        return <Navigate to={routes.login.path} replace />;
    }

    const rawRole = String(
        user?.primaryRoleCode || user?.role || user?.loginUserName || ""
    ).toUpperCase();

    const isShg = rawRole.includes("SHG") || rawRole.includes("WSHG");

    if (isShg) {
        const allowedShgPaths = [
            "/track-wshg",
            "/add-wshg",
            "/wshg-registration",
            "/wshg-list",
        ];

        const isAllowed = allowedShgPaths.some(
            (p) => location.pathname === p || location.pathname.startsWith(p + "/")
        );

        if (!isAllowed) {
            return <Navigate to={routes.wshgTracking.path} replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
