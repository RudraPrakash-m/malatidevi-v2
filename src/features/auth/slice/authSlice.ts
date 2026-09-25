import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../service/AuthService";
import { getJwtToken, setJwtToken, removeJwtToken } from "@/shared/utils/cookieUtils";
import { isTokenValid } from "@/shared/utils/authUtils";

interface AuthState {
    token: string | null;
    user: any;
    menu: any[];
    isAuthenticated: boolean;
}

interface LocalAuthPayload {
    token: string;
    user: any;
}

const existingToken = getJwtToken();
const hasValidExistingToken = existingToken ? isTokenValid(existingToken) : false;
const rawStoredUser = typeof window !== 'undefined' ? localStorage.getItem("authUser") : null;
let storedUser: any = null;

if (rawStoredUser && hasValidExistingToken) {
    try {
        storedUser = JSON.parse(rawStoredUser);
    } catch {
        storedUser = null;
    }
}

if (hasValidExistingToken && existingToken && (!storedUser || !storedUser.primaryRoleCode)) {
    try {
        const parts = existingToken.split('.');
        if (parts.length >= 2) {
            const payloadStr = window.atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
            const decoded = JSON.parse(payloadStr);
            if (decoded?.role || decoded?.sub) {
                storedUser = {
                    userName: decoded.userName || (decoded.sub === 'dswo' ? 'Smt. Arundhati Ray' : decoded.sub) || 'Officer',
                    loginUserName: decoded.sub || 'dswo',
                    primaryRoleCode: decoded.role || decoded.primaryRoleCode || 'DSWO',
                    userDesignation: decoded.userDesignation || 'District Social Welfare Officer (DSWO)',
                    ...storedUser,
                };
            }
        }
    } catch {
        // ignore
    }
}

const isUserAuthenticated = Boolean(hasValidExistingToken && (storedUser || existingToken));

const initialState: AuthState = {
    token: isUserAuthenticated ? existingToken : null,
    user: storedUser,
    menu: [],
    isAuthenticated: isUserAuthenticated,
};

const extractToken = (res: any, data: any): string | null => {
    if (typeof res === 'string' && res.length > 50) {
        return res;
    }
    if (typeof data === 'string' && data.length > 50) {
        return data;
    }
    return (
        data?.token ||
        res?.token ||
        data?.jwtToken ||
        res?.jwtToken ||
        data?.accessToken ||
        res?.accessToken ||
        null
    );
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | LocalAuthPayload>) => {
            const payload = typeof action.payload === "string"
                ? { token: action.payload, user: null }
                : action.payload;

            state.token = payload.token;
            state.user = payload.user;
            state.isAuthenticated = true;
            setJwtToken(payload.token);
            if (payload.user) {
                localStorage.setItem("authUser", JSON.stringify(payload.user));
            }
        },
        clearAuth: (state) => {
            state.token = null;
            state.user = null;
            state.menu = [];
            state.isAuthenticated = false;
            removeJwtToken();
            localStorage.removeItem("authUser");
        },
        checkToken: (state) => {
            if (state.token && !isTokenValid(state.token)) {
                state.token = null;
                state.user = null;
                state.menu = [];
                state.isAuthenticated = false;
                removeJwtToken();
            }
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                const res = payload as any;
                const outcome = res?.outcome;
                const data = res?.data || res;

                const token = extractToken(res, data);


                if (outcome === false || (!token && outcome !== true)) {
                    return;
                }

                if (token) {
                    state.token = token;
                    state.user = data?.user || (data?.loginUserName ? data : null);
                    state.menu = data?.menu || (Array.isArray(data) ? data : []);
                    state.isAuthenticated = true;
                    setJwtToken(token);
                    if (state.user) {
                        localStorage.setItem("authUser", JSON.stringify(state.user));
                    }
                }
            }
        );
        builder.addMatcher(
            authApi.endpoints.getUserProfile.matchFulfilled,
            (state, { payload }) => {
                const data = (payload as any)?.data || payload;
                if (
                    data &&
                    typeof data === "object" &&
                    !Array.isArray(data) &&
                    (data.userName || data.primaryRoleCode || data.loginUserName || data.role)
                ) {
                    state.user = {
                        ...state.user,
                        ...data,
                    };
                    localStorage.setItem("authUser", JSON.stringify(state.user));
                }
            }
        );
        builder.addMatcher(
            authApi.endpoints.getMenuList.matchFulfilled,
            (state, { payload }) => {
                const data = (payload as any)?.data || payload;
                if (Array.isArray(data)) {
                    state.menu = data;
                } else if (data?.menu) {
                    state.menu = data.menu;
                }
            }
        );
        builder.addMatcher(
            authApi.endpoints.logout.matchFulfilled,
            (state) => {
                state.token = null;
                state.user = null;
                state.menu = [];
                state.isAuthenticated = false;
                removeJwtToken();
                localStorage.removeItem("authUser");
            }
        );
    },
});

export const { setToken, clearAuth, checkToken } = authSlice.actions;

export const selectAuth = (state: any) => state.auth;
export const selectToken = (state: any) => state.auth.token;
export const selectCurrentUser = (state: any) => state.auth.user;
export const selectIsAuthenticated = (state: any) => state.auth.isAuthenticated;

export default authSlice.reducer;
