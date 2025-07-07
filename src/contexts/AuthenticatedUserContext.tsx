import React, { FC, useEffect, useMemo, useState } from 'react'

interface AuthenticatedUserProviderType {
    children: React.ReactNode
}


export interface AuthenticatedUserType {
    email: string;
    id: string;
    token: string;
    password: boolean | null; 
    role?: string;
    fullName: string;
    title: string;
    aboutMe: string;
    phone: string;
    location: string;
    githubUrl: string;
    linkedinUrl: string;
    websiteUrl: string;
}

export interface AuthenticatedUserContextType {
    isAuthDialogActive: boolean,
    syncAuthDialogActive: (value?: boolean) => void,
    user: AuthenticatedUserType | null;
    setAuthenticatedUser: (user: AuthenticatedUserType | null) => void;
}

export const AuthenticatedUserContext = React.createContext<AuthenticatedUserContextType>({
    isAuthDialogActive: false,
    syncAuthDialogActive: () => { },
    user: null,
    setAuthenticatedUser: () => { }
});

export const AuthenticatedUserProvider: FC<AuthenticatedUserProviderType> = ({ children }) => {

    const [isAuthDialogActive, setAuthDialogActive] = useState<boolean>(false);
    const [user, setAuthenticatedUser] = useState<AuthenticatedUserType | null>(() => {
        const storedAuthenticatedUser = localStorage.getItem('user');
        try {
            if (storedAuthenticatedUser)
                return JSON.parse(storedAuthenticatedUser);
            else
                throw Error('Invalid JSON');
        } catch (error) {
            return null;
        }
    });

    const syncAuthDialogActive = (value?: boolean) => {
        setAuthDialogActive(value ?? user === null)
    }

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user');
        }
    }, [user])

    const providerValue = useMemo(() => {
        return { isAuthDialogActive, syncAuthDialogActive, user, setAuthenticatedUser };
    }, [user, setAuthenticatedUser, isAuthDialogActive]);

    return (
        <AuthenticatedUserContext.Provider value={providerValue}>
            {children}
        </AuthenticatedUserContext.Provider>
    )
}