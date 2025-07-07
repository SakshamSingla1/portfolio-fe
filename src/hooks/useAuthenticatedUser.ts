import React from "react";
import { AuthenticatedUserContext } from "../contexts/AuthenticatedUserContext";

export const useAuthenticatedUser = () => {
    const context = React.useContext(AuthenticatedUserContext);
    if (!context) {
        throw new Error('useAuthenticatedUser must be used within a AuthenticatedUserProvider');
    }
    return context;
};
