import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { routes } from "./routeConfig";

const PublicRoute = () => {
    const { token, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    if (token && isAuthenticated) {
        const role = String(user?.primaryRoleCode || user?.role || user?.loginUserName || "").toUpperCase();
        if (role.includes("WSHG") || role.includes("SHG")) {
            return <Navigate to={routes.wshgTracking.path} replace />;
        }
        return <Navigate to={routes.dashboard.path} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
