import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticatedUserContext } from "../contexts/AuthenticatedUserContext";
import { ADMIN_ROUTES } from "../utils/constant";

const isSessionExpired = (): boolean | null => {
    const lastReLogin = localStorage.getItem("reLoginTimestamp");
    if (!lastReLogin) return null;
    const diff = Date.now() - new Date(lastReLogin).getTime();
    return diff >= 24 * 60 * 60 * 1000;
};

export const useAuthenticatedUser = () => {
    const context = React.useContext(AuthenticatedUserContext);
    const navigate = useNavigate();

    if (!context) throw new Error("useAuthenticatedUser must be used within AuthenticatedUserProvider");

    useEffect(() => {
        const expired = isSessionExpired();

        if (expired === true) {
            const alreadyHandled = sessionStorage.getItem("sessionHandled");
            if (alreadyHandled === "true") return;

            sessionStorage.setItem("sessionHandled", "true");
            context.setAuthenticatedUser(null);
            sessionStorage.removeItem("user");
            localStorage.removeItem("reLoginTimestamp");

            // Optionally replace with Snackbar instead of alert
            alert("Session expired. Please log in again.");
            navigate(ADMIN_ROUTES.LOGIN, { replace: true });
        } else if (expired === null) {
            context.setAuthenticatedUser(null);
            sessionStorage.removeItem("user");
            localStorage.removeItem("reLoginTimestamp");
        }
    }, [context, navigate]);

    return context;
};
