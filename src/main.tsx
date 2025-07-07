import "./index.css";
import App from "./App";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "react-jss";
import { BrowserRouter } from "react-router-dom";
import { defaultTheme } from './utils/theme';
import { AuthenticatedUserProvider } from './contexts/AuthenticatedUserContext';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <HelmetProvider>
        <ThemeProvider theme={defaultTheme}>
            <BrowserRouter>
                <AuthenticatedUserProvider>
                    <App />
                </AuthenticatedUserProvider>
            </BrowserRouter>
        </ThemeProvider>
    </HelmetProvider>
);