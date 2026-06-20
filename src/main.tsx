import "./index.css";
import App from "./App";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "react-jss";
import { BrowserRouter } from "react-router-dom";
import { defaultTheme } from './utils/theme';
import { AuthenticatedUserProvider } from './contexts/AuthenticatedUserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <QueryClientProvider client={queryClient}>
        <HelmetProvider>
            <ThemeProvider theme={defaultTheme}>
                <BrowserRouter>
                    <AuthenticatedUserProvider>
                        <App />
                    </AuthenticatedUserProvider>
                </BrowserRouter>
            </ThemeProvider>
        </HelmetProvider>
    </QueryClientProvider>
);