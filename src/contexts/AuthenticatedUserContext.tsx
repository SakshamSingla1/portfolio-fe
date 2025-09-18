import React, { type FC, useEffect, useMemo, useState } from 'react'
import { type IUser } from '../utils/types';

interface AuthenticatedUserProviderType {
    children: React.ReactNode
}

export interface AuthenticatedUserContextType {
    isAuthDialogActive: boolean,
    syncAuthDialogActive: (value?: boolean) => void,
    user: IUser | null;
    setAuthenticatedUser: (user: IUser | null) => void;
}

export const AuthenticatedUserContext = React.createContext<AuthenticatedUserContextType>({
    isAuthDialogActive: false,
    syncAuthDialogActive: () => { },
    user: null,
    setAuthenticatedUser: () => { }
});

export const AuthenticatedUserProvider: FC<AuthenticatedUserProviderType> = ({ children }) => {

    const [isAuthDialogActive, setAuthDialogActive] = useState<boolean>(false);
    const [user, setAuthenticatedUser] = useState<IUser | null>(() => {
        const storedAuthenticatedUser = sessionStorage.getItem('user');
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
            sessionStorage.setItem('user', JSON.stringify(user))
        } else {
            sessionStorage.removeItem('user');
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