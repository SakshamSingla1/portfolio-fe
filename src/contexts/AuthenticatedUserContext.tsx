import React, { useCallback, useEffect, useMemo, useState } from "react";
import { type ColorTheme } from "../services/useColorThemeService";
import type { RolePermissionResponseDTO } from "../services/useRoleService";
import { AuthDialogProvider } from "./AuthDialogContext";

interface AuthenticatedUserProviderType {
    children: React.ReactNode;
}

export interface AuthenticatedUserType {
    id: string;
    fullName: string;
    userName: string;
    email: string;
    phone: string;
    roleId: string;
    roleName: string;
    status: string;
    emailVerified: string;
    phoneVerified: string;
    token: string;
}

export interface AuthenticatedUserContextType {
    user: AuthenticatedUserType | null;
    setAuthenticatedUser: (user: AuthenticatedUserType | null) => void;

    defaultTheme: ColorTheme | null;
    setDefaultTheme: (theme: ColorTheme | null) => void;

    rolePermissions: RolePermissionResponseDTO | null;
    setRolePermissions: (rolePermissions: RolePermissionResponseDTO | null) => void;

    logout: () => void;
}

export const AuthenticatedUserContext = React.createContext<AuthenticatedUserContextType>({
    user: null,
    setAuthenticatedUser: () => {},

    defaultTheme: null,
    setDefaultTheme: () => {},

    rolePermissions: null,
    setRolePermissions: () => {},

    logout: () => {},
});

export const AuthenticatedUserProvider: React.FC<AuthenticatedUserProviderType> = ({ children }) => {
    const [user, setAuthenticatedUser] = useState<AuthenticatedUserType | null>(() => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [defaultTheme, setDefaultTheme] = useState<ColorTheme | null>(() => {
        try {
            const stored = localStorage.getItem("defaultTheme");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [rolePermissions, setRolePermissions] = useState<RolePermissionResponseDTO | null>(() => {
        try {
            const stored = localStorage.getItem("rolePermissions");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    useEffect(() => {
        if (defaultTheme) localStorage.setItem("defaultTheme", JSON.stringify(defaultTheme));
        else localStorage.removeItem("defaultTheme");
    }, [defaultTheme]);

    useEffect(() => {
        if (rolePermissions) localStorage.setItem("rolePermissions", JSON.stringify(rolePermissions));
        else localStorage.removeItem("rolePermissions");
    }, [rolePermissions]);

    const logout = useCallback(() => {
        setAuthenticatedUser(null);
        setDefaultTheme(null);
        setRolePermissions(null);
        localStorage.removeItem("user");
        localStorage.removeItem("defaultTheme");
        localStorage.removeItem("rolePermissions");
        localStorage.removeItem("reLoginTimestamp");
    }, []);

    const setAuthenticatedUserWithTimestamp = useCallback((u: AuthenticatedUserType | null) => {
        if (u && !localStorage.getItem("reLoginTimestamp")) {
            localStorage.setItem("reLoginTimestamp", new Date().toISOString());
        }
        setAuthenticatedUser(u);
    }, []);

    const providerValue = useMemo(
        () => ({
            user,
            setAuthenticatedUser: setAuthenticatedUserWithTimestamp,
            defaultTheme,
            setDefaultTheme,
            rolePermissions,
            setRolePermissions,
            logout,
        }),
        [user, defaultTheme, rolePermissions, setAuthenticatedUserWithTimestamp, logout]
    );

    return (
        <AuthenticatedUserContext.Provider value={providerValue}>
            <AuthDialogProvider isLoggedIn={!!user}>
                {children}
            </AuthDialogProvider>
        </AuthenticatedUserContext.Provider>
    );
};
