import React, { createContext, useCallback, useContext, useState } from "react";

interface AuthDialogContextType {
  isAuthDialogActive: boolean;
  syncAuthDialogActive: (value?: boolean) => void;
}

const AuthDialogContext = createContext<AuthDialogContextType>({
  isAuthDialogActive: false,
  syncAuthDialogActive: () => {},
});

export const useAuthDialog = () => useContext(AuthDialogContext);

interface Props {
  children: React.ReactNode;
  isLoggedIn: boolean;
}

export const AuthDialogProvider: React.FC<Props> = ({ children, isLoggedIn }) => {
  const [isAuthDialogActive, setAuthDialogActive] = useState<boolean>(false);

  const syncAuthDialogActive = useCallback((value?: boolean) => {
    setAuthDialogActive(value ?? !isLoggedIn);
  }, [isLoggedIn]);

  return (
    <AuthDialogContext.Provider value={{ isAuthDialogActive, syncAuthDialogActive }}>
      {children}
    </AuthDialogContext.Provider>
  );
};
