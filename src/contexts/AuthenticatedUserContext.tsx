import React, { useEffect, useMemo, useState} from "react";
import { type ColorTheme } from "../services/useColorThemeService";
import type { NavlinkResponse } from "../services/useNavlinkService";

interface AuthenticatedUserProviderType {
    children: React.ReactNode;
}

export interface AuthenticatedUserType {
    id: string;
    fullName: string;
    userName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    emailVerified: string;
    phoneVerified: string;
    token: string;
}

export interface AuthenticatedUserContextType {
    isAuthDialogActive: boolean;
    syncAuthDialogActive: (value?: boolean) => void;

    user: AuthenticatedUserType | null;
    setAuthenticatedUser: (user: AuthenticatedUserType | null) => void;

    defaultTheme: ColorTheme | null;
    setDefaultTheme: (theme: ColorTheme | null) => void;

    navlinks: NavlinkResponse[] | null;
    setNavlinks: (navlinks: NavlinkResponse[] | null) => void;

    logout: () => void;
}

export const AuthenticatedUserContext = React.createContext<AuthenticatedUserContextType>({
    isAuthDialogActive: false,
    syncAuthDialogActive: () => {},

    user: null,
    setAuthenticatedUser: () => {},

    defaultTheme: null,
    setDefaultTheme: () => {},

    navlinks: null,
    setNavlinks: () => {},

    logout: () => {},
});

export const AuthenticatedUserProvider: React.FC<AuthenticatedUserProviderType> = ({ children }) => {
    const [isAuthDialogActive, setAuthDialogActive] = useState<boolean>(false);

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

    const [navlinks, setNavlinks] = useState<NavlinkResponse[] | null>(() => {
        try {
            const stored = localStorage.getItem("navlinks");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const syncAuthDialogActive = (value?: boolean) => {
        setAuthDialogActive(value ?? user === null);
    };

    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    useEffect(() => {
        if (defaultTheme) localStorage.setItem("defaultTheme", JSON.stringify(defaultTheme));
        else localStorage.removeItem("defaultTheme");
    }, [defaultTheme]);

    useEffect(() => {
        if (navlinks) localStorage.setItem("navlinks", JSON.stringify(navlinks));
        else localStorage.removeItem("navlinks");
    }, [navlinks]);

    const logout = () => {
        setAuthenticatedUser(null);
        setDefaultTheme(null);
        setNavlinks(null);
        localStorage.removeItem("user");
        localStorage.removeItem("defaultTheme");
        localStorage.removeItem("navlinks");
        localStorage.removeItem("reLoginTimestamp");
    };

    const providerValue = useMemo(
        () => ({
            isAuthDialogActive,
            syncAuthDialogActive,
            user,
            setAuthenticatedUser,
            defaultTheme,
            setDefaultTheme,
            navlinks,
            setNavlinks,
            logout,
        }),
        [isAuthDialogActive, user, defaultTheme, navlinks]
    );

    return (
        <AuthenticatedUserContext.Provider value={providerValue}>
            {children}
        </AuthenticatedUserContext.Provider>
    );
};
