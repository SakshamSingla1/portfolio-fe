import React, { type FC, useEffect, useMemo, useState } from 'react';

export interface AuthenticatedUserType {
    id: number;
    email: string;
    token: string;
    role?: string;
    fullName: string;
    title?: string;
    aboutMe?: string;
    phone?: string;
    location?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    profileImageUrl?: string;
}

export interface AuthenticatedUserContextType {
    isAuthDialogActive: boolean;
    syncAuthDialogActive: (value?: boolean) => void;
    user: AuthenticatedUserType | null;
    setAuthenticatedUser: (user: AuthenticatedUserType | null) => void;
    loading: boolean;
}

export const AuthenticatedUserContext = React.createContext<AuthenticatedUserContextType>({
    isAuthDialogActive: false,
    syncAuthDialogActive: () => { },
    user: null,
    setAuthenticatedUser: () => { },
    loading: true
});

export const AuthenticatedUserProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setAuthenticatedUser] = useState<AuthenticatedUserType | null>(() => {
        const stored = sessionStorage.getItem('user');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return null;
            }
        }
        return null;
    });

    const [isAuthDialogActive, setAuthDialogActive] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const syncAuthDialogActive = (value?: boolean) => {
        setAuthDialogActive(value ?? user === null);
    };

    useEffect(() => {
        setLoading(true);
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('user');
        }
        setLoading(false);
    }, [user]);

    const providerValue = useMemo(() => ({
        user,
        setAuthenticatedUser,
        isAuthDialogActive,
        syncAuthDialogActive,
        loading
    }), [user, isAuthDialogActive, loading]);

    return (
        <AuthenticatedUserContext.Provider value={providerValue}>
            {children}
        </AuthenticatedUserContext.Provider>
    );
};
